import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { CgoLogo } from '../components/SidebarLayout';
import api from '../api';

/**
 * SignIn
 * ------
 * Full-screen authentication page for SecureTrack SL. Posts credentials to
 * the Spring Boot backend, stores the returned JWT, and routes officers
 * into the main application shell on success.
 */
function SignIn() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both your username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;

      if (!token) {
        throw new Error('No token returned by the server.');
      }

      localStorage.setItem('token', token);
      navigate('/app/dashboard');
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          setError('Invalid username or password. Please try again.');
        } else {
          setError('Unable to sign in. Please try again shortly.');
        }
      } else if (err.request) {
        setError('Cannot reach the SecureTrack SL server. Check your connection.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0B3A5A] via-[#123c5e] to-[#0a2c47] px-4 py-12">
      {/* Logo + titles */}
      <div className="mb-8 flex flex-col items-center text-center">
        <CgoLogo size={96} />
        <h1 className="mt-4 text-3xl font-bold text-white">SecureTrack SL</h1>
        <p className="mt-1 text-sm text-sky-200">Sri Lanka Customs Authority</p>
        <p className="mt-0.5 text-xs text-sky-300/70">Container Monitoring System</p>
      </div>

      {/* Sign-in card */}
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-xl font-bold text-slate-900">Sign In</h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">
              Username
            </label>
            <div className="relative">
              <User size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B3A5A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3A5A]/15"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B3A5A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3A5A]/15"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#0B3A5A] py-2.75 text-sm font-semibold text-white transition-colors hover:bg-[#0a2f4a] disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="text-center">
            <a href="#forgot-password" className="text-sm text-[#0B3A5A] hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
      </div>

      <p className="mt-8 text-xs text-sky-300/70">
        © 2026 Sri Lanka Customs Authority. All rights reserved.
      </p>
    </div>
  );
}

export default SignIn;
