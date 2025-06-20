import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { UserRound, Users, CalendarCheck, Book } from 'lucide-react';

const data = [
  { name: 'Present', value: 60 },
  { name: 'Absent', value: 30 },
  { name: 'Leave', value: 10 },
];
const COLORS = ['#34d399', '#f87171', '#fbbf24'];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-green-700">📊 Dashboard Overview</h2>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[{
          icon: <Users className="text-green-500" size={30} />,
          title: 'Total Students',
          value: '320'
        }, {
          icon: <UserRound className="text-blue-500" size={30} />,
          title: 'Total Teachers',
          value: '25'
        }, {
          icon: <Book className="text-purple-500" size={30} />,
          title: 'Classes',
          value: '12'
        }, {
          icon: <CalendarCheck className="text-orange-500" size={30} />,
          title: "Today's Attendance",
          value: '295'
        }].map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white shadow-md rounded-xl p-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <div>
                <p className="text-gray-500">{item.title}</p>
                <h3 className="text-xl font-semibold">{item.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">📈 Attendance Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
