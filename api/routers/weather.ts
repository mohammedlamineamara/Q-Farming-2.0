import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { settings } from "../../db/schema";
import { eq } from "drizzle-orm";
import {
  parseCoordinates,
  getCachedWeather,
  setCachedWeather,
  fetchOpenMeteoWeather,
} from "../lib/weather";
import type { WeatherData } from "../lib/weather";

export const weatherRouter = createRouter({
  get: authedQuery
    .input(
      z
        .object({
          bypassCache: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }): Promise<WeatherData> => {
      const db = getDb();
      const userSettings = await db
        .select()
        .from(settings)
        .where(eq(settings.userId, ctx.user.id));

      const farmLocation = userSettings[0]?.farmLocation;

      const parsed = parseCoordinates(farmLocation);
      if (!parsed) {
        return {
          status: "not_configured",
          locationName: farmLocation || "",
          message: "Farm location is not configured or could not be resolved.",
          lastUpdated: new Date().toISOString(),
        };
      }

      const cacheKey = `user_${ctx.user.id}_${parsed.lat.toFixed(4)}_${parsed.lon.toFixed(4)}`;

      if (!input?.bypassCache) {
        const cached = getCachedWeather(cacheKey);
        if (cached) {
          return cached;
        }
      }

      const result = await fetchOpenMeteoWeather(
        parsed.lat,
        parsed.lon,
        parsed.name
      );

      if (result.status === "success") {
        setCachedWeather(cacheKey, result);
      }

      return result;
    }),
});
