export interface Profile {
    name: string;
    title: string;
    bio: string;
    email: string;
    github: string;
    linkedin: string;
    imageUrl: string;
}

export interface Skill {
    subject: string;
    score: number;
    fullMark?: number;
}

export interface Project {
    id: string | number;
    name: string;
    description: string;
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
    updatedAt?: string;
    type: string;
    imageUrl?: string;
    githubUrl?: string;
    liveUrl?: string;
    isPrivate?: boolean;
    gallery?: string[];
}

export interface Experience {
    role: string;
    company: string;
    period: string;
    description: string | string[];
}

export interface Stat {
    label: string;
    value: string;
    trend: string;
}

export interface Settings {
    siteName: string;
    heroBadge: string;
    heroTitle1: string;
    heroTitle2: string;
    heroGithubUrl: string;
    heroGitlabUrl: string;
    aboutTitle: string;
    aboutDescription: string[];
    aboutImage: string;
    arsenalTitle: string;
    arsenalDescription: string;
    whatsappNumber: string;
    whatsappGreeting: string;
    whatsappMessage: string;
    footerText: string;
    copyright: string;
}

export interface PortfolioData {
    profile: Profile;
    skills: Skill[];
    projects: Project[];
    experience: Experience[];
    stats: Stat[];
    settings: Settings;
}
