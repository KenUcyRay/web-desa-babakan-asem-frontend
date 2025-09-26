// Socket.io client utility
import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
  try {
    // Connect to backend socket server
    socket = io(import.meta.env.VITE_NEW_BASE_URL || "http://localhost:3001", {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      withCredentials: true
    });
    
    console.log("Socket initialized successfully");
    return socket;
  } catch (error) {
    console.error("Socket initialization failed:", error);
    return null;
  }
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Emergency event listeners
export const onNewEmergency = (callback) => {
  if (socket) {
    socket.on("new_emergency", callback);
  }
};

export const onEmergencyUpdated = (callback) => {
  if (socket) {
    socket.on("emergency_updated", callback);
  }
};

export const onEmergencyDeleted = (callback) => {
  if (socket) {
    socket.on("emergency_deleted", callback);
  }
};

export const offEmergencyEvents = () => {
  if (socket) {
    socket.off("new_emergency");
    socket.off("emergency_updated");
    socket.off("emergency_deleted");
  }
};

// Socket connection events
export const onConnect = (callback) => {
  if (socket) {
    socket.on("connect", callback);
  }
};

export const onDisconnect = (callback) => {
  if (socket) {
    socket.on("disconnect", callback);
  }
};

export const onConnectError = (callback) => {
  if (socket) {
    socket.on("connect_error", callback);
  }
};