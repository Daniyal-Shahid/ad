import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { DesignerProvider } from './context/DesignerContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Memories from './pages/Memories';
import Dates from './pages/Dates';
import CreateDate from './pages/CreateDate';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';

// Layout Wrapper
const AppLayout = ({ children }) => <Layout>{children}</Layout>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <DesignerProvider>
          <ModalProvider>
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Placeholder Routes for now */}
            <Route
              path="/memories"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Memories />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dates"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dates />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dates/create"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CreateDate />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ModalProvider>
        </DesignerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
