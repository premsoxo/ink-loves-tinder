import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FiCamera, FiHeart, FiMapPin, FiBriefcase, FiGraduationCap, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Onboarding = () => {
  const { user, updateProfile, uploadPhoto } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    interestedIn: [],
    bio: '',
    interests: [],
    occupation: '',
    education: '',
    height: '',
    relationshipGoals: ''
  });
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [newInterest, setNewInterest] = useState('');

  const steps = [
    { title: 'Basic Info', description: 'Tell us about yourself' },
    { title: 'Photos', description: 'Add some photos to your profile' },
    { title: 'Interests', description: 'What do you love to do?' },
    { title: 'Preferences', description: 'What are you looking for?' },
    { title: 'Review', description: 'Review your profile' }
  ];

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        age: user.profile.age || '',
        gender: user.profile.gender || '',
        interestedIn: user.profile.interestedIn || [],
        bio: user.profile.bio || '',
        interests: user.profile.interests || [],
        occupation: user.profile.occupation || '',
        education: user.profile.education || '',
        height: user.profile.height || '',
        relationshipGoals: user.profile.relationshipGoals || ''
      });
      if (user.profile.photos) {
        setPhotos(user.profile.photos);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev,
      interestedIn: prev.interestedIn.includes(value)
        ? prev.interestedIn.filter(item => item !== value)
        : [...prev.interestedIn, value]
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(item => item !== interest)
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const uploadedPhoto = await uploadPhoto(file);
      setPhotos(prev => [...prev, uploadedPhoto]);
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const profileData = {
        ...formData,
        photos: photos
      };
      await updateProfile(profileData);
      toast.success('Profile completed successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to complete profile');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return formData.firstName && formData.lastName && formData.age && formData.gender && formData.interestedIn.length > 0;
      case 1: // Photos
        return photos.length > 0;
      case 2: // Interests
        return formData.bio && formData.interests.length > 0;
      case 3: // Preferences
        return formData.relationshipGoals;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interested In *</label>
              <div className="flex flex-wrap gap-3">
                {['male', 'female', 'non-binary'].map((gender) => (
                  <label key={gender} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.interestedIn.includes(gender)}
                      onChange={() => handleCheckboxChange(gender)}
                      className="w-4 h-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span className="capitalize">{gender}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Photos</h2>
            <p className="text-gray-600 mb-6">Add at least one photo to your profile. This will help others get to know you better.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {photos.length < 6 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <FiCamera className="text-3xl text-gray-400" />
                    <span className="text-gray-600">
                      {uploading ? 'Uploading...' : 'Add Photo'}
                    </span>
                  </label>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tell Us About Yourself</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about yourself, your interests, and what makes you unique..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interests *</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  onClick={addInterest}
                  disabled={!newInterest.trim()}
                  className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:bg-gray-300 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                  >
                    <FiHeart className="text-pink-500" />
                    {interest}
                    <button
                      onClick={() => removeInterest(interest)}
                      className="text-pink-600 hover:text-pink-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiBriefcase />
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="What do you do?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiGraduationCap />
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Your education level"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">What Are You Looking For?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Goals *</label>
                <select
                  name="relationshipGoals"
                  value={formData.relationshipGoals}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select Goal</option>
                  <option value="casual">Casual Dating</option>
                  <option value="serious">Serious Relationship</option>
                  <option value="friendship">Friendship</option>
                  <option value="marriage">Marriage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  min="100"
                  max="250"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Your height in cm"
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Your Profile</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                {photos[0] && (
                  <img
                    src={photos[0].url}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className="text-gray-600">{formData.age} years old • {formData.gender}</p>
                </div>
              </div>
              
              {formData.bio && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Bio</h4>
                  <p className="text-gray-600">{formData.bio}</p>
                </div>
              )}
              
              {formData.interests.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
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
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {formData.occupation && (
                  <div>
                    <span className="font-medium text-gray-800">Occupation:</span> {formData.occupation}
                  </div>
                )}
                {formData.education && (
                  <div>
                    <span className="font-medium text-gray-800">Education:</span> {formData.education}
                  </div>
                )}
                {formData.relationshipGoals && (
                  <div>
                    <span className="font-medium text-gray-800">Looking for:</span> {formData.relationshipGoals}
                  </div>
                )}
                {formData.height && (
                  <div>
                    <span className="font-medium text-gray-800">Height:</span> {formData.height} cm
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-pink-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{steps[currentStep].title}</h1>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
          >
            <FiArrowLeft />
            Previous
          </motion.button>

          {currentStep < steps.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:bg-gray-300 transition-colors"
            >
              Next
              <FiArrowRight />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors"
            >
              Complete Profile
              <FiArrowRight />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
