import React, { useState } from 'react';
import { Logo } from './Logo';
import { Lock, Mail, ArrowRight, AlertCircle, User, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      // Simple mock auth
      if (loginPassword === 'admin') {
        onLogin();
      } else {
        setError('Mot de passe incorrect. Essayez "admin".');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call for signup
    setTimeout(() => {
      setIsLoading(false);
      // Direct login after signup
      onLogin();
    }, 1000);
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <p className="text-zinc-500 mt-4 text-sm text-center">
            {mode === 'LOGIN' && 'Gestion événementielle professionnelle'}
            {mode === 'SIGNUP' && 'Créer votre compte administrateur'}
          </p>
        </div>

        {/* LOGIN FORM */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="email" 
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@beatek.com"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="password" 
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors placeholder:text-zinc-700"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-900/20 mt-6 group disabled:opacity-70"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Se connecter <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <div className="text-center mt-4">
              <p className="text-zinc-500 text-sm">
                Pas encore de compte ?{' '}
                <button type="button" onClick={() => { setError(''); setMode('SIGNUP'); }} className="text-fuchsia-500 hover:text-fuchsia-400 font-medium hover:underline">
                  S'inscrire
                </button>
              </p>
            </div>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'SIGNUP' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  name="name"
                  type="text" 
                  required
                  value={signupData.name}
                  onChange={handleSignupChange}
                  placeholder="Jean Dupont"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  name="email"
                  type="email" 
                  required
                  value={signupData.email}
                  onChange={handleSignupChange}
                  placeholder="jean@beatek.com"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  name="password"
                  type="password" 
                  required
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors placeholder:text-zinc-700"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-900/20 mt-6 group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                   <span>Création en cours...</span>
                </div>
              ) : (
                <>
                  Créer le compte <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

             <div className="text-center mt-4">
              <button type="button" onClick={() => { setError(''); setMode('LOGIN'); }} className="text-zinc-500 hover:text-white text-sm font-medium hover:underline flex items-center justify-center gap-1 mx-auto">
                <ArrowLeft size={14} /> Retour à la connexion
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} Beatek Events. Accès sécurisé.
          </p>
        </div>
      </div>
    </div>
  );
};