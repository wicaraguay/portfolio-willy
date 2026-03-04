import React from 'react';
import {
    User,
    Code2,
    Briefcase,
    BarChart3,
    Palette,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleLogout
}) => {
    const menuItems = [
        { id: 'profile', label: 'Biografía', icon: <User className="w-5 h-5" /> },
        { id: 'projects', label: 'Proyectos', icon: <Code2 className="w-5 h-5" /> },
        { id: 'skills', label: 'Habilidades', icon: <BarChart3 className="w-5 h-5" /> },
        { id: 'experience', label: 'Experiencia', icon: <Briefcase className="w-5 h-5" /> },
        { id: 'settings', label: 'Ajustes', icon: <Palette className="w-5 h-5" /> },
    ];

    return (
        <>
            <button
                className="lg:hidden fixed bottom-8 left-8 p-4 bg-orange-600 text-white rounded-full shadow-2xl z-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="lg:hidden fixed inset-0 bg-dark-900 z-40 p-8 pt-24"
                    >
                        <div className="space-y-4">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${activeTab === item.id ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20' : 'text-gray-400'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="font-bold">{item.label}</span>
                                </button>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-red-400 mt-8"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-bold">Salir</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <aside className="hidden lg:flex w-72 flex-col bg-dark-800 border-r border-white/5 p-8 fixed h-screen overflow-y-auto">
                <div className="flex items-center gap-3 text-orange-500 mb-12">
                    <span className="font-orbitron font-bold text-2xl">{'<'}</span>
                    <span className="font-orbitron font-bold text-lg uppercase tracking-widest text-white">ADMIN</span>
                    <span className="font-orbitron font-bold text-2xl">{'>'}</span>
                </div>

                <nav className="flex-1 space-y-3">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20 shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <div className={activeTab === item.id ? 'text-orange-500' : 'text-gray-500'}>
                                {item.icon}
                            </div>
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-black/20 transition-all mt-8"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Cerrar Sesión</span>
                </button>
            </aside>
        </>
    );
};

export default Sidebar;
