const WEATHER_API_KEY = process.env.NEXT_PUBLIC_API_WEATHER;

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
}

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  if (!WEATHER_API_KEY) {
    throw new Error('Thiếu API Key thời tiết');
  }

  try {
    // Gọi OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Weather API Error:', response.status, errorText);
      throw new Error(`Lỗi khi lấy dữ liệu thời tiết: ${response.status}`);
    }

    const data = await response.json();

    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      city: data.name,
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
};
