import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AgencyDashboard() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--c-sand)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--c-accent)', marginBottom: '0.5rem' }}>
          Witaj, {profile?.full_name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: '15px' }}>
          Dashboard biura podróży — wkrótce tutaj pojawi się więcej.
        </p>
      </div>
    </main>
  )
}
