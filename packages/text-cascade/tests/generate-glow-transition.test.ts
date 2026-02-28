import { describe, it, expect } from "vitest";
import { generateGlowTransition } from "../src/generate-glow-transition";

describe("generateGlowTransition", () => {
  it("same-length morph produces correct frames", () => {
    const result = generateGlowTransition("Save", "Done");
    expect(result.frames).toHaveLength(4);
    expect(result.confirmedText).toBe("Done");
    expect(result.frames[0]).toEqual({ text: "Dave", glowIndex: 0 });
    expect(result.frames[1]).toEqual({ text: "Dove", glowIndex: 1 });
    expect(result.frames[2]).toEqual({ text: "Done", glowIndex: 2 });
    expect(result.frames[3]).toEqual({ text: "Done", glowIndex: 3 });
  });

  it("growing text: 'Copy' → 'Copied' matches COPY_CONFIRM output", () => {
    const result = generateGlowTransition("Copy", "Copied");
    expect(result.frames).toHaveLength(6);
    expect(result.confirmedText).toBe("Copied");
    expect(result.frames[0]).toEqual({ text: "Copy", glowIndex: 0 });
    expect(result.frames[1]).toEqual({ text: "Copy", glowIndex: 1 });
    expect(result.frames[2]).toEqual({ text: "Copy", glowIndex: 2 });
    expect(result.frames[3]).toEqual({ text: "Copi", glowIndex: 3 });
    expect(result.frames[4]).toEqual({ text: "Copie", glowIndex: 4 });
    expect(result.frames[5]).toEqual({ text: "Copied", glowIndex: 5 });
  });

  it("shrinking text produces correct frames", () => {
    const result = generateGlowTransition("Copied", "Copy");
    expect(result.frames).toHaveLength(6);
    expect(result.confirmedText).toBe("Copy");
    expect(result.frames[0]).toEqual({ text: "Copied", glowIndex: 0 });
    expect(result.frames[1]).toEqual({ text: "Copied", glowIndex: 1 });
    expect(result.frames[2]).toEqual({ text: "Copied", glowIndex: 2 });
    expect(result.frames[3]).toEqual({ text: "Copyed", glowIndex: 3 });
    expect(result.frames[4]).toEqual({ text: "Copyd", glowIndex: 4 });
    expect(result.frames[5]).toEqual({ text: "Copy", glowIndex: 3 });
  });

  it("identical text produces identity frames", () => {
    const result = generateGlowTransition("Same", "Same");
    expect(result.frames).toHaveLength(4);
    expect(result.confirmedText).toBe("Same");
    result.frames.forEach((frame, i) => {
      expect(frame.text).toBe("Same");
      expect(frame.glowIndex).toBe(i);
    });
  });

  it("single char texts work", () => {
    const result = generateGlowTransition("A", "B");
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0]).toEqual({ text: "B", glowIndex: 0 });
    expect(result.confirmedText).toBe("B");
  });
});
