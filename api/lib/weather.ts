interface OpenMeteoApiResponse {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    weather_code?: number;
    is_day?: number;
    time?: string;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_sum?: number[];
    wind_speed_10m_max?: number[];
  };
}

export interface WeatherCurrent {
  temperature: number;
  apparentTemperature?: number;
  humidity?: number;
  windSpeed: number;
  windDirection?: number;
  weatherCode: number;
  condition: string;
  isDay?: number;
  time: string;
}

export interface WeatherDayForecast {
  date: string;
  weatherCode: number;
  condition: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  windSpeedMax?: number;
}

export interface WeatherData {
  status: "success" | "not_configured" | "error";
  locationName: string;
  latitude?: number;
  longitude?: number;
  current?: WeatherCurrent;
  forecast?: WeatherDayForecast[];
  lastUpdated: string;
  fromCache?: boolean;
  message?: string;
}

// Known Algerian Wilayas / Cities coordinates
export const ALGERIAN_LOCATIONS: Record<string, { lat: number; lon: number; name: string }> = {
  algiers: { lat: 36.7538, lon: 3.0588, name: "Algiers" },
  oran: { lat: 35.6971, lon: -0.6308, name: "Oran" },
  constantine: { lat: 36.365, lon: 6.6147, name: "Constantine" },
  annaba: { lat: 36.9, lon: 7.7667, name: "Annaba" },
  blida: { lat: 36.4701, lon: 2.8288, name: "Blida" },
  batna: { lat: 35.5559, lon: 6.1741, name: "Batna" },
  setif: { lat: 36.19, lon: 5.41, name: "Sétif" },
  sétif: { lat: 36.19, lon: 5.41, name: "Sétif" },
  biskra: { lat: 34.8517, lon: 5.7281, name: "Biskra" },
  tlemcen: { lat: 34.8783, lon: -1.315, name: "Tlemcen" },
  mostaganem: { lat: 35.9311, lon: 0.0892, name: "Mostaganem" },
  eloued: { lat: 33.3683, lon: 6.8675, name: "El Oued" },
  "el oued": { lat: 33.3683, lon: 6.8675, name: "El Oued" },
  ouargla: { lat: 31.9493, lon: 5.325, name: "Ouargla" },
  ghardaia: { lat: 32.4912, lon: 3.6736, name: "Ghardaïa" },
  ghardaïa: { lat: 32.4912, lon: 3.6736, name: "Ghardaïa" },
  bejaia: { lat: 36.7511, lon: 5.0567, name: "Béjaïa" },
  béjaïa: { lat: 36.7511, lon: 5.0567, name: "Béjaïa" },
  skikda: { lat: 36.8762, lon: 6.9092, name: "Skikda" },
  tiaret: { lat: 35.3711, lon: 1.317, name: "Tiaret" },
  mascara: { lat: 35.3967, lon: 0.1403, name: "Mascara" },
  medea: { lat: 36.2642, lon: 2.7539, name: "Médéa" },
  médéa: { lat: 36.2642, lon: 2.7539, name: "Médéa" },
  djelfa: { lat: 34.6728, lon: 3.263, name: "Djelfa" },
  guelma: { lat: 36.4622, lon: 7.4261, name: "Guelma" },
  "tizi ouzou": { lat: 36.7118, lon: 4.0459, name: "Tizi Ouzou" },
  boumerdes: { lat: 36.7597, lon: 3.4772, name: "Boumerdès" },
  tipaza: { lat: 36.5897, lon: 2.4475, name: "Tipaza" },
  chlef: { lat: 36.165, lon: 1.3344, name: "Chlef" },
  adrar: { lat: 27.8744, lon: -0.2939, name: "Adrar" },
};

/**
 * Parses user farm location into latitude and longitude.
 * Format can be "36.7538, 3.0588" or a city name like "Algiers, Algeria".
 */
export function parseCoordinates(location: string | null | undefined): {
  lat: number;
  lon: number;
  name: string;
} | null {
  if (!location || !location.trim()) {
    return null;
  }
  const clean = location.trim();

  // Try parsing comma-separated coordinates: "36.75, 3.05"
  const coordMatch = clean.match(/^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lon = parseFloat(coordMatch[3]);
    if (isValidCoordinates(lat, lon)) {
      return { lat, lon, name: `Coords (${lat.toFixed(2)}, ${lon.toFixed(2)})` };
    }
    return null;
  }

  // Try match with known Algerian locations
  const normalized = clean.toLowerCase().replace(/,\s*algeria$/, "").trim();
  for (const [key, val] of Object.entries(ALGERIAN_LOCATIONS)) {
    if (normalized === key || normalized.includes(key) || key.includes(normalized)) {
      return { lat: val.lat, lon: val.lon, name: val.name };
    }
  }

  // Default fallback if containing "algiers" or "alger"
  if (normalized.includes("alger")) {
    return { lat: 36.7538, lon: 3.0588, name: "Algiers" };
  }

  return null;
}

export function isValidCoordinates(lat: number, lon: number): boolean {
  return (
    typeof lat === "number" &&
    typeof lon === "number" &&
    !isNaN(lat) &&
    !isNaN(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

/**
 * Maps WMO weather code (0-99) to condition key.
 */
export function mapWmoCode(code: number): {
  condition: string;
  icon: string;
} {
  switch (code) {
    case 0:
      return { condition: "clear_sky", icon: "☀️" };
    case 1:
    case 2:
      return { condition: "mainly_clear", icon: "🌤️" };
    case 3:
      return { condition: "overcast", icon: "☁️" };
    case 45:
    case 48:
      return { condition: "foggy", icon: "🌫️" };
    case 51:
    case 53:
    case 55:
      return { condition: "drizzle", icon: "🌦️" };
    case 56:
    case 57:
      return { condition: "freezing_drizzle", icon: "🌧️" };
    case 61:
    case 63:
    case 65:
      return { condition: "rain", icon: "🌧️" };
    case 66:
    case 67:
      return { condition: "freezing_rain", icon: "🌨️" };
    case 71:
    case 73:
    case 75:
    case 77:
      return { condition: "snow", icon: "❄️" };
    case 80:
    case 81:
    case 82:
      return { condition: "rain_showers", icon: "🌦️" };
    case 85:
    case 86:
      return { condition: "snow_showers", icon: "🌨️" };
    case 95:
      return { condition: "thunderstorm", icon: "⛈️" };
    case 96:
    case 99:
      return { condition: "thunderstorm_hail", icon: "⛈️" };
    default:
      return { condition: "partly_cloudy", icon: "⛅" };
  }
}

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

const weatherCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function getCachedWeather(key: string): WeatherData | null {
  const entry = weatherCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    weatherCache.delete(key);
    return null;
  }
  return { ...entry.data, fromCache: true };
}

export function setCachedWeather(key: string, data: WeatherData): void {
  weatherCache.set(key, {
    data: { ...data, fromCache: false },
    timestamp: Date.now(),
  });
}

export function clearWeatherCache(): void {
  weatherCache.clear();
}

/**
 * Fetch weather from Open-Meteo with 8s timeout and validation.
 */
export async function fetchOpenMeteoWeather(
  lat: number,
  lon: number,
  locationName: string,
  fetchFn: typeof fetch = fetch
): Promise<WeatherData> {
  if (!isValidCoordinates(lat, lon)) {
    return {
      status: "error",
      locationName,
      message: "Invalid coordinate bounds",
      lastUpdated: new Date().toISOString(),
    };
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetchFn(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        status: "error",
        locationName,
        message: `Weather provider error (${response.status})`,
        lastUpdated: new Date().toISOString(),
      };
    }

    const json = (await response.json()) as OpenMeteoApiResponse;

    if (!json || !json.current) {
      return {
        status: "error",
        locationName,
        message: "Invalid response from weather provider",
        lastUpdated: new Date().toISOString(),
      };
    }

    const currentWmo = mapWmoCode(json.current.weather_code ?? 0);
    const current: WeatherCurrent = {
      temperature: Math.round(json.current.temperature_2m ?? 0),
      apparentTemperature: Math.round(json.current.apparent_temperature ?? json.current.temperature_2m ?? 0),
      humidity: json.current.relative_humidity_2m,
      windSpeed: Math.round(json.current.wind_speed_10m ?? 0),
      windDirection: json.current.wind_direction_10m,
      weatherCode: json.current.weather_code ?? 0,
      condition: currentWmo.condition,
      isDay: json.current.is_day,
      time: json.current.time ?? new Date().toISOString(),
    };

    const forecast: WeatherDayForecast[] = [];
    if (json.daily && Array.isArray(json.daily.time)) {
      for (let i = 0; i < json.daily.time.length; i++) {
        const wCode = json.daily.weather_code?.[i] ?? 0;
        forecast.push({
          date: json.daily.time[i],
          weatherCode: wCode,
          condition: mapWmoCode(wCode).condition,
          tempMax: Math.round(json.daily.temperature_2m_max?.[i] ?? current.temperature),
          tempMin: Math.round(json.daily.temperature_2m_min?.[i] ?? current.temperature - 5),
          precipitation: json.daily.precipitation_sum?.[i] ?? 0,
          windSpeedMax: json.daily.wind_speed_10m_max?.[i] ?? 0,
        });
      }
    }

    return {
      status: "success",
      locationName,
      latitude: lat,
      longitude: lon,
      current,
      forecast,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorObj = err as Error | null;
    return {
      status: "error",
      locationName,
      message: errorObj?.name === "AbortError" ? "Weather request timed out (8s limit)" : (errorObj?.message || "Failed to fetch weather"),
      lastUpdated: new Date().toISOString(),
    };
  }
}
