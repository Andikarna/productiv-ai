import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Orbs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '25%',
        width: '300px',
        height: '300px',
        background: 'var(--color-primary)',
        filter: 'blur(100px)',
        opacity: 0.3,
        borderRadius: '50%',
        animation: 'float 10s infinite alternate'
      }}/>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '25%',
        width: '250px',
        height: '250px',
        background: 'var(--color-accent)',
        filter: 'blur(100px)',
        opacity: 0.2,
        borderRadius: '50%',
        animation: 'float 12s infinite alternate reverse'
      }}/>

      <div className="glass-panel animate-slide-up" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '48px',
        borderRadius: 'var(--radius-xl)',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden'
      }}>
        {/* Shine highlight */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
        }}/>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="animate-scale-in" style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 20px',
            boxShadow: 'var(--glow-primary)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            ⚡
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', lineHeight: '1.2' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            Sign in to <span className="text-gradient text-gradient-pulse" style={{ fontWeight: '700' }}>ProductiveAI</span>
          </p>
        </div>

        {error && (
          <div className="animate-scale-in" style={{
            background: 'rgba(255, 42, 85, 0.1)',
            border: '1px solid rgba(255, 42, 85, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '24px',
            color: 'var(--color-danger)',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-muted)' }}>
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text-muted)' }}>
              PASSWORD
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="btn-login"
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '12px' }}
          >
            {loading ? <><span className="spin">⟳</span> INITIATING...</> : 'ACCESS DASHBOARD'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          New to the ecosystem?{' '}
          <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: '600', letterSpacing: '0.02em' }}>
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}
