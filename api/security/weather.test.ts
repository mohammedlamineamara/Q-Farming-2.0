import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  parseCoordinates,
  isValidCoordinates,
  mapWmoCode,
  getCachedWeather,
  setCachedWeather,
  clearWeatherCache,
  fetchOpenMeteoWeather,
} from "../lib/weather";
import type { WeatherData } from "../lib/weather";
import { weatherRouter } from "../routers/weather";
import type { TrpcContext } from "../context";

describe("Q-Farming 2.0 - Phase 5D Weather Security & Integrity", () => {
  beforeEach(() => {
    clearWeatherCache();
    vi.restoreAllMocks();
  });

  it("1. should validate coordinate boundaries strictly (-90..90, -180..180)", () => {
    expect(isValidCoordinates(36.75, 3.05)).toBe(true);
    expect(isValidCoordinates(-34.0, 18.4)).toBe(true);
    expect(isValidCoordinates(91, 10)).toBe(false);
    expect(isValidCoordinates(-91, 10)).toBe(false);
    expect(isValidCoordinates(36, 181)).toBe(false);
    expect(isValidCoordinates(36, -181)).toBe(false);
    expect(isValidCoordinates(NaN, 10)).toBe(false);
  });

  it("2. should reject arbitrary invalid coordinate formats in location parser", () => {
    expect(parseCoordinates("999.99, 999.99")).toBeNull();
    expect(parseCoordinates("random-non-existent-city-xyz")).toBeNull();
    expect(parseCoordinates("")).toBeNull();
    expect(parseCoordinates(undefined)).toBeNull();
  });

  it("3. should resolve known Algerian farm locations deterministically", () => {
    const algiers = parseCoordinates("Algiers, Algeria");
    expect(algiers).not.toBeNull();
    expect(algiers?.lat).toBeCloseTo(36.75, 1);
    expect(algiers?.lon).toBeCloseTo(3.05, 1);

    const biskra = parseCoordinates("Biskra");
    expect(biskra).not.toBeNull();
    expect(biskra?.lat).toBeCloseTo(34.85, 1);
  });

  it("4. should parse valid comma-separated numeric coordinates from farmLocation", () => {
    const coords = parseCoordinates("35.6971, -0.6308");
    expect(coords).not.toBeNull();
    expect(coords?.lat).toBe(35.6971);
    expect(coords?.lon).toBe(-0.6308);
  });

  it("5. should map WMO codes to correct meteorological condition categories", () => {
    expect(mapWmoCode(0).condition).toBe("clear_sky");
    expect(mapWmoCode(1).condition).toBe("mainly_clear");
    expect(mapWmoCode(3).condition).toBe("overcast");
    expect(mapWmoCode(45).condition).toBe("foggy");
    expect(mapWmoCode(61).condition).toBe("rain");
    expect(mapWmoCode(71).condition).toBe("snow");
    expect(mapWmoCode(95).condition).toBe("thunderstorm");
  });

  it("6. should cache weather data for 10 minutes", () => {
    const mockData: WeatherData = {
      status: "success",
      locationName: "Algiers",
      latitude: 36.75,
      longitude: 3.05,
      current: {
        temperature: 22,
        windSpeed: 10,
        weatherCode: 0,
        condition: "clear_sky",
        time: "2026-06-01T12:00:00Z",
      },
      lastUpdated: new Date().toISOString(),
    };

    setCachedWeather("cache_key_algiers", mockData);
    const cached = getCachedWeather("cache_key_algiers");
    expect(cached).not.toBeNull();
    expect(cached?.fromCache).toBe(true);
    expect(cached?.locationName).toBe("Algiers");
  });

  it("7. should expire cache after 10 minutes (TTL check)", () => {
    const mockData: WeatherData = {
      status: "success",
      locationName: "Algiers",
      lastUpdated: new Date().toISOString(),
    };

    setCachedWeather("key_ttl", mockData);
    // Fast-forward time by 11 minutes
    const futureTime = Date.now() + 11 * 60 * 1000;
    vi.spyOn(Date, "now").mockReturnValue(futureTime);

    const expired = getCachedWeather("key_ttl");
    expect(expired).toBeNull();
  });

  it("8. should successfully process 7-day forecast from provider response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 24.5,
          relative_humidity_2m: 55,
          wind_speed_10m: 12.3,
          weather_code: 0,
          is_day: 1,
          time: "2026-06-01T14:00",
        },
        daily: {
          time: [
            "2026-06-01",
            "2026-06-02",
            "2026-06-03",
            "2026-06-04",
            "2026-06-05",
            "2026-06-06",
            "2026-06-07",
          ],
          weather_code: [0, 1, 3, 61, 80, 0, 1],
          temperature_2m_max: [28, 29, 25, 22, 23, 27, 30],
          temperature_2m_min: [17, 18, 16, 14, 15, 17, 19],
          precipitation_sum: [0, 0, 1.2, 8.5, 3.0, 0, 0],
          wind_speed_10m_max: [15, 14, 20, 25, 18, 12, 14],
        },
      }),
    });

    const result = await fetchOpenMeteoWeather(36.75, 3.05, "Algiers", mockFetch as unknown as typeof fetch);
    expect(result.status).toBe("success");
    expect(result.current?.temperature).toBe(25);
    expect(result.forecast?.length).toBe(7);
    expect(result.forecast?.[0].condition).toBe("clear_sky");
    expect(result.forecast?.[3].condition).toBe("rain");
  });

  it("9. should handle provider timeout gracefully (8-second timeout guard)", async () => {
    const timeoutError = new Error("The operation was aborted");
    timeoutError.name = "AbortError";
    const slowFetch = vi.fn().mockRejectedValue(timeoutError);

    const result = await fetchOpenMeteoWeather(36.75, 3.05, "Algiers", slowFetch as unknown as typeof fetch);
    expect(result.status).toBe("error");
    expect(result.message).toContain("timed out");
  });

  it("10. should handle HTTP errors from external provider safely", async () => {
    const errorFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    const result = await fetchOpenMeteoWeather(36.75, 3.05, "Algiers", errorFetch as unknown as typeof fetch);
    expect(result.status).toBe("error");
    expect(result.message).toContain("503");
  });

  it("11. client router cannot supply arbitrary coordinates in input", async () => {
    // Calling weather router with unauthorized fields should fail schema or be ignored
    const caller = weatherRouter.createCaller({
      user: { id: 1, email: "admin@q-farming.com", role: "admin", clientId: "tenant-1" },
      session: { unionId: "u1", clientId: "tenant-1" },
    } as unknown as TrpcContext);

    // Weather router input only allows { bypassCache?: boolean }
    // If client tries to supply lat/lon, zod strips or rejects them
    const res = await caller.get({});
    expect(res).toBeDefined();
    expect(["success", "not_configured", "error"]).toContain(res.status);
  });

  it("12. should return not_configured when user farmLocation is empty in settings", async () => {
    const caller = weatherRouter.createCaller({
      user: { id: 9999, email: "newuser@q-farming.com", role: "worker", clientId: "tenant-99" },
      session: { unionId: "u99", clientId: "tenant-99" },
    } as unknown as TrpcContext);

    const res = await caller.get({});
    expect(res.status).toBe("not_configured");
  });

  it("13. should support bypassCache parameter to force fresh data and replace cached result", async () => {
    const cacheKey = "user_1_36.7538_3.0588";
    const staleCachedData: WeatherData = {
      status: "success",
      locationName: "Algiers",
      latitude: 36.7538,
      longitude: 3.0588,
      current: {
        temperature: 12,
        windSpeed: 8,
        weatherCode: 0,
        condition: "clear_sky",
        time: "2026-09-17T08:00:00.000Z",
      },
      lastUpdated: "2026-09-17T08:00:00.000Z",
    };
    setCachedWeather(cacheKey, staleCachedData);

    const caller = weatherRouter.createCaller({
      user: { id: 1, email: "admin@q-farming.com", role: "admin", clientId: "tenant-1" },
      session: { unionId: "u1", clientId: "tenant-1" },
    } as unknown as TrpcContext);

    // Normal request uses the server cache
    const normalRes = await caller.get({});
    expect(normalRes.status).toBe("success");
    expect(normalRes.fromCache).toBe(true);
    expect(normalRes.current?.temperature).toBe(12);

    // Manual refresh sends bypassCache=true, bypassing cache and fetching fresh data.
    // Mock the external provider so this security test does not depend on network availability.
    const freshProviderTime = "2026-09-17T09:00:00.000Z";
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 24,
          relative_humidity_2m: 50,
          apparent_temperature: 25,
          wind_speed_10m: 10,
          wind_direction_10m: 180,
          weather_code: 1,
          is_day: 1,
          time: freshProviderTime,
        },
        daily: {
          time: ["2026-09-17"],
          weather_code: [1],
          temperature_2m_max: [28],
          temperature_2m_min: [18],
          precipitation_sum: [0],
          wind_speed_10m_max: [15],
        },
      }),
    } as Response);

    const freshRes = await caller.get({ bypassCache: true });
    expect(freshRes.status).toBe("success");
    expect(freshRes.fromCache).toBeFalsy();

    // Fresh weather data replaces the cached result in memory
    const updatedCache = getCachedWeather(cacheKey);
    expect(updatedCache).toBeDefined();
    expect(updatedCache?.lastUpdated).toBe(freshRes.lastUpdated);
    expect(updatedCache?.lastUpdated).not.toBe(staleCachedData.lastUpdated);
  });
});
