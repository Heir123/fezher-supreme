import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    const socketInstance = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('🔌 Socket connected');
      setIsConnected(true);
      
      // Join organization room
      const orgData = localStorage.getItem('organizationData');
      if (orgData) {
        try {
          const org = JSON.parse(orgData);
          socketInstance.emit('join-organization', org.id);
          console.log('📦 Joined organization:', org.id);
        } catch (e) {
          console.error('Error parsing organization data:', e);
        }
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const value = {
    socket,
    isConnected,
    emit: (event, data) => {
      if (socketRef.current) {
        socketRef.current.emit(event, data);
      }
    },
    on: (event, callback) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      }
    },
    off: (event, callback) => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    }
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export default SocketContext;