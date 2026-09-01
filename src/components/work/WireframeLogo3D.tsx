"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import Logo from "@/components/ui/Logo";
import { Center } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";

/**
 * LogoPart Interface
 *
 * Represents a single extruded part of the logo with its wireframe edges.
 * Each part can be animated independently.
 */
interface LogoPart {
  id: string;
  extrudedGeometry: THREE.ExtrudeGeometry;
  edgesGeometry: THREE.EdgesGeometry;
}

/**
 * LogoMesh Component
 *
 * Loads and renders the logo SVG as three separate 3D extruded wireframes.
 * Each part (top-diamond, double-g, bottom-pyramid) is processed independently
 * to enable individual animations.
 *
 * Creates a dual-layer effect per part:
 * 1. Semi-transparent base mesh for volume
 * 2. Glowing edge lines for the wireframe aesthetic
 *
 * Animation Phases:
 * - drawing: Lines draw in sequentially (0-2s)
 * - settling: Fade to full opacity (2-2.5s)
 * - rotating: Continuous rotation (2.5s+)
 */
function LogoMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [phase, setPhase] = useState<"drawing" | "settling" | "rotating">(
    "drawing"
  );
  const [settlingProgress, setSettlingProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // Load the SVG file
  const svgData = useLoader(SVGLoader, "/logo-mark.svg");

  // Process each SVG path into separate extruded 3D geometries
  const logoParts = useMemo<LogoPart[]>(() => {
    if (!svgData) {
      return [];
    }

    const parts: LogoPart[] = [];

    // Process each path in the SVG independently
    svgData.paths.forEach((path) => {
      // Extract the path ID from SVG metadata
      const pathId = path.userData?.node?.id || `path-${parts.length}`;

      // Convert the path to THREE.js shapes
      const shapes = SVGLoader.createShapes(path);

      if (shapes.length === 0) {
        return;
      }

      // Create extruded geometry for this specific path
      // Note: Multiple shapes from one path are combined into one geometry
      const extrudeSettings = {
        depth: 20,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 0.5,
        bevelSegments: 1,
      };

      // If there are multiple shapes in this path, we need to handle them
      // Create a geometry for each shape and merge them for this path
      if (shapes.length === 1) {
        const extrudedGeometry = new THREE.ExtrudeGeometry(
          shapes[0],
          extrudeSettings
        );
        // DO NOT center individual geometries - preserves relative positions from SVG

        const edgesGeometry = new THREE.EdgesGeometry(extrudedGeometry, 15);

        parts.push({
          id: pathId,
          extrudedGeometry,
          edgesGeometry,
        });
      } else {
        // For multiple shapes in one path, create separate geometries
        shapes.forEach((shape, index) => {
          const extrudedGeometry = new THREE.ExtrudeGeometry(
            shape,
            extrudeSettings
          );
          // DO NOT center individual geometries - preserves relative positions from SVG

          const edgesGeometry = new THREE.EdgesGeometry(extrudedGeometry, 15);

          parts.push({
            id: `${pathId}-${index}`,
            extrudedGeometry,
            edgesGeometry,
          });
        });
      }
    });

    return parts;
  }, [svgData]);

  // Multi-phase animation system
  useFrame((state, delta) => {
    // Lazy initialize start time on first frame
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const elapsed = (Date.now() - startTimeRef.current) / 1000; // Convert to seconds

    // Phase transitions
    if (phase === "drawing" && elapsed >= 2.0) {
      setPhase("settling");
    } else if (phase === "settling" && elapsed >= 2.5) {
      setPhase("rotating");
    }

    // Update animation progress based on phase
    if (phase === "drawing") {
      // Drawing phase: 0 to 2 seconds
      setAnimationProgress(Math.min(elapsed / 2.0, 1));
    } else if (phase === "settling") {
      // Settling phase: 2 to 2.5 seconds
      // Normalize to 0-1 range for this 0.5s phase
      setSettlingProgress(Math.min((elapsed - 2.0) / 0.5, 1));
      setAnimationProgress(1);
    } else {
      // Rotating phase: fully drawn
      setAnimationProgress(1);
      setSettlingProgress(1);
    }

    // Apply rotation only in rotating phase
    if (groupRef.current && phase === "rotating") {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  if (logoParts.length === 0) {
    return null;
  }

  return (
    <group ref={groupRef} scale={[0.1, -0.1, 0.1]}>
      <Center>
        {logoParts.map((part, index) => {
          // Stagger each part's animation
          const staggerDelay = index * 0.15; // 150ms delay between parts
          const partProgress = Math.max(
            0,
            Math.min(
              1,
              (animationProgress - staggerDelay) /
                (1 - staggerDelay * logoParts.length)
            )
          );

          // Calculate opacity based on phase with smooth transitions
          let lineOpacity = 0;

          if (phase === "drawing") {
            // Drawing phase: fade from 0 to 0.85
            lineOpacity = partProgress * 0.85;
          } else if (phase === "settling") {
            // Settling phase: fade from 0.85 to 1.0 smoothly
            // settlingProgress goes from 0 to 1 over the 0.5s settling period
            lineOpacity = 0.85 + settlingProgress * 0.15;
          } else {
            // Rotating phase: stay at full opacity
            lineOpacity = 1.0;
          }

          return (
            <group key={part.id}>
              {/* Child 1: Semi-transparent base mesh for volume */}
              {/* <mesh geometry={part.extrudedGeometry}>
                <meshStandardMaterial
                  color="#B85B40"
                  transparent={true}
                  opacity={0}
                  roughness={1}
                  metalness={0.1}
                />
              </mesh> */}

              {/* Child 2: Glowing edge lines for wireframe effect */}
              <lineSegments geometry={part.edgesGeometry}>
                <lineBasicMaterial
                  color="#004e98"
                  linewidth={1}
                  blending={THREE.AdditiveBlending}
                  transparent={true}
                  opacity={lineOpacity}
                />
              </lineSegments>
            </group>
          );
        })}
      </Center>
    </group>
  );
}

/**
 * WireframeLogo3D Component
 *
 * A 3D rotating wireframe representation of the brand logo mark.
 * Engineered aesthetic with glowing blueprint-style edges.
 *
 * Brand Colors:
 * - Terracotta: #B85B40
 * - Off-white Background: #F2F0E6
 *
 * @example
 * ```tsx
 * <div className="w-full h-96">
 *   <WireframeLogo3D />
 * </div>
 * ```
 */
/**
 * Probed once per page load and cached. `getContext` returning null is silent —
 * the noisy part is three.js reacting to it, which is exactly what this avoids.
 */
let webglSupported: boolean | null = null;

function hasWebGL(): boolean {
  if (webglSupported !== null) return webglSupported;
  try {
    const probe = document.createElement("canvas");
    webglSupported = !!(
      probe.getContext("webgl2") || probe.getContext("webgl")
    );
  } catch {
    webglSupported = false;
  }
  return webglSupported;
}

/**
 * The degraded form: the same mark, flat, in the same lapis the wireframe uses.
 * Decorative and aria-hidden, like the canvas it stands in for.
 */
function FlatLogo() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      aria-hidden="true"
    >
      <Logo className="w-2/3 h-2/3 text-lapis" />
    </div>
  );
}

export default function WireframeLogo3D({ zoom }: { zoom: number }) {
  /*
    Mounting <Canvas> where WebGL is unavailable — a GPU blocklist, a managed
    browser with WebGL off, an old device — makes three.js log two errors and
    throw "Error creating WebGL context". R3F's own `fallback` prop is not
    enough on its own: it catches the throw and draws the fallback, but only
    after three.js has already attempted the context and written to the console,
    so Lighthouse still records errors-in-console. The support check has to come
    first, so the context is never attempted.

    `null` until the effect runs, because the export is prerendered and the
    probe needs a DOM. This element is decorative — z-0, opacity-50, behind the
    text — so one frame without it costs nothing.
  */
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => setSupported(hasWebGL()), []);

  if (supported === null) return null;
  if (!supported) return <FlatLogo />;

  return (
    <Canvas
      /* Second line of defence: a context lost after mount still degrades. */
      fallback={<FlatLogo />}
      orthographic
      camera={{
        zoom,
        position: [0, 20, 100],
        near: 0.1,
        far: 1000,
      }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{
        background: "transparent",
      }}
    >
      {/* Ambient lighting for base illumination */}
      <ambientLight intensity={2} />

      {/* Directional light for depth and definition */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow={false}
      />

      {/* Additional fill light from opposite side */}
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />

      <LogoMesh />
    </Canvas>
  );
}
