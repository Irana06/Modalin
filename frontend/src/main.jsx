import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
// Latin subset only, three weights: light for headlines, regular for text, medium for labels.
import '@fontsource/geist-sans/latin-300.css'
import '@fontsource/geist-sans/latin-400.css'
import '@fontsource/geist-sans/latin-500.css'
import '@fontsource/geist-mono/latin-400.css'
import './index.css'
import { AuthProvider, RequireRole } from './lib/auth'
import { ToastHost } from './components/ui'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ApplyLoan from './pages/ApplyLoan'
import Applications from './pages/Applications'
import ApplicationDetail from './pages/ApplicationDetail'
import Products from './pages/admin/Products'
import Users from './pages/admin/Users'
import AuditLogs from './pages/admin/AuditLogs'
import NotFound from './pages/NotFound'

// Scroll reveals hide content only from here on, so the page still reads fine if JS fails to load.
document.documentElement.classList.add('motion-ready')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/masuk" element={<Login />} />
          <Route path="/daftar" element={<Register />} />
          <Route element={<RequireRole />}>
            <Route element={<AppLayout />}>
              <Route element={<RequireRole roles={['umkm']} />}>
                <Route path="/app" element={<Dashboard />} />
                <Route path="/app/ajukan" element={<ApplyLoan />} />
              </Route>
              <Route element={<RequireRole roles={['verifikator', 'manajer', 'admin']} />}>
                <Route path="/app/pengajuan" element={<Applications />} />
              </Route>
              <Route path="/app/pengajuan/:id" element={<ApplicationDetail />} />
              <Route element={<RequireRole roles={['admin']} />}>
                <Route path="/app/produk" element={<Products />} />
                <Route path="/app/pengguna" element={<Users />} />
                <Route path="/app/audit" element={<AuditLogs />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastHost />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
