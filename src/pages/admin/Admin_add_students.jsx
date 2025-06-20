import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

function Add_students() {
  const [student, setStudent] = useState({
    name: '',
    fatherName: '',
    rollNo: '',
    class: '',
    session: ''
  });

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      student.name &&
      student.fatherName &&
      student.rollNo &&
      student.class &&
      student.session
    ) {
      try {
        await addDoc(collection(db, "students"), student);
        alert("✅ Student added successfully!");
        setStudent({ name: '', fatherName: '', rollNo: '', class: '', session: '' });
      } catch (error) {
        console.error("❌ Error adding student:", error);
      }
    } else {
      alert("⚠️ Please fill all fields.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700">🎓 Add New Student</h1>
        <p className="mt-2 text-gray-600 text-sm">
          Fill in the student details below and submit to register the student.
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Student Name</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Father Name</label>
            <input
              type="text"
              name="fatherName"
              value={student.fatherName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Roll Number</label>
            <input
              type="text"
              name="rollNo"
              value={student.rollNo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <input
              type="text"
              name="class"
              value={student.class}
              onChange={handleChange}
              placeholder="e.g., 9th, 10th, 1st Year"
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Session</label>
            <input
              type="text"
              name="session"
              value={student.session}
              onChange={handleChange}
              placeholder="e.g., 2022-2024"
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition"
            >
              ➕ Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Add_students;
