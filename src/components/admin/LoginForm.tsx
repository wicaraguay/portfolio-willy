import React from 'react';
import { motion } from 'motion/react';

interface LoginFormProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleLogin: (e: React.FormEvent) => void;
    saving: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    saving
}) => {
    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-dark-800 border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-3 text-orange-500 mb-4">
                        <span className="font-orbitron font-bold text-2xl">{'<'}</span>
                        <span className="font-orbitron font-bold text-lg uppercase tracking-widest text-white">WILLY TECH</span>
                        <span className="font-orbitron font-bold text-2xl">{'>'}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">Panel de Administración</h2>
                    <p className="text-gray-400 text-sm mt-2">Inicia sesión para gestionar tu portafolio</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs text-orange-400 uppercase tracking-wider font-bold">Correo Electrónico</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 transition-all outline-none"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-orange-400 uppercase tracking-wider font-bold">Contraseña</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-dark-900 border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-900/40 disabled:opacity-50"
                    >
                        {saving ? 'Iniciando sesión...' : 'Entrar al Sistema'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginForm;
