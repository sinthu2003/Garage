import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Replace with your password
      localStorage.setItem('isAdminAuthenticated', 'true');
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center border-b border-gray-800">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Admin Access</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              className={`w-full px-4 py-3 rounded-xl bg-gray-800 border text-white ${
                error ? 'border-red-500' : 'border-gray-700'
              }`}
            />
            {error && <p className="text-red-400 text-sm">Incorrect password.</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};