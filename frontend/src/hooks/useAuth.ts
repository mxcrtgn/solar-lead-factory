import { useState, useEffect } from 'react';
import { apiMethods, isDemoMode } from '../lib/api';

const { auth } = apiMethods;

// Demo user data
const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@lfs.fr',
  firstName: 'Demo',
  lastName: 'User',
  role: 'ADMIN',
};

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // In demo mode, check if user is logged in locally
    if (isDemoMode && token === 'demo-token') {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    if (token && !isDemoMode) {
      auth.me()
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Demo mode: accept any login
    if (isDemoMode) {
      localStorage.setItem('token', 'demo-token');
      setUser(DEMO_USER);
      return { user: DEMO_USER, token: 'demo-token' };
    }

    // Real mode: call API
    const res = await auth.login(email, password);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return { user, loading, login, logout };
}
