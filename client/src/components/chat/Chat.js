import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMatches } from '../../contexts/MatchContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { FiSend, FiArrowLeft, FiHeart, FiMoreVertical } from 'react-icons/fi';
import Loading from '../common/Loading';
import toast from 'react-hot-toast';

const Chat = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { matches, sendMessage } = useMatches();
  const [currentMatch, setCurrentMatch] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (matches && matchId) {
      const match = matches.find(m => m._id === matchId);
      if (match) {
        setCurrentMatch(match);
        const other = match.users.find(u => u._id !== user?._id);
        setOtherUser(other);
      }
    }
  }, [matches, matchId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [currentMatch?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentMatch) return;

    setSending(true);
    try {
      await sendMessage(currentMatch._id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!currentMatch || !otherUser) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/matches')}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FiArrowLeft size={20} />
              </motion.button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  {otherUser.profile?.photos?.[0] ? (
                    <img
                      src={otherUser.profile.photos[0].url}
                      alt={otherUser.profile.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xl text-gray-600">
                        {otherUser.profile?.firstName?.[0] || '?'}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {otherUser.profile?.firstName} {otherUser.profile?.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {otherUser.profile?.age} years old
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfile(!showProfile)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FiMoreVertical size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {currentMatch.messages?.map((message, index) => {
                  const isOwnMessage = message.sender === user?._id;
                  const showDate = index === 0 || 
                    formatDate(message.timestamp) !== formatDate(currentMatch.messages[index - 1]?.timestamp);

                  return (
                    <div key={message._id || index}>
                      {/* Date Separator */}
                      {showDate && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center my-4"
                        >
                          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                            {formatDate(message.timestamp)}
                          </span>
                        </motion.div>
                      )}

                      {/* Message */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          isOwnMessage 
                            ? 'bg-pink-500 text-white rounded-br-md' 
                            : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-pink-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </AnimatePresence>
              
              {/* Scroll to bottom anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  disabled={sending}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiSend size={18} />
                  )}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Profile Sidebar */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="w-80 bg-white border-l border-gray-200 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="relative mb-4">
                      {otherUser.profile?.photos?.[0] ? (
                        <img
                          src={otherUser.profile.photos[0].url}
                          alt={otherUser.profile.firstName}
                          className="w-24 h-24 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mx-auto">
                          <span className="text-4xl text-gray-600">
                            {otherUser.profile?.firstName?.[0] || '?'}
                          </span>
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-800">
                      {otherUser.profile?.firstName} {otherUser.profile?.lastName}
                    </h3>
                    <p className="text-gray-500">{otherUser.profile?.age} years old</p>
                  </div>

                  {otherUser.profile?.bio && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">Bio</h4>
                      <p className="text-gray-600 text-sm">{otherUser.profile.bio}</p>
                    </div>
                  )}

                  {otherUser.profile?.interests && otherUser.profile.interests.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {otherUser.profile.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {otherUser.profile?.occupation && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">Occupation</h4>
                      <p className="text-gray-600 text-sm">{otherUser.profile.occupation}</p>
                    </div>
                  )}

                  <div className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FiHeart />
                      Send Super Like
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Chat;
