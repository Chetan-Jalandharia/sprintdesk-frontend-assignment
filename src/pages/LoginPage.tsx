import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try { await login(username, password); navigate('/dashboard', { replace: true }) } catch { /* error is rendered from the store */ }
  }

  return <main className="login-page"><section className="login-panel"><a className="brand login-brand" href="/login"><span className="brand-mark">S</span><span>SprintDesk</span></a><div className="login-copy"><p className="eyebrow">Your team workspace</p><h1>Make every sprint count.</h1><p>Bring tasks, momentum, and clarity into one focused workspace.</p></div><form className="login-form" onSubmit={handleSubmit}><label htmlFor="username">Username<input id="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required /></label><label htmlFor="password">Password<div className="password-field"><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? 'Hide' : 'Show'}</button></div></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign in'}</button><small className="login-hint">Demo account is prefilled for evaluation.</small></form></section><aside className="login-aside"><span className="aside-kicker">SPRINT 03 / 2026</span><blockquote>“The best teams do not move faster. They remove the things that slow them down.”</blockquote><div className="aside-stat"><strong>30</strong><span>tasks ready to move forward</span></div></aside></main>
}
