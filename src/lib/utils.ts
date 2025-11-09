import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Använd denna hjälpfunktion för att kombinera och optimera CSS-klasser med Tailwind CSS och clsx
