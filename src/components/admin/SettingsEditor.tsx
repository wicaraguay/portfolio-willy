import React from 'react';
import { motion } from 'motion/react';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';
import { PortfolioData } from '../../types';

interface SettingsEditorProps {
    data: PortfolioData;
    saving: boolean;
    uploading: string | null;
    handleSave: (section: keyof PortfolioData) => void;
    handleFileUpload: (file: File, path: string, section: keyof PortfolioData, field: string) => void;
    updateField: (section: keyof PortfolioData, field: string, value: any) => void;
}

const SettingsEditor: React.FC<SettingsEditorProps> = ({
    data,
    saving,
    uploading,
    handleSave,
    handleFileUpload,
    updateField
}) => {
    const settings = data.settings;

    const fields = [
        { label: 'Nombre del Sitio', field: 'siteName' },
        { label: 'Badge Hero', field: 'heroBadge' },
        { label: 'Título Hero 1', field: 'heroTitle1' },
        { label: 'Título Hero 2', field: 'heroTitle2' },
        { label: 'GitHub URL (Hero)', field: 'heroGithubUrl' },
        { label: 'GitLab URL (Hero)', field: 'heroGitlabUrl' },
        { label: 'Título Sobre Mí', field: 'aboutTitle' },
        { label: 'Título Arsenal', field: 'arsenalTitle' },
        { label: 'Descripción Arsenal', field: 'arsenalDescription', type: 'textarea' },
        { label: 'WhatsApp Número', field: 'whatsappNumber' },
        { label: 'WhatsApp Saludo', field: 'whatsappGreeting' },
        { label: 'WhatsApp Mensaje', field: 'whatsappMessage' },
        { label: 'Texto Footer', field: 'footerText' },
        { label: 'Copyright', field: 'copyright' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wide uppercase">Ajustes Generales</h2>
                    <p className="text-gray-400 mt-1">Configura los textos y elementos globales del sitio.</p>
                </div>
                <button
                    onClick={() => handleSave('settings')}
                    disabled={saving}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8 space-y-8">
                <div className="space-y-4">
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Imagen "Sobre Mí"</label>
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32 bg-dark-900 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center relative">
                            {settings.aboutImage ? (
                                <img src={settings.aboutImage} alt="About" className="w-full h-full object-contain" />
                            ) : (
                                <ImageIcon className="w-12 h-12 text-gray-800" />
                            )}
                            {uploading === 'settings' && (
                                <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <label className="cursor-pointer bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-xl transition-all border border-white/5 flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Subir Imagen
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'settings', 'settings', 'aboutImage')}
                            />
                        </label>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {fields.map((f) => (
                        <div key={f.field} className={`space-y-2 ${f.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                            <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">{f.label}</label>
                            {f.type === 'textarea' ? (
                                <textarea
                                    value={(settings as any)[f.field]}
                                    onChange={(e) => updateField('settings', f.field, e.target.value)}
                                    rows={3}
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 transition-colors outline-none resize-none"
                                />
                            ) : (
                                <input
                                    value={(settings as any)[f.field]}
                                    onChange={(e) => updateField('settings', f.field, e.target.value)}
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 transition-colors outline-none"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default SettingsEditor;
