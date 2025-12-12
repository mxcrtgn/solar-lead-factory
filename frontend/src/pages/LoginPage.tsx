import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      // Force reload to update auth state
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Erreur de connexion');
      setLoading(false);
    }
  };

  const fillDemo = (type: 'admin' | 'ops') => {
    if (type === 'admin') {
      setEmail('hortense@lfs.fr');
      setPassword('admin123');
    } else {
      setEmail('guillaume@lfs.fr');
      setPassword('ops123');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="/ferme-solaire-logo.svg"
              alt="La Ferme Solaire"
              className="h-16 w-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-[#211F1B]">
              Solar Lead Factory
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#211F1B] mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#594FF4] focus:border-[#594FF4] transition-all outline-none font-medium"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#211F1B] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#594FF4] focus:border-[#594FF4] transition-all outline-none font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-[#594FF4] hover:bg-[#4840C9] text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-[#FFDE00]/10 rounded-xl border-2 border-[#FFDE00]/20">
            <p className="text-xs font-bold text-[#211F1B] mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FFDE00] rounded-full"></div>
              Comptes de démo
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="w-full text-left p-3 rounded-lg hover:bg-white transition-colors text-sm border border-gray-200"
              >
                <span className="font-bold text-[#594FF4]">Admin:</span>{' '}
                <span className="text-gray-700">Hortense Foillard</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('ops')}
                className="w-full text-left p-3 rounded-lg hover:bg-white transition-colors text-sm border border-gray-200"
              >
                <span className="font-bold text-[#594FF4]">Ops:</span>{' '}
                <span className="text-gray-700">Guillaume Bougeard</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6 font-medium">
          © 2025 La Ferme Solaire. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
