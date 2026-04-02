import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

interface WeatherWidgetProps {
    type: 'forecast' | 'wind';
    className?: string;
}

interface HourlyData {
    time: string[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
}

interface DailyData {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    wind_speed_10m_max: number[];
}

interface WeatherData {
    hourly: HourlyData;
    daily: DailyData;
}

function getWeatherDescription(code: number): string {
    const weatherCodes: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    };
    return weatherCodes[code] || 'Unknown';
}

function getWeatherIcon(code: number): string {
    if (code === 0) return '☀️';
    if (code <= 3) return '🌤️';
    if (code <= 48) return '🌫️';
    if (code <= 57) return '🌧️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    if (code <= 86) return '🌨️';
    return '⛈️';
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

function formatHour(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

function getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

export default function WeatherWidget({ type, className }: WeatherWidgetProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const latitude = -33.9137;
                const longitude = 18.4309;
                const timezone = 'Africa/Johannesburg';

                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=${timezone}`,
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }

                const data = await response.json();
                setWeather(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'An error occurred',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) {
        return (
            <div className={className}>
                {/*<CardHeader>*/}
                {/*    <CardTitle>Weather</CardTitle>*/}
                {/*</CardHeader>*/}
                {/*<CardContent>*/}
                <div className="flex h-40 items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">
                        Loading weather data...
                    </div>
                </div>
                {/*</CardContent>*/}
            </div>
        );
    }

    if (error || !weather) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Weather - Cape Town</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-destructive">
                        Failed to load weather data
                    </div>
                </CardContent>
            </Card>
        );
    }

    const currentHour = new Date().getHours();
    const hourlyData = weather.hourly.time.slice(0, 24).map((time, index) => ({
        time,
        windSpeed: weather.hourly.wind_speed_10m[index],
        windGust: Math.round(weather.hourly.wind_speed_10m[index] * 1.3),
        windDirection: weather.hourly.wind_direction_10m[index],
    }));

    if (type === 'forecast') {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>7-Day Forecast - Cape Town</CardTitle>
                </CardHeader>
                <CardContent>
                    <Carousel
                        className="w-full"
                        opts={{ align: 'start', loop: false }}
                    >
                        <CarouselContent>
                            {weather.daily.time.map((date, index) => (
                                <CarouselItem
                                    key={date}
                                    className="md:basis-1/2"
                                >
                                    <div className="flex flex-col items-center rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent">
                                        <span className="text-sm font-semibold text-muted-foreground">
                                            {formatDate(date)}
                                        </span>
                                        <span className="my-2 text-5xl">
                                            {getWeatherIcon(
                                                weather.daily.weather_code[
                                                    index
                                                ],
                                            )}
                                        </span>
                                        <span className="text-2xl font-bold">
                                            {Math.round(
                                                weather.daily
                                                    .temperature_2m_max[index],
                                            )}
                                            °
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {Math.round(
                                                weather.daily
                                                    .temperature_2m_min[index],
                                            )}
                                            °
                                        </span>
                                        <span className="mt-2 text-center text-xs text-muted-foreground">
                                            {getWeatherDescription(
                                                weather.daily.weather_code[
                                                    index
                                                ],
                                            )}
                                        </span>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Wind & Gust (Hourly) - Cape Town</CardTitle>
            </CardHeader>
            <CardContent>
                <Carousel
                    className="h-[280px] w-full"
                    opts={{
                        align: 'start',
                    }}
                    orientation="vertical"
                >
                    <CarouselContent className="-mt-0">
                        {hourlyData.map((data, index) => (
                            <CarouselItem
                                key={data.time}
                                className="basis-1/4 pt-1"
                            >
                                <div
                                    className={`flex items-center justify-between rounded-lg p-2 ${
                                        index === currentHour
                                            ? 'border border-primary bg-primary/10'
                                            : 'bg-muted/50'
                                    }`}
                                >
                                    <span className="w-16 text-xs font-medium text-muted-foreground">
                                        {formatHour(data.time)}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs">💨</span>
                                        <span className="text-sm font-medium">
                                            {Math.round(data.windSpeed)}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            km/h
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px]">🌬️</span>
                                        <span className="text-xs text-muted-foreground">
                                            {Math.round(data.windGust)}
                                        </span>
                                    </div>
                                    <span className="w-8 text-right text-xs text-muted-foreground">
                                        {getWindDirection(data.windDirection)}
                                    </span>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </CardContent>
        </Card>
    );
}
