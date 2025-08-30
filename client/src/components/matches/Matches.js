import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMatches } from '../../contexts/MatchContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiMessageCircle, FiHeart, FiClock, FiMapPin } from 'react-icons/fi';
import Loading from '../common/Loading';

const Matches = () => {
  const { matches, loading } = useMatches();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filteredMatches, setFilteredMatches] = useState([]);

  useEffect(() => {
    if (matches) {
      setFilteredMatches(matches);
    }
  }, [matches]);

  const handleChatClick = (matchId) => {
    navigate(`/chat/${matchId}`);
  };

  const getOtherUser = (match) => {
    if (!match.users || !user) return null;
    return match.users.find(u => u._id !== user._id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">My Matches</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl text-gray-600 mb-2">No matches yet</h3>
            <p className="text-gray-500 mb-6">Keep swiping to find your perfect match!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Start Swiping
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredMatches.map((match, index) => {
                const otherUser = getOtherUser(match);
                if (!otherUser) return null;

                return (
                  <motion.div
                    key={match._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Profile Photo */}
                    <div className="relative h-64 bg-gradient-to-br from-pink-100 to-red-100">
                      {otherUser.profile?.photos?.[0] ? (
                        <img
                          src={otherUser.profile.photos[0].url}
                          alt={`${otherUser.profile.firstName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl text-gray-400">👤</div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <FiHeart className="inline mr-1" />
                        Match
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {otherUser.profile?.firstName} {otherUser.profile?.lastName}
                        </h3>
                        <span className="text-gray-500">
                          {otherUser.profile?.age} years old
                        </span>
                      </div>

                      {otherUser.profile?.bio && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {otherUser.profile.bio}
                        </p>
                      )}

                      {/* Interests */}
                      {otherUser.profile?.interests && otherUser.profile.interests.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {otherUser.profile.interests.slice(0, 3).map((interest, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs"
                              >
                                {interest}
                              </span>
                            ))}
                            {otherUser.profile.interests.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{otherUser.profile.interests.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Match Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <FiClock />
                          <span>Matched {formatDate(match.matchedAt)}</span>
                        </div>
                        {otherUser.profile?.location && (
                          <div className="flex items-center gap-1">
                            <FiMapPin />
                            <span>Nearby</span>
                          </div>
                        )}
                      </div>

                      {/* Last Message Preview */}
                      {match.lastMessage && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            <span className="font-medium">
                              {match.lastMessage.sender === user._id ? 'You' : otherUser.profile?.firstName}:
                            </span>{' '}
                            {match.lastMessage.content}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleChatClick(match._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                          <FiMessageCircle />
                          Chat
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
