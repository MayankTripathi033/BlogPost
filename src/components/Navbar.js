'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white">
            My Blog
          </Link>
          
          <div className="flex space-x-4">
            <Link href="/">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </motion.span>
            </Link>
            <Link href="/blog">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Blog
              </motion.span>
            </Link>
            <Link href="/about">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 