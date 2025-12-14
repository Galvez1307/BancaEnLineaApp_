export const fetchRate = async (
  base: string,
  target: string
): Promise<number | null> => {
  const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(
    base
  )}&symbols=${encodeURIComponent(target)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`fetchRate HTTP error: ${res.status}`);
      return null;
    }
    const json = await res.json();
    const rate = json?.rates?.[target];
    if (typeof rate !== "number") {
      console.warn("fetchRate: invalid rate response", json);
      return null;
    }
    return rate;
  } catch (err) {
    console.warn("fetchRate error:", err);
    return null;
  }
};
