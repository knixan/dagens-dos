import { getWeatherData } from "@/lib/actions/weather-location";
import Image from "next/image";
import WeatherComment from "../../components/weather-comments";
import ClientGeoWeather from "../../components/weather-client";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import SearchForm from "@/components/Forms/SearchForm";
import { Location, Series } from "../../types/weather-types";

// Helper function for wind direction
function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// Helper function for cloud cover
function getCloudCoverIcon(cloudCover: number): string {
  if (cloudCover < 20) return "☀️";
  if (cloudCover < 50) return "⛅";
  if (cloudCover < 80) return "🌥️";
  return "☁️";
}

// Helper function for thunder risk level
function getThunderRiskLevel(probability: number): {
  text: string;
  textClass: string;
  bgClass: string;
} {
  // Return Tailwind/shadcn utility classes instead of hard-coded hex colors
  if (probability < 20)
    return {
      text: "Låg",
      textClass: "text-destructive/90 text-green-600",
      bgClass: "bg-destructive/10",
    };
  if (probability < 50)
    return {
      text: "Medel",
      textClass: "text-secondary-foreground text-amber-600",
      bgClass: "bg-secondary/10",
    };
  return {
    text: "Hög",
    textClass: "text-destructive",
    bgClass: "bg-destructive/10",
  };
}

// New: map weather summary text to an emoji
function getWeatherEmoji(summary: string): string {
  const s = (summary || "").toLowerCase();
  if (s.includes("clear") || s.includes("sunny")) return "☀️";
  if (s.includes("nearly clear")) return "🌤️";
  if (s.includes("partly") || s.includes("scattered")) return "⛅";
  if (s.includes("cloud") || s.includes("overcast")) return "☁️";
  if (s.includes("rain") || s.includes("shower") || s.includes("drizzle"))
    return "🌧️";
  if (s.includes("thunder") || s.includes("storm")) return "⛈️";
  if (s.includes("snow") || s.includes("sleet") || s.includes("blizzard"))
    return "❄️";
  if (s.includes("fog") || s.includes("mist") || s.includes("haze"))
    return "🌫️";
  // fallback based on keywords or return a cloud emoji
  return "🌥️";
}

// Translate English weather summary to Swedish
function translateSummary(summary: string): string {
  const s = (summary || "").toLowerCase().trim();
  if (s === "clear sky") return "Klar himmel";
  if (s === "nearly clear sky") return "Nästan klar himmel";
  if (s === "halfclear sky") return "Halvklart väder";
  if (s === "variable cloudiness") return "Växlande molnighet";
  if (s === "cloudy sky") return "Molnigt väder";
  if (s === "overcast") return "Mulet";
  if (s === "fog") return "Dimma";
  if (s === "mist") return "Dis";
  if (s === "rain") return "Regn";
  if (s === "rain showers") return "Regnskurar";
  if (s === "heavy rain") return "Kraftigt regn";
  if (s === "thunder") return "Åska";
  if (s === "thunderstorm") return "Åskväder";
  if (s === "snow") return "Snö";
  if (s === "snow showers") return "Snöskurar";
  if (s === "heavy snow") return "Kraftig snö";
  if (s === "sleet") return "Snöblandat regn";
  if (s === "hail") return "Hagel";
  if (s === "light rain") return "Lätt regn";
  if (s === "drizzle") return "Duggregn";
  if (s === "freezing rain") return "Underkylt regn";
  if (s === "partly cloudy") return "Delvis molnigt";
  if (s === "mostly cloudy") return "Mestadels molnigt";
  // Fallback: returnera original om ingen översättning finns
  return summary;
}

// Format ISO date/time strings into readable Swedish date/time
function formatTime(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return iso;
  }
}

function formatDateShort(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("sv-SE", {
      day: "numeric",
      month: "short",
    })
      .format(d)
      .replace(".", "");
  } catch {
    return iso;
  }
}

function formatDateTimeShort(iso?: string) {
  if (!iso) return "";
  const date = formatDateShort(iso);
  const time = formatTime(iso);
  return `${date} ${time}`.trim();
}

// Ny: Hitta (eller närmaste) post för varje dag kl 12 för n dagar framåt
function getNextDaysMidday(timeseries: Series[] = [], days = 10): Series[] {
  const out: Series[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const target = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + i,
      12,
      0,
      0
    );

    const sameDay = timeseries.filter((s) => {
      try {
        const d = new Date(s.validTime);
        return (
          d.getFullYear() === target.getFullYear() &&
          d.getMonth() === target.getMonth() &&
          d.getDate() === target.getDate()
        );
      } catch {
        return false;
      }
    });

    if (sameDay.length === 0) continue;

    let best = sameDay[0];
    let bestDiff = Math.abs(new Date(best.validTime).getHours() - 12);
    for (const s of sameDay) {
      const diff = Math.abs(new Date(s.validTime).getHours() - 12);
      if (diff < bestDiff) {
        best = s;
        bestDiff = diff;
      }
    }
    out.push(best);
  }
  return out;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function getLocationLabel(loc?: Location) {
  if (!loc) return "Okänd plats";
  if (loc.name && loc.name.trim()) return loc.name;
  const display = loc.display_name ?? "";

  // Split on commas and trim segments
  const parts = display
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    // remove pure postal code segments (3-6 digits) and segments that are just numbers
    .filter((p) => !/^\d{3,6}$/.test(p));

  if (parts.length === 0) return display || "Okänd plats";

  // Locality: first meaningful part
  const locality = parts[0];

  // Municipality/region: prefer second part if it isn't the country
  let municipality = parts.length > 1 ? parts[1] : "";

  // Country: last part (if different from municipality/locality)
  const countryPart = parts[parts.length - 1];

  // If municipality equals country (single segment), omit municipality
  if (
    municipality &&
    municipality.toLowerCase() === countryPart.toLowerCase()
  ) {
    municipality = "";
  }

  // Build label: locality + optional municipality, plus country name (no ISO codes)
  const partsOut: string[] = [];
  if (locality) partsOut.push(locality.replace(/^[\s,-]+|[\s,-]+$/g, ""));
  if (municipality)
    partsOut.push(municipality.replace(/^[\s,-]+|[\s,-]+$/g, ""));

  let countryDisplay = "";
  if (countryPart && countryPart !== locality && countryPart !== municipality) {
    countryDisplay = countryPart;
  }

  if (countryDisplay) partsOut.push(countryDisplay);

  return partsOut.join(", ") || display || "Okänd plats";
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export default async function Page({
  searchParams,
}: {
  searchParams: { location?: string } | Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  const location = params?.location ?? "";

  // Use server action that returns { ok, data } for better error handling
  const weatherResult = location ? await getWeatherData({ location }) : null;
  const weather = weatherResult?.ok ? weatherResult.data : null;

  // 10-dagarslista (exklusive idag) med post närmast kl 12
  // getNextDaysMidday starts from today, so request 11 days and drop the first
  const tenDayMidday = weather
    ? getNextDaysMidday(weather.timeseries, 11).slice(1)
    : [];

  return (
    <div>
      <Navbar />
      <div
        className="bg-background text-foreground"
        style={{
          padding: "0",
          boxSizing: "border-box",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          flex: 1,
        }}
      >
        {/* Header Section */}
        <header
          className="bg-secondary shadow-md"
          style={{ padding: "32px 24px" }}
        >
          <div
            style={{ maxWidth: "1200px", margin: "0 auto" }}
            className="text-center"
          >
            <div className="flex flex-col items-center justify-center gap-4 mb-2">
              <div style={{ position: "relative", width: 120, height: 120 }}>
                <Image
                  src="/images/vaderskuggan.png"
                  alt="vaderskuggan"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 600px) 80px, 120px"
                />
              </div>

              <h1
                className="text-primary-foreground"
                style={{
                  margin: "0",
                  fontSize: "32px",
                  fontWeight: "700",
                  letterSpacing: "-0.5px",
                }}
              >
                Väderskuggan
              </h1>
            </div>

            <div
              className="text-primary-foreground text-center"
              style={{ margin: "0 0 24px 0", lineHeight: 1.15 }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: 4,
                  letterSpacing: "-0.3px",
                }}
              >
                Molnigt med en chans till sol och eftertanke
              </div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                Din dagliga dos av meteorologisk besvikelse.
              </div>
            </div>

            <SearchForm
              paramName="location"
              placeholder="Sök efter stad eller plats..."
              className="flex flex-col sm:flex-row text-card-foreground items-center justify-center gap-3"
            />
          </div>
        </header>

        {/* Main Content */}
        <main
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}
        >
          {!location ? (
            <ClientGeoWeather />
          ) : !weather ? (
            <div
              className="text-center bg-card-forground rounded-md border-2 border-secondary"
              style={{ padding: "64px 24px" }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
              <p
                className="text-foreground"
                style={{ opacity: 0.7, fontSize: "18px", margin: 0 }}
              >
                {`Kunde inte hämta väderdata för “${location}”`}
              </p>
            </div>
          ) : (
            <section>
              {/* Insert: compact current weather card */}
              {weather.timeseries[0] && (
                <div className="current-card  flex items-center gap-4 mb-5 p-3 bg-card rounded-lg border border-border shadow-sm">
                  <div style={{ fontSize: 48, lineHeight: 1 }}>
                    {getWeatherEmoji(weather.timeseries[0].summary)}
                  </div>

                  <div className="temp-col flex flex-col">
                    <div
                      style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}
                      className="text-primary"
                    >
                      {weather.timeseries[0].temp}°C
                    </div>
                    <div
                      style={{ fontSize: 14, opacity: 0.8 }}
                      className="text-foreground"
                    >
                      {translateSummary(weather.timeseries[0].summary)}
                    </div>
                    <div
                      style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}
                      className="text-foreground"
                    >
                      {formatDateShort(weather.timeseries[0].validTime)}
                    </div>
                    <div
                      style={{ fontSize: 12, opacity: 0.7 }}
                      className="text-foreground"
                    >
                      {formatTime(weather.timeseries[0].validTime)}
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
                      {typeof weather.timeseries[0].temp === "number"
                        ? `${weather.timeseries[0].temp}°C`
                        : "—"}
                    </div>
                    <WeatherComment
                      temp={weather.timeseries[0]?.temp}
                      summary={translateSummary(weather.timeseries[0]?.summary)}
                    />
                  </div>
                </div>
              )}

              {/* Current Weather Summary */}
              {weather.timeseries[0] && (
                <div
                  className="pt-6 grid gap-4"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        opacity: 0.6,
                        marginBottom: "4px",
                      }}
                      className="text-foreground"
                    >
                      Luftfuktighet
                    </div>
                    <div
                      style={{ fontSize: "20px", fontWeight: "600" }}
                      className="text-primary"
                    >
                      💧 {weather.timeseries[0].humidity}%
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        opacity: 0.6,
                        marginBottom: "4px",
                      }}
                      className="text-foreground"
                    >
                      Lufttryck
                    </div>
                    <div
                      style={{ fontSize: "20px", fontWeight: "600" }}
                      className="text-primary"
                    >
                      🌡️ {weather.timeseries[0].airPressure} hPa
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        opacity: 0.6,
                        marginBottom: "4px",
                      }}
                      className="text-foreground"
                    >
                      Sikt
                    </div>
                    <div
                      style={{ fontSize: "20px", fontWeight: "600" }}
                      className="text-primary"
                    >
                      👁️ {(weather.timeseries[0].visibility / 1000).toFixed(1)}{" "}
                      km
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        opacity: 0.6,
                        marginBottom: "4px",
                      }}
                      className="text-foreground"
                    >
                      Molntäcke
                    </div>
                    <div
                      style={{ fontSize: "20px", fontWeight: "600" }}
                      className="text-primary"
                    >
                      {getCloudCoverIcon(weather.timeseries[0].cloudCover)}{" "}
                      {weather.timeseries[0].cloudCover}%
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Cards Grid */}
              <div
                style={{
                  display: "grid",
                  gap: "16px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                }}
              >
                {weather.timeseries.slice(0, 6).map((s, i) => (
                  <div
                    key={i}
                    style={{ position: "relative", overflow: "hidden" }}
                    className="bg-card rounded-md p-5 border border-border shadow-md"
                  >
                    {/* Decorative accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />

                    <div
                      style={{
                        fontSize: "13px",
                        opacity: 0.6,
                        marginBottom: "12px",
                        fontWeight: "500",
                      }}
                      className="text-foreground"
                    >
                      {formatDateTimeShort(s.validTime)}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "42px",
                          fontWeight: "700",
                          lineHeight: 1,
                        }}
                        className="text-primary"
                      >
                        {s.temp}°C
                      </div>
                      <div
                        className="bg-secondary"
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                        aria-hidden="false"
                        title={translateSummary(s.summary)}
                      >
                        <span
                          role="img"
                          aria-label={translateSummary(s.summary)}
                        >
                          {getWeatherEmoji(s.summary)}
                        </span>
                      </div>
                    </div>

                    {/* Wind and Precipitation */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        paddingBottom: "12px",
                        marginBottom: "12px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            opacity: 0.6,
                            marginBottom: "4px",
                          }}
                          className="text-foreground"
                        >
                          Vind
                        </div>
                        <div
                          style={{ fontSize: "15px", fontWeight: "600" }}
                          className="text-foreground"
                        >
                          {s.windSpeed} m/s {getWindDirection(s.windDirection)}
                        </div>
                        <div
                          style={{ fontSize: "12px", opacity: 0.6 }}
                          className="text-foreground"
                        >
                          Vindbyar: {s.windGust} m/s
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            opacity: 0.6,
                            marginBottom: "4px",
                          }}
                          className="text-foreground"
                        >
                          Nederbörd
                        </div>
                        <div
                          style={{ fontSize: "15px", fontWeight: "600" }}
                          className="text-foreground"
                        >
                          {s.precipitationMean} mm
                        </div>
                        <div
                          style={{ fontSize: "12px", opacity: 0.6 }}
                          className="text-foreground"
                        >
                          {s.precipitationCategory}
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        fontSize: "13px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{ opacity: 0.6 }}
                          className="text-foreground"
                        >
                          Luftfuktighet:
                        </span>
                        <span
                          style={{ fontWeight: "600" }}
                          className="text-foreground"
                        >
                          {s.humidity}%
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{ opacity: 0.6 }}
                          className="text-foreground"
                        >
                          Molntäcke:
                        </span>
                        <span
                          style={{ fontWeight: "600" }}
                          className="text-foreground"
                        >
                          {s.cloudCover}%
                        </span>
                      </div>
                      {s.thunderProbability > 0 && (
                        <div
                          className={`${
                            getThunderRiskLevel(s.thunderProbability).bgClass
                          } p-2 rounded-md flex justify-between items-center`}
                          style={{ gridColumn: "1 / -1" }}
                        >
                          <span
                            style={{ opacity: 0.8 }}
                            className="text-foreground"
                          >
                            ⚡ Åskerisk:
                          </span>
                          <span
                            className={`${
                              getThunderRiskLevel(s.thunderProbability)
                                .textClass
                            } font-semibold`}
                          >
                            {getThunderRiskLevel(s.thunderProbability).text} (
                            {s.thunderProbability}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ny: 10-dagarsprognos - temperatur vid kl. 12 + kommentar */}
              {tenDayMidday.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                    className="text-primary"
                  >
                    10-dagarsprognos — temperatur vid kl. 12
                  </h3>

                  {/* Lista: designad på samma sätt som morgonrapporten */}
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {tenDayMidday.map((s: Series, idx: number) => {
                      return (
                        <div
                          key={idx}
                          className="bg-card rounded-md p-4 border border-border shadow-sm"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                            }}
                          >
                            <div
                              style={{ fontSize: 13, opacity: 0.8 }}
                              className="text-foreground"
                            >
                              {formatDateShort(s.validTime)}
                            </div>
                            <div
                              style={{ fontSize: 12, opacity: 0.7 }}
                              className="text-foreground"
                            >
                              {formatTime(s.validTime)}
                            </div>
                          </div>

                          <div style={{ fontSize: 48, lineHeight: 1 }}>
                            {getWeatherEmoji(s.summary)}
                          </div>

                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div
                              style={{
                                fontSize: 24,
                                fontWeight: 700,
                                marginBottom: 4,
                              }}
                              className="text-primary"
                            >
                              {typeof s.temp === "number" ? `${s.temp}°C` : "—"}
                            </div>
                            <div
                              style={{ fontSize: 14, opacity: 0.85 }}
                              className="text-foreground"
                            >
                              {translateSummary(s.summary)}
                            </div>
                          </div>

                          <div
                            style={{
                              marginLeft: "auto",
                              textAlign: "right",
                              display: "flex",
                              flexDirection: "column",
                              gap: 6,
                            }}
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
                              {typeof s.temp === "number" ? `${s.temp}°C` : "—"}
                            </div>
                            <div
                              style={{ fontSize: 13, opacity: 0.85 }}
                              className="text-foreground"
                            >
                              Nederbörd:{" "}
                              <strong>{s.precipitationMean ?? "—"} mm</strong>
                            </div>
                            <div>
                              <WeatherComment
                                temp={s.temp}
                                summary={translateSummary(s.summary)}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
