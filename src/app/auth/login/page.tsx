'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Nieprawidłowy email lub hasło')
      setLoading(false)
      return
    }

    // Middleware przekieruje na właściwy dashboard wg roli
    router.push('/')
    router.refresh()
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--c-sand)',
    }}>
      {/* Lewa strona — branding */}
      <div style={{
        background: 'var(--c-accent)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="animate-fade-in"
      >
        {/* Dekoracja tła */}
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          right: '-40px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
        }} />

        <Link href="/" style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.8rem',
          color: '#fff',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}>
          Grupeo
        </Link>

        <div>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            color: '#fff',
            lineHeight: 1.25,
            marginBottom: '1.5rem',
            opacity: 0.95,
          }}>
            Profesjonalna platforma<br />dla grup leisure<br />w Polsce
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
            Biura podróży i hotele — wszystko w jednym miejscu.
          </p>
        </div>
      </div>

      {/* Prawa strona — formularz */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }} className="animate-fade-up">

          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--c-ink)',
            marginBottom: '0.4rem',
            letterSpacing: '-0.02em',
          }}>
            Zaloguj się
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--c-muted)', marginBottom: '2rem' }}>
            Nie masz konta?{' '}
            <Link href="/auth/register" style={{ color: 'var(--c-accent)', textDecoration: 'none', fontWeight: 500 }}>
              Zarejestruj się
            </Link>
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--c-ink)' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="twoj@email.pl"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--c-ink)' }}>
                Hasło
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p style={{
                fontSize: '13px',
                color: 'var(--c-danger)',
                background: '#fdf2f2',
                border: '1px solid #f5c6c6',
                borderRadius: '8px',
                padding: '10px 14px',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '4px',
                padding: '12px',
                background: loading ? 'var(--c-muted)' : 'var(--c-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s',
                letterSpacing: '0.01em',
              }}
            >
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>

          </form>
        </div>
      </div>

      {/* Responsive — ukryj lewą stronę na mobile */}
      <style>{`
        @media (max-width: 640px) {
          main { grid-template-columns: 1fr !important; }
          main > div:first-child { display: none !important; }
        }
      `}</style>
    </main>
  )
}
