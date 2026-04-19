import React, { useState } from 'react';
import { register, googleAuth } from '../api';
import type { RegisterPayload, UserProfile } from '../api';
import { useGoogleLogin } from '@react-oauth/google';
import TopNav from '../components/TopNav';

interface Props {
  onRegister: (user: UserProfile) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ onRegister, onSwitchToLogin }: Props) {
  const [form, setForm] = useState<RegisterPayload>({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    role: 'student',
    first_name: '',
    last_name: '',
    association_name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await register(form);
      onRegister(user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setLoading(true);
      try {
        const { user } = await googleAuth(tokenResponse.access_token, 'access_token');
        onRegister(user);
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
          <h2>Créer un compte</h2>
          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div className="role-selector">
              <label className={`role-option ${form.role === 'student' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={form.role === 'student'}
                  onChange={handleChange}
                />
                🎓 Étudiant
              </label>
              <label className={`role-option ${form.role === 'association' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="association"
                  checked={form.role === 'association'}
                  onChange={handleChange}
                />
                🏛️ Association
              </label>
            </div>

            <input
              name="username"
              placeholder="Nom d'utilisateur"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="form-row">
              <input
                name="first_name"
                placeholder="Prénom"
                value={form.first_name}
                onChange={handleChange}
              />
              <input
                name="last_name"
                placeholder="Nom"
                value={form.last_name}
                onChange={handleChange}
              />
            </div>

            {form.role === 'association' && (
              <>
                <input
                  name="association_name"
                  placeholder="Nom de l'association"
                  value={form.association_name}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description de l'association"
                  value={form.description}
                  onChange={handleChange}
                />
              </>
            )}

            <input
              name="password"
              type="password"
              placeholder="Mot de passe (min. 8 caractères)"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            <input
              name="password_confirm"
              type="password"
              placeholder="Confirmer le mot de passe"
              value={form.password_confirm}
              onChange={handleChange}
              required
              minLength={8}
            />

            {error && <p className="auth-error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>
          <div className="auth-divider"><span>ou</span></div>
          <button
            type="button"
            className="auth-google-btn"
            onClick={() => registerWithGoogle()}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            S'inscrire avec Google
          </button>
          <p className="auth-switch">
            Déjà un compte ?{' '}
            <button type="button" className="link-btn" onClick={onSwitchToLogin}>
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
