import { NextRequest, NextResponse } from 'next/server';

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function getWeatherApiKey(): string | undefined {
  return (
    process.env.WEATHER_API_KEY ||
    process.env.NEXT_PUBLIC_API_WEATHER ||
    process.env.NEXT_PUBLIC_API_WEATHER_V2
  );
}

export async function GET(request: NextRequest) {
  const lat = Number(request.nextUrl.searchParams.get('lat'));
  const lon = Number(request.nextUrl.searchParams.get('lon'));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ message: 'Thiếu tọa độ hợp lệ.' }, { status: 400 });
  }

  const apiKey = getWeatherApiKey();
  if (!apiKey?.trim()) {
    return NextResponse.json({ message: 'Thiếu cấu hình WEATHER_API_KEY.' }, { status: 500 });
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: apiKey.trim(),
    units: 'metric',
    lang: 'vi',
  });

  try {
    const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Weather API Error:', response.status, errorText);
      return NextResponse.json(
        { message: `Lỗi khi lấy dữ liệu thời tiết: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      temp: Math.round(data.main.temp),
      description: data.weather?.[0]?.description ?? '',
      icon: data.weather?.[0]?.icon ?? '',
      city: data.name ?? '',
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    return NextResponse.json({ message: 'Không thể lấy dữ liệu thời tiết.' }, { status: 502 });
  }
}
