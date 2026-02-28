import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TextCascadeRenderer } from "../src/text-cascade-renderer";
import type { TextCascadeState } from "../src/types";

function createMockState(
  overrides: Partial<TextCascadeState> = {}
): TextCascadeState {
  return {
    phase: "idle",
    displayText: "Test",
    revealCount: 0,
    glowCharIndex: -1,
    charStepMs: 60,
    isExpanded: false,
    isConfirmed: false,
    enter: () => {},
    exit: () => {},
    confirm: () => {},
    ...overrides,
  };
}

describe("TextCascadeRenderer", () => {
  it("renders one span per character with text-cascade class", () => {
    const state = createMockState({ displayText: "Hi" });
    const { container } = render(<TextCascadeRenderer state={state} />);

    const chars = container.querySelectorAll(".text-cascade");
    expect(chars).toHaveLength(2);
    expect(chars[0].textContent).toBe("H");
    expect(chars[1].textContent).toBe("i");
  });

  it("sets data-phase on container", () => {
    const state = createMockState({ phase: "entering" });
    const { container } = render(<TextCascadeRenderer state={state} />);

    const outer = container.querySelector("[data-phase]");
    expect(outer?.getAttribute("data-phase")).toBe("entering");
  });

  it("sets data-active on active characters during entering", () => {
    const state = createMockState({
      phase: "entering",
      displayText: "Hi",
      isExpanded: true,
    });
    const { container } = render(<TextCascadeRenderer state={state} />);

    const chars = container.querySelectorAll(".text-cascade");
    expect(chars[0].hasAttribute("data-active")).toBe(true);
    expect(chars[1].hasAttribute("data-active")).toBe(true);
  });

  it("does not set data-active on characters when idle", () => {
    const state = createMockState({ phase: "idle", displayText: "Hi" });
    const { container } = render(<TextCascadeRenderer state={state} />);

    const chars = container.querySelectorAll(".text-cascade");
    expect(chars[0].hasAttribute("data-active")).toBe(false);
    expect(chars[1].hasAttribute("data-active")).toBe(false);
  });

  it("sets --char-delay and --exit-delay CSS custom properties", () => {
    const state = createMockState({
      phase: "entering",
      displayText: "ABC",
      charStepMs: 60,
      revealCount: 3,
      isExpanded: true,
    });
    const { container } = render(<TextCascadeRenderer state={state} />);

    const chars = container.querySelectorAll(".text-cascade");
    expect((chars[0] as HTMLElement).style.getPropertyValue("--char-delay")).toBe("0ms");
    expect((chars[1] as HTMLElement).style.getPropertyValue("--char-delay")).toBe("60ms");
    expect((chars[2] as HTMLElement).style.getPropertyValue("--char-delay")).toBe("120ms");

    // Exit delays are reverse order
    expect((chars[0] as HTMLElement).style.getPropertyValue("--exit-delay")).toBe("120ms");
    expect((chars[1] as HTMLElement).style.getPropertyValue("--exit-delay")).toBe("60ms");
    expect((chars[2] as HTMLElement).style.getPropertyValue("--exit-delay")).toBe("0ms");
  });

  it("applies glowClassName when glowCharIndex matches", () => {
    const state = createMockState({
      phase: "glowing",
      displayText: "Hi",
      glowCharIndex: 1,
      isExpanded: true,
    });
    const { container } = render(
      <TextCascadeRenderer state={state} glowClassName="glow-test" />
    );

    const chars = container.querySelectorAll(".text-cascade");
    expect(chars[0].classList.contains("glow-test")).toBe(false);
    expect(chars[1].classList.contains("glow-test")).toBe(true);
  });

  it("sets maxWidth to 0 when idle", () => {
    const state = createMockState({ phase: "idle", isExpanded: false });
    const { container } = render(<TextCascadeRenderer state={state} />);

    const outer = container.querySelector("[data-phase]") as HTMLElement;
    expect(outer.style.maxWidth).toBe("0");
  });

  it("sets maxWidth to expandedWidth when expanded", () => {
    const state = createMockState({
      phase: "visible",
      isExpanded: true,
      displayText: "Hello",
    });
    const { container } = render(
      <TextCascadeRenderer state={state} expandedWidth="5rem" />
    );

    const outer = container.querySelector("[data-phase]") as HTMLElement;
    expect(outer.style.maxWidth).toBe("5rem");
  });
});
