import React from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, User } from 'lucide-react';
import { Settings } from '../../types';

interface AboutProps {
    settings: Settings;
}

const About: React.FC<AboutProps> = ({ settings }) => {
    return (
        <motion.section
            id="about"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="grid md:grid-cols-2 gap-8 md:gap-12"
        >
            <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-orange-500"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-orange-500"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-orange-500"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-orange-500"></div>
                </div>

                <div className="relative aspect-square w-full bg-dark-900/50 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center p-8">
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotateZ: [0, 0.5, 0, -0.5, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative z-10 w-full h-full flex items-center justify-center p-8"
                    >
                        {settings.aboutImage?.trim() ? (
                            <img
                                src={settings.aboutImage}
                                alt="About Me"
                                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,143,0,0.4)]"
                            />
                        ) : (
                            <div className="w-full max-w-[200px] aspect-square flex items-center justify-center bg-dark-900 border border-white/10 rounded-full drop-shadow-[0_0_50px_rgba(255,143,0,0.4)]">
                                <ImageIcon className="w-24 h-24 text-orange-500/50" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-orange-500/10 blur-3xl -z-10 rounded-full scale-75"></div>
                    </motion.div>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-orange-500/5 to-transparent h-20 w-full -translate-y-full animate-scan"></div>
                </div>

                {/* Decorative Labels at the bottom of the card */}
                <div className="mt-4 flex justify-between items-center px-2 text-[10px] font-mono tracking-widest text-orange-500/80 uppercase">
                    <div className="flex items-center gap-2">
                        <span>IDENTITY VERIFIED</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>REF: WillyTech 2026</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold text-white tracking-[0.15em] sm:tracking-[0.2em] uppercase flex items-center gap-3">
                    <User className="w-6 h-6 text-orange-400" />
                    {settings.aboutTitle}
                </h2>
                <div className="space-y-4 text-gray-400 leading-relaxed">
                    {Array.isArray(settings.aboutDescription) ? (
                        settings.aboutDescription.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))
                    ) : (
                        <p>{settings.aboutDescription || ''}</p>
                    )}
                </div>
            </div>
        </motion.section>
    );
};

export default About;
