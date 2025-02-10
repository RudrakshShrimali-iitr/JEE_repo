import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Shield, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'signup';
type UserRole = 'user' | 'admin';

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:4000/auth${mode === 'signup' ? '/signup' : '/loginup'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            ...(mode === 'signup' && { firstName, lastName, role }),
            ...(mode === 'login' && { role }),
          }),
        }
      );

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response');
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      alert(mode === 'signup' ? 'Account created successfully! Please login.' : 'Logged in successfully!');

      // Redirect based on user role (force redirect for Admin)
      if (mode === 'signup') {
        setMode('login');
      } else {
        if (role === 'admin') {
          navigate('/admin'); // **Force redirect to admin**
        } else {
          navigate('/exam'); // Redirect to user exam page
        }
      }

      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-400 to-white-600 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>

          {mode === 'login' && (
            <div className="mb-6">
              <div className="flex rounded-lg overflow-hidden">
                <button
                  onClick={() => setRole('user')}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all ${
                    role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <User size={20} />
                  <span className="font-medium">User Account</span>
                </button>
                <button
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all ${
                    role === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Shield size={20} />
                  <span className="font-medium">Admin Account</span>
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {role === 'admin'
                  ? 'Admin accounts have full access to manage the system'
                  : 'User accounts have standard access to the platform'}
              </p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Surname"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-purple-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Processing...'
              ) : mode === 'login' ? (
                <>
                  <LogIn size={20} />
                  Login
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Sign Up
                </>
              )}
            </button>
          </form>
        </div>

        <div className="hidden md:block bg-purple-50 p-8">
          <img
            src="https://static.vecteezy.com/system/resources/previews/004/490/867/non_2x/woman-sitting-at-the-table-with-laptop-working-on-a-computer-freelance-online-education-or-social-media-concept-working-from-home-remote-job-flat-style-illustration-vector.jpg"
            alt="Working desk"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}