/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Github,
  Terminal,
  Database,
  Server,
  Layout,
  Activity,
  ChevronRight,
  Mail,
  Linkedin,
  MapPin,
  GitBranch,
  Globe,
  ChevronUp,
  Menu,
  X,
  User,
  Image as ImageIcon
} from 'lucide-react';



// --- Mock Data ---

const skillData = [
  { subject: 'Backend', score: 95, fullMark: 100 },
  { subject: 'Frontend', score: 85, fullMark: 100 },
  { subject: 'Databases', score: 90, fullMark: 100 },
  { subject: 'DevOps', score: 75, fullMark: 100 },
  { subject: 'Data Eng', score: 80, fullMark: 100 },
  { subject: 'Architecture', score: 90, fullMark: 100 },
];

const projects = [
  {
    id: 1,
    name: "data-pipeline-engine",
    description: "High-throughput data processing pipeline built with Go and Apache Kafka. Handles millions of events per second.",
    language: "Go",
    languageColor: "#00ADD8",
    stars: 128,
    forks: 34,
    updatedAt: "2 days ago",
    type: "Backend",
    icon: <Database className="w-4 h-4" />
  },
  {
    id: 2,
    name: "analytics-dashboard-ui",
    description: "Real-time analytics dashboard frontend using React, Recharts, and WebSockets. Highly optimized for rendering large datasets.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 85,
    forks: 12,
    updatedAt: "5 days ago",
    type: "Frontend",
    icon: <Layout className="w-4 h-4" />
  },
  {
    id: 3,
    name: "auth-microservice",
    description: "Scalable authentication microservice with OAuth2, JWT, and Redis caching. Deployed via Kubernetes.",
    language: "Rust",
    languageColor: "#dea584",
    stars: 210,
    forks: 45,
    updatedAt: "1 week ago",
    type: "Backend",
    icon: <Server className="w-4 h-4" />
  },
  {
    id: 4,
    name: "ml-model-server",
    description: "FastAPI server for serving machine learning models with GPU acceleration and dynamic batching.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 342,
    forks: 89,
    updatedAt: "2 weeks ago",
    type: "Data",
    icon: <Activity className="w-4 h-4" />
  },
];

const stats = [
  { label: "Commits (Last Year)", value: "2,845", trend: "+12%" },
  { label: "Data Processed", value: "45 TB", trend: "+5%" },
  { label: "Uptime Maintained", value: "99.99%", trend: "Stable" },
  { label: "Projects Shipped", value: "24", trend: "+3" },
];

export default function Portfolio({ initialData }: { initialData?: any }) {
  const profileDefaults = {
    name: "Willan Caraguay",
    title: "Fullstack Developer & Data Engineer",
    bio: "Especialista en desarrollo de sistemas escalables, pipelines de datos y experiencias digitales de alto impacto.",
    email: "willan.caraguay@gmail.com",
    github: "github.com/willytech",
    linkedin: "linkedin.com/in/willan-caraguay",
    imageUrl: "/images/willy.png"
  };

  const settingsDefaults = {
    siteName: 'WILLY TECH',
    heroBadge: 'Willan Caraguay • Data Engineer',
    heroTitle1: 'Fullstack',
    heroTitle2: 'Developer',
    heroGithubUrl: 'github.com/developer',
    heroGitlabUrl: 'gitlab.com/developer',
    aboutTitle: 'Sobre mí',
    aboutDescription: [
      'Hola, soy un Ingeniero de Software Fullstack apasionado por los datos y la arquitectura de sistemas. Mi viaje comenzó con la curiosidad de cómo funcionan las cosas "bajo el capó" y evolucionó hacia la construcción de sistemas distribuidos complejos.',
      'Me especializo en cerrar la brecha entre el análisis de datos complejos y las experiencias de usuario intuitivas. No solo escribo código; diseño soluciones que escalan, rinden y aportan valor real al negocio.',
      'Cuando no estoy programando, estoy probablemente optimizando mi configuración de Linux, contribuyendo a proyectos Open Source o aprendiendo sobre las últimas tendencias en IA y Machine Learning.'
    ],
    aboutImage: '/images/willy.png',
    arsenalTitle: 'Arsenal Técnico',
    arsenalDescription: 'Mi enfoque fullstack me permite entender el ciclo de vida completo del software. Desde el diseño de bases de datos optimizadas y pipelines de datos, hasta la creación de interfaces de usuario fluidas y reactivas.',
    whatsappNumber: '34600000000',
    whatsappGreeting: '¿Hablamos de tu proyecto? 👋',
    whatsappMessage: 'Estoy disponible para ayudarte a construir esa solución tecnológica que tienes en mente.',
    footerText: 'Willy Tech',
    copyright: 'Todos los derechos reservados.'
  };

  const profile = { ...profileDefaults, ...initialData?.profile };
  const settings = { ...settingsDefaults, ...initialData?.settings };
  const skills = initialData?.skills?.length > 0 ? initialData.skills : skillData;
  const projectsList = initialData?.projects?.length > 0 ? initialData.projects : projects;
  const experienceList = initialData?.experience?.length > 0 ? initialData.experience : [
    { role: "Senior Fullstack Engineer", company: "TechData Corp", period: "2023 - Present", description: "Liderando la migración a microservicios y optimizando pipelines de datos." },
    { role: "Backend Developer", company: "CloudScale Inc", period: "2021 - 2023", description: "Desarrollo de APIs de alto rendimiento en Go y gestión de clusters Kubernetes." },
    { role: "Frontend Developer", company: "CreativeWeb", period: "2019 - 2021", description: "Creación de dashboards interactivos con React y D3.js." }
  ];
  const statsList = initialData?.stats?.length > 0 ? initialData.stats : stats;



  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Show WhatsApp welcome message after 10 seconds
    const welcomeTimer = setTimeout(() => {
      setShowWelcomeMessage(true);

      // Auto-hide the message after 8 seconds
      setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 8000);
    }, 10000);

    return () => clearTimeout(welcomeTimer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };



  return (
    <div className="min-h-screen bg-dark-900 text-gray-300 selection:bg-orange-500/30 selection:text-white overflow-x-hidden w-full">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dark-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white font-orbitron font-bold text-base md:text-lg tracking-tight">
            <span className="text-orange-500 text-xl md:text-2xl">{"<"}</span>
            {settings.siteName}
            <span className="text-orange-500 text-xl md:text-2xl">{"/>"}</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#home" onClick={handleNavClick} className="hover:text-white transition-colors">Inicio</a>
            <a href="#about" onClick={handleNavClick} className="hover:text-white transition-colors">Sobre mí</a>
            <a href="#skills" onClick={handleNavClick} className="hover:text-white transition-colors">Habilidades</a>
            <a href="#projects" onClick={handleNavClick} className="hover:text-white transition-colors">Proyectos</a>
            <a href="#contact" onClick={handleNavClick} className="px-4 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md hover:bg-orange-500 hover:text-white transition-all">
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
                <a href="#home" onClick={handleNavClick} className="hover:text-orange-500 transition-colors">Inicio</a>
                <a href="#about" onClick={handleNavClick} className="hover:text-orange-500 transition-colors">Sobre mí</a>
                <a href="#skills" onClick={handleNavClick} className="hover:text-orange-500 transition-colors">Habilidades</a>
                <a href="#projects" onClick={handleNavClick} className="hover:text-orange-500 transition-colors">Proyectos</a>
                <a href="#contact" onClick={handleNavClick} className="py-3 text-center bg-orange-500 text-white rounded-lg">
                  Contáctame
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-20 md:space-y-32">

        {/* Hero Section */}
        <section id="home" className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
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
              <h1 className="text-5xl md:text-7xl font-orbitron font-bold tracking-widest leading-[1.3] drop-shadow-lg">
                <span className="text-white">{settings.heroTitle1}</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-500 to-orange-600">
                  {settings.heroTitle2}
                </span>
              </h1>
              <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                {profile.bio}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a href={settings.heroGithubUrl.startsWith('http') ? settings.heroGithubUrl : `https://${settings.heroGithubUrl || profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(255,159,28,0.3)] hover:shadow-[0_0_30px_rgba(255,159,28,0.5)]">
                <Github className="w-5 h-5" />
                Ver GitHub
              </a>
              <a href="#contact" className="flex items-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-800 border border-orange-500/30 hover:border-orange-500/60 text-orange-400 rounded-lg font-medium transition-all">
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

          {/* Hero Visual - Data Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative flex items-center justify-center min-h-[400px] md:min-h-[500px] lg:min-h-[600px] order-1 lg:order-2 overflow-hidden"
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

              {/* Technical HUD Details */}
              <div className="absolute top-8 left-20 flex flex-col gap-1">
                <div className="w-16 h-1 bg-orange-500/20"></div>
                <div className="w-8 h-1 bg-orange-500/40"></div>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] font-pixel text-orange-500/60 tracking-widest uppercase whitespace-nowrap">
                <div className="w-8 md:w-16 h-[1px] bg-orange-500/30"></div>
                <span>Willan Caraguay</span>
                <div className="w-8 md:w-16 h-[1px] bg-orange-500/30"></div>
              </div>
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
                  fetchPriority="high"
                  decoding="sync"
                  className="w-full max-w-[500px] h-auto object-cover drop-shadow-[0_0_50px_rgba(255,143,0,0.4)] rounded-2xl"
                />
              ) : (
                <div className="w-full max-w-[300px] aspect-square flex items-center justify-center bg-dark-900 border border-white/10 rounded-full drop-shadow-[0_0_50px_rgba(255,143,0,0.4)]">
                  <User className="w-32 h-32 text-orange-500/50" />
                </div>
              )}

              {/* Secondary Glow directly behind logo */}
              <div className="absolute inset-0 bg-orange-500/10 blur-3xl -z-10 rounded-full scale-75"></div>
            </motion.div>

            {/* Stylized Label */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-dark-800/50 border border-white/5 rounded-full backdrop-blur-md z-20">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-pixel text-white/80 tracking-widest uppercase">V1.0</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid lg:grid-cols-2 gap-8 md:gap-12"
        >
          <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
            {/* HUD Photo Frame */}
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
                    alt="Willy Tech Logo"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,143,0,0.4)]"
                  />
                ) : (
                  <div className="w-full max-w-[200px] aspect-square flex items-center justify-center bg-dark-900 border border-white/10 rounded-full drop-shadow-[0_0_50px_rgba(255,143,0,0.4)]">
                    <ImageIcon className="w-24 h-24 text-orange-500/50" />
                  </div>
                )}

                {/* Secondary Glow directly behind logo */}
                <div className="absolute inset-0 bg-orange-500/10 blur-3xl -z-10 rounded-full scale-75"></div>
              </motion.div>

              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-orange-500/5 to-transparent h-20 w-full -translate-y-full animate-scan"></div>
            </div>

            {/* Photo Info / Tag */}
            <div className="mt-4 flex items-center justify-between text-[10px] font-pixel text-orange-500/60 uppercase tracking-[0.2em]">
              <span>Identity Verified</span>
              <span>Ref: WC-2024</span>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wide uppercase">{settings.aboutTitle}</h2>
            <div className="prose prose-invert text-gray-400 leading-relaxed">
              {settings.aboutDescription.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center"
        >
          <div className="order-2 lg:order-1 bg-dark-800 border border-white/5 rounded-2xl p-8 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Terminal className="w-32 h-32 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-orange-400" />
              Experiencia Laboral
            </h3>
            <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-dark-700">
              {experienceList.map((job: any, i: number) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-dark-900 border-2 border-orange-500"></div>
                  <div className="text-white font-medium">{job.role}</div>
                  <div className="text-sm text-orange-400 mb-1">{job.company} • {job.period}</div>
                  <div className="text-sm text-gray-500">{job.description || job.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wide uppercase">{settings.arsenalTitle}</h2>
            <p className="text-gray-400 leading-relaxed">
              {settings.arsenalDescription}
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-dark-700 rounded-lg text-orange-400"><Server className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-white font-medium">Backend & Data</h4>
                  <p className="text-sm text-gray-500">Node.js, Go, Python, PostgreSQL, Redis, Kafka</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-dark-700 rounded-lg text-orange-400"><Layout className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-white font-medium">Frontend</h4>
                  <p className="text-sm text-gray-500">React, TypeScript, Tailwind CSS, Next.js</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-dark-700 rounded-lg text-orange-400"><Terminal className="w-6 h-6" /></div>
                <div>
                  <h4 className="text-white font-medium">DevOps & Cloud</h4>
                  <p className="text-sm text-gray-500">Docker, Kubernetes, AWS, CI/CD Pipelines</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Projects Section (GitLab/GitHub Style) */}
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
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wide uppercase mb-4">Repositorios Destacados</h2>
              <p className="text-gray-400">Proyectos destacados de código abierto y arquitectura.</p>
            </div>
            <a href="#" className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Ver todo en GitHub <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projectsList.map((project: any) => (
              <div key={project.id} className="group bg-dark-800 border border-white/10 rounded-xl p-6 hover:border-orange-500/50 transition-all hover:shadow-[0_4px_20px_rgba(255,159,28,0.1)] flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-dark-700 rounded-lg overflow-hidden flex items-center justify-center text-gray-400 group-hover:text-orange-400 transition-colors border border-white/5 flex-shrink-0">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        project.type === 'Backend' ? <Server className="w-6 h-6" /> :
                          project.type === 'Frontend' ? <Layout className="w-6 h-6" /> :
                            project.type === 'Data' ? <Activity className="w-6 h-6" /> : <Database className="w-6 h-6" />
                      )}
                    </div>
                    <a href={project.githubUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-orange-400 hover:underline flex items-center gap-2">
                      {project.name}
                    </a>
                  </div>
                  <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded-full">Public</span>
                </div>

                <p className="text-sm text-gray-400 mb-6 flex-grow">
                  {project.description}
                </p>

                <div className="flex items-center gap-6 text-xs text-gray-500 font-mono mt-auto pt-4 border-t border-white/5">
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
                    Actualizado {project.updatedAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid lg:grid-cols-2 gap-12"
        >
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white tracking-wide uppercase">Hablemos</h2>
            <p className="text-gray-400 leading-relaxed">
              ¿Tienes un proyecto interesante o un problema de datos complejo? Estoy siempre abierto a discutir nuevas oportunidades y colaboraciones técnicas.
            </p>

            <div className="space-y-4 pt-4">
              <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-4 bg-dark-800 border border-white/5 rounded-xl hover:border-orange-500/50 transition-colors group">
                <div className="p-3 bg-dark-700 rounded-lg text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Envíame un Email</div>
                  <div className="text-white font-medium">{profile.email}</div>
                </div>
              </a>

              <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-dark-800 border border-white/5 rounded-xl hover:border-orange-500/50 transition-colors group">
                <div className="p-3 bg-dark-700 rounded-lg text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">LinkedIn</div>
                  <div className="text-white font-medium">{profile.linkedin}</div>
                </div>
              </a>

              <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-dark-800 border border-white/5 rounded-xl hover:border-orange-500/50 transition-colors group">
                <div className="p-3 bg-dark-700 rounded-lg text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">GitHub</div>
                  <div className="text-white font-medium">{profile.github}</div>
                </div>
              </a>
            </div>
          </div>

          <form className="bg-dark-800 border border-white/5 rounded-2xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-white mb-2">Enviar un Mensaje</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Nombre</label>
              <input type="text" className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Juan Pérez" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Email</label>
              <input type="email" className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="juan@ejemplo.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Mensaje</label>
              <textarea rows={4} className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Cuéntame sobre tu proyecto..." />
            </div>
            <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              Enviar Mensaje <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-dark-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-white">
            <span className="text-orange-500 font-orbitron font-bold text-xl">{"<"}</span>
            <span className="font-orbitron font-bold text-base uppercase tracking-widest leading-none mt-1">{settings.footerText}</span>
            <span className="text-orange-500 font-orbitron font-bold text-xl">{"/>"}</span>
          </div>

          <div className="text-sm text-gray-500 font-mono">
            © {new Date().getFullYear()} {settings.footerText}. {settings.copyright}
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-end gap-3 z-50">

        {/* WhatsApp Button with Greeting Message */}
        <motion.div layout transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="relative">
          <AnimatePresence>
            {showWelcomeMessage && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.92, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 12, scale: 0.92, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute bottom-[calc(100%+12px)] right-0 bg-dark-800 border border-orange-500/20 shadow-[0_4px_20px_rgba(255,159,28,0.2)] rounded-2xl p-4 origin-bottom-right"
                style={{ width: 'min(260px, calc(100vw - 2rem))' }}
              >
                <div className="text-sm text-gray-300 font-sans leading-relaxed">
                  <span className="font-bold text-white mb-1 block">{settings.whatsappGreeting}</span>
                  {settings.whatsappMessage}
                </div>
                <div className="absolute -bottom-2 right-4 w-4 h-4 bg-dark-800 border-b border-r border-orange-500/20 transform rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.75, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="p-3 md:p-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-full shadow-[0_0_20px_rgba(255,159,28,0.3)] hover:shadow-[0_0_30px_rgba(255,159,28,0.5)] transition-colors flex items-center justify-center z-10 select-none"
            aria-label="Contactar por WhatsApp"
            onMouseEnter={() => setShowWelcomeMessage(true)}
            onMouseLeave={() => setShowWelcomeMessage(false)}
            onClick={(e) => {
              const isTouch = window.matchMedia('(hover: none)').matches;
              if (isTouch && !showWelcomeMessage) {
                e.preventDefault();
                setShowWelcomeMessage(true);
                setTimeout(() => setShowWelcomeMessage(false), 4000);
              }
            }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 1.76.45 3.41 1.23 4.88L2 22l5.23-1.18c1.45.75 3.08 1.18 4.77 1.18 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.27c-1.53 0-3-.4-4.27-1.13l-3.08.69.7-2.92C4.58 15.42 4.15 13.76 4.15 12c0-4.33 3.52-7.85 7.85-7.85s7.85 3.52 7.85 7.85-3.52 7.85-7.85 7.85zm4.23-5.59c-.23-.12-1.38-.68-1.59-.76-.21-.08-.37-.12-.52.12s-.6.76-.74.92c-.14.16-.28.18-.51.06-1.13-.53-2.19-1.31-3.02-2.26-.64-.73-1.07-1.5-1.28-1.87-.07-.12-.01-.25.07-.35.08-.1.17-.2.25-.3s.11-.16.17-.26c.06-.11.03-.21-.01-.31-.05-.1-.52-1.25-.71-1.71-.19-.45-.38-.39-.52-.39h-.45c-.19 0-.5.07-.76.35-.26.28-1 .98-1 2.38s1.02 2.76 1.17 2.96c.14.2 2.01 3.06 4.86 4.29 1.14.49 1.8.72 2.45.92.74.24 1.42.2 1.96.12.59-.08 1.38-.56 1.57-1.11.19-.55.19-1.01.13-1.11-.06-.09-.22-.14-.45-.25z" clipRule="evenodd" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Back to Top Button */}
        <AnimatePresence mode="wait">
          {showScrollTop && (
            <motion.button
              key="scroll-top"
              initial={{ opacity: 0, y: 16, scale: 0.75, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 16, scale: 0.75, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={scrollToTop}
              className="p-3 md:p-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-full shadow-[0_0_20px_rgba(255,159,28,0.3)] hover:shadow-[0_0_30px_rgba(255,159,28,0.5)] transition-colors"
              aria-label="Volver arriba"
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
