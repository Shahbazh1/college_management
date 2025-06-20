import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function getRemarks(percent) {
  if (percent >= 90) return 'Excellent';
  if (percent >= 75) return 'Good';
  if (percent >= 50) return 'Fair';
  return 'Alarming';
}

function Report() {
  const [reportKind, setReportKind] = useState('');
  const [reportType, setReportType] = useState('');
  const [month, setMonth] = useState('');
  const [attendanceDuration, setAttendanceDuration] = useState('');
  const [session, setSession] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [reportScope, setReportScope] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [data, setData] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const handleGenerate = async () => {
    if (reportKind === 'test') {
      if (!reportType || !session || !selectedClass) {
        alert('❌ Please fill all required fields!');
        return;
      }

      const folder = reportType;

      try {
        const colRef = collection(
          db,
          'test_results',
          `${session}_${selectedClass}`,
          folder
        );
        const snap = await getDocs(colRef);
        const result = snap.docs.map(doc => doc.data());
        setData(result);
        setShowReport(true);
      } catch (err) {
        console.error('Test fetch error:', err.message);
        alert('❌ Failed to fetch test report.');
      }
    } else if (reportKind === 'attendance') {
      if (!attendanceDuration || !session || !reportScope || !selectedClass) {
        alert('❌ Please select all required attendance fields!');
        return;
      }

      if (reportScope === 'student' && !rollNo) {
        alert('❌ Please enter roll number for student report!');
        return;
      }

      try {
        let allData = [];

        if (attendanceDuration === 'monthly') {
          const colRef = collection(
            db,
            'attendance',
            `${session}-${month}`,
            selectedClass
          );

          const snap = await getDocs(colRef);
          let result = snap.docs.map(doc => doc.data());

          if (reportScope === 'student') {
            result = result.filter(student => String(student.rollNo) === rollNo.trim());
          }

          allData = result;
        } else if (attendanceDuration === 'annually') {
          const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];

          const studentMap = {};

          for (const m of months) {
            const colRef = collection(
              db,
              'attendance',
              `${session}-${m}`,
              selectedClass
            );
            const snap = await getDocs(colRef);

            snap.docs.forEach(docSnap => {
              const d = docSnap.data();
              const id = d.rollNo;

              if (reportScope === 'student' && String(d.rollNo) !== rollNo.trim()) return;

              if (!studentMap[id]) {
                studentMap[id] = {
                  ...d,
                  present: 0,
                  absent: 0,
                  leave: 0,
                };
              }

              studentMap[id].present += d.present || 0;
              studentMap[id].absent += d.absent || 0;
              studentMap[id].leave += d.leave || 0;
            });
          }

          allData = Object.values(studentMap);
        }

        setData(allData);
        setShowReport(true);
      } catch (err) {
        console.error('Attendance fetch error:', err.message);
        alert('❌ Failed to fetch attendance report.');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-green-700">📊 Generate Report</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={reportKind}
          onChange={(e) => {
            setReportKind(e.target.value);
            setReportType('');
            setMonth('');
            setAttendanceDuration('');
            setReportScope('');
            setRollNo('');
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Report Type</option>
          <option value="test">Test Results</option>
          <option value="attendance">Attendance</option>
        </select>

        {reportKind === 'test' && (
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Duration</option>
            <option value="1st term">1st Term</option>
            <option value="2nd term">2nd Term</option>
            <option value="final">Final</option>
          </select>
        )}

        {reportKind === 'attendance' && (
          <select
            value={attendanceDuration}
            onChange={(e) => setAttendanceDuration(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Attendance Duration</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        )}

        {reportKind === 'attendance' && attendanceDuration === 'monthly' && (
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Month</option>
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December',
            ].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        )}

        {reportKind === 'attendance' && (
          <select
            value={reportScope}
            onChange={(e) => setReportScope(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Report For</option>
            <option value="class">Whole Class</option>
            <option value="student">Only Student</option>
          </select>
        )}

        {reportKind === 'attendance' && reportScope === 'student' && (
          <input
            type="text"
            placeholder="Enter Roll No"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        )}

        <select
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Session</option>
          <option value="2022-2024">2022-2024</option>
          <option value="2023-2025">2023-2025</option>
          <option value="2024-2026">2024-2026</option>
        </select>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Class</option>
          <option value="11">Class 11</option>
          <option value="12">Class 12</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Generate Report
      </button>

      {showReport && data.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Roll No</th>
                <th className="border px-3 py-2">Name</th>

                {reportKind === 'test' && data[0]?.marks && (
                  <>
                    {Object.keys(data[0].marks).map(subject => (
                      <th key={subject} className="border px-3 py-2">{subject}</th>
                    ))}
                    <th className="border px-3 py-2">Obtained Marks</th>
                  </>
                )}

                {reportKind === 'attendance' && (
                  <>
                    <th className="border px-3 py-2">Total</th>
                    <th className="border px-3 py-2">Present</th>
                    <th className="border px-3 py-2">Absent</th>
                    <th className="border px-3 py-2">Leaves</th>
                    <th className="border px-3 py-2">% Attendance</th>
                    <th className="border px-3 py-2">Remarks</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((student, i) => {
                const totalDays = student.present + student.absent + student.leave;
                const percent =
                  reportKind === 'attendance' && totalDays > 0
                    ? ((student.present / totalDays) * 100).toFixed(1)
                    : '0.0';

                return (
                  <tr key={i}>
                    <td className="border px-3 py-2">{student.rollNo}</td>
                    <td className="border px-3 py-2">{student.name}</td>

                    {reportKind === 'test' && student.marks && (
                      <>
                        {Object.entries(student.marks).map(([subject, mark]) => (
                          <td key={subject} className="border px-3 py-2">{mark}</td>
                        ))}
                        <td className="border px-3 py-2 font-semibold text-green-700">
                          {Object.values(student.marks).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)}
                        </td>
                      </>
                    )}

                    {reportKind === 'attendance' && (
                      <>
                        <td className="border px-3 py-2">{totalDays}</td>
                        <td className="border px-3 py-2">{student.present}</td>
                        <td className="border px-3 py-2">{student.absent}</td>
                        <td className="border px-3 py-2">{student.leave}</td>
                        <td className="border px-3 py-2">{percent}%</td>
                        <td className="border px-3 py-2 font-semibold text-blue-600">
                          {getRemarks(percent)}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Report;
