export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
}

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const params = new URLSearchParams({ lat: String(lat), lon: String(lon) });
    const response = await fetch(`/api/weather?${params.toString()}`, { cache: 'no-store' });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message || `Lỗi khi lấy dữ liệu thời tiết: ${response.status}`);
    }

    return (await response.json()) as WeatherData;
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
};
