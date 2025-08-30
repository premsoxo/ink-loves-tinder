import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, PanInfo } from 'framer-motion';
import { FaHeart, FaTimes, FaUser, FaCog, FaComments, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useMatch } from '../../contexts/MatchContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProfileCard from './ProfileCard';
import MatchModal from './MatchModal';

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const { user, logout } = useAuth();
  const { addMatch } = useMatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/profile/discover');
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex >= profiles.length) return;
    
    const currentProfile = profiles[currentIndex];
    try {
      const response = await axios.post(`/api/matches/like/${currentProfile._id}`);
      
      if (response.data.isMatch) {
        setMatchedUser(currentProfile);
        setShowMatchModal(true);
        addMatch(response.data.match);
        toast.success("It's a match! 🎉");
      } else {
        toast.success('Profile liked!');
      }
      
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error liking profile:', error);
      toast.error('Failed to like profile');
    }
  };

  const handleDislike = async () => {
    if (currentIndex >= profiles.length) return;
    
    const currentProfile = profiles[currentIndex];
    try {
      await axios.post(`/api/matches/dislike/${currentProfile._id}`);
      toast.success('Profile passed');
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error disliking profile:', error);
      toast.error('Failed to pass profile');
    }
  };

  const handleDragEnd = async (event, info) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      // Swipe right (like)
      await handleLike();
    } else if (info.offset.x < -swipeThreshold) {
      // Swipe left (dislike)
      await handleDislike();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FaHeart className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No More Profiles</h2>
            <p className="text-gray-600 mb-6">
              You've seen all the profiles in your area. Check back later for new matches!
            </p>
            <button
              onClick={fetchProfiles}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition-all duration-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaUser className="text-gray-600 text-xl" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Ink Loves Tinder</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/matches')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <FaComments className="text-gray-600 text-xl" />
              {/* Add notification badge if there are unread messages */}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaSignOutAlt className="text-gray-600 text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Profile Card */}
        <motion.div
          key={currentProfile._id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <ProfileCard
            profile={currentProfile}
            onDragEnd={handleDragEnd}
          />
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDislike}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 border-2 border-gray-300"
          >
            <FaTimes className="text-gray-400 text-2xl" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
          >
            <FaHeart className="text-white text-2xl" />
          </motion.button>
        </div>

        {/* Profile Info */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentProfile.profile?.firstName} {currentProfile.profile?.lastName}
          </h2>
          <p className="text-gray-600">
            {currentProfile.profile?.age} • {currentProfile.profile?.gender}
          </p>
          {currentProfile.profile?.bio && (
            <p className="text-gray-700 mt-2 text-sm">
              {currentProfile.profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedUser={matchedUser}
        onStartChat={() => {
          setShowMatchModal(false);
          navigate('/matches');
        }}
      />
    </div>
  );
};

export default Dashboard;
