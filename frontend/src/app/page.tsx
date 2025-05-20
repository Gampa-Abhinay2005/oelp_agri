'use client';
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, LogIn, UserPlus, Sprout } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 sm:px-20 py-4 bg-white shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
          <Leaf className="text-green-500" /> Agri-Science
        </h1>
        <nav className="hidden sm:flex gap-6 font-medium text-gray-700">
          <Link href="/login" className="hover:text-blue-700">Login</Link>
          <Link href="/register" className="hover:text-green-700">Register</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 sm:px-20 py-20 flex-1">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold text-green-900 mb-4"
        >
          Welcome to Agri-Science
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-10"
        >
          Smarter farming starts here. Get AI-powered crop suggestions and expert guidance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/login">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg shadow transition-all">
              <LogIn size={18} /> Login
            </button>
          </Link>
          <Link href="/register">
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg shadow transition-all">
              <UserPlus size={18} /> Register
            </button>
          </Link>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16 px-6 sm:px-20 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
        <div className="p-6 rounded-xl shadow hover:shadow-lg transition bg-green-50">
          <Sprout className="mx-auto text-green-600 mb-4" size={32} />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Smart Crop Suggestions</h3>
          <p className="text-gray-600">Know the right crop based on soil, season, and local data.</p>
        </div>
        <div className="p-6 rounded-xl shadow hover:shadow-lg transition bg-green-50">
          <Leaf className="mx-auto text-green-600 mb-4" size={32} />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Eco-Friendly Guidance</h3>
          <p className="text-gray-600">Use resources wisely and farm sustainably with expert tips.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} Agri-Science. Made with ❤️ for farmers.
      </footer>
    </div>
  );
}
