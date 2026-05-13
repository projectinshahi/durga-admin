"use client";
import { useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      toast.success('Access granted');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 w-full">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#b8860b]">Dinorah Admin</h1>
          <p className="text-gray-500 mt-2 text-sm">Secure infrastructure access point.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Administrator Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#c99f2b] text-black" placeholder="admin@dinorah.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Secure Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#c99f2b] text-black" placeholder="••••••••" />
          </div>
          <button disabled={isSubmitting} type="submit" className="w-full bg-[#1a1110] text-[#c99f2b] font-bold tracking-widest uppercase text-sm py-4 rounded-lg shadow-md hover:bg-black transition-colors disabled:opacity-50 mt-4">
            {isSubmitting ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
