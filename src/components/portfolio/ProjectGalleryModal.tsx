import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface ProjectGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    projectName: string;
}

const ProjectGalleryModal: React.FC<ProjectGalleryModalProps> = ({ isOpen, onClose, images, projectName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setCurrentIndex(0);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-950/90 backdrop-blur-sm p-4 md:p-8"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-5xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[95vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/5 bg-dark-900 flex-shrink-0 relative z-10">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-orbitron font-bold text-white tracking-wider md:tracking-widest flex items-center gap-2 md:gap-3 truncate pr-4">
                                <ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-orange-400 flex-shrink-0" />
                                <span className="truncate">{projectName} - Demo UI</span>
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Gallery Content */}
                        <div className="relative flex-grow flex items-center justify-center bg-dark-950 min-h-[50vh] overflow-hidden p-4">
                            {images.length > 0 ? (
                                <>
                                    <motion.img
                                        key={currentIndex}
                                        src={images[currentIndex]}
                                        alt={`${projectName} screenshot ${currentIndex + 1}`}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="max-w-full max-h-[60vh] md:max-h-[70vh] object-contain rounded-lg shadow-lg border border-white/5"
                                    />

                                    {/* Controls */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-dark-900/80 text-white rounded-full border border-white/10 hover:bg-orange-500 hover:border-orange-500 transition-all shadow-lg backdrop-blur-md z-10"
                                            >
                                                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-dark-900/80 text-white rounded-full border border-white/10 hover:bg-orange-500 hover:border-orange-500 transition-all shadow-lg backdrop-blur-md z-10"
                                            >
                                                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                                            </button>

                                            {/* Indicators */}
                                            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-dark-900/80 backdrop-blur-md rounded-full border border-white/10 max-w-[80vw] overflow-x-auto no-scrollbar z-10">
                                                {images.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCurrentIndex(idx)}
                                                        className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all flex-shrink-0 ${idx === currentIndex
                                                            ? 'bg-orange-500 w-4 md:w-6'
                                                            : 'bg-gray-500 hover:bg-gray-400'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="text-gray-500 flex flex-col items-center gap-4">
                                    <ImageIcon className="w-12 h-12 opacity-50" />
                                    <p>No hay imágenes disponibles para este proyecto.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProjectGalleryModal;
