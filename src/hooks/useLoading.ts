import { useState, useEffect } from 'react';

export function useLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Short loading duration for better user experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Quick loading with simple spinner

    return () => clearTimeout(timer);
  }, []);

  return isLoading;
}