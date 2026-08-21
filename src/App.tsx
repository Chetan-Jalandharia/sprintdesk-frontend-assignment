import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { SessionGate } from './components/SessionGate'
import { ProtectedRoute, PublicOnlyRoute } from './routes/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { BoardPage } from './pages/BoardPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { NotificationSync } from './components/NotificationSync'
import { NotificationPanel } from './components/NotificationPanel'
import { ToastViewport } from './components/ToastViewport'
import { useAuthStore } from './stores/useAuthStore'
import { useThemeStore } from './stores/useThemeStore'
import './App.css'

const DashboardPage = lazy(async () => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))

function AppShell() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  return <div className="app-shell"><NotificationSync /><ToastViewport /><aside className="sidebar"><a className="brand" href="/dashboard" aria-label="SprintDesk home"><span className="brand-mark">S</span><span>SprintDesk</span></a><nav aria-label="Primary navigation"><NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/dashboard"><span aria-hidden="true">▦</span> Overview</NavLink><NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/board"><span aria-hidden="true">□</span> Board</NavLink><NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/analytics"><span aria-hidden="true">◌</span> Analytics</NavLink></nav><div className="sidebar-footer"><button className="nav-item" type="button" onClick={toggleTheme} aria-pressed={theme === 'dark'}><span aria-hidden="true">◐</span> {theme === 'dark' ? 'Light mode' : 'Dark mode'}</button><button className="profile" type="button" onClick={logout} title="Sign out"><img src={user?.image} alt={user ? `${user.firstName} ${user.lastName}` : ''} /><span><strong>{user?.firstName} {user?.lastName}</strong><small>Sign out</small></span></button></div></aside><div className="main-area"><header className="topbar"><div className="breadcrumb">Workspace <span>/</span> SprintDesk</div><div className="topbar-actions"><button className="icon-button" type="button" aria-label="Search">⌕</button><NotificationPanel /></div></header><Suspense fallback={<div className="route-loading" role="status">Loading workspace...</div>}><Routes><Route path="dashboard" element={<DashboardPage />} /><Route path="board" element={<BoardPage />} /><Route path="analytics" element={<AnalyticsPage />} /><Route path="*" element={<Navigate to="dashboard" replace />} /></Routes></Suspense></div></div>
}

function App() {
  return <BrowserRouter><SessionGate><Routes><Route element={<PublicOnlyRoute />}><Route path="/login" element={<LoginPage />} /></Route><Route element={<ProtectedRoute />}><Route path="/*" element={<AppShell />} /></Route><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></SessionGate></BrowserRouter>
}

export default App
