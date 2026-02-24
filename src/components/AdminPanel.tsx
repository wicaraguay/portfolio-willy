import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  LayoutDashboard,
  User,
  Code2,
  Briefcase,
  BarChart3,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Github,
  Linkedin,
  Mail,
  Palette,
  Camera,
  Upload,
  Image as ImageIcon,
  Menu,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, storage } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { compressImage } from '../utils/image';

const Notification = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 ${type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}
    >
      {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span className="font-medium">{message}</span>
    </motion.div>
  );
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  const [data, setData] = useState({
    profile: {
      name: "Willan Caraguay",
      title: "Fullstack Developer & Data Engineer",
      bio: "Especialista en desarrollo de sistemas escalables, pipelines de datos y experiencias digitales de alto impacto.",
      email: "willan.caraguay@gmail.com",
      github: "github.com/willytech",
      linkedin: "linkedin.com/in/willan-caraguay",
      imageUrl: "/images/willy.png"
    },
    skills: [],
    projects: [],
    experience: [],
    stats: [],
    settings: {
      siteName: 'WILLY TECH',
      heroBadge: 'Willan Caraguay • Data Engineer',
      heroTitle1: 'Fullstack',
      heroTitle2: 'Developer',
      heroGithubUrl: '',
      heroGitlabUrl: '',
      aboutTitle: 'Sobre mí',
      aboutDescription: [
        'Hola, soy un Ingeniero de Software Fullstack apasionado por los datos y la arquitectura de sistemas. Mi viaje comenzó con la curiosidad de cómo funcionan las cosas "bajo el capó" y evolucionó hacia la construcción de sistemas distribuidos complejos.',
        'Me especializo en cerrar la brecha entre el análisis de datos complejos y las experiencias de usuario intuitivas. No solo escribo código; diseño soluciones que escalan, rinden y aportan valor real al negocio.',
        'Cuando no estoy programando, estoy probablemente optimizando mi configuración de Linux, contribuyendo a proyectos Open Source o aprendiendo sobre las últimas tendencias en IA y Machine Learning.'
      ],
      aboutImage: '/images/willy.png',
      arsenalTitle: 'Arsenal Técnico',
      arsenalDescription: 'Mi enfoque fullstack me permite entender el ciclo de vida completo del software. Desde el diseño de bases de datos optimizadas y pipelines de datos, hasta la creación de interfaces de usuario fluidas y reactivas.',
      whatsappNumber: '34600000000',
      whatsappGreeting: '¿Hablamos de tu proyecto? 👋',
      whatsappMessage: 'Estoy disponible para ayudarte a construir esa solución tecnológica que tienes en mente.',
      footerText: 'Willy Tech',
      copyright: 'Todos los derechos reservados.'
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });

    async function fetchData() {
      try {
        const collections = ['profile', 'skills', 'projects', 'experience', 'stats', 'settings'];
        const results: any = {};
        for (const name of collections) {
          const docRef = doc(db, 'content', name);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const docData = docSnap.data();
            results[name] = (name === 'profile' || name === 'settings') ? docData : docData.data;
          }
        }
        setData(prev => {
          const newData = { ...prev } as any;
          for (const key in results) {
            if (key === 'profile' || key === 'settings') {
              newData[key] = { ...newData[key], ...results[key] };
            } else {
              newData[key] = results[key];
            }
          }
          return newData;
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        showNotification('Failed to load data', 'error');
      }
    }

    fetchData();
    return () => unsubscribe();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      const docRef = doc(db, 'content', section);
      const sectionData = data[section as keyof typeof data];
      const payload = (section === 'profile' || section === 'settings') ? sectionData : { data: sectionData };
      await setDoc(docRef, payload);
      showNotification(`${section.charAt(0).toUpperCase() + section.slice(1)} saved successfully!`, 'success');
    } catch (error) {
      console.error(error);
      showNotification('Error saving data', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File, path: string, section: string, field: string, index?: number) => {
    setUploading(index !== undefined ? `${section}-${index}` : section);
    try {
      // Compress and convert to WebP
      const compressedBlob = await compressImage(file);
      const finalFile = compressedBlob instanceof File ? compressedBlob : new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });

      const storageRef = ref(storage, `${path}/${Date.now()}-${finalFile.name}`);
      const snapshot = await uploadBytes(storageRef, finalFile);
      const url = await getDownloadURL(snapshot.ref);

      updateField(section, field, url, index);
      showNotification('Imagen subida y optimizada correctamente', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Error al subir la imagen', 'error');
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteImage = async (url: string, section: string, field: string, index?: number) => {
    if (!url) return;
    setSaving(true);
    try {
      // Create a reference to the file to delete
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);

      // Remove from state
      updateField(section, field, '', index);
      showNotification('Imagen eliminada de Firebase', 'success');
    } catch (error) {
      console.error("Error deleting image:", error);
      showNotification('Error al eliminar la imagen o no existe en Storage', 'error');
      // Still remove from state even if storage deletion fails (e.g. if it was a default placeholder)
      updateField(section, field, '', index);
    } finally {
      setSaving(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification('¡Bienvenido de nuevo!', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Error al iniciar sesión. Verifica tus credenciales.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const updateField = (section: string, field: string, value: any, index?: number) => {
    setData(prev => {
      const newData = { ...prev } as any;
      if (Array.isArray(newData[section])) {
        newData[section] = [...newData[section]];
        if (index !== undefined) {
          newData[section][index] = { ...newData[section][index], [field]: value };
        }
      } else {
        newData[section] = { ...newData[section], [field]: value };
      }
      return newData;
    });
  };

  const addItem = (section: string, template: any) => {
    setData(prev => {
      const newData = { ...prev } as any;
      newData[section] = [...newData[section], template];
      return newData;
    });
  };

  const removeItem = (section: string, index: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;

    setData(prev => {
      const newData = { ...prev } as any;
      newData[section] = newData[section].filter((_: any, i: number) => i !== index);
      return newData;
    });
  };

  if (authLoading) return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="font-mono text-orange-400">Verificando sesión...</div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-dark-800 border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 text-orange-500 mb-4">
            <span className="font-orbitron font-bold text-2xl">{'<'}</span>
            <span className="font-orbitron font-bold text-lg uppercase tracking-widest text-white">WILLY TECH</span>
            <span className="font-orbitron font-bold text-2xl">{'>'}</span>
          </div>
          <h2 className="text-xl font-bold text-white">Panel de Administración</h2>
          <p className="text-gray-400 text-sm mt-2">Inicia sesión para gestionar tu portafolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-orange-400 uppercase tracking-wider font-bold">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 transition-all outline-none"
              placeholder="tu@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-orange-400 uppercase tracking-wider font-bold">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-900/40 disabled:opacity-50"
          >
            {saving ? 'Iniciando sesión...' : 'Entrar al Sistema'}
          </button>
        </form>
      </motion.div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="font-mono text-orange-400">Cargando datos...</div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wide uppercase">Configuración del Perfil</h2>
                <p className="text-gray-400 mt-1">Gestiona tu información personal y biografía.</p>
              </div>
              <button
                onClick={() => handleSave('profile')}
                disabled={saving}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>

            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8 space-y-8">
              <div className="flex flex-col items-center gap-6 pb-8 border-b border-white/5">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500/20 group-hover:border-orange-500/50 transition-all bg-dark-900 flex items-center justify-center">
                    {(data.profile as any).imageUrl?.trim() ? (
                      <img src={(data.profile as any).imageUrl} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-700" />
                    )}
                    {uploading === 'profile' && (
                      <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center rounded-full">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-orange-600 hover:bg-orange-500 text-white rounded-full cursor-pointer shadow-xl transition-all hover:scale-110 z-10">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'profile', 'profile', 'imageUrl')}
                    />
                  </label>
                  {(data.profile as any).imageUrl && (
                    <button
                      onClick={() => handleDeleteImage((data.profile as any).imageUrl, 'profile', 'imageUrl')}
                      disabled={saving}
                      className="absolute top-0 right-0 p-2 bg-red-500 hover:bg-red-400 text-white rounded-full transition-all hover:scale-110 shadow-xl opacity-0 group-hover:opacity-100 z-10 disabled:opacity-50"
                      title="Borrar foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-white font-medium">Foto de Perfil</h3>
                  <p className="text-xs text-gray-500 mt-1">Sube una imagen cuadrada para mejores resultados</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                      value={(data.profile as any).name || ''}
                      onChange={(e) => updateField('profile', 'name', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Título de Trabajo</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                      value={(data.profile as any).title || ''}
                      onChange={(e) => updateField('profile', 'title', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                      placeholder="Ej. Ingeniero Fullstack Senior"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Biografía</label>
                <textarea
                  value={(data.profile as any).bio || ''}
                  onChange={(e) => updateField('profile', 'bio', e.target.value)}
                  rows={4}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none resize-none"
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Correo</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                      value={(data.profile as any).email || ''}
                      onChange={(e) => updateField('profile', 'email', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                      placeholder="hola@ejemplo.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">URL de GitHub</label>
                  <div className="relative">
                    <Github className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                      value={(data.profile as any).github || ''}
                      onChange={(e) => updateField('profile', 'github', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                      placeholder="github.com/usuario"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">URL de LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                      value={(data.profile as any).linkedin || ''}
                      onChange={(e) => updateField('profile', 'linkedin', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                      placeholder="linkedin.com/in/usuario"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'projects':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wide uppercase">Proyectos</h2>
                <p className="text-gray-400 mt-1">Muestra tu mejor trabajo.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => addItem('projects', { name: 'Nuevo Proyecto', description: '', language: 'JS', stars: 0, forks: 0, type: 'Backend', languageColor: '#3874ff' })}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl border border-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Añadir Proyecto
                </button>
                <button
                  onClick={() => handleSave('projects')}
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              <AnimatePresence>
                {(data.projects as any[]).map((project, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-dark-800 border border-white/10 rounded-2xl p-6 relative group hover:border-orange-500/30 transition-all"
                  >
                    <button
                      onClick={() => removeItem('projects', idx)}
                      className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid gap-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 uppercase tracking-wider">Nombre del Proyecto</label>
                          <input
                            value={project.name}
                            onChange={(e) => updateField('projects', 'name', e.target.value, idx)}
                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white font-bold focus:border-orange-500 transition-colors outline-none"
                            placeholder="Nombre del Proyecto"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 uppercase tracking-wider">Lenguaje</label>
                          <input
                            value={project.language}
                            onChange={(e) => updateField('projects', 'language', e.target.value, idx)}
                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 transition-colors outline-none"
                            placeholder="Lenguaje"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider">Descripción</label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateField('projects', 'description', e.target.value, idx)}
                          className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-orange-500 transition-colors outline-none resize-none"
                          placeholder="Descripción del Proyecto"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider">Imagen del Proyecto</label>
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-24 rounded-xl bg-dark-900 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
                            {project.imageUrl ? (
                              <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-gray-800" />
                            )}
                            {uploading === `projects-${idx}` && (
                              <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                          <div className="flex-grow space-y-3">
                            <input
                              value={project.imageUrl || ''}
                              onChange={(e) => updateField('projects', 'imageUrl', e.target.value, idx)}
                              className="w-full bg-dark-900 border border-white/10 rounded-xl p-2.5 text-xs text-gray-400 focus:border-orange-500 outline-none"
                              placeholder="URL de la imagen o sube una"
                            />
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white text-xs font-medium rounded-lg cursor-pointer transition-all border border-white/5">
                              <Upload className="w-3.5 h-3.5" />
                              Subir Imagen
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'projects', 'projects', 'imageUrl', idx)}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 uppercase tracking-wider">Estrellas</label>
                          <input
                            type="number"
                            value={project.stars}
                            onChange={(e) => updateField('projects', 'stars', parseInt(e.target.value), idx)}
                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-orange-500 transition-colors outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 uppercase tracking-wider">Forks</label>
                          <input
                            type="number"
                            value={project.forks}
                            onChange={(e) => updateField('projects', 'forks', parseInt(e.target.value), idx)}
                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-orange-500 transition-colors outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 uppercase tracking-wider">Tipo</label>
                          <select
                            value={project.type}
                            onChange={(e) => updateField('projects', 'type', e.target.value, idx)}
                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-orange-500 transition-colors outline-none appearance-none"
                          >
                            <option value="Backend">Backend</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Data">Data</option>
                            <option value="DevOps">DevOps</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-gray-500 uppercase tracking-wider">Color</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={project.languageColor || '#3874ff'}
                              onChange={(e) => updateField('projects', 'languageColor', e.target.value, idx)}
                              className="h-11 w-12 bg-dark-900 border border-white/10 rounded-xl p-1 cursor-pointer"
                            />
                            <input
                              value={project.languageColor}
                              onChange={(e) => updateField('projects', 'languageColor', e.target.value, idx)}
                              className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white text-sm font-mono focus:border-orange-500 transition-colors outline-none"
                              placeholder="#Hex"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {(data.projects as any[]).length === 0 && (
                <div className="text-center py-12 bg-dark-800/50 border border-white/5 rounded-2xl border-dashed">
                  <Code2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Aún no se han añadido proyectos.</p>
                  <button
                    onClick={() => addItem('projects', { name: 'Nuevo Proyecto', description: '', language: 'JS', stars: 0, forks: 0, type: 'Backend', languageColor: '#3874ff' })}
                    className="mt-4 text-orange-400 hover:text-orange-300 font-medium"
                  >
                    Añade tu primer proyecto
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'skills':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wide uppercase">Radar de Habilidades</h2>
                <p className="text-gray-400 mt-1">Define tus fortalezas técnicas.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => addItem('skills', { subject: 'Nueva Habilidad', score: 50 })}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl border border-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Añadir Habilidad
                </button>
                <button
                  onClick={() => handleSave('skills')}
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {(data.skills as any[]).map((skill, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-6 bg-dark-800 p-6 rounded-xl border border-white/10 group hover:border-orange-500/30 transition-all"
                  >
                    <div className="flex-1 space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Nombre de la Habilidad</label>
                      <input
                        value={skill.subject}
                        onChange={(e) => updateField('skills', 'subject', e.target.value, idx)}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 transition-colors outline-none"
                        placeholder="Ej. React"
                      />
                    </div>
                    <div className="w-1/3 space-y-2">
                      <div className="flex justify-between">
                        <label className="text-xs text-gray-500 uppercase tracking-wider">Competencia</label>
                        <span className="text-xs font-mono text-orange-400">{skill.score}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.score}
                        onChange={(e) => updateField('skills', 'score', parseInt(e.target.value), idx)}
                        className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>
                    <button
                      onClick={() => removeItem('skills', idx)}
                      className="mt-6 p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Eliminar Habilidad"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wide uppercase">Experiencia</h2>
                <p className="text-gray-400 mt-1">Tu trayectoria profesional.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => addItem('experience', { role: 'Nuevo Rol', company: '', period: '', description: '' })}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl border border-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Añadir Rol
                </button>
                <button
                  onClick={() => handleSave('experience')}
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {(data.experience as any[]).map((exp, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-dark-800 p-6 rounded-2xl border border-white/10 space-y-6 relative group hover:border-orange-500/30 transition-all"
                  >
                    <button
                      onClick={() => removeItem('experience', idx)}
                      className="absolute top-6 right-6 p-2 text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete Experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider">Rol</label>
                        <input
                          value={exp.role}
                          onChange={(e) => updateField('experience', 'role', e.target.value, idx)}
                          className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 transition-colors outline-none"
                          placeholder="Ej. Ingeniero Senior"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider">Empresa</label>
                        <input
                          value={exp.company}
                          onChange={(e) => updateField('experience', 'company', e.target.value, idx)}
                          className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 transition-colors outline-none"
                          placeholder="Ej. Google"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Período</label>
                      <input
                        value={exp.period}
                        onChange={(e) => updateField('experience', 'period', e.target.value, idx)}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 transition-colors outline-none"
                        placeholder="Ej. 2020 - Presente"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Descripción</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateField('experience', 'description', e.target.value, idx)}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 transition-colors outline-none resize-none"
                        rows={3}
                        placeholder="Describe tus responsabilidades..."
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wide uppercase">Configuración General</h2>
                <p className="text-gray-400 mt-1">Personaliza el contenido de todo el sitio.</p>
              </div>
              <button
                onClick={() => handleSave('settings')}
                disabled={saving}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>

            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8 space-y-8">
              {/* Branding & Hero */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Identidad y Hero</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Nombre del Sitio</label>
                    <input
                      value={(data.settings as any)?.siteName || ''}
                      onChange={(e) => updateField('settings', 'siteName', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Badge Hero</label>
                    <input
                      value={(data.settings as any)?.heroBadge || ''}
                      onChange={(e) => updateField('settings', 'heroBadge', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Título Hero (Línea 1)</label>
                    <input
                      value={(data.settings as any)?.heroTitle1 || ''}
                      onChange={(e) => updateField('settings', 'heroTitle1', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Título Hero (Línea 2)</label>
                    <input
                      value={(data.settings as any)?.heroTitle2 || ''}
                      onChange={(e) => updateField('settings', 'heroTitle2', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Sección "Sobre Mí"</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Título Sección</label>
                    <input
                      value={(data.settings as any)?.aboutTitle || ''}
                      onChange={(e) => updateField('settings', 'aboutTitle', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Párrafos (Uno por línea)</label>
                    <textarea
                      value={(data.settings as any)?.aboutDescription?.join('\n') || ''}
                      onChange={(e) => updateField('settings', 'aboutDescription', e.target.value.split('\n'))}
                      rows={6}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Imagen del Logo/About</label>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="w-20 h-20 rounded-xl bg-dark-900 border border-white/10 overflow-hidden flex items-center justify-center p-2 relative">
                        {(data.settings as any)?.aboutImage?.trim() ? (
                          <img src={(data.settings as any).aboutImage} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-700" />
                        )}
                        {uploading === 'settings' && (
                          <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white text-sm font-medium rounded-lg cursor-pointer transition-all border border-white/5 w-fit">
                          <Upload className="w-4 h-4" />
                          Subir Imagen (Logo)
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'settings', 'settings', 'aboutImage')}
                          />
                        </label>
                        {(data.settings as any)?.aboutImage && (
                          <button
                            onClick={() => handleDeleteImage((data.settings as any).aboutImage, 'settings', 'aboutImage')}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-lg cursor-pointer transition-all border border-red-500/20 w-fit disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Borrar Logo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arsenal / WhatsApp */}
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">WhatsApp</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Número (con código país)</label>
                      <input
                        value={(data.settings as any)?.whatsappNumber || ''}
                        onChange={(e) => updateField('settings', 'whatsappNumber', e.target.value)}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                        placeholder="Ej. 34600000000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Saludo (Título)</label>
                      <input
                        value={(data.settings as any)?.whatsappGreeting || ''}
                        onChange={(e) => updateField('settings', 'whatsappGreeting', e.target.value)}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Mensaje (Cuerpo)</label>
                      <textarea
                        value={(data.settings as any)?.whatsappMessage || ''}
                        onChange={(e) => updateField('settings', 'whatsappMessage', e.target.value)}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Arsenal Técnico</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Título Arsenal</label>
                      <input
                        value={(data.settings as any)?.arsenalTitle || ''}
                        onChange={(e) => updateField('settings', 'arsenalTitle', e.target.value)}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Descripción Arsenal</label>
                      <textarea
                        value={(data.settings as any)?.arsenalDescription || ''}
                        onChange={(e) => updateField('settings', 'arsenalDescription', e.target.value)}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none resize-none"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Pie de Página (Footer)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Texto Branding</label>
                    <input
                      value={(data.settings as any)?.footerText || ''}
                      onChange={(e) => updateField('settings', 'footerText', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Copyright / Derechos</label>
                    <input
                      value={(data.settings as any)?.copyright || ''}
                      onChange={(e) => updateField('settings', 'copyright', e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col md:flex-row font-sans">
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-dark-800 z-50 sticky top-0">
        <div className="flex items-center gap-3 text-orange-500">
          <span className="font-orbitron font-bold text-xl">{'<'}</span>
          <span className="font-orbitron font-bold text-base uppercase tracking-widest text-white">WILLY TECH</span>
          <span className="font-orbitron font-bold text-xl">{'>'}</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-dark-800 border-r border-white/5 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 text-orange-500 mb-3">
            <span className="font-orbitron font-bold text-xl">{'<'}</span>
            <span className="font-orbitron font-bold text-base uppercase tracking-widest text-white">WILLY TECH</span>
            <span className="font-orbitron font-bold text-xl">{'>'}</span>
          </div>
          <h1 className="text-xl font-medium text-gray-400 tracking-tight pl-1">Consola de Admin</h1>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 px-4">Gestión de Contenido</div>

          <button
            onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${activeTab === 'profile'
              ? 'bg-orange-600/10 text-orange-400 border border-orange-500/20'
              : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-orange-400' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="font-medium">Perfil</span>
          </button>

          <button
            onClick={() => { setActiveTab('skills'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${activeTab === 'skills'
              ? 'bg-orange-600/10 text-orange-400 border border-orange-500/20'
              : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
          >
            <BarChart3 className={`w-5 h-5 ${activeTab === 'skills' ? 'text-orange-400' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="font-medium">Habilidades</span>
          </button>

          <button
            onClick={() => { setActiveTab('projects'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${activeTab === 'projects'
              ? 'bg-orange-600/10 text-orange-400 border border-orange-500/20'
              : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
          >
            <Code2 className={`w-5 h-5 ${activeTab === 'projects' ? 'text-orange-400' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="font-medium">Proyectos</span>
          </button>

          <button
            onClick={() => { setActiveTab('experience'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${activeTab === 'experience'
              ? 'bg-orange-600/10 text-orange-400 border border-orange-500/20'
              : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
          >
            <Briefcase className={`w-5 h-5 ${activeTab === 'experience' ? 'text-orange-400' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="font-medium">Experiencia</span>
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${activeTab === 'settings'
              ? 'bg-orange-600/10 text-orange-400 border border-orange-500/20'
              : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
          >
            <Palette className={`w-5 h-5 ${activeTab === 'settings' ? 'text-orange-400' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="font-medium">Configuración</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-400 hover:bg-dark-700 hover:text-white rounded-xl transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto h-[calc(100vh-64px)] md:h-screen w-full scrollbar-thin scrollbar-track-dark-900 scrollbar-thumb-dark-700">
        <div className="max-w-5xl mx-auto pb-20">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
