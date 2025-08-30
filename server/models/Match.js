const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  matchedAt: {
    type: Date,
    default: Date.now
  },
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  messages: [{
    content: {
      type: String,
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Ensure users array has exactly 2 unique users
matchSchema.pre('save', function(next) {
  if (this.users.length !== 2) {
    return next(new Error('Match must have exactly 2 users'));
  }
  
  if (this.users[0].equals(this.users[1])) {
    return next(new Error('Cannot match user with themselves'));
  }
  
  next();
});

// Method to get the other user in the match
matchSchema.methods.getOtherUser = function(userId) {
  return this.users.find(user => !user.equals(userId));
};

// Method to add a message
matchSchema.methods.addMessage = function(content, senderId) {
  this.messages.push({
    content,
    sender: senderId,
    timestamp: new Date()
  });
  
  this.lastMessage = {
    content,
    sender: senderId,
    timestamp: new Date()
  };
  
  return this.save();
};

module.exports = mongoose.model('Match', matchSchema);
