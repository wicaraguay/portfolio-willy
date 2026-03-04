import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Settings } from '../../types';

interface NavbarProps {
    settings: Settings;
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
    handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ settings, isMenuOpen, setIsMenuOpen, handleNavClick }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dark-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3 text-white font-orbitron font-bold text-base md:text-lg tracking-tight">
                    <span className="text-orange-500 text-xl md:text-2xl">{"<"}</span>
                    {settings.siteName}
                    <span className="text-orange-500 text-xl md:text-2xl">{"/>"}</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <a href="/" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-white transition-colors">Inicio</a>
                    <a href="/about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-white transition-colors">Sobre mí</a>
                    <a href="/skills" onClick={(e) => handleNavClick(e, 'skills')} className="hover:text-white transition-colors">Habilidades</a>
                    <a href="/projects" onClick={(e) => handleNavClick(e, 'projects')} className="hover:text-white transition-colors">Proyectos</a>
                    <a href="/contact" onClick={(e) => handleNavClick(e, 'contact')} className="px-4 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md hover:bg-orange-500 hover:text-white transition-all">
                        Contáctame
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b border-white/5 bg-dark-900 overflow-hidden"
                    >
                        <div className="flex flex-col gap-4 p-6 text-base font-medium">
                            <a href="/" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-orange-500 transition-colors">Inicio</a>
                            <a href="/about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-orange-500 transition-colors">Sobre mí</a>
                            <a href="/skills" onClick={(e) => handleNavClick(e, 'skills')} className="hover:text-orange-500 transition-colors">Habilidades</a>
                            <a href="/projects" onClick={(e) => handleNavClick(e, 'projects')} className="hover:text-orange-500 transition-colors">Proyectos</a>
                            <a href="/contact" onClick={(e) => handleNavClick(e, 'contact')} className="py-3 text-center bg-orange-500 text-white rounded-lg">
                                Contáctame
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
