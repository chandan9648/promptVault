import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Input, Button } from '../components/ui';
import { toast } from 'react-toastify';



const Login = () => {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.ok) {
      nav('/prompts');
      toast.success('Logged in successfully!');
    } else {
      setError(res.message);
      toast.error(res.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-md p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</Button>
      </form>
      <p className="text-sm text-gray-600 mt-4">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
    
    </div>
  );
};

export default Login;
