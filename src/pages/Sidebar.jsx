import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { RiMenuLine, RiCloseLine } from 'react-icons/ri';

function Sidebar() {
  const [role, setRole] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role);
          }
        } catch (error) {
          console.error('Error fetching user role from Firestore:', error);
        }
      }
    };

    fetchUserRole();
  }, []);

  return (
    <>
      {/* Toggle Button (Visible on small screens only) */}
      <div className="md:hidden bg-gray-100 p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">
          {role === 'admin' ? 'Admin Panel' : role === 'student' ? 'Student Panel' : 'Panel'}
        </h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          {isOpen ? <RiCloseLine /> : <RiMenuLine />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:block w-64 bg-gray-200 p-4 min-h-screen`}
      >
        <div className="flex flex-row items-center">
          <i className="ri-shield-user-line text-2xl"></i>
          <h2 className="text-lg font-bold mb-4 pt-4 pl-4">
            {role === 'admin' ? 'Admin Panel' : role === 'student' ? 'Student Panel' : 'Panel'}
          </h2>
        </div>

        <ul className="space-y-2">
          <li>
            <div className="flex flex-row">
              <i className="ri-dashboard-line text-2xl"></i>
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 w-full px-4 py-2 hover:bg-gray-300 rounded transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </li>

          {role === 'admin' && (
            <>
              <li>
                <div className="flex flex-row">
                  <i className="ri-user-add-line text-2xl"></i>
                  <Link
                    to="/add_students"
                    className="flex items-center space-x-3 w-full px-4 py-2 hover:bg-gray-300 rounded transition-colors"
                  >
                    Add Students
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex flex-row">
                  <i className="ri-clipboard-line text-2xl"></i>
                  <Link
                    to="/attendance"
                    className="flex items-center space-x-3 w-full px-4 py-2 hover:bg-gray-300 rounded transition-colors"
                  >
                    Attendance
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex flex-row">
                  <i className="ri-file-chart-line text-2xl"></i>
                  <Link
                    to="/report"
                    className="flex items-center space-x-3 w-full px-4 py-2 hover:bg-gray-300 rounded transition-colors"
                  >
                    Report
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex flex-row">
                  <i className="ri-file-list-3-line text-2xl"></i>
                  <Link
                    to="/test-results"
                    className="flex items-center space-x-3 w-full px-4 py-2 hover:bg-gray-300 rounded transition-colors"
                  >
                    Enter Test Results
                  </Link>
                </div>
              </li>
            </>
          )}

          {role === 'student' && (
            <li>
              <div className="flex flex-row">
                <i className="ri-file-chart-line text-2xl"></i>
                <Link
                  to="/report"
                  className="flex items-center space-x-3 w-full px-4 py-2 hover:bg-gray-300 rounded transition-colors"
                >
                  Report
                </Link>
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
