import { useState, useEffect, useCallback } from 'react';

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  error: string | null;
  loading: boolean;
  isIpFallback: boolean;
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    city: null,
    country: null,
    error: null,
    loading: true,
    isIpFallback: false,
  });

  const fetchIpLocation = async () => {
    try {
      // Dùng ipapi.co miễn phí để lấy vị trí tương đối
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Không thể lấy vị trí qua IP');

      const data = await response.json();
      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country_name,
        error: null,
        loading: false,
        isIpFallback: true,
      });
    } catch (error: any) {
      setLocation(prev => ({
        ...prev,
        error: 'Không thể xác định vị trí',
        loading: false,
      }));
    }
  };

  const requestLocation = useCallback(() => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      // Trình duyệt không hỗ trợ, dùng IP
      fetchIpLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: null, // Sẽ lấy tên thành phố thông qua API thời tiết sau
          country: null,
          error: null,
          loading: false,
          isIpFallback: false,
        });
      },
      (error) => {
        // Người dùng từ chối hoặc có lỗi, dùng IP
        fetchIpLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { location, retry: requestLocation };
}
