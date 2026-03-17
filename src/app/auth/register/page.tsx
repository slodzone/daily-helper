'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Role = 'agency' | 'hotel'
type Step = 'role' | 'details'

export default function RegisterPage() {
  const supabase = createClient()
  const router = useRouter()

  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Wspólne pola
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

  // Pola agencji
  const [agencyName, setAgencyName] = useState('')
  const [nip, setNip] = useState('')
  const [agencyCity, setAgencyCity] = useState('')

  // Pola hotelu
  const [hotelName, setHotelName] = useState('')
  const [hotelCity, setHotelCity] = useState('')

  function selectRole(r: Role) {
    setRole(r)
    setStep('details')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!role) return
    setError('')
    setLoading(true)

    // 1. Utwórz konto w Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    })

    if (signUpError || !data.user) {
      setError(signUpError?.message || 'Błąd rejestracji')
      setLoading(false)
      return
    }

    // 2. Utwórz profil agencji lub hotelu
    if (role === 'agency') {
      const { error: agencyError } = await supabase.from('agencies').insert({
        user_id: data.user.id,
        name: agencyName,
        nip,
        city: agencyCity,
        contact_person: fullName,
        status: 'pending',
      })
      if (agencyError) {
        setError('Błąd tworzenia profilu agencji')
        setLoading(false)
        return
      }
    }

    if (role === 'hotel') {
      const slug = hotelName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        + '-' + Math.random().toString(36).slice(2, 6)

      const { error: hotelError } = await supabase.from('hotels').insert({
        user_id: data.user.id,
        name: hotelName,
        slug,
        city: hotelCity,
        address: '',
        status: 'pending',
      })
      if (hotelError) {
        setError('Błąd tworzenia profilu hotelu')
        setLoading(false)
        return
      }
    }

    // 3. Przekieruj na odpowiedni dashboard
    router.push(role === 'agency' ? '/dashboard/agency' : '/dashboard/hotel')
    router.refresh()
  }

  // ─── KROK 1: Wybór roli ───────────────────────────────────
  if (step === 'role') {
    return (
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--c-sand)',
        padding: '2rem',
      }}>
        <div style={{ width: '100%', maxWidth: '480px' }} className="animate-fade-up">

          <Link href="/" style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.6rem',
            color: 'var(--c-accent)',
            textDecoration: 'none',
            display: 'block',
            marginBottom: '2.5rem',
            letterSpacing: '-0.02em',
          }}>
            Grupeo
          </Link>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            Dołącz do Grupeo
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--c-muted)', marginBottom: '2rem' }}>
            Kim jesteś?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Biuro podróży */}
            <button onClick={() => selectRole('agency')} style={{
              padding: '20px 24px',
              background: '#fff',
              border: '1px solid var(--c-border)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--c-accent)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26,58,42,0.06)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--c-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                background: 'var(--c-stone)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
              }}>
                ✈️
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '3px' }}>Biuro podróży</p>
                <p style={{ fontSize: '13px', color: 'var(--c-muted)', lineHeight: 1.5 }}>
                  Szukam hoteli na grupy, wysyłam zapytania i porównuję oferty
                </p>
              </div>
            </button>

            {/* Hotel */}
            <button onClick={() => selectRole('hotel')} style={{
              padding: '20px 24px',
              background: '#fff',
              border: '1px solid var(--c-border)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--c-accent)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26,58,42,0.06)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--c-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                background: 'var(--c-stone)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
              }}>
                🏨
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '3px' }}>Hotel</p>
                <p style={{ fontSize: '13px', color: 'var(--c-muted)', lineHeight: 1.5 }}>
                  Przyjmuję zapytania od biur podróży i wysyłam oferty dla grup
                </p>
              </div>
            </button>

          </div>

          <p style={{ marginTop: '1.5rem', fontSize: '13px', color: 'var(--c-muted)', textAlign: 'center' }}>
            Masz już konto?{' '}
            <Link href="/auth/login" style={{ color: 'var(--c-accent)', textDecoration: 'none', fontWeight: 500 }}>
              Zaloguj się
            </Link>
          </p>
        </div>
      </main>
    )
  }

  // ─── KROK 2: Dane rejestracyjne ───────────────────────────
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--c-sand)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fade-up">

        {/* Nagłówek */}
        <button onClick={() => setStep('role')} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '13px',
          color: 'var(--c-muted)',
          marginBottom: '1.5rem',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          ← Wróć
        </button>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--c-stone)',
          borderRadius: '8px',
          padding: '6px 12px',
          marginBottom: '1.5rem',
        }}>
          <span style={{ fontSize: '16px' }}>{role === 'agency' ? '✈️' : '🏨'}</span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--c-accent)' }}>
            {role === 'agency' ? 'Biuro podróży' : 'Hotel'}
          </span>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          Utwórz konto
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--c-muted)', marginBottom: '2rem' }}>
          Wypełnij dane aby dołączyć do platformy
        </p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Dane osobowe */}
          <div style={{
            background: '#fff',
            border: '1px solid var(--c-border)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Dane kontaktowe
            </p>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>Imię i nazwisko</label>
              <input placeholder="Jan Kowalski" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>Email</label>
              <input type="email" placeholder="jan@firma.pl" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>Hasło</label>
              <input type="password" placeholder="min. 8 znaków" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
            </div>
          </div>

          {/* Dane firmy */}
          <div style={{
            background: '#fff',
            border: '1px solid var(--c-border)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {role === 'agency' ? 'Dane biura podróży' : 'Dane hotelu'}
            </p>

            {role === 'agency' && <>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>Nazwa biura podróży</label>
                <input placeholder="np. Słoneczne Wakacje sp. z o.o." value={agencyName} onChange={e => setAgencyName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>NIP</label>
                <input placeholder="1234567890" value={nip} onChange={e => setNip(e.target.value)} required pattern="\d{10}" maxLength={10} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>Miasto</label>
                <input placeholder="Warszawa" value={agencyCity} onChange={e => setAgencyCity(e.target.value)} required />
              </div>
            </>}

            {role === 'hotel' && <>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>Nazwa hotelu</label>
                <input placeholder="np. Hotel Wiśniowy Sad" value={hotelName} onChange={e => setHotelName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>Miasto</label>
                <input placeholder="Kraków" value={hotelCity} onChange={e => setHotelCity(e.target.value)} required />
              </div>
            </>}
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

          <button type="submit" disabled={loading} style={{
            padding: '13px',
            background: loading ? 'var(--c-muted)' : 'var(--c-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.01em',
            transition: 'opacity 0.15s',
          }}>
            {loading ? 'Tworzenie konta...' : 'Utwórz konto'}
          </button>

          <p style={{ fontSize: '12px', color: 'var(--c-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            Rejestrując się, akceptujesz regulamin platformy.<br />
            Konto zostanie aktywowane po weryfikacji.
          </p>
        </form>
      </div>
    </main>
  )
}
