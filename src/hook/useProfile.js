import { useAuth } from "../contexts/AuthContext";

export const useProfile = () => {
  const { profile, isLoading, isInitialized } = useAuth();

  return {
    profile,
    isLoading,
    isInitialized,
    isReady: isInitialized && profile !== null,
    hasProfile: profile !== null,
  };
};
