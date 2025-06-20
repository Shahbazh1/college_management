import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';

const Attendance = () => {
  const [session, setSession] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceExists, setAttendanceExists] = useState(false);

  const [viewMode, setViewMode] = useState('class'); // 'class' or 'student'
  const [reportRollNo, setReportRollNo] = useState('');
  const [reportData, setReportData] = useState([]);

  // Load students
  useEffect(() => {
    const fetchStudents = async () => {
      if (!session || !studentClass) return;

      const q = query(
        collection(db, 'students'),
        where('session', '==', session),
        where('class', '==', studentClass)
      );

      const snapshot = await getDocs(q);
      const studentList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStudents(studentList);
    };

    fetchStudents();
  }, [session, studentClass]);

  // Check if attendance already exists
  useEffect(() => {
    const checkAttendance = async () => {
      if (!session || !studentClass || !date) return;

      const ref = collection(db, `attendance_daily/${session}_${studentClass}/${month}`);
      const snap = await getDocs(ref);
      const exists = snap.docs.some(doc => doc.id.endsWith(`_${date}`));
      setAttendanceExists(exists);

      if (exists) {
        const data = {};
        snap.docs.forEach(doc => {
          const [rollNo, docDate] = doc.id.split('_');
          if (docDate === date) {
            data[rollNo] = doc.data().status;
          }
        });
        setAttendanceData(data);
      } else {
        setAttendanceData({});
      }
    };

    checkAttendance();
  }, [session, studentClass, date]);

  // Handle date change
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    const dateObj = new Date(selectedDate);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    setMonth(monthNames[dateObj.getMonth()]);
    setYear(dateObj.getFullYear());
  };

  // Submit Attendance
  const handleSubmit = async () => {
  if (attendanceExists) {
    alert('⚠️ Attendance already submitted. You cannot edit it.');
    return;
  }

  if (!date || !session || !studentClass) {
    alert('Please select session, class and date');
    return;
  }

  try {
    await Promise.all(
      students.map(async (stu) => {
        const status = attendanceData[stu.id] || 'Absent';

        // ✅ Save or update monthly totals
        const monthlyRef = doc(db, `attendance/${session}-${month}/${studentClass}/${stu.rollNo}`);
        const monthlySnap = await getDoc(monthlyRef);

        const prev = monthlySnap.exists() ? monthlySnap.data() : {
          present: 0,
          absent: 0,
          leave: 0,
        };

        let updated = { ...prev };
        if (status === 'Present') updated.present += 1;
        else if (status === 'Leave') updated.leave += 1;
        else updated.absent += 1;

        await setDoc(monthlyRef, {
          name: stu.name,
          rollNo: stu.rollNo,
          session,
          class: studentClass,
          ...updated,
        });
      })
    );

    setAttendanceExists(true);
    alert('✅ Attendance submitted');
  } catch (error) {
    console.error('Error saving attendance:', error);
    alert('❌ Failed to submit attendance.');
  }
};


  // View Report
  const handleReportView = async () => {
    if (!session || !studentClass || !month) {
      alert('Please select session, class, and month');
      return;
    }

    const basePath = `attendance/${session}/${month}/${studentClass}`;

    try {
      if (viewMode === 'student') {
        if (!reportRollNo) {
          alert('Please enter roll number to view student report.');
          return;
        }

        const docRef = doc(db, basePath, reportRollNo);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setReportData([{ id: reportRollNo, ...docSnap.data() }]);
        } else {
          alert('No report found for this student.');
          setReportData([]);
        }
      } else {
        const classRef = collection(db, basePath);
        const classSnap = await getDocs(classRef);
        const fullReport = classSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setReportData(fullReport);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('❌ Failed to fetch report.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">📋 Take Attendance</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select onChange={e => setSession(e.target.value)} value={session} className="p-2 rounded border">
          <option value="">Select Session</option>
          <option>2022-2024</option>
          <option>2023-2025</option>
          <option>2024-2026</option>
        </select>

        <select onChange={e => setStudentClass(e.target.value)} value={studentClass} className="p-2 rounded border">
          <option value="">Select Class</option>
          <option>11</option>
          <option>12</option>
        </select>

        <input type="date" value={date} onChange={handleDateChange} className="p-2 rounded border" />
      </div>

      {/* Student Table */}
      {students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Roll No</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr key={stu.id}>
                  <td className="px-4 py-2 border">{stu.name}</td>
                  <td className="px-4 py-2 border">{stu.rollNo}</td>
                  <td className="px-4 py-2 border flex flex-wrap gap-1">
                    {['Present', 'Absent', 'Leave'].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          setAttendanceData((prev) => ({
                            ...prev,
                            [stu.id]: status,
                          }))
                        }
                        disabled={attendanceExists}
                        className={`px-2 py-1 rounded text-sm ${
                          attendanceData[stu.id] === status
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200'
                        } ${attendanceExists ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {status}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!attendanceExists ? (
            <div className="mt-4 text-right">
              <button
                onClick={handleSubmit}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded"
              >
                Submit Attendance
              </button>
            </div>
          ) : (
            <div className="mt-4 text-red-600 font-semibold text-center">
              Attendance already submitted. Editing is disabled.
            </div>
          )}
        </div>
      )}
      {reportData.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Roll No</th>
                <th className="px-4 py-2 border">Present</th>
                <th className="px-4 py-2 border">Absent</th>
                <th className="px-4 py-2 border">Leave</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(stu => (
                <tr key={stu.id}>
                  <td className="px-4 py-2 border">{stu.name}</td>
                  <td className="px-4 py-2 border">{stu.rollNo}</td>
                  <td className="px-4 py-2 border text-green-600 font-bold">{stu.present || 0}</td>
                  <td className="px-4 py-2 border text-red-600 font-bold">{stu.absent || 0}</td>
                  <td className="px-4 py-2 border text-yellow-600 font-bold">{stu.leave || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;
