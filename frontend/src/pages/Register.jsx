import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Input, Button } from '../components/ui';
import { toast } from 'react-toastify';


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
      nav('/prompts');
      toast.success('Registered successfully!');
    } else {
      setError(res.message);
      toast.error(res.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto max-w-md p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit" className='cursor-pointer' disabled={loading}>{loading ? 'Creating…' : 'Register'}</Button>
      </form>
      <p className="text-sm text-gray-600 mt-4">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
    </div>
  );
};

export default Register;
