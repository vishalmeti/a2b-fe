import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    };

    // Check initially
    checkToken();

    // Set up storage event listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        navigate('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);
};
