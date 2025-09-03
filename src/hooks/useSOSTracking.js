import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SOS_STORAGE_KEY = 'sos_tracking';
const MAX_CANCELLATIONS = 3;

export const useSOSTracking = () => {
  const { profile, setProfile } = useAuth();
  const [sosData, setSOSData] = useState({
    cancellationCount: 0,
    isBlocked: false,
    lastCancellation: null
  });
  const [showWarning, setShowWarning] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  // Load SOS data from localStorage
  useEffect(() => {
    if (profile?.id) {
      const stored = localStorage.getItem(`${SOS_STORAGE_KEY}_${profile.id}`);
      if (stored) {
        const data = JSON.parse(stored);
        setSOSData(data);
        
        // Check if user is blocked
        if (data.isBlocked) {
          setShowBlockedModal(true);
        }
      }
    }
  }, [profile?.id]);

  // Save SOS data to localStorage
  const saveSOSData = (data) => {
    if (profile?.id) {
      localStorage.setItem(`${SOS_STORAGE_KEY}_${profile.id}`, JSON.stringify(data));
      setSOSData(data);
    }
  };

  // Track SOS cancellation
  const trackCancellation = () => {
    if (!profile?.id) return;

    const newCount = sosData.cancellationCount + 1;
    const newData = {
      ...sosData,
      cancellationCount: newCount,
      lastCancellation: new Date().toISOString()
    };

    if (newCount >= MAX_CANCELLATIONS) {
      // Block user
      newData.isBlocked = true;
      saveSOSData(newData);
      setShowBlockedModal(true);
      
      // Auto logout after showing modal
      setTimeout(() => {
        handleLogout();
      }, 3000);
    } else if (newCount === MAX_CANCELLATIONS - 1) {
      // Show warning for second cancellation
      saveSOSData(newData);
      setShowWarning(true);
    } else {
      saveSOSData(newData);
    }
  };

  // Handle logout when blocked
  const handleLogout = () => {
    localStorage.removeItem('token');
    setProfile(null);
    window.location.href = '/login';
  };

  // Reset tracking (for admin purposes)
  const resetTracking = () => {
    if (profile?.id) {
      localStorage.removeItem(`${SOS_STORAGE_KEY}_${profile.id}`);
      setSOSData({
        cancellationCount: 0,
        isBlocked: false,
        lastCancellation: null
      });
    }
  };

  // Check if user can use SOS
  const canUseSOS = () => {
    return profile && 
           profile.role === 'USER' && 
           !sosData.isBlocked;
  };

  return {
    sosData,
    showWarning,
    setShowWarning,
    showBlockedModal,
    setShowBlockedModal,
    trackCancellation,
    resetTracking,
    canUseSOS,
    handleLogout
  };
};