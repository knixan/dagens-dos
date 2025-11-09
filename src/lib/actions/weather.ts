"use server";

import { WeatherType } from "../../types/weather-types";

export async function getWeatherByLocation(
  location: string
): Promise<WeatherType | null> {
  if (!location) return null;
  try {
    const respone = await fetch(
      `https://weather.lexlink.se/forecast/location/${location}`
    );
    if (!respone.ok) {
      const txt = await respone.text();
      console.log(
        "getWeatherByLocation: non-ok response",
        respone.status,
        txt.slice?.(0, 300) ?? txt
      );
      return null;
    }

    const contentType = respone.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      // Attempt to parse JSON but fall back to logging the text if it's not JSON
      const txt = await respone.text();
      try {
        return JSON.parse(txt);
      } catch {
        console.log(
          "getWeatherByLocation: expected JSON but got:",
          txt.slice?.(0, 500) ?? txt
        );
        return null;
      }
    }

    const data = await respone.json();
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}
