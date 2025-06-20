import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { sendEmailVerification } from "firebase/auth";

// After user signs up

const Sign_up = () => {
  const ADMIN_SECRET_PIN = "485748"; // 🔐 Replace with your secure PIN

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      alert("Please fill in all fields");
      return;
    }

    if (role === 'admin' && adminPin !== ADMIN_SECRET_PIN) {
      alert('❌ Invalid Admin PIN!');
      return;
    }

    setLoading(true);

    try {
     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const user = userCredential.user;
const uid = user.uid;

// ✅ Send email verification
await sendEmailVerification(user);
alert("📧 A verification email has been sent to your email address. Please verify before logging in.");


      await setDoc(doc(db, 'users', uid), {
        name,
        email,
        role
      });

      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify({ name, email, role }));

      if (role === 'admin') {
        navigate('/sign_in');
      } else if (role === 'student') {
        navigate('/sign_in');
      } else {
        navigate('/sign_in');
      }

    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-700">🚀 Sign Up</h2>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">-- Choose Role --</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* 🔐 Show PIN only if admin is selected */}
          {role === 'admin' && (
            <div>
              <label className="block text-gray-600 mb-1">Enter Admin PIN</label>
              <input
                type="password"
                placeholder="Enter secure admin PIN"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/sign_in" className="text-green-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Sign_up;
