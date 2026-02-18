interface SeparatedLogoProps {
  className?: string;
  isOpen: boolean;
  rotation?: number;
  smoothTransition?: boolean; // true for node snaps, false for cursor tracking
}

export const SeparatedLogo = ({
  className = "",
  isOpen,
  rotation = 0,
  smoothTransition = true,
}: SeparatedLogoProps) => {
  const transforms = {
    leftG: isOpen ? "translate(-8px, 0)" : "translate(0, 0)",
    rightG: isOpen ? "translate(8px, 0)" : "translate(0, 0)",
    topDiamond: isOpen ? "translate(0, -12px)" : "translate(0, 0)",
    bottomTriangle: isOpen ? "translate(0, 10px)" : "translate(0, 0)",
  };

  // When cursor-tracking drives rotation every frame, CSS transition
  // fights the lerp and causes visible stepping. Only use CSS transition
  // for discrete snaps (node hover).
  const transitionStyle = smoothTransition
    ? "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
    : "none";

  return (
    <svg
      viewBox="0 0 87 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      overflow="visible"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: transitionStyle,
      }}
    >
      <g id="logo-group">
        <path
          id="right-g"
          d="M55.3687 34.5026L43.8687 53.5026V41.5026L55.3687 22.0026L85.8687 74.5026H55.3687L45.8687 58.5026L55.3687 42.5026L67.8687 64.0026H61.8687L55.8687 54.0026L52.8687 58.5026L58.8687 68.0026H74.8687L55.3687 34.5026Z"
          fill="currentColor"
          stroke="currentColor"
          style={{
            transform: transforms.rightG,
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s",
          }}
        />
        <path
          id="left-g"
          d="M31.3687 34.5026L42.8687 53.5026V41.5026L31.3687 22.0026L0.868744 74.5026H31.3687L40.8687 58.5026L31.3687 42.5026L18.8687 64.0026H24.8687L30.8687 54.0026L33.8687 58.5026L27.8687 68.0026H11.8687L31.3687 34.5026Z"
          fill="currentColor"
          stroke="currentColor"
          style={{
            transform: transforms.leftG,
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s",
          }}
        />
        <path
          id="top-diamond"
          d="M53.0307 17.796L43.3687 1.00262L33.7068 17.796L43.3687 33.9971L53.0307 17.796Z"
          fill="currentColor"
          stroke="currentColor"
          style={{
            transform: transforms.topDiamond,
            transition:
              "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.65s",
          }}
        />
        <path
          id="bottom-triangle"
          d="M50.8687 75.0026L43.3687 62.0026L35.8687 75.0026H50.8687Z"
          fill="currentColor"
          stroke="currentColor"
          style={{
            transform: transforms.bottomTriangle,
            transition:
              "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s",
          }}
        />
      </g>
    </svg>
  );
};
