const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get potential matches for the current user
router.get('/discover', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build query based on user preferences
    const query = {
      _id: { $ne: currentUser._id },
      'profile.age': {
        $gte: currentUser.preferences.ageRange.min,
        $lte: currentUser.preferences.ageRange.max
      },
      'profile.gender': { $in: currentUser.profile.interestedIn },
      isProfileComplete: true
    };

    // Add gender preference filters
    const genderFilters = [];
    if (currentUser.preferences.showMen) genderFilters.push('male');
    if (currentUser.preferences.showWomen) genderFilters.push('female');
    if (currentUser.preferences.showNonBinary) genderFilters.push('non-binary', 'other');
    
    query['profile.gender'] = { $in: genderFilters };

    // Exclude users already liked/disliked
    query._id = {
      $nin: [
        ...currentUser.likes,
        ...currentUser.dislikes,
        ...currentUser.matches
      ]
    };

    const potentialMatches = await User.find(query)
      .select('profile firstName lastName age gender photos bio interests occupation')
      .limit(20);

    res.json(potentialMatches);
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by ID
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('profile firstName lastName age gender photos bio interests occupation education height relationshipGoals lastActive');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(user.preferences, preferences);
    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
