import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaTimes, FaComments } from 'react-icons/fa';

const MatchModal = ({ isOpen, onClose, matchedUser, onStartChat }) => {
  if (!isOpen || !matchedUser) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>

          {/* Match Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <FaHeart className="text-white text-4xl" />
          </motion.div>

          {/* Match Text */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            It's a Match!
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            You and {matchedUser.profile?.firstName} liked each other
          </motion.p>

          {/* Matched User Photo */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-pink-200">
              {matchedUser.profile?.photos?.[0] ? (
                <img
                  src={matchedUser.profile.photos[0].url}
                  alt={matchedUser.profile?.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-200 to-red-200 flex items-center justify-center">
                  <FaHeart className="text-pink-400 text-3xl" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Matched User Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {matchedUser.profile?.firstName} {matchedUser.profile?.lastName}
            </h2>
            <p className="text-gray-600">
              {matchedUser.profile?.age} • {matchedUser.profile?.gender}
            </p>
            {matchedUser.profile?.bio && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {matchedUser.profile.bio}
              </p>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <button
              onClick={onStartChat}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-xl font-medium hover:from-pink-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FaComments />
              <span>Start Chatting</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
            >
              Keep Swiping
            </button>
          </motion.div>

          {/* Celebration Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * 400 - 200, 
                  y: Math.random() * 400 - 200,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  x: Math.random() * 800 - 400, 
                  y: Math.random() * 800 - 400,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="absolute w-2 h-2 bg-pink-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%'
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MatchModal;
