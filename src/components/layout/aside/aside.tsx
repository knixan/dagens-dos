import * as React from "react";
import MostPopular from "@/components/layout/aside/MostPopular";
import SubscribeNow from "@/components/layout/aside/SubscribeNow";
import TipUs from "@/components/layout/aside/TipUs";
import WeatherAside from "@/components/layout/aside/WeatherAside";
import ElectricityPrices from "@/components/layout/aside/ElectricityPrices";

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

interface PopularItem {
  title: string;
  href?: string;
}

interface AsideProps {
  weather?: WeatherData;
  popularItems?: PopularItem[];
}

export default function Aside({ weather, popularItems }: AsideProps) {
  return (
    <aside className="space-y-8">
      <MostPopular popular={popularItems} />
      <SubscribeNow />
      <TipUs />
      <WeatherAside weather={weather} />
      <ElectricityPrices />
    </aside>
  );
}
