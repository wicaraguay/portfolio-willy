import React from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Github, Send } from 'lucide-react';
import { Profile } from '../../types';

interface ContactProps {
    profile: Profile;
}

const Contact: React.FC<ContactProps> = ({ profile }) => {
    return (
        <motion.section
            id="contact"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="grid lg:grid-cols-2 gap-12 items-start"
        >
            <div className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-orbitron font-extrabold text-white tracking-[0.2em] uppercase leading-tight flex items-center gap-3">
                        <Mail className="w-6 h-6 text-orange-400" />
                        Hablemos
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-md font-medium">
                        ¿Tienes un proyecto interesante o un problema de datos complejo? Estoy siempre abierto a discutir nuevas oportunidades y colaboraciones técnicas.
                    </p>
                </div>

                <div className="space-y-4 max-w-md">
                    <ContactMethod
                        icon={<Mail className="w-5 h-5" />}
                        label="Envíame un Email"
                        value={profile.email}
                        href={`mailto:${profile.email}`}
                    />
                    <ContactMethod
                        icon={<Linkedin className="w-5 h-5" />}
                        label="LinkedIn"
                        value={profile.linkedin}
                        href={`https://${profile.linkedin}`}
                    />
                    <ContactMethod
                        icon={<Github className="w-5 h-5" />}
                        label="GitHub"
                        value={profile.github}
                        href={`https://${profile.github}`}
                    />
                </div>
            </div>

            <div className="bg-dark-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                {/* HUD Decorative Corners */}
                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-40">
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-orange-500/50"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none opacity-40">
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-orange-500/50"></div>
                </div>

                <form className="space-y-6 relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                        <h3 className="text-white font-orbitron font-bold text-lg uppercase tracking-widest">
                            Enviar Mensaje
                        </h3>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] text-gray-400 font-orbitron uppercase tracking-[0.2em] font-bold ml-1 group-hover:text-white transition-colors">
                            Nombre Completo
                        </label>
                        <div className="relative group/input">
                            <input
                                type="text"
                                className="w-full bg-dark-950/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-700 focus:border-orange-500/50 focus:bg-dark-950/80 transition-all outline-none font-saira text-base shadow-inner group-hover/input:border-white/20"
                                placeholder="Escribe tu nombre..."
                            />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-orange-500 group-hover/input:w-[90%] transition-all duration-300"></div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] text-gray-400 font-orbitron uppercase tracking-[0.2em] font-bold ml-1 group-hover:text-white transition-colors">
                            Email de Contacto
                        </label>
                        <div className="relative group/input">
                            <input
                                type="email"
                                className="w-full bg-dark-950/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-700 focus:border-orange-500/50 focus:bg-dark-950/80 transition-all outline-none font-saira text-base shadow-inner group-hover/input:border-white/20"
                                placeholder="tu@email.com"
                            />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-orange-500 group-hover/input:w-[90%] transition-all duration-300"></div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] text-gray-400 font-orbitron uppercase tracking-[0.2em] font-bold ml-1 group-hover:text-white transition-colors">
                            Detalles del Proyecto
                        </label>
                        <div className="relative group/input">
                            <textarea
                                rows={4}
                                className="w-full bg-dark-950/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-700 focus:border-orange-500/50 focus:bg-dark-950/80 transition-all outline-none resize-none font-saira text-base shadow-inner group-hover/input:border-white/20"
                                placeholder="¿Cómo puedo ayudarte?"
                            />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-orange-500 group-hover/input:w-[90%] transition-all duration-300"></div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-orbitron font-bold py-5 rounded-xl transition-all shadow-xl shadow-orange-900/30 flex items-center justify-center gap-3 group/btn uppercase tracking-widest text-sm"
                    >
                        <span>Enviar Mensaje</span>
                        <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </motion.button>
                </form>
            </div>
        </motion.section>
    );
};

interface ContactMethodProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    href: string;
}

const ContactMethod: React.FC<ContactMethodProps> = ({ icon, label, value, href }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, x: 5 }}
        className="flex items-center gap-5 p-5 bg-dark-900/40 backdrop-blur-md border border-white/5 rounded-xl hover:border-orange-500/40 hover:bg-dark-900/60 transition-all group shadow-lg hover:shadow-orange-500/5"
    >
        <div className="w-14 h-14 flex items-center justify-center bg-dark-950/80 rounded-xl text-orange-500 border border-white/10 group-hover:border-orange-500/50 group-hover:text-orange-400 group-hover:shadow-[0_0_20px_rgba(255,143,0,0.2)] transition-all duration-300">
            {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
        </div>
        <div className="space-y-1">
            <div className="text-[10px] text-gray-400 font-orbitron uppercase tracking-[0.2em] font-bold group-hover:text-white transition-colors">
                {label}
            </div>
            <div className="text-gray-200 font-saira text-base font-medium break-all group-hover:text-white transition-colors">
                {value}
            </div>
        </div>
    </motion.a>
);

export default Contact;
