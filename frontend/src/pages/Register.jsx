import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        bottom: '10%',
        left: '15%',
        width: '350px',
        height: '350px',
        background: 'var(--color-accent)',
        filter: 'blur(120px)',
        opacity: 0.25,
        borderRadius: '50%',
        animation: 'float 14s infinite alternate'
      }}/>
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: '300px',
        height: '300px',
        background: 'var(--color-primary)',
        filter: 'blur(120px)',
        opacity: 0.25,
        borderRadius: '50%',
        animation: 'float 10s infinite alternate reverse'
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', lineHeight: '1.2' }}>Initiate Account</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Sync with <span className="text-gradient text-gradient-pulse" style={{ fontWeight: '700' }}>ProductiveAI</span>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="reg-name" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
              IDENTITY NAME
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              className="input"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Alex Node"
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="reg-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
              EMAIL ADDRESS
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              placeholder="you@domain.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="reg-password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
              SECURITY KEY (PASSWORD)
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className="input"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="reg-confirm" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--color-text-muted)' }}>
              CONFIRM SECURITY KEY
            </label>
            <input
              id="reg-confirm"
              name="confirm"
              type="password"
              className="input"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat password"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            id="btn-register"
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '8px' }}
          >
            {loading ? <><span className="spin">⟳</span> ALLOCATING...</> : 'INITIALIZE'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Already integrated?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: '600', letterSpacing: '0.02em' }}>
            AUTHENTICATE
          </Link>
        </div>
      </div>
    </div>
  );
}
