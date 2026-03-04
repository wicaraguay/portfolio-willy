import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Plus, Trash2, Upload, Image as ImageIcon, Code2 } from 'lucide-react';
import { PortfolioData, Project } from '../../types';

interface ProjectsEditorProps {
    data: PortfolioData;
    saving: boolean;
    uploading: string | null;
    handleSave: (section: keyof PortfolioData) => void;
    handleFileUpload: (file: File, path: string, section: keyof PortfolioData, field: string, index?: number) => void;
    handleMultipleFileUpload?: (files: FileList, path: string, section: keyof PortfolioData, field: string, index?: number) => void;
    updateField: (section: keyof PortfolioData, field: string, value: any, index?: number) => void;
    addItem: (section: keyof PortfolioData, template: any) => void;
    removeItem: (section: keyof PortfolioData, index: number) => void;
}

const ProjectsEditor: React.FC<ProjectsEditorProps> = ({
    data,
    saving,
    uploading,
    handleSave,
    handleFileUpload,
    handleMultipleFileUpload,
    updateField,
    addItem,
    removeItem
}) => {
    const projects = data.projects;

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
                        onClick={() => addItem('projects', { name: 'Nuevo Proyecto', description: '', language: 'JS', stars: 0, forks: 0, type: 'Backend', languageColor: '#3874ff', updatedAt: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) })}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl border border-white/10 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Añadir Proyecto
                    </button>
                    <button
                        onClick={() => handleSave('projects')}
                        disabled={saving}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                <AnimatePresence>
                    {projects.map((project, idx) => (
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
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center h-[24px]">
                                            <label className="text-xs text-gray-500 uppercase tracking-wider">Privacidad</label>
                                            <label className="flex items-center cursor-pointer">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only"
                                                        checked={project.isPrivate || false}
                                                        onChange={(e) => updateField('projects', 'isPrivate', e.target.checked, idx)}
                                                    />
                                                    <div className={`block w-10 h-6 rounded-full transition-colors ${project.isPrivate ? 'bg-orange-500' : 'bg-dark-700'}`}></div>
                                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${project.isPrivate ? 'transform translate-x-4' : ''}`}></div>
                                                </div>
                                                <span className="ml-3 text-sm text-gray-300">
                                                    {project.isPrivate ? 'Privado' : 'Público'}
                                                </span>
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-500 uppercase tracking-wider mt-1 block">Live URL</label>
                                                <input
                                                    value={project.liveUrl || ''}
                                                    onChange={(e) => updateField('projects', 'liveUrl', e.target.value, idx)}
                                                    placeholder="https://..."
                                                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 transition-colors outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-500 uppercase tracking-wider mt-1 block">Lenguaje</label>
                                                <input
                                                    value={project.language}
                                                    onChange={(e) => updateField('projects', 'language', e.target.value, idx)}
                                                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 transition-colors outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider">Descripción</label>
                                    <textarea
                                        value={project.description}
                                        onChange={(e) => updateField('projects', 'description', e.target.value, idx)}
                                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none resize-none"
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

                                <div className="space-y-2">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wider block">Galería de Imágenes (UI Demo)</label>
                                            <div className="text-[10px] text-gray-400 mt-1">Sube imágenes o ingresa una URL por línea para crear el carrusel de este proyecto.</div>
                                        </div>
                                        <label className={`inline-flex items-center gap-2 px-3 py-1.5 ${uploading === `projects-${idx}-gallery` ? 'bg-orange-500/20 text-orange-400' : 'bg-dark-700 hover:bg-dark-600 text-white'} text-xs font-medium rounded-lg cursor-pointer transition-all border border-white/5 flex-shrink-0`}>
                                            {uploading === `projects-${idx}-gallery` ? (
                                                <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Upload className="w-3.5 h-3.5" />
                                            )}
                                            {uploading === `projects-${idx}-gallery` ? 'Subiendo...' : 'Subir Imágenes'}
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0 && handleMultipleFileUpload) {
                                                        handleMultipleFileUpload(e.target.files, 'projects/gallery', 'projects', 'gallery', idx);
                                                    }
                                                }}
                                                disabled={uploading === `projects-${idx}-gallery`}
                                            />
                                        </label>
                                    </div>
                                    <textarea
                                        value={project.gallery?.join('\n') || ''}
                                        onChange={(e) => {
                                            const urls = e.target.value.split('\n').map(url => url.trim()).filter(url => url.length > 0);
                                            updateField('projects', 'gallery', urls, idx);
                                        }}
                                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white text-xs font-mono focus:border-orange-500 transition-colors outline-none resize-y"
                                        placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.png"
                                        rows={3}
                                    />
                                    {project.gallery && project.gallery.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2 p-2 bg-dark-900 border border-white/5 rounded-lg max-h-32 overflow-y-auto">
                                            {project.gallery.map((url, i) => (
                                                <div key={i} className="relative w-12 h-12 rounded border border-white/10 overflow-hidden group/thumb">
                                                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const newGallery = project.gallery!.filter((_, index) => index !== i);
                                                            updateField('projects', 'gallery', newGallery, idx);
                                                        }}
                                                        className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                                                        title="Eliminar imagen"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Estrellas</label>
                                        <input
                                            type="number"
                                            value={project.stars}
                                            onChange={(e) => updateField('projects', 'stars', parseInt(e.target.value), idx)}
                                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-orange-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Forks</label>
                                        <input
                                            type="number"
                                            value={project.forks}
                                            onChange={(e) => updateField('projects', 'forks', parseInt(e.target.value), idx)}
                                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-orange-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Tipo</label>
                                        <select
                                            value={project.type}
                                            onChange={(e) => updateField('projects', 'type', e.target.value, idx)}
                                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-orange-500 outline-none appearance-none"
                                        >
                                            <option value="Backend">Backend</option>
                                            <option value="Frontend">Frontend</option>
                                            <option value="Data">Data</option>
                                            <option value="DevOps">DevOps</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Color Hex</label>
                                        <input
                                            value={project.languageColor}
                                            onChange={(e) => updateField('projects', 'languageColor', e.target.value, idx)}
                                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white text-sm font-mono focus:border-orange-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs text-gray-500 font-bold uppercase tracking-widest border-b border-white/5 pb-2">Metadatos de Publicación</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase tracking-wider">Última Actualización</label>
                                            <div className="flex gap-2">
                                                <input
                                                    value={project.updatedAt || ''}
                                                    onChange={(e) => updateField('projects', 'updatedAt', e.target.value, idx)}
                                                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-orange-500 outline-none"
                                                    placeholder="Ej: Hace 2 días, 4 Mar 2026..."
                                                />
                                                <button
                                                    onClick={() => {
                                                        const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                                                        updateField('projects', 'updatedAt', today, idx);
                                                    }}
                                                    className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-white text-xs rounded-lg transition-colors border border-white/5 whitespace-nowrap"
                                                    title="Poner fecha de hoy"
                                                >
                                                    Hoy
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {projects.length === 0 && (
                    <div className="text-center py-12 bg-dark-800/50 border border-white/5 rounded-2xl border-dashed">
                        <Code2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Aún no se han añadido proyectos.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProjectsEditor;
