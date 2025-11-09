export interface spotPrices {
  date: string;
  SE1: Se1[];
  SE2: Se2[];
  SE3: Se3[];
  SE4: Se4[];
}

export interface Se1 {
  hour: number;
  price_eur: number;
  price_sek: number;
  kmeans: number;
}

export interface Se2 {
  hour: number;
  price_eur: number;
  price_sek: number;
  kmeans: number;
}

export interface Se3 {
  hour: number;
  price_eur: number;
  price_sek: number;
  kmeans: number;
}

export interface Se4 {
  hour: number;
  price_eur: number;
  price_sek: number;
  kmeans: number;
}
