import React from 'react';
import { motion } from 'motion/react';
import { Save, Upload, Trash2, Image as ImageIcon, Info } from 'lucide-react';
import { PortfolioData } from '../../types';

interface AboutEditorProps {
    data: PortfolioData;
    saving: boolean;
    uploading: string | null;
    handleSave: (section: keyof PortfolioData) => void;
    handleFileUpload: (file: File, path: string, section: keyof PortfolioData, field: string) => void;
    handleDeleteImage: (url: string, section: keyof PortfolioData, field: string) => void;
    updateField: (section: keyof PortfolioData, field: string, value: any) => void;
}

const AboutEditor: React.FC<AboutEditorProps> = ({
    data,
    saving,
    uploading,
    handleSave,
    handleFileUpload,
    handleDeleteImage,
    updateField
}) => {
    const settings = data.settings;
    const [description, setDescription] = React.useState(
        Array.isArray(settings.aboutDescription)
            ? settings.aboutDescription.join('\n\n')
            : (settings.aboutDescription || '')
    );

    // Sync state when data props update (e.g., after fetching or saving)
    React.useEffect(() => {
        const val = Array.isArray(settings.aboutDescription)
            ? settings.aboutDescription.join('\n\n')
            : (settings.aboutDescription || '');
        // Only update if the joined value is actually different to avoid cursor jumps
        if (val !== description.split('\n').map(p => p.trim()).filter(p => p !== '').join('\n\n')) {
            setDescription(val);
        }
    }, [settings.aboutDescription]);

    const onDescriptionChange = (val: string) => {
        setDescription(val);
        const paragraphs = val.split('\n').map(p => p.trim()).filter(p => p !== '');
        updateField('settings', 'aboutDescription', paragraphs);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wide uppercase">Sobre Mí</h2>
                    <p className="text-gray-400 mt-1">Personaliza tu sección biográfica y fotos.</p>
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
                {/* Image Section */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Imagen Destacada</label>
                    <div className="flex items-center gap-6">
                        <div className="w-48 h-48 bg-dark-900 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center relative group">
                            {settings.aboutImage ? (
                                <>
                                    <img src={settings.aboutImage} alt="About" className="w-full h-full object-contain p-4" />
                                    <button
                                        onClick={() => handleDeleteImage(settings.aboutImage, 'settings', 'aboutImage')}
                                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <ImageIcon className="w-16 h-16 text-gray-800" />
                            )}
                            {uploading === 'settings' && (
                                <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl transition-all border border-white/5">
                                <Upload className="w-4 h-4" />
                                Subir Nueva Foto
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'settings', 'settings', 'aboutImage')}
                                />
                            </label>
                            <p className="text-xs text-gray-500 max-w-xs">
                                Recomendado: Imagen con fondo transparente (PNG) en alta resolución.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Título de la Sección</label>
                        <div className="relative">
                            <Info className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input
                                value={settings.aboutTitle}
                                onChange={(e) => updateField('settings', 'aboutTitle', e.target.value)}
                                className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 transition-all outline-none"
                                placeholder="Ej: Sobre Mí"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-medium text-orange-400 uppercase tracking-wider">Descripción / Biografía</label>
                            <span className="text-[10px] text-gray-500 font-mono italic">Usa saltos de línea para crear nuevos párrafos</span>
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => onDescriptionChange(e.target.value)}
                            rows={10}
                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 transition-all outline-none resize-none leading-relaxed font-saira text-base"
                            placeholder="Escribe aquí tu descripción detallada..."
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AboutEditor;
