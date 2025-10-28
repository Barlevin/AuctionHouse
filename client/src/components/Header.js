import React from 'react';
import { Gavel, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ onAddItemClick }) => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <Gavel className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">
              Auction House
            </h1>
          </motion.div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddItemClick}
              className="flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </motion.button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

