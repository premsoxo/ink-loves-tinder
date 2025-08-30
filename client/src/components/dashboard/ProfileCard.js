import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { FaHeart, FaTimes, FaMapMarkerAlt, FaInfo } from 'react-icons/fa';

const ProfileCard = ({ profile, onDragEnd }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const handlePhotoChange = (direction) => {
    if (direction === 'next') {
      setCurrentPhotoIndex(prev => 
        prev === profile.profile?.photos?.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentPhotoIndex(prev => 
        prev === 0 ? profile.profile?.photos?.length - 1 : prev - 1
      );
    }
  };

  const handleDragEnd = (event, info) => {
    onDragEnd(event, info);
  };

  const photos = profile.profile?.photos || [];
  const currentPhoto = photos[currentPhotoIndex];

  if (!currentPhoto) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FaInfo className="text-gray-400 text-2xl" />
            </div>
            <p>No photos available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -100, right: 100 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Photo Container */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src={currentPhoto.url}
          alt={`${profile.profile?.firstName} ${profile.profile?.lastName}`}
          className="w-full h-full object-cover"
        />
        
        {/* Photo Navigation */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => handlePhotoChange('prev')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-30 rounded-full flex items-center justify-center text-white hover:bg-opacity-50 transition-all duration-200"
            >
              ‹
            </button>
            <button
              onClick={() => handlePhotoChange('next')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-30 rounded-full flex items-center justify-center text-white hover:bg-opacity-50 transition-all duration-200"
            >
              ›
            </button>
            
            {/* Photo Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Info Toggle Button */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-30 rounded-full flex items-center justify-center text-white hover:bg-opacity-50 transition-all duration-200"
        >
          <FaInfo />
        </button>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Profile Info Overlay */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute inset-0 bg-black bg-opacity-80 text-white p-6 flex flex-col justify-center"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              {profile.profile?.firstName} {profile.profile?.lastName}
            </h2>
            <p className="text-xl mb-4">
              {profile.profile?.age} • {profile.profile?.gender}
            </p>
            
            {profile.profile?.bio && (
              <p className="text-lg mb-4 leading-relaxed">
                {profile.profile.bio}
              </p>
            )}
            
            {profile.profile?.occupation && (
              <p className="text-lg mb-2">
                💼 {profile.profile.occupation}
              </p>
            )}
            
            {profile.profile?.education && (
              <p className="text-lg mb-2">
                🎓 {profile.profile.education}
              </p>
            )}
            
            {profile.profile?.interests && profile.profile.interests.length > 0 && (
              <div className="mb-4">
                <p className="text-lg mb-2">Interests:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {profile.profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {profile.profile?.relationshipGoals && (
              <p className="text-lg">
                💕 Looking for: {profile.profile.relationshipGoals}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Basic Info (Always Visible) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          {profile.profile?.firstName} {profile.profile?.lastName}
        </h2>
        <p className="text-lg mb-2">
          {profile.profile?.age} • {profile.profile?.gender}
        </p>
        {profile.profile?.bio && (
          <p className="text-sm opacity-90 line-clamp-2">
            {profile.profile.bio}
          </p>
        )}
      </div>

      {/* Swipe Hints */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center space-x-2 text-white">
          <FaTimes className="text-red-400" />
          <span className="text-sm font-medium">Swipe Left</span>
        </div>
      </div>
      
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center space-x-2 text-white">
          <span className="text-sm font-medium">Swipe Right</span>
          <FaHeart className="text-pink-400" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
