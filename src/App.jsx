import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Forget_password from './components/Forget_password';
import Header from './components/Header';
import Sidebar from './pages/Sidebar';
import Add_students from './pages/admin/Admin_add_students';
import Report from './pages/Report';
import Attendence from './pages/admin/Admin_attendence';
import Test_results_report from './pages/admin/Admin_test_results_report';
import Dashboard from './pages/Dashboard';
import Welcome from './components/Welcome_page';
import Sign_in from './components/Sign_in';
import Sign_up from './components/Sign_up';

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/sign_in" element={<Sign_in />} />
        <Route path="/sign_up" element={<Sign_up />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<Forget_password />} />

      </Routes>
    );
  }

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<Report />} />

            {role === 'admin' && (
              <>
                <Route path="/add_students" element={<Add_students />} />
                <Route path="/attendance" element={<Attendence />} />
                <Route path="/test-results" element={<Test_results_report />} />

              </>
            )}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
