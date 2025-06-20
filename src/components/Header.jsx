import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');

    if (confirmLogout) {
      try {
        await auth.signOut(); // Sign out from Firebase
        localStorage.clear(); // Clear localStorage (optional if you're storing roles or tokens)
        navigate('/sign_in'); // Redirect to Sign In page
      } catch (error) {
        console.error('Logout Error:', error);
      }
    }
  };

  return (
    <header className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">EduTrack-College Management System</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
