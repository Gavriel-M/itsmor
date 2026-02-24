export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export const EASE_OUT_EXPO_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

export const EASE_OUT_FAST: [number, number, number, number] = [0, 0, 0.2, 1];

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeInQuad(t: number): number {
  return t * t;
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}
