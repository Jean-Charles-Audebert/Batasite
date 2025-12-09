import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastNotification } from './components/ToastNotification';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SetPasswordPage } from './pages/SetPasswordPage';
import './App.css';

/**
 * Composant racine de l'application
 * Configure les routes et les providers
 */
function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/set-password" element={<SetPasswordPage />} />

            {/* Routes protégées - tout dans le dashboard */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <ToastNotification />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
