import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const MatchContext = createContext();

export const useMatches = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatches must be used within a MatchProvider');
  }
  return context;
};

export const MatchProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('newMatch', (data) => {
        console.log('New match received:', data);
        // Handle new match notification
        toast.success(`New match with ${data.user.profile?.firstName}! 🎉`);
      });

      socket.on('newMessage', (data) => {
        console.log('New message received:', data);
        // Update matches with new message
        setMatches(prev => prev.map(match => {
          if (match.matchId === data.matchId) {
            return {
              ...match,
              lastMessage: data.message
            };
          }
          return match;
        }));
      });

      return () => {
        socket.off('newMatch');
        socket.off('newMessage');
      };
    }
  }, [socket]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const addMatch = (newMatch) => {
    setMatches(prev => [...prev, newMatch]);
  };

  const sendMessage = async (matchId, content) => {
    try {
      const response = await axios.post(`/api/matches/${matchId}/messages`, { content });
      
      // Update the match with the new message
      setMatches(prev => prev.map(match => {
        if (match.matchId === matchId) {
          return {
            ...match,
            lastMessage: {
              content,
              sender: user._id,
              timestamp: new Date()
            }
          };
        }
        return match;
      }));

      return { success: true, messageId: response.data.messageId };
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return { success: false };
    }
  };

  const value = {
    matches,
    loading,
    fetchMatches,
    addMatch,
    sendMessage
  };

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
};
