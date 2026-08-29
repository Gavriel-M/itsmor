import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TextCascadeRenderer } from "../src/text-cascade-renderer";
import type { TextCascadeState } from "../src/types";
import type { ReactElement } from "react";

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
    const { container } = render(
      <TextCascadeRenderer state={state} stableWidth="6ch" />
    );

    const chars = container.querySelectorAll(".text-cascade");
    expect(chars).toHaveLength(2);
    expect(chars[0].textContent).toBe("H");
    expect(chars[1].textContent).toBe("i");
  });

  it("sets data-phase on container", () => {
    const state = createMockState({ phase: "entering" });
    const { container } = render(
      <TextCascadeRenderer state={state} stableWidth="6ch" />
    );

    const outer = container.querySelector("[data-phase]");
    expect(outer?.getAttribute("data-phase")).toBe("entering");
  });

  it("sets data-active on active characters during entering", () => {
    const state = createMockState({
      phase: "entering",
      displayText: "Hi",
      isExpanded: true,
    });
    const { container } = render(
      <TextCascadeRenderer state={state} stableWidth="6ch" />
    );

    const chars = container.querySelectorAll(".text-cascade");
    expect(chars[0].hasAttribute("data-active")).toBe(true);
    expect(chars[1].hasAttribute("data-active")).toBe(true);
  });

  it("does not set data-active on characters when idle", () => {
    const state = createMockState({ phase: "idle", displayText: "Hi" });
    const { container } = render(
      <TextCascadeRenderer state={state} stableWidth="6ch" />
    );

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
    const { container } = render(
      <TextCascadeRenderer state={state} stableWidth="6ch" />
    );

    const chars = container.querySelectorAll(".text-cascade");
    expect(
      (chars[0] as HTMLElement).style.getPropertyValue("--char-delay")
    ).toBe("0ms");
    expect(
      (chars[1] as HTMLElement).style.getPropertyValue("--char-delay")
    ).toBe("60ms");
    expect(
      (chars[2] as HTMLElement).style.getPropertyValue("--char-delay")
    ).toBe("120ms");

    // Exit delays are reverse order
    expect(
      (chars[0] as HTMLElement).style.getPropertyValue("--exit-delay")
    ).toBe("120ms");
    expect(
      (chars[1] as HTMLElement).style.getPropertyValue("--exit-delay")
    ).toBe("60ms");
    expect(
      (chars[2] as HTMLElement).style.getPropertyValue("--exit-delay")
    ).toBe("0ms");
  });

  it("applies glowClassName when glowCharIndex matches", () => {
    const state = createMockState({
      phase: "glowing",
      displayText: "Hi",
      glowCharIndex: 1,
      isExpanded: true,
    });
    const { container } = render(
      <TextCascadeRenderer
        state={state}
        stableWidth="6ch"
        glowClassName="glow-test"
      />
    );

    const chars = container.querySelectorAll(".text-cascade");
    expect(chars[0].classList.contains("glow-test")).toBe(false);
    expect(chars[1].classList.contains("glow-test")).toBe(true);
  });

  it("uses stableWidth for width when dynamicWidth is off", () => {
    const collapsed = render(
      <TextCascadeRenderer
        state={createMockState({ phase: "idle", isExpanded: false })}
        stableWidth="7ch"
      />
    ).container.querySelector("[data-phase]") as HTMLElement;
    expect(collapsed.style.width).toBe("7ch");

    // Width is unconditional without dynamicWidth — expanding does not change it
    const expanded = render(
      <TextCascadeRenderer
        state={createMockState({
          phase: "visible",
          isExpanded: true,
          displayText: "Hello",
        })}
        stableWidth="7ch"
      />
    ).container.querySelector("[data-phase]") as HTMLElement;
    expect(expanded.style.width).toBe("7ch");
  });

  it("derives width from displayText when dynamicWidth is on", () => {
    // Collapsed: "0" — jsdom normalises the length to "0px"
    const collapsed = render(
      <TextCascadeRenderer
        state={createMockState({ phase: "idle", isExpanded: false })}
        stableWidth="20ch"
        dynamicWidth
      />
    ).container.querySelector("[data-phase]") as HTMLElement;
    expect(collapsed.style.width).toBe("0px");

    // Expanded: displayText length + 2, ignoring stableWidth
    const expanded = render(
      <TextCascadeRenderer
        state={createMockState({
          phase: "visible",
          isExpanded: true,
          displayText: "Hello",
        })}
        stableWidth="20ch"
        dynamicWidth
      />
    ).container.querySelector("[data-phase]") as HTMLElement;
    expect(expanded.style.width).toBe("7ch");
  });

  describe("glow / weight switches", () => {
    const glowing = () =>
      createMockState({
        phase: "glowing",
        displayText: "Hi",
        glowCharIndex: 1,
        isExpanded: true,
      });
    const outerOf = (ui: ReactElement) =>
      render(ui).container.querySelector("[data-phase]") as HTMLElement;

    it("glow alone enables the animation and leaves the colour to CSS", () => {
      const outer = outerOf(
        <TextCascadeRenderer state={glowing()} stableWidth="6ch" glow />
      );

      expect(outer.hasAttribute("data-glow")).toBe(true);
      // No inline variable, so an external --cascade-glow-color is what applies
      expect(outer.style.getPropertyValue("--cascade-glow-color")).toBe("");

      const chars = outer.querySelectorAll(".text-cascade");
      expect((chars[1] as HTMLElement).style.color).toBe("");
    });

    it("glowColor alone implies the switch and sets the variable", () => {
      const outer = outerOf(
        <TextCascadeRenderer
          state={glowing()}
          stableWidth="6ch"
          glowColor="#ffd700"
        />
      );

      expect(outer.hasAttribute("data-glow")).toBe(true);
      expect(outer.style.getPropertyValue("--cascade-glow-color")).toBe(
        "#ffd700"
      );
    });

    it("glow={false} suppresses the effect even when glowColor is set", () => {
      const outer = outerOf(
        <TextCascadeRenderer
          state={glowing()}
          stableWidth="6ch"
          glow={false}
          glowColor="#ffd700"
        />
      );

      expect(outer.hasAttribute("data-glow")).toBe(false);
      const chars = outer.querySelectorAll(".text-cascade");
      expect((chars[1] as HTMLElement).style.color).toBe("");
    });

    it("weightPulse alone enables the pulse and leaves the weight to CSS", () => {
      const outer = outerOf(
        <TextCascadeRenderer state={glowing()} stableWidth="6ch" weightPulse />
      );

      expect(outer.hasAttribute("data-cascade-weight")).toBe(true);
      expect(outer.style.getPropertyValue("--cascade-weight")).toBe("");

      const chars = outer.querySelectorAll(".text-cascade");
      expect((chars[1] as HTMLElement).style.fontWeight).toBe("");
    });

    it("cascadeWeight alone implies the switch and sets the variable", () => {
      const outer = outerOf(
        <TextCascadeRenderer
          state={glowing()}
          stableWidth="6ch"
          cascadeWeight={600}
        />
      );

      expect(outer.hasAttribute("data-cascade-weight")).toBe(true);
      expect(outer.style.getPropertyValue("--cascade-weight")).toBe("600");
    });

    it("weightPulse={false} suppresses the pulse even when cascadeWeight is set", () => {
      const outer = outerOf(
        <TextCascadeRenderer
          state={glowing()}
          stableWidth="6ch"
          weightPulse={false}
          cascadeWeight={600}
        />
      );

      expect(outer.hasAttribute("data-cascade-weight")).toBe(false);
      const chars = outer.querySelectorAll(".text-cascade");
      expect((chars[1] as HTMLElement).style.fontWeight).toBe("");
    });

    it("omits the empty class attribute when no class props are given", () => {
      const outer = outerOf(
        <TextCascadeRenderer state={glowing()} stableWidth="6ch" />
      );

      expect(outer.hasAttribute("class")).toBe(false);
      const chars = outer.querySelectorAll(".text-cascade");
      // No trailing space on a non-glowing character
      expect(chars[0].getAttribute("class")).toBe("text-cascade");
      expect(chars[1].getAttribute("class")).toBe("text-cascade");
    });
  });
});
