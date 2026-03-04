import React from 'react';
import { motion } from 'motion/react';
import { Github, Mail, MapPin, Terminal, User } from 'lucide-react';
import { Profile, Settings } from '../../types';

interface HeroProps {
    profile: Profile;
    settings: Settings;
    handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ profile, settings, handleNavClick }) => {
    return (
        <section id="home" className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center min-h-[50vh] md:min-h-[70vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 order-2 lg:order-1"
            >
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        {settings.heroBadge}
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-orbitron font-bold tracking-widest leading-[1.3] drop-shadow-lg">
                        <span className="text-white">{settings.heroTitle1}</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-500 to-orange-600">
                            {settings.heroTitle2}
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed whitespace-pre-line">
                        {profile.bio}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                    <a href={settings.heroGithubUrl.startsWith('http') ? settings.heroGithubUrl : `https://${settings.heroGithubUrl || profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(255,159,28,0.3)] hover:shadow-[0_0_30px_rgba(255,159,28,0.5)]">
                        <Github className="w-5 h-5" />
                        Ver GitHub
                    </a>
                    <a href="/contact" onClick={(e) => handleNavClick(e, 'contact')} className="flex items-center justify-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-800 border border-orange-500/30 hover:border-orange-500/60 text-orange-400 rounded-lg font-medium transition-all">
                        <Mail className="w-5 h-5" />
                        Contáctame
                    </a>
                </div>

                <div className="flex items-center gap-6 pt-4 text-sm text-gray-500 font-mono">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Remote / Global
                    </div>
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        Linux / Unix
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative flex items-center justify-center min-h-[280px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] order-1 lg:order-2 overflow-hidden"
            >
                {/* Massive Background Glow */}
                <div className="absolute inset-0 bg-orange-600/10 blur-[120px] rounded-full scale-150 animate-pulse"></div>
                <div className="absolute inset-0 bg-orange-500/5 blur-[80px] rounded-full -translate-y-8"></div>

                {/* HUD Corner Accents */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-orange-500/50 rounded-tl-xl mt-4 ml-4"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-orange-500/50 rounded-tr-xl mt-4 mr-4"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-orange-500/50 rounded-bl-xl mb-4 ml-4"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-orange-500/50 rounded-br-xl mb-4 mr-4"></div>
                </div>

                {/* Main Logo with Floating Animation */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotateZ: [0, 1, 0, -1, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative z-10 w-full flex items-center justify-center p-8"
                >
                    {profile.imageUrl?.trim() ? (
                        <img
                            src={profile.imageUrl}
                            alt={profile.name}
                            className="w-full max-w-[500px] h-auto object-cover drop-shadow-[0_0_50px_rgba(255,143,0,0.4)] rounded-2xl"
                        />
                    ) : (
                        <div className="w-full max-w-[300px] aspect-square flex items-center justify-center bg-dark-900 border border-white/10 rounded-full drop-shadow-[0_0_50px_rgba(255,143,0,0.4)]">
                            <User className="w-32 h-32 text-orange-500/50" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-orange-500/10 blur-3xl -z-10 rounded-full scale-75"></div>
                </motion.div>

                {/* Decorative Labels at the bottom of the card */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 flex justify-between items-center text-[8px] sm:text-[10px] font-mono tracking-widest text-orange-500/80 uppercase pointer-events-none">
                    <div className="flex items-center gap-2">
                        <span>IDENTITY VERIFIED</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>REF: WillyTech 2026</span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
