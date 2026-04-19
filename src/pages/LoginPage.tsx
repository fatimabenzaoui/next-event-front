import React, { useState } from 'react';
import { login, googleAuth } from '../api';
import type { LoginPayload, UserProfile } from '../api';
import { useGoogleLogin } from '@react-oauth/google';
import TopNav from '../components/TopNav';

interface Props {
  onLogin: (user: UserProfile) => void;
  onSwitchToRegister: () => void;
}

export default function LoginPage({ onLogin, onSwitchToRegister }: Props) {
  const [form, setForm] = useState<LoginPayload>({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await login(form);
      onLogin(user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setLoading(true);
      try {
        const { user } = await googleAuth(tokenResponse.access_token, 'access_token');
        onLogin(user);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur Google');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Connexion Google échouée'),
  });

  return (
    <div>
      <TopNav />
      <div className="auth-page">
        <div className="auth-orb" />
        <div className="auth-card">
          <div className="auth-brand">
            <span className="auth-brand-next">NEXT</span>
            <span className="auth-brand-event">EVENT</span>
          </div>
          <h2>Connexion</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="username"
              placeholder="Nom d'utilisateur"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
            />
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              required
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <div className="auth-divider"><span>ou</span></div>
          <button
            type="button"
            className="auth-google-btn"
            onClick={() => loginWithGoogle()}
            disabled={loading || !GOOGLE_CLIENT_ID}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Se connecter avec Google
          </button>
          <p className="auth-switch">
            Pas encore de compte ?{' '}
            <button type="button" className="link-btn" onClick={onSwitchToRegister}>
              Créer un compte
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
