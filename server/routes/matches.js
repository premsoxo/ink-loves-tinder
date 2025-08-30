const express = require('express');
const User = require('../models/User');
const Match = require('../models/Match');
const auth = require('../middleware/auth');

const router = express.Router();

// Like a user
router.post('/like/:userId', auth, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: 'Cannot like yourself' });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add to likes
    if (!currentUser.likes.includes(targetUserId)) {
      currentUser.likes.push(targetUserId);
      await currentUser.save();
    }

    // Check if it's a mutual match
    if (targetUser.likes.includes(currentUserId)) {
      // Create a match
      const match = new Match({
        users: [currentUserId, targetUserId]
      });
      await match.save();

      // Add to both users' matches
      currentUser.matches.push(targetUserId);
      targetUser.matches.push(currentUserId);
      await Promise.all([currentUser.save(), targetUser.save()]);

      // Notify both users via socket.io
      const io = req.app.get('io');
      io.to(currentUserId.toString()).emit('newMatch', {
        type: 'match',
        user: targetUser.getPublicProfile(),
        matchId: match._id
      });
      io.to(targetUserId.toString()).emit('newMatch', {
        type: 'match',
        user: currentUser.getPublicProfile(),
        matchId: match._id
      });

      return res.json({
        message: 'It\'s a match!',
        isMatch: true,
        match: match
      });
    }

    res.json({
      message: 'User liked successfully',
      isMatch: false
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike a user
router.post('/dislike/:userId', auth, async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: 'Cannot dislike yourself' });
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add to dislikes
    if (!currentUser.dislikes.includes(targetUserId)) {
      currentUser.dislikes.push(targetUserId);
      await currentUser.save();
    }

    res.json({ message: 'User disliked successfully' });
  } catch (error) {
    console.error('Dislike error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's matches
router.get('/', auth, async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const matches = await Match.find({
      users: currentUserId,
      isActive: true
    }).populate('users', 'profile firstName lastName photos');

    const formattedMatches = matches.map(match => {
      const otherUser = match.users.find(user => user._id.toString() !== currentUserId);
      return {
        matchId: match._id,
        user: otherUser,
        matchedAt: match.matchedAt,
        lastMessage: match.lastMessage
      };
    });

    res.json(formattedMatches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a specific match
router.get('/:matchId/messages', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    const currentUserId = req.user.userId;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if current user is part of this match
    if (!match.users.includes(currentUserId)) {
      return res.status(403).json({ message: 'Not authorized to view this match' });
    }

    res.json(match.messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/:matchId/messages', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    const { content } = req.body;
    const currentUserId = req.user.userId;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if current user is part of this match
    if (!match.users.includes(currentUserId)) {
      return res.status(403).json({ message: 'Not authorized to send messages to this match' });
    }

    // Add message
    await match.addMessage(content, currentUserId);

    // Notify the other user via socket.io
    const otherUserId = match.getOtherUser(currentUserId);
    const io = req.app.get('io');
    io.to(otherUserId.toString()).emit('newMessage', {
      matchId,
      message: {
        content,
        sender: currentUserId,
        timestamp: new Date()
      }
    });

    res.json({
      message: 'Message sent successfully',
      messageId: match.messages[match.messages.length - 1]._id
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
