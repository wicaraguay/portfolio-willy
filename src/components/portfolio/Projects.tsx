import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Layout, Server, Activity, Database, Rocket, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Project as ProjectType } from '../../types';
import ProjectGalleryModal from './ProjectGalleryModal';

interface ProjectsProps {
    projects: ProjectType[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
    const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);

    return (
        <>
            <motion.section
                id="projects"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="space-y-8"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold text-white tracking-[0.15em] sm:tracking-[0.2em] uppercase flex items-center gap-3 mb-4">
                            <Rocket className="w-6 h-6 text-orange-400" />
                            Repositorios Destacados
                        </h2>
                        <p className="text-gray-400">Proyectos destacados de código abierto y arquitectura.</p>
                    </div>
                    <a href="https://github.com/wicaraguay" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors">
                        Ver todo en GitHub <ChevronRight className="w-4 h-4" />
                    </a>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="group bg-dark-800 border border-white/10 rounded-xl p-4 sm:p-6 hover:border-orange-500/50 transition-all hover:shadow-[0_4px_20px_rgba(255,159,28,0.1)] flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-dark-700 rounded-lg overflow-hidden flex items-center justify-center text-gray-400 group-hover:text-orange-400 transition-colors border border-white/5 flex-shrink-0">
                                        {project.imageUrl ? (
                                            <img
                                                src={project.imageUrl}
                                                alt={project.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ProjectIcon type={project.type} />
                                        )}
                                    </div>
                                    <a href={project.liveUrl || project.githubUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-orange-400 hover:underline flex items-center gap-2">
                                        {project.name}
                                    </a>
                                </div>
                                <span className={`text-xs font-mono border px-2 py-1 rounded-full ${project.isPrivate ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'}`}>
                                    {project.isPrivate ? 'Private' : 'Public'}
                                </span>
                            </div>

                            <p className="text-sm text-gray-400 mb-6 flex-grow">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-3 mb-6">
                                {(project.liveUrl || project.githubUrl) && (
                                    <a
                                        href={project.liveUrl || project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-md transition-colors border border-white/5"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        {project.liveUrl ? 'Visitar Sitio' : 'Ver Repositorio'}
                                    </a>
                                )}
                                {project.gallery && project.gallery.length > 0 && (
                                    <button
                                        onClick={() => setSelectedProject(project)}
                                        className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-md transition-colors border border-orange-500/20"
                                    >
                                        <ImageIcon className="w-3 h-3" />
                                        Ver Demo UI
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-gray-500 font-mono mt-auto pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.languageColor || '#FF9F1C' }}></span>
                                    {project.language}
                                </div>
                                <div className="flex items-center gap-1.5 hover:text-orange-400 cursor-pointer transition-colors">
                                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
                                    {project.stars}
                                </div>
                                <div className="flex items-center gap-1.5 hover:text-orange-400 cursor-pointer transition-colors">
                                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="fill-current"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>
                                    {project.forks}
                                </div>
                                <div className="ml-auto">
                                    {project.updatedAt && `Actualizado ${project.updatedAt}`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>

            <ProjectGalleryModal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                images={selectedProject?.gallery || []}
                projectName={selectedProject?.name || ''}
            />
        </>
    );
};

const ProjectIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'Backend': return <Server className="w-6 h-6" />;
        case 'Frontend': return <Layout className="w-6 h-6" />;
        case 'Data': return <Activity className="w-6 h-6" />;
        default: return <Database className="w-6 h-6" />;
    }
};

export default Projects;
