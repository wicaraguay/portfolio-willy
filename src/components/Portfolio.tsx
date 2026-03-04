import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// Hooks & Types
import { usePortfolio } from '../hooks/usePortfolio';
import { PortfolioData } from '../types';

// Components
import Navbar from './portfolio/Navbar';
import Hero from './portfolio/Hero';
import About from './portfolio/About';
import Skills from './portfolio/Skills';
import Experience from './portfolio/Experience';
import Projects from './portfolio/Projects';
import Contact from './portfolio/Contact';

// --- Default Data (Mocks) ---
const defaultData: PortfolioData = {
  profile: {
    name: "Willan Caraguay",
    title: "Fullstack Developer & Data Engineer",
    bio: "Especialista en desarrollo de sistemas escalables, pipelines de datos y experiencias digitales de alto impacto.",
    email: "willan.caraguay@gmail.com",
    github: "github.com/willytech",
    linkedin: "linkedin.com/in/willan-caraguay",
    imageUrl: "/images/willy.png"
  },
  settings: {
    siteName: 'WILLY TECH',
    heroBadge: 'Willan Caraguay • Data Engineer',
    heroTitle1: 'Fullstack',
    heroTitle2: 'Developer',
    heroGithubUrl: 'github.com/developer',
    heroGitlabUrl: 'gitlab.com/developer',
    aboutTitle: 'Sobre mí',
    aboutDescription: [
      'Hola, soy un Ingeniero de Software Fullstack apasionado por los datos y la arquitectura de sistemas.',
      'Me especializo en cerrar la brecha entre el análisis de datos complejos y las experiencias de usuario intuitivas.'
    ],
    aboutImage: '/images/willy.png',
    arsenalTitle: 'Habilidades Tech',
    arsenalDescription: 'Mi enfoque fullstack me permite entender el ciclo de vida completo del software.',
    whatsappNumber: '34600000000',
    whatsappGreeting: '¿Hablamos de tu proyecto? 👋',
    whatsappMessage: 'Estoy disponible para ayudarte a construir esa solución tecnológica que tienes en mente.',
    footerText: 'Willy Tech',
    copyright: 'Todos los derechos reservados.'
  },
  skills: [],
  projects: [],
  experience: [
    { role: "Senior Fullstack Engineer", company: "TechData Corp", period: "2023 - Present", description: "Liderando la migración a microservicios." },
  ],
  stats: []
};

export default function Portfolio({ initialData }: { initialData?: PortfolioData }) {
  const { data: fetchedData, loading } = usePortfolio(initialData);

  // Deep merge fetched data with defaults
  const data: PortfolioData = {
    profile: { ...defaultData.profile, ...(fetchedData?.profile || initialData?.profile) },
    settings: { ...defaultData.settings, ...(fetchedData?.settings || initialData?.settings) },
    skills: fetchedData?.skills || initialData?.skills || defaultData.skills,
    projects: fetchedData?.projects || initialData?.projects || defaultData.projects,
    experience: fetchedData?.experience || initialData?.experience || defaultData.experience,
    stats: fetchedData?.stats || initialData?.stats || defaultData.stats,
  };

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { section } = useParams();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const newPath = targetId === 'home' ? '/' : `/${targetId}`;
    navigate(newPath);
    scrollToSection(targetId);
  };

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (section) {
      const timer = setTimeout(() => scrollToSection(section), 100);
      return () => clearTimeout(timer);
    } else if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [section]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setShowWelcomeMessage(true);
      setTimeout(() => setShowWelcomeMessage(false), 12000);
    }, 2000);
    return () => clearTimeout(welcomeTimer);
  }, []);

  if (loading && !initialData) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-orange-500">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-gray-300 selection:bg-orange-500/30 selection:text-white overflow-x-hidden w-full">
      <Navbar
        settings={data.settings}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        handleNavClick={handleNavClick}
      />

      <main className="pt-20 pb-16 px-4 md:px-6 max-w-7xl mx-auto space-y-16 md:space-y-32">
        <Hero profile={data.profile} settings={data.settings} handleNavClick={handleNavClick} />
        <About settings={data.settings} />

        <section id="skills" className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <Skills settings={data.settings} />
          <Experience experienceList={data.experience} />
        </section>

        <Projects projects={data.projects} />
        <Contact profile={data.profile} />
      </main>

      {/* Floating UI Elements */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40 flex flex-col items-center gap-4">
        {/* WhatsApp Button (Entry animation on mount) */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            layout: { type: "spring", stiffness: 260, damping: 20 },
            default: { type: "spring", stiffness: 260, damping: 20 }
          }}
          className="relative flex items-center justify-center"
          onMouseEnter={() => setShowWelcomeMessage(true)}
          onMouseLeave={() => setShowWelcomeMessage(false)}
        >
          <div className="absolute right-full mr-4 pointer-events-none hidden sm:block">
            <AnimatePresence>
              {showWelcomeMessage && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  className="bg-dark-900/95 backdrop-blur-md text-white p-5 rounded-sm shadow-[0_0_40px_rgba(255,143,0,0.15)] border border-orange-500/40 min-w-[300px] max-w-[420px] relative mt-[-65px]"
                >
                  <div className="flex flex-col gap-3 relative z-10 text-left">
                    <div className="flex items-center gap-3 border-b border-orange-500/10 pb-3">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse flex-shrink-0"></span>
                      <p className="text-orange-400 text-sm font-orbitron font-bold tracking-[0.2em] uppercase">
                        {data.settings.whatsappGreeting}
                      </p>
                    </div>
                    <p className="text-[12px] text-gray-300 leading-relaxed font-mono italic tracking-wide">
                      {data.settings.whatsappMessage}
                    </p>
                  </div>

                  {/* Digital corner accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-500/50"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-500/50"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a
            href={`https://wa.me/${data.settings.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-orange-600 text-white rounded-full shadow-2xl hover:bg-orange-500 transition-all hover:scale-110 shadow-orange-900/20"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
        </motion.div>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{
                layout: { type: "spring", stiffness: 260, damping: 20 },
                default: { type: "spring", stiffness: 260, damping: 20 }
              }}
              onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="p-4 bg-dark-800 text-orange-500 border border-orange-500/30 rounded-full shadow-2xl hover:bg-dark-700 z-40 transition-all hover:scale-110"
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <footer className="py-8 md:py-12 px-4 md:px-6 border-t border-white/5 bg-dark-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-white font-orbitron font-bold text-base md:text-lg tracking-tight">
            <span className="text-orange-500 text-xl md:text-2xl">{"<"}</span>
            {data.settings.siteName}
            <span className="text-orange-500 text-xl md:text-2xl">{"/>"}</span>
          </div>
          <div className="text-sm text-gray-500 font-mono">
            © {new Date().getFullYear()} {data.settings.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
