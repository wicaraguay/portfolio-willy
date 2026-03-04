import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { PortfolioData } from '../../types';

interface ExperienceEditorProps {
    data: PortfolioData;
    saving: boolean;
    handleSave: (section: keyof PortfolioData) => void;
    updateField: (section: keyof PortfolioData, field: string, value: any, index?: number) => void;
    addItem: (section: keyof PortfolioData, template: any) => void;
    removeItem: (section: keyof PortfolioData, index: number) => void;
}

const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
    data,
    saving,
    handleSave,
    updateField,
    addItem,
    removeItem
}) => {
    const experience = data.experience;

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
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <AnimatePresence>
                    {experience.map((exp, idx) => (
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
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider">Periodo</label>
                                    <input
                                        value={exp.period}
                                        onChange={(e) => updateField('experience', 'period', e.target.value, idx)}
                                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 transition-colors outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Descripción (Usa "-" para viñetas)</label>
                                <textarea
                                    value={Array.isArray(exp.description) ? exp.description.join('\n') : exp.description}
                                    onChange={(e) => updateField('experience', 'description', e.target.value, idx)}
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none resize-none"
                                    rows={4}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ExperienceEditor;
