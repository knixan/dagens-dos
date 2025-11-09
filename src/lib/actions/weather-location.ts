"use server";

import { getWeatherByLocation } from "@/lib/actions/weather";

type WeatherParams = {
  lat?: number;
  lon?: number;
  location?: string;
};

/**
 * Get weather data by location coordinates or location name
 */
export async function getWeatherData(params: WeatherParams) {
  try {
    const { lat, lon, location } = params;

    let locParam: string | undefined;
    if (location && typeof location === "string") {
      locParam = location;
    } else if (typeof lat === "number" && typeof lon === "number") {
      locParam = `${lat},${lon}`;
    }

    if (!locParam) {
      return { ok: false, error: "Missing location", data: null };
    }

    const data = await getWeatherByLocation(locParam);
    if (!data) {
      return { ok: false, error: "No data", data: null };
    }

    return { ok: true, data };
  } catch (error) {
    console.error("Weather action error", error);
    return { ok: false, error: "Server error", data: null };
  }
}
