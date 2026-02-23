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
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, storage } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  const [data, setData] = useState({
    profile: {},
    skills: [],
    projects: [],
    experience: [],
    stats: []
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });

    async function fetchData() {
      try {
        const collections = ['profile', 'skills', 'projects', 'experience', 'stats'];
        const results: any = {};
        for (const name of collections) {
          const docRef = doc(db, 'content', name);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const docData = docSnap.data();
            results[name] = name === 'profile' ? docData : docData.data;
          }
        }
        setData(results);
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
      const payload = section === 'profile' ? sectionData : { data: sectionData };
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
      const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      updateField(section, field, url, index);
      showNotification('Imagen subida correctamente', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Error al subir la imagen', 'error');
    } finally {
      setUploading(null);
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
      const newData = { ...prev };
      if (index !== undefined && Array.isArray(newData[section as keyof typeof newData])) {
        // @ts-ignore
        newData[section][index][field] = value;
      } else {
        // @ts-ignore
        newData[section][field] = value;
      }
      return newData;
    });
  };

  const addItem = (section: string, template: any) => {
    setData(prev => {
      const newData = { ...prev };
      // @ts-ignore
      newData[section] = [...newData[section], template];
      return newData;
    });
  };

  const removeItem = (section: string, index: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;

    setData(prev => {
      const newData = { ...prev };
      // @ts-ignore
      newData[section] = newData[section].filter((_, i) => i !== index);
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
            <span className="font-pixel text-2xl">{'<'}</span>
            <span className="font-pixel text-lg uppercase tracking-widest text-white">WILLY TECH</span>
            <span className="font-pixel text-2xl">{'>'}</span>
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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-pixel text-white tracking-wide">Configuración del Perfil</h2>
                <p className="text-gray-400 mt-1">Gestiona tu información personal y biografía.</p>
              </div>
              <button
                onClick={() => handleSave('profile')}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>

            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8 space-y-8">
              <div className="flex flex-col items-center gap-6 pb-8 border-b border-white/5">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500/20 group-hover:border-orange-500/50 transition-all bg-dark-900 flex items-center justify-center">
                    {(data.profile as any).imageUrl ? (
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
                  <label className="absolute bottom-0 right-0 p-2 bg-orange-600 hover:bg-orange-500 text-white rounded-full cursor-pointer shadow-xl transition-all hover:scale-110">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'profile', 'profile', 'imageUrl')}
                    />
                  </label>
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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-pixel text-white tracking-wide">Proyectos</h2>
                <p className="text-gray-400 mt-1">Muestra tu mejor trabajo.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => addItem('projects', { name: 'Nuevo Proyecto', description: '', language: 'JS', stars: 0, forks: 0, type: 'Backend', languageColor: '#3874ff' })}
                  className="flex items-center gap-2 px-4 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl border border-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Añadir Proyecto
                </button>
                <button
                  onClick={() => handleSave('projects')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Changes'}
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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-pixel text-white tracking-wide">Radar de Habilidades</h2>
                <p className="text-gray-400 mt-1">Define tus fortalezas técnicas.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => addItem('skills', { subject: 'Nueva Habilidad', score: 50 })}
                  className="flex items-center gap-2 px-4 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl border border-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Añadir Habilidad
                </button>
                <button
                  onClick={() => handleSave('skills')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-pixel text-white tracking-wide">Experiencia</h2>
                <p className="text-gray-400 mt-1">Tu trayectoria profesional.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => addItem('experience', { role: 'Nuevo Rol', company: '', period: '', description: '' })}
                  className="flex items-center gap-2 px-4 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl border border-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Añadir Rol
                </button>
                <button
                  onClick={() => handleSave('experience')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex font-sans">
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-72 bg-dark-800 border-r border-white/5 flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 text-orange-500 mb-3">
            <span className="font-pixel text-lg">{'<'}</span>
            <span className="font-pixel text-sm uppercase tracking-widest text-white">WILLY TECH</span>
            <span className="font-pixel text-lg">{'>'}</span>
          </div>
          <h1 className="text-xl font-medium text-gray-400 tracking-tight pl-1">Consola de Admin</h1>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 px-4">Gestión de Contenido</div>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${activeTab === 'profile'
              ? 'bg-orange-600/10 text-orange-400 border border-orange-500/20'
              : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-orange-400' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="font-medium">Perfil</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${activeTab === 'skills'
              ? 'bg-orange-600/10 text-orange-400 border border-orange-500/20'
              : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
          >
            <BarChart3 className={`w-5 h-5 ${activeTab === 'skills' ? 'text-orange-400' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="font-medium">Habilidades</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${activeTab === 'projects'
              ? 'bg-orange-600/10 text-orange-400 border border-orange-500/20'
              : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
          >
            <Code2 className={`w-5 h-5 ${activeTab === 'projects' ? 'text-orange-400' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="font-medium">Proyectos</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${activeTab === 'experience'
              ? 'bg-orange-600/10 text-orange-400 border border-orange-500/20'
              : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`}
          >
            <Briefcase className={`w-5 h-5 ${activeTab === 'experience' ? 'text-orange-400' : 'text-gray-500 group-hover:text-white'}`} />
            <span className="font-medium">Experiencia</span>
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
      <main className="flex-1 p-10 overflow-y-auto h-screen scrollbar-thin scrollbar-track-dark-900 scrollbar-thumb-dark-700">
        <div className="max-w-5xl mx-auto pb-20">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
