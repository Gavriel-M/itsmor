import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTextCascade } from "../src/use-text-cascade";
import type { CascadeGlowTransition } from "../src/types";

// Mock reduced motion to false by default
vi.mock("../src/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}));

import { usePrefersReducedMotion } from "../src/use-prefers-reduced-motion";
const mockPrefersReduced = vi.mocked(usePrefersReducedMotion);

const GLOW_TRANSITION: CascadeGlowTransition = {
  frames: [
    { text: "Copy", glowIndex: 0 },
    { text: "Copy", glowIndex: 1 },
    { text: "Copy", glowIndex: 2 },
    { text: "Copi", glowIndex: 3 },
    { text: "Copie", glowIndex: 4 },
    { text: "Copied", glowIndex: 5 },
  ],
  confirmedText: "Copied",
};

describe("useTextCascade", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockPrefersReduced.mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("has correct initial state", () => {
    const { result } = renderHook(() =>
      useTextCascade({ text: "Hello" })
    );
    expect(result.current.phase).toBe("idle");
    expect(result.current.isExpanded).toBe(false);
    expect(result.current.revealCount).toBe(0);
    expect(result.current.displayText).toBe("Hello");
  });

  it("enter transitions to entering then visible", () => {
    const { result } = renderHook(() =>
      useTextCascade({ text: "Hi" })
    );

    act(() => result.current.enter());
    expect(result.current.phase).toBe("entering");
    expect(result.current.isExpanded).toBe(true);

    // Wait for enter duration: (2-1)*60 + 150 = 210ms
    act(() => vi.advanceTimersByTime(210));
    expect(result.current.phase).toBe("visible");
    expect(result.current.revealCount).toBe(2);
  });

  it("exit from visible transitions to exiting then idle", () => {
    const { result } = renderHook(() =>
      useTextCascade({ text: "Hi" })
    );

    // Enter then wait for visible
    act(() => result.current.enter());
    act(() => vi.advanceTimersByTime(210));
    expect(result.current.phase).toBe("visible");

    // Exit
    act(() => result.current.exit());
    expect(result.current.phase).toBe("exiting");

    // Wait for exit duration: (2-1)*60 + 150 = 210ms
    act(() => vi.advanceTimersByTime(210));
    expect(result.current.phase).toBe("idle");
    expect(result.current.revealCount).toBe(0);
  });

  it("mid-enter exit gracefully interrupts", () => {
    const { result } = renderHook(() =>
      useTextCascade({ text: "Hello" })
    );

    act(() => result.current.enter());
    expect(result.current.phase).toBe("entering");

    // Exit immediately while entering
    act(() => {
      vi.advanceTimersByTime(30); // small elapsed time
      result.current.exit();
    });
    expect(result.current.phase).toBe("exiting");

    // Should eventually return to idle
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.phase).toBe("idle");
  });

  it("confirm flow: visible → glowing → confirmed → exiting → idle", () => {
    const { result } = renderHook(() =>
      useTextCascade({ text: "Copy", glowTransition: GLOW_TRANSITION })
    );

    // Enter + wait for visible
    act(() => result.current.enter());
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.phase).toBe("visible");

    // Confirm
    act(() => result.current.confirm());
    expect(result.current.phase).toBe("glowing");

    // Advance through glow frames (6 frames * 60ms = 360ms)
    act(() => vi.advanceTimersByTime(360));
    expect(result.current.phase).toBe("confirmed");
    expect(result.current.isConfirmed).toBe(true);
    expect(result.current.displayText).toBe("Copied");

    // Wait for confirmHoldMs (1500ms) then exit duration
    act(() => vi.advanceTimersByTime(1500));
    expect(result.current.phase).toBe("exiting");

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.phase).toBe("idle");
  });

  it("reduced motion: enter skips to visible instantly", () => {
    mockPrefersReduced.mockReturnValue(true);

    const { result } = renderHook(() =>
      useTextCascade({ text: "Hi" })
    );

    act(() => result.current.enter());
    expect(result.current.phase).toBe("visible");
    expect(result.current.revealCount).toBe(2);
  });

  it("reduced motion: exit skips to idle instantly", () => {
    mockPrefersReduced.mockReturnValue(true);

    const { result } = renderHook(() =>
      useTextCascade({ text: "Hi" })
    );

    act(() => result.current.enter());
    expect(result.current.phase).toBe("visible");

    act(() => result.current.exit());
    expect(result.current.phase).toBe("idle");
    expect(result.current.revealCount).toBe(0);
  });

  it("cleans up timers on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");

    const { result, unmount } = renderHook(() =>
      useTextCascade({ text: "Hello" })
    );

    act(() => result.current.enter());
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });
});
