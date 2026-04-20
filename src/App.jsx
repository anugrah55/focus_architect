import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Missions } from './pages/Missions';
import { Sessions } from './pages/Sessions';

// Protected Route Wrapper
function RequireAuth({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

// Public Route Wrapper (redirects if already logged in)
function PublicOnly({ children }) {
  const { currentUser } = useAuth();
  if (currentUser) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
          
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/missions" element={<RequireAuth><Missions /></RequireAuth>} />
          <Route path="/sessions" element={<RequireAuth><Sessions /></RequireAuth>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
