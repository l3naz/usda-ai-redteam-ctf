import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { getAuthToken } from '../utils/api';

/**
 * Hook to check if user is authenticated with backend
 */
export function useAuth() {
  const { user } = useUser();
  const [hasBackendAuth, setHasBackendAuth] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    setHasBackendAuth(!!token);
  }, [user]);

  return {
    isAuthenticated: !!user,
    hasBackendAuth,
    user,
  };
}
