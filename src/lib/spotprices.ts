"use server";
import { spotPrices } from "../types/el-price";

export async function getSpotPrices(date: string): Promise<spotPrices> {
  const data = await fetch(`https://spotprices.lexlink.se/espot/${date}`);
  return data.json();
}
