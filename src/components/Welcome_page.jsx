// src/pages/Welcome.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightCircle, LogIn, UserPlus } from 'lucide-react';
import collegeImage from '../assets/college.png';

const Welcome = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src={collegeImage}
        alt="College"
        className="absolute inset-0 w-full h-full object-cover brightness-50"
      />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center text-white min-h-screen px-4 py-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="block text-yellow-400 mb-2"
          >
            Welcome to
          </motion.span>
          Govt Associate College Kundian (Boys)
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-base sm:text-lg md:text-xl max-w-2xl mb-8"
        >
          Here you can track your performance like attendance and test results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
        >
          <Link
            to="/get-started"
            className="bg-green-600 text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-green-700 transition w-full sm:w-auto"
          >
            <ArrowRightCircle className="w-5 h-5" />
            Get Started
          </Link>

          <Link
            to="/sign_in"
            className="border border-white text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-white hover:text-green-600 transition w-full sm:w-auto"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </Link>

          <Link
            to="/sign_up"
            className="border border-white text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-white hover:text-green-600 transition w-full sm:w-auto"
          >
            <UserPlus className="w-5 h-5" />
            Sign Up
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
