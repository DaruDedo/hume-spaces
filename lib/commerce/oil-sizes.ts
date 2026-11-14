export const oilWeights = [50, 100, 250, 500, 1000] as const;
export const oilPackPercent = { 50: 120, 100: 115, 250: 110, 500: 105, 1000: 100 } as const;
export const oilPackPrice = (kiloPaise: number, grams: keyof typeof oilPackPercent) =>
  Math.max(1, Math.round(kiloPaise * grams * oilPackPercent[grams] / 100000));
export const oilWeightLabel = (grams: number) => grams === 1000 ? '1 kg' : grams + ' g';
