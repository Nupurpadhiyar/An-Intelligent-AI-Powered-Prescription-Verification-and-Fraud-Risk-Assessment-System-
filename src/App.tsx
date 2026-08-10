import { useState } from 'react'
import Landing from './pages/Landing'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import MedicineDB from './pages/MedicineDB'
import Settings from './pages/Settings'
import About from './pages/About'
import Help from './pages/Help'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Auth from './pages/Auth'

export type Page =
  | 'landing'
  | 'upload'
  | 'dashboard'
  | 'reports'
  | 'medicine'
  | 'settings'
  | 'about'
  | 'help'
  | 'contact'
  | 'admin'
  | 'login'
  | 'register'

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [darkMode, setDarkMode] = useState(true)

  const navigate = (p: Page) => {
    setPage(p)
    window.scrollTo(0, 0)
  }

  const props = { navigate, darkMode, setDarkMode }

  return (
    <div style={{ minHeight: '100vh', background: '#040d1a' }}>
      {page === 'landing' && <Landing {...props} />}
      {page === 'upload' && <Upload {...props} />}
      {page === 'dashboard' && <Dashboard {...props} />}
      {page === 'reports' && <Reports {...props} />}
      {page === 'medicine' && <MedicineDB {...props} />}
      {page === 'settings' && <Settings {...props} />}
      {page === 'about' && <About {...props} />}
      {page === 'help' && <Help {...props} />}
      {page === 'contact' && <Contact {...props} />}
      {page === 'admin' && <Admin {...props} />}
      {page === 'login' && <Auth navigate={navigate} mode="login" />}
      {page === 'register' && <Auth navigate={navigate} mode="register" />}
    </div>
  )
}
