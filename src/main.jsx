import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import TodoApp from './App.jsx'
import LoginPage from './login-page.jsx'
import './index.css'

function AppRoot() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  )

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true')
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
  }

  return isAuthenticated ? (
    <TodoApp onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>
)
