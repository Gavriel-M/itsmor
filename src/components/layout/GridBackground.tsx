export default function GridBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none select-none">
      {/* Vertical Lines */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `linear-gradient(to right, #E5E5E5 1px, transparent 1px)`,
          backgroundSize: "clamp(40px, 10vw, 120px) 100%",
        }}
      />
      {/* Horizontal Lines */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, #E5E5E5 1px, transparent 1px)`,
          backgroundSize: "100% clamp(40px, 10vw, 120px)",
        }}
      />
    </div>
  );
}
