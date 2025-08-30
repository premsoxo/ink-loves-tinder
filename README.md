# Ink Loves Tinder - Modern Dating Application

A beautiful, modern dating application built with React, Node.js, and MongoDB, featuring a Tinder-like swiping interface with real-time messaging.

## ✨ Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Tinder-like Swiping**: Intuitive swipe interface for liking/disliking profiles
- **Real-time Messaging**: Instant messaging between matched users
- **Profile Management**: Comprehensive user profiles with photos and preferences
- **Smart Matching**: Algorithm-based matching system
- **Real-time Notifications**: Instant updates for matches and messages
- **Mobile-First Design**: Optimized for mobile and desktop use

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 18** with Hooks
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **Socket.io Client** for real-time features

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ink-loves-tinder
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/dating-app
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system or update the connection string in `.env`

## 🚀 Running the Application

### Development Mode (Recommended)
Run both backend and frontend simultaneously:
```bash
npm run dev
```

### Separate Mode
**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

### Production Build
```bash
npm run build
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/dating-app

## 📱 Usage

### For New Users
1. Register with email, password, and basic profile information
2. Complete your profile with photos and additional details
3. Start swiping through potential matches

### For Existing Users
1. Login with your credentials
2. Continue swiping and messaging
3. Manage your profile and preferences

### Swiping Interface
- **Swipe Right** (or tap ❤️): Like a profile
- **Swipe Left** (or tap ✖️): Pass on a profile
- **Tap Info Button**: View detailed profile information
- **Photo Navigation**: Swipe through multiple photos

## 🏗️ Project Structure

```
ink-loves-tinder/
├── server/                 # Backend code
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
├── client/                # Frontend code
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
├── package.json           # Backend dependencies
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/photo` - Upload photo

### Profiles
- `GET /api/profile/discover` - Get potential matches
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/preferences` - Update preferences

### Matches
- `POST /api/matches/like/:userId` - Like a user
- `POST /api/matches/dislike/:userId` - Dislike a user
- `GET /api/matches` - Get user's matches
- `GET /api/matches/:matchId/messages` - Get messages
- `POST /api/matches/:matchId/messages` - Send message

## 🎨 Customization

### Styling
- Modify `client/tailwind.config.js` for theme customization
- Update `client/src/index.css` for custom CSS
- Use Tailwind utility classes for rapid styling

### Features
- Add new profile fields in `server/models/User.js`
- Extend matching algorithm in `server/routes/profile.js`
- Implement additional real-time features with Socket.io

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use PM2 or similar process manager
3. Deploy to platforms like Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `build` folder to platforms like Vercel, Netlify, or AWS S3

### Database
- Use MongoDB Atlas for cloud database hosting
- Set up proper security and access controls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- [ ] Video calling integration
- [ ] Advanced matching algorithms
- [ ] Social media integration
- [ ] Location-based matching
- [ ] Premium features
- [ ] Push notifications
- [ ] Dark mode theme
- [ ] Multi-language support

---

**Happy Dating! 💕**

Built with ❤️ using modern web technologies.
