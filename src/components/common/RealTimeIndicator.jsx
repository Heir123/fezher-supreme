import React from 'react';
import { useSocket } from '../../context/SocketContext';
import './RealTimeIndicator.css';

function RealTimeIndicator() {
  const { isConnected } = useSocket();

  return (
    <div className={`realtime-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
      <span className="realtime-dot"></span>
      <span className="realtime-text">
        {isConnected ? 'Live' : 'Connecting...'}
      </span>
    </div>
  );
}

export default RealTimeIndicator;