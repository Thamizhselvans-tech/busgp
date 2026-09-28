import { useState, useCallback } from 'react';
import { LocationPermissionState } from '../types';

export const useLocation = () => {
  const [locationState, setLocationState] = useState<LocationPermissionState>('unknown');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
      if (!navigator.geolocation) {
        setLocationState('unavailable');
        setErrorMessage('Location services are not supported by your browser.');
        resolve(null);
        return;
      }

      setLocationState('requesting');
      setErrorMessage(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoords(newCoords);
          setLocationState('granted');
          resolve(newCoords);
        },
        (error) => {
          console.warn('Geolocation access denied or unavailable:', error.message);
          setLocationState('denied');
          setErrorMessage('Location permission was denied. You can still select your bus manually.');
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  return {
    locationState,
    coords,
    errorMessage,
    requestLocation,
    setLocationState,
  };
};
