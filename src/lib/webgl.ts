"use client";

import { useEffect, useState } from "react";

let cached: boolean | null = null;

function probe(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    cached = gl !== null;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return cached;
  } catch {
    cached = false;
    return cached;
  }
}

/**
 * `null` until the first client effect runs, because the export is prerendered
 * and the probe needs a DOM.
 */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => setSupported(probe()), []);
  return supported;
}
