import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'agency') redirect('/dashboard/agency')
    if (profile?.role === 'hotel')  redirect('/dashboard/hotel')
    if (profile?.role === 'admin')  redirect('/admin')
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--c-sand)',
      padding: '2rem',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }} className="animate-fade-up">
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          color: 'var(--c-accent)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>
          Grupeo
        </h1>
        <p style={{
          marginTop: '0.75rem',
          fontSize: '1.05rem',
          color: 'var(--c-muted)',
          letterSpacing: '0.01em',
        }}>
          B2B portal dla grup leisure w Polsce
        </p>
      </div>

      {/* CTA */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        animation: 'fadeUp 0.5s 0.15s ease both',
      }}>
        <Link href="/auth/login" style={{
          padding: '12px 32px',
          background: 'var(--c-accent)',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: 500,
          letterSpacing: '0.01em',
          transition: 'opacity 0.15s',
        }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          Zaloguj się
        </Link>
        <Link href="/auth/register" style={{
          padding: '12px 32px',
          background: 'transparent',
          color: 'var(--c-accent)',
          border: '1px solid var(--c-accent)',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: 500,
          letterSpacing: '0.01em',
        }}>
          Zarejestruj się
        </Link>
      </div>

      {/* Tagline */}
      <p style={{
        marginTop: '4rem',
        fontSize: '13px',
        color: 'var(--c-muted)',
        textAlign: 'center',
        maxWidth: '380px',
        lineHeight: 1.6,
        animation: 'fadeUp 0.5s 0.3s ease both',
      }}>
        Łączymy biura podróży z hotelami.<br />
        Bez maili, bez Exceli — wszystko w jednym miejscu.
      </p>
    </main>
  )
}
