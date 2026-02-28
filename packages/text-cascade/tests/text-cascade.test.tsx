import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { createRef } from "react";
import { TextCascade } from "../src/text-cascade";
import type { TextCascadeHandle } from "../src/types";

vi.mock("../src/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}));

describe("TextCascade", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("hover enter/exit works on the wrapper", () => {
    const { container } = render(<TextCascade hoverText="Hello" />);

    const wrapper = container.firstElementChild!;

    act(() => {
      fireEvent.mouseEnter(wrapper);
    });

    const phaseEl = container.querySelector("[data-phase]");
    expect(phaseEl?.getAttribute("data-phase")).toBe("entering");

    act(() => {
      fireEvent.mouseLeave(wrapper);
    });

    expect(phaseEl?.getAttribute("data-phase")).toBe("exiting");
  });

  it("click triggers onClick + confirm when clickText is provided", () => {
    const onClick = vi.fn();
    const { container } = render(
      <TextCascade
        hoverText="Copy"
        clickText="Copied"
        onClick={onClick}
      />
    );

    const wrapper = container.firstElementChild!;

    // Enter first
    act(() => {
      fireEvent.mouseEnter(wrapper);
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Click
    act(() => {
      fireEvent.click(wrapper);
    });

    expect(onClick).toHaveBeenCalledTimes(1);

    const phaseEl = container.querySelector("[data-phase]");
    expect(phaseEl?.getAttribute("data-phase")).toBe("glowing");
  });

  it("trigger render prop receives clicked state", () => {
    const { container } = render(
      <TextCascade
        hoverText="Copy"
        clickText="Copied"
        onClick={() => {}}
        trigger={({ clicked }) => (
          <span data-testid="trigger" data-clicked={clicked} />
        )}
      />
    );

    const trigger = container.querySelector("[data-testid='trigger']");
    expect(trigger?.getAttribute("data-clicked")).toBe("false");

    const wrapper = container.firstElementChild!;

    // Enter + wait for visible
    act(() => {
      fireEvent.mouseEnter(wrapper);
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Click to confirm
    act(() => {
      fireEvent.click(wrapper);
    });

    // Advance through glow frames
    act(() => {
      vi.advanceTimersByTime(400);
    });

    const updatedTrigger = container.querySelector(
      "[data-testid='trigger']"
    );
    expect(updatedTrigger?.getAttribute("data-clicked")).toBe("true");
  });

  it("lifecycle callbacks fire correctly", () => {
    const onEnter = vi.fn();
    const onExit = vi.fn();
    const onConfirm = vi.fn();

    const ref = createRef<TextCascadeHandle>();
    render(
      <TextCascade
        hoverText="Hi"
        ref={ref}
        onEnter={onEnter}
        onExit={onExit}
        onConfirm={onConfirm}
      />
    );

    // Enter via ref
    act(() => {
      ref.current!.enter();
    });
    expect(onEnter).toHaveBeenCalledTimes(1);

    // Wait for visible
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Exit via ref
    act(() => {
      ref.current!.exit();
    });
    expect(onExit).not.toHaveBeenCalled();

    // Wait for exit to complete
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it("imperative handle exposes phase, isExpanded, isConfirmed", () => {
    const ref = createRef<TextCascadeHandle>();
    render(<TextCascade hoverText="Hi" ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current!.phase).toBe("idle");
    expect(ref.current!.isExpanded).toBe(false);
    expect(ref.current!.isConfirmed).toBe(false);

    act(() => {
      ref.current!.enter();
    });

    expect(ref.current!.phase).toBe("entering");
    expect(ref.current!.isExpanded).toBe(true);
  });

  it("hover-only mode works without clickText", () => {
    const { container } = render(<TextCascade hoverText="Hello" />);
    const wrapper = container.firstElementChild!;

    act(() => {
      fireEvent.mouseEnter(wrapper);
    });
    const phaseEl = container.querySelector("[data-phase]");
    expect(phaseEl?.getAttribute("data-phase")).toBe("entering");

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(phaseEl?.getAttribute("data-phase")).toBe("visible");

    act(() => {
      fireEvent.mouseLeave(wrapper);
    });
    expect(phaseEl?.getAttribute("data-phase")).toBe("exiting");
  });

  it("as prop changes the root element", () => {
    const { container } = render(
      <TextCascade hoverText="Hello" as="button" />
    );
    expect(container.firstElementChild!.tagName).toBe("BUTTON");
  });

  it("as='div' renders a div", () => {
    const { container } = render(
      <TextCascade hoverText="Hello" as="div" />
    );
    expect(container.firstElementChild!.tagName).toBe("DIV");
  });

  it("default as renders a span", () => {
    const { container } = render(<TextCascade hoverText="Hello" />);
    expect(container.firstElementChild!.tagName).toBe("SPAN");
  });
});
