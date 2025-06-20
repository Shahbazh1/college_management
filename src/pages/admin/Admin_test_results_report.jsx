import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from 'firebase/firestore';

function TestResultsReport() {
  const [testType, setTestType] = useState('');
  const [month, setMonth] = useState('');
  const [week, setWeek] = useState('');
  const [session, setSession] = useState('');
  const [className, setClassName] = useState('');
  const [stream, setStream] = useState('');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [isLocked, setIsLocked] = useState(false);

  const sessionOptions = ['2022-2024', '2023-2025', '2024-2026'];

  const compulsorySubjects = ['English', 'Urdu', 'TarjamatulQuran', 'Islamiat'];
  const artsSubjects = ['Health', 'Sociology', 'History of Pakistan'];
  const scienceSubjects = ['Physics', 'Chemistry', 'Math', 'Computer', 'Biology'];

  const getSubjects = () => {
    if (stream === 'arts') return [...compulsorySubjects, ...artsSubjects];
    if (stream === 'science') return [...compulsorySubjects, ...scienceSubjects];
    return [];
  };

  // Fetch students
  useEffect(() => {
    async function fetchStudents() {
      if (!className) return;
      const q = query(collection(db, 'students'), where('class', '==', className));
      const snap = await getDocs(q);
      setStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchStudents();
  }, [className]);

  // Check lock status
  useEffect(() => {
    async function checkExisting() {
      if (!isFormComplete()) return;
      const folder = getTestFolder();
      const path = `test_results/${session}_${className}/${folder}`;
      const checkSnap = await getDocs(collection(db, path));

      setIsLocked(!checkSnap.empty);
    }
    checkExisting();
  }, [testType, month, week, session, className, stream]);

  // Helpers
  const getTestFolder = () => {
    return testType === 'weekly' ? `${month}_${week}` :
           testType === 'monthly' ? month : testType;
  };

  const isFormComplete = () => {
    return testType && session && className && stream &&
      ((testType === 'weekly' && week && month) ||
       (testType === 'monthly' && month) ||
       ['1st term', '2nd term', 'final'].includes(testType));
  };

  const handleMarksChange = (studentId, subject, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subject]: value
      }
    }));
  };

  const handleSubmit = async () => {
    const folder = getTestFolder();

    try {
      await Promise.all(students.map(async (student) => {
        const path = `test_results/${session}_${className}/${folder}`;
        const ref = doc(db, path, student.id);

        await setDoc(ref, {
          studentId: student.id,
          name: student.name,
          rollNo: student.rollNo,
          marks: marks[student.id] || {}
        });
      }));
      setIsLocked(true);
      alert('✅ Test results saved and locked!');
    } catch (e) {
      console.error('Error:', e);
      alert('❌ Failed to save results.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">📚 Enter Test Results</h2>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <select className="border px-3 py-2 rounded" value={testType} onChange={e => {
          setTestType(e.target.value);
          setMonth('');
          setWeek('');
        }}>
          <option value="">Select Test Type</option>
          <option value="1st term">1st Term</option>
          <option value="2nd term">2nd Term</option>
          <option value="final">Final Term</option>
        </select>

        {(testType === 'weekly' || testType === 'monthly') && (
          <select className="border px-3 py-2 rounded" value={month} onChange={e => setMonth(e.target.value)}>
            <option value="">Select Month</option>
            {['January','February','March','April','May','June','July','August','September','October','November','December']
              .map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        )}

        {testType === 'weekly' && (
          <select className="border px-3 py-2 rounded" value={week} onChange={e => setWeek(e.target.value)}>
            <option value="">Select Week</option>
            <option>1st Week</option>
            <option>2nd Week</option>
            <option>3rd Week</option>
            <option>4th Week</option>
          </select>
        )}

        <select className="border px-3 py-2 rounded" value={session} onChange={e => setSession(e.target.value)}>
          <option value="">Select Session</option>
          {sessionOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select className="border px-3 py-2 rounded" value={className} onChange={e => setClassName(e.target.value)}>
          <option value="">Select Class</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>

        <select className="border px-3 py-2 rounded" value={stream} onChange={e => setStream(e.target.value)}>
          <option value="">Select Stream</option>
          <option value="arts">Arts</option>
          <option value="science">Science</option>
        </select>
      </div>

      {isFormComplete() && students.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Roll No</th>
                  <th className="border px-2 py-1">Name</th>
                  {getSubjects().map(subject => (
                    <th key={subject} className="border px-2 py-1">{subject}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td className="border px-2 py-1">{student.rollNo}</td>
                    <td className="border px-2 py-1">{student.name}</td>
                    {getSubjects().map(subject => (
                      <td key={subject} className="border px-2 py-1">
                        <input
                          type="number"
                          className="border px-2 py-1 w-full rounded"
                          value={marks[student.id]?.[subject] || ''}
                          onChange={e => handleMarksChange(student.id, subject, e.target.value)}
                          disabled={isLocked}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isLocked && (
            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save & Lock Test Results
            </button>
          )}

          {isLocked && (
            <p className="text-green-600 font-medium mt-4">✅ This test result is already saved and locked. Editing is disabled.</p>
          )}
        </>
      )}

      {!isFormComplete() && (
        <p className="text-sm text-gray-500 mt-4">📌 Select all fields to begin entering marks.</p>
      )}
    </div>
  );
}

export default TestResultsReport;
