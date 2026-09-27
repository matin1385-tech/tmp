import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Fetch credentials from backend API
      const res = await fetch('http://localhost:5000/api/credentials', {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch credentials');
      }

      const credentials = await res.json();

      if (
        username === credentials.username &&
        password === credentials.password
      ) {
        // Store auth status in localStorage
        localStorage.setItem('eea_auth', JSON.stringify({ 
          authenticated: true,
          username: username,
          timestamp: new Date().toISOString()
        }));
        
        // Redirect to home page
        await router.push('/');
      } else {
        setError('Invalid username or password');
        setPassword('');
      }
    } catch (err) {
      setError('Error loading authentication data. Make sure backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f1f3f9] to-indigo-50 text-gray-800 flex flex-col font-sans">
      <Head>
        <title>EEA - Login</title>
      </Head>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl -z-10" />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl shadow-lg mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1e1b4b] tracking-tight">
              EEA Optimizer
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Energy Efficiency Analyzer
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 transition-all">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
              Login to System
            </h2>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full bg-[#1e1b4b] hover:bg-indigo-950 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Test Info */}
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-700">
              <p className="font-semibold mb-2">Test Credentials:</p>
              <p>👤 Username: <span className="font-mono bg-white px-2 py-1 rounded ml-1">admin</span></p>
              <p>🔐 Password: <span className="font-mono bg-white px-2 py-1 rounded ml-1">EEA@2024</span></p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>EEA Process Optimization System © 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
