import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const Forget_password = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ Password reset email sent. Please check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-700">🔐 Forgot Password</h2>

        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Registered Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Go back to{' '}
          <Link to="/sign_in" className="text-green-600 font-semibold underline hover:text-green-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Forget_password;
