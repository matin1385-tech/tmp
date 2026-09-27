import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const authData = localStorage.getItem('eea_auth');
    if (authData) {
      try {
        const auth = JSON.parse(authData);
        if (auth.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push('/login');
        }
      } catch (e) {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setIsChecking(false);
  }, [router]);

  return { isAuthenticated, isChecking };
};
