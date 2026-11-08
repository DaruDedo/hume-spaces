export const oilWeights = [50, 100, 250, 500, 1000] as const;
export const oilWeightLabel = (grams: number) => grams === 1000 ? '1 kg' : grams + ' g';
