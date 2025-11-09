"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as React from "react";
import WeatherComment from "@/components/weather-comments";
import { getWeatherData } from "@/lib/actions/weather-location";

interface WeatherTimeseriesItem {
  temp: number | null;
  summary?: string;
}

interface WeatherData {
  tempC?: number;
  location?: string;
  condition?: string;
  timeseries?: WeatherTimeseriesItem[];
}

interface Props {
  weather?: WeatherData;
}

export default function WeatherAside({ weather }: Props) {
  const getWeatherEmoji = (summary?: string) => {
    const s = (summary || "").toLowerCase();
    if (s.includes("sun") || s.includes("klart") || s.includes("clear"))
      return "☀️";
    if (s.includes("partly") || s.includes("delvis") || s.includes("moln"))
      return "🌤️";
    if (s.includes("cloud") || s.includes("mulet")) return "☁️";
    if (s.includes("rain") || s.includes("regn")) return "🌧️";
    if (s.includes("snow") || s.includes("snö")) return "❄️";
    if (s.includes("storm") || s.includes("åska")) return "⛈️";
    if (s.includes("fog") || s.includes("dimma")) return "🌫️";
    return "🌤️";
  };

  const translateSummary = (summary?: string) => {
    if (!summary) return "";
    const s = summary.toLowerCase();
    if (s.includes("clear") || s.includes("klart")) return "Klart";
    if (s.includes("partly") || s.includes("delvis")) return "Delvis molnigt";
    if (s.includes("cloud") || s.includes("mulet")) return "Mulet";
    if (s.includes("rain") || s.includes("regn")) return "Regn";
    if (s.includes("snow") || s.includes("snö")) return "Snö";
    if (s.includes("storm") || s.includes("åska")) return "Åska";
    if (s.includes("fog") || s.includes("dimma")) return "Dimma";
    return summary;
  };

  const [geoWeather, setGeoWeather] = React.useState<WeatherData | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (weather) return; // respect explicit prop
    if (!("geolocation" in navigator)) return;

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return;
        try {
          const { latitude, longitude } = pos.coords;

          const result = await getWeatherData({
            lat: latitude,
            lon: longitude,
          });

          if (!result.ok || !result.data) return;

          const data = result.data;

          if (!cancelled && data) {
            const first = data?.timeseries?.[0];
            type RawSeries = { temp?: number | null; summary?: string };
            setGeoWeather({
              tempC:
                typeof first?.temp === "number"
                  ? Math.round(first.temp)
                  : undefined,
              location:
                data?.location?.display_name ??
                data?.location?.name ??
                undefined,
              condition: first?.summary ?? undefined,
              timeseries: Array.isArray(data?.timeseries)
                ? data.timeseries.map((s: RawSeries) => ({
                    temp: s.temp ?? null,
                    summary: s.summary,
                  }))
                : undefined,
            });
          }
        } catch {
          // ignore
        }
      },
      () => {},
      { maximumAge: 60_000, timeout: 10_000 }
    );

    return () => {
      cancelled = true;
    };
  }, [weather]);

  const effectiveWeather = weather ?? geoWeather;

  const current =
    effectiveWeather?.timeseries && effectiveWeather.timeseries[0]
      ? effectiveWeather.timeseries[0]
      : typeof effectiveWeather?.tempC === "number"
      ? { temp: effectiveWeather.tempC, summary: effectiveWeather?.condition }
      : undefined;

  return (
    <section className="rounded-xl border bg-card text-card-foreground p-6 shadow">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">Lokalt Väder</h3>

      {current ? (
        <div className="current-card flex items-center gap-4 p-3 bg-card rounded-lg border border-border shadow-sm">
          <div style={{ fontSize: 48, lineHeight: 1 }}>
            {getWeatherEmoji(current?.summary)}
          </div>

          <div className="temp-col flex flex-col">
            <div
              style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}
              className="text-primary"
            >
              {typeof current?.temp === "number" ? `${current.temp}°C` : "—"}
            </div>
            <div
              style={{ fontSize: 14, opacity: 0.8 }}
              className="text-foreground"
            >
              {translateSummary(current?.summary)}
            </div>
          </div>

          <div
            className="temp-right"
            style={{ marginLeft: "auto", textAlign: "right" }}
          >
            <div
              style={{ fontSize: 12, opacity: 0.7 }}
              className="text-foreground"
            >
              Känns som
            </div>
            <div
              style={{ fontSize: 14, fontWeight: 600 }}
              className="text-foreground"
            >
              {typeof current?.temp === "number" ? `${current.temp}°C` : "—"}
            </div>
            <WeatherComment
              temp={current?.temp ?? null}
              summary={translateSummary(current?.summary)}
            />
          </div>
        </div>
      ) : (
        <div
          className="text-center bg-card rounded-md border-2 border-secondary"
          style={{ padding: "24px" }}
        >
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌤️</div>
          <p
            className="text-foreground"
            style={{ opacity: 0.7, fontSize: "14px", margin: 0 }}
          >
            Ingen väderdata tillgänglig
          </p>
        </div>
      )}

      <div className="mt-3">
        <Button
          variant="secondary"
          asChild={!!effectiveWeather}
          className="w-full"
        >
          {effectiveWeather ? (
            <Link href="/vader">10‑dygnsprognos</Link>
          ) : (
            <span className="opacity-70">10‑dygnsprognos</span>
          )}
        </Button>
      </div>
    </section>
  );
}
