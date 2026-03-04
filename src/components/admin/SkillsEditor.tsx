import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { PortfolioData } from '../../types';

interface SkillsEditorProps {
    data: PortfolioData;
    saving: boolean;
    handleSave: (section: keyof PortfolioData) => void;
    updateField: (section: keyof PortfolioData, field: string, value: any, index?: number) => void;
    addItem: (section: keyof PortfolioData, template: any) => void;
    removeItem: (section: keyof PortfolioData, index: number) => void;
}

const SkillsEditor: React.FC<SkillsEditorProps> = ({
    data,
    saving,
    handleSave,
    updateField,
    addItem,
    removeItem
}) => {
    const skills = data.skills;

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
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                <AnimatePresence>
                    {skills.map((skill, idx) => (
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
                                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
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
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default SkillsEditor;
