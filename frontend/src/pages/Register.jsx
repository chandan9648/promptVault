import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Input, Button } from '../components/ui';
import { toast } from 'react-toastify';
import { Shield, UserPlus } from 'lucide-react';



const Register = () => {
  const { register, loading } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password);
    if (res.ok) {
      nav('/');
      toast.success('Registered successfully!');
    } else {
      setError(res.message);
      toast.error(res.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4">
      <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 border">
            <Shield size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <p className="text-sm text-gray-600 mt-0.5">Start saving and sharing prompts.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 mt-6">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            placeholder="Your name"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
          />
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <UserPlus size={16} />
            {loading ? 'Creating…' : 'Register'}
          </Button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
