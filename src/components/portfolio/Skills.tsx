import React from 'react';
import { motion } from 'motion/react';
import { Layout, Server, Terminal, Cpu } from 'lucide-react';
import { Settings } from '../../types';

interface SkillsProps {
    settings: Settings;
}

const Skills: React.FC<SkillsProps> = ({ settings }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
        >
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-[0.2em] uppercase flex items-center gap-3">
                <Cpu className="w-6 h-6 text-orange-400" />
                {settings.arsenalTitle}
            </h2>
            <p className="text-gray-400 leading-relaxed">
                {settings.arsenalDescription}
            </p>
            <div className="space-y-4">
                <SkillCategory
                    icon={<Server className="w-6 h-6" />}
                    title="Backend & Data"
                    techs={[
                        { name: 'Node.js', icon: 'nodedotjs' },
                        { name: 'Go', icon: 'go' },
                        { name: 'Python', icon: 'python' },
                        { name: 'PostgreSQL', icon: 'postgresql' },
                        { name: 'Redis', icon: 'redis' },
                        { name: 'Kafka', icon: 'apachekafka' }
                    ]}
                />
                <SkillCategory
                    icon={<Layout className="w-6 h-6" />}
                    title="Frontend"
                    techs={[
                        { name: 'React', icon: 'react' },
                        { name: 'TypeScript', icon: 'typescript' },
                        { name: 'Tailwind', icon: 'tailwindcss' },
                        { name: 'Next.js', icon: 'nextdotjs' }
                    ]}
                />
                <SkillCategory
                    icon={<Terminal className="w-6 h-6" />}
                    title="DevOps & Cloud"
                    techs={[
                        { name: 'Docker', icon: 'docker' },
                        { name: 'K8s', icon: 'kubernetes' },
                        { name: 'AWS', icon: 'aws' },
                        { name: 'CI/CD', icon: 'githubactions' }
                    ]}
                />
            </div>
        </motion.div>
    );
};

interface SkillCategoryProps {
    icon: React.ReactNode;
    title: string;
    techs: { name: string; icon: string }[];
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ icon, title, techs }) => (
    <div className="flex items-start gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors group/item">
        <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/20 rounded-lg text-orange-400 shadow-[0_0_15px_rgba(255,159,28,0.1)] group-hover/item:shadow-[0_0_20px_rgba(255,159,28,0.2)] transition-all">
            {icon}
        </div>
        <div>
            <h4 className="text-white font-medium">{title}</h4>
            <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                    <div key={tech.name} className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-md group/tech hover:border-orange-500/30 transition-all cursor-default" title={tech.name}>
                        <img
                            src={tech.name === 'AWS'
                                ? "https://1000marcas.net/wp-content/uploads/2025/03/Amazon-Web-Services-Emblem.png"
                                : `https://cdn.simpleicons.org/${tech.icon}/${tech.icon === 'apachekafka' || tech.icon === 'nodedotjs' || tech.icon === 'nextdotjs' || tech.icon === 'githubactions' ? 'fff' : 'FF9F1C'}`}
                            alt={tech.name}
                            className="w-4 h-4 object-contain transition-transform group-hover/tech:scale-110"
                        />
                        <span className="text-[11px] font-mono text-gray-500 group-hover/tech:text-white transition-colors">{tech.name}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default Skills;
