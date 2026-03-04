import React from 'react';
import { motion } from 'motion/react';
import { Save, Camera, User, Briefcase, Mail, Github, Linkedin, Trash2, Image as ImageIcon } from 'lucide-react';
import { PortfolioData } from '../../types';

interface ProfileEditorProps {
    data: PortfolioData;
    saving: boolean;
    uploading: string | null;
    handleSave: (section: keyof PortfolioData) => void;
    handleFileUpload: (file: File, path: string, section: keyof PortfolioData, field: string) => void;
    handleDeleteImage: (url: string, section: keyof PortfolioData, field: string) => void;
    updateField: (section: keyof PortfolioData, field: string, value: any) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
    data,
    saving,
    uploading,
    handleSave,
    handleFileUpload,
    handleDeleteImage,
    updateField
}) => {
    const profile = data.profile;

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
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8 space-y-8">
                <div className="flex flex-col items-center gap-6 pb-8 border-b border-white/5">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500/20 group-hover:border-orange-500/50 transition-all bg-dark-900 flex items-center justify-center">
                            {profile.imageUrl?.trim() ? (
                                <img src={profile.imageUrl} alt="Perfil" className="w-full h-full object-cover" />
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
                        {profile.imageUrl && (
                            <button
                                onClick={() => handleDeleteImage(profile.imageUrl, 'profile', 'imageUrl')}
                                disabled={saving}
                                className="absolute top-0 right-0 p-2 bg-red-500 hover:bg-red-400 text-white rounded-full transition-all hover:scale-110 shadow-xl opacity-0 group-hover:opacity-100 z-10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input
                                value={profile.name}
                                onChange={(e) => updateField('profile', 'name', e.target.value)}
                                className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Título de Trabajo</label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input
                                value={profile.title}
                                onChange={(e) => updateField('profile', 'title', e.target.value)}
                                className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Biografía</label>
                    <textarea
                        value={profile.bio}
                        onChange={(e) => updateField('profile', 'bio', e.target.value)}
                        rows={4}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 transition-all outline-none resize-none"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Correo</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input
                                value={profile.email}
                                onChange={(e) => updateField('profile', 'email', e.target.value)}
                                className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">GitHub URL (sin https://)</label>
                        <div className="relative">
                            <Github className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input
                                value={profile.github}
                                onChange={(e) => updateField('profile', 'github', e.target.value)}
                                className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">LinkedIn URL (sin https://)</label>
                        <div className="relative">
                            <Linkedin className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input
                                value={profile.linkedin}
                                onChange={(e) => updateField('profile', 'linkedin', e.target.value)}
                                className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileEditor;
