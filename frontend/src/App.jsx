import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import PromptsList from './pages/PromptsList';
import PromptEditor from './pages/PromptEditor';
import PromptDetail from './pages/PromptDetail';
import Community from './pages/Community';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <main className="py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/community" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/community" element={<Community />} />
              <Route path="/prompts" element={<ProtectedRoute><PromptsList /></ProtectedRoute>} />
              <Route path="/prompts/new" element={<ProtectedRoute><PromptEditor /></ProtectedRoute>} />
              <Route path="/prompts/:id" element={<ProtectedRoute><PromptDetail /></ProtectedRoute>} />
              <Route path="/prompts/:id/edit" element={<ProtectedRoute><PromptEditor /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
