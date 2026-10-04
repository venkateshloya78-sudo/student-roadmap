import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { setToken } from '../lib/auth'
import Logo from '../components/Common/Logo'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      await api.post('/auth/register', { email, password })
      const form = new URLSearchParams()
      form.append('username', email)
      form.append('password', password)
      const res = await api.post('/auth/login', form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      setToken(res.data.access_token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-white">
        <Logo href="/" size="lg" variant="dark" showTagline={true} />
        <div className="space-y-8">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-2">How it works</p>
            <div className="space-y-5">
              {[
                { n: '1', t: 'Create your profile', d: 'Tell us your degree, year, and skills.' },
                { n: '2', t: 'Choose a career path', d: 'Pick from 12 evidence-grounded career roles.' },
                { n: '3', t: 'Get your roadmap', d: 'Receive a personalised, ordered learning plan.' },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-sm font-bold">{s.n}</div>
                  <div>
                    <p className="font-semibold">{s.t}</p>
                    <p className="text-indigo-200 text-sm">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-indigo-200 text-sm">Free forever. No credit card required.</p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Logo href="/" size="md" showTagline={false} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-8">Start building your career roadmap in 2 minutes</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input" placeholder="you@example.com" required autoFocus />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input" placeholder="Min 8 characters" required />
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                className="input" placeholder="Repeat password" required />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>Creating account...</>
              ) : 'Create account →'}
            </button>

            <p className="text-center text-xs text-slate-400">
              By signing up, you agree to our terms of service.
            </p>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
