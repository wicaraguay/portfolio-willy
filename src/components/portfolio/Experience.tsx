import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { ChevronRight, Terminal } from 'lucide-react';
import { Experience as ExperienceType } from '../../types';

interface ExperienceProps {
    experienceList?: ExperienceType[];
}

const Experience: React.FC<ExperienceProps> = ({ experienceList = [] }) => {
    const yPos = useMotionValue(0);
    const yPosPct = useTransform(yPos, (v: number) => `${v}%`);
    const [isPaused, setIsPaused] = useState(false);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const animationRef = useRef<any>(null);

    const startExperienceAnimation = (currentY = yPos.get()) => {
        if (animationRef.current) animationRef.current.stop();

        const targetY = -50;
        const startY = currentY <= -50 ? 0 : currentY;
        if (startY === 0) yPos.set(0);

        const distanceToTravel = Math.abs(targetY - startY);
        const totalDistance = 50;
        const duration = (distanceToTravel / totalDistance) * 30;

        animationRef.current = animate(yPos, targetY, {
            duration: duration,
            ease: "linear",
            onComplete: () => {
                yPos.set(0);
                startExperienceAnimation(0);
            }
        });
    };

    useEffect(() => {
        startExperienceAnimation();
        return () => {
            if (animationRef.current) animationRef.current.stop();
        };
    }, []);

    const resetIdleTimer = () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (isPaused) {
            idleTimerRef.current = setTimeout(() => {
                setIsPaused(false);
                startExperienceAnimation();
            }, 2000);
        }
    };

    const handleManualInteraction = () => {
        if (animationRef.current) animationRef.current.stop();
        setIsPaused(true);
        resetIdleTimer();
    };

    return (
        <div className="bg-dark-800 border border-white/5 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Terminal className="w-32 h-32 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-orange-400" />
                Experiencia Laboral
            </h3>
            <div
                className="relative h-[500px] mt-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] cursor-grab active:cursor-grabbing"
                onMouseMove={resetIdleTimer}
                onTouchStart={resetIdleTimer}
            >
                <motion.div
                    style={{ y: yPosPct }}
                    drag="y"
                    dragConstraints={{ top: -1000, bottom: 0 }}
                    onDragStart={handleManualInteraction}
                    onHoverStart={() => {
                        if (animationRef.current) animationRef.current.stop();
                        setIsPaused(true);
                    }}
                    onHoverEnd={resetIdleTimer}
                    className="space-y-8 pb-12"
                >
                    {[...experienceList, ...experienceList].map((job, i) => {
                        const description = typeof job.description === 'string' ? job.description : job.description.join('\n');
                        const parts = description.split(/(?:\s+-\s+|\n-\s+|^-\s+)/).map(p => p.trim()).filter(p => p.length > 0);
                        const startsWithDash = description.trim().startsWith('-');
                        const intro = startsWithDash ? '' : parts[0];
                        const tasks = startsWithDash ? parts : parts.slice(1);

                        return (
                            <div key={i} className="relative group bg-dark-800/40 p-8 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all select-none">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <div className="text-xl font-orbitron font-bold text-white tracking-tight group-hover:text-orange-400 transition-colors uppercase">{job.role}</div>
                                            <div className="text-sm font-mono text-orange-400 mt-1 flex items-center gap-2">
                                                <span>{job.company}</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-pixel text-gray-500 border border-white/10 px-2 py-1 rounded bg-dark-900/50">
                                            {job.period}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {intro && (
                                            <p className="text-sm text-gray-400 leading-relaxed italic opacity-80">
                                                {intro}
                                            </p>
                                        )}
                                        {tasks.length > 0 && (
                                            <ul className="space-y-3">
                                                {tasks.map((task, idx) => (
                                                    <li key={idx} className="text-sm text-gray-400 leading-relaxed flex items-start gap-3">
                                                        <ChevronRight className="w-3 h-3 mt-1 text-orange-500/50 flex-shrink-0" />
                                                        <span>{task}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default Experience;
