import React, { useEffect, useRef, useState, useCallback } from "react";

interface LetterCoord {
  x: number;
  y: number;
  yTop: number;
}

export default function CinematicLogoAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  
  // SVG ref for the golden reel
  const rollRef = useRef<SVGGElement>(null);

  // Layout & Measurement
  const [coords, setCoords] = useState<LetterCoord[]>([]);
  const [layoutReady, setLayoutReady] = useState<boolean>(false);

  // Letter contents
  const firstWord = ["F", "I", "L", "M"];
  const secondWord = ["D", "A", "P", "P", "A"];
  const allLetters = [...firstWord, ...secondWord];

  // Track the timestamp when each letter was triggered in the current loop
  const letterTriggerTimes = useRef<number[]>(Array(9).fill(-1));

  // 1. Measure letter positions relative to container
  const measureCoords = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const measured: LetterCoord[] = [];
    allLetters.forEach((_, i) => {
      const el = letterRefs.current[i];
      if (el) {
        const elRect = el.getBoundingClientRect();
        // Calculate center X, center Y, and top Y relative to the container
        const x = elRect.left - containerRect.left + elRect.width / 2;
        const y = elRect.top - containerRect.top + elRect.height / 2;
        const yTop = elRect.top - containerRect.top;
        measured.push({ x, y, yTop });
      }
    });

    if (measured.length === 9) {
      setCoords(measured);
      setLayoutReady(true);
    }
  }, []);

  useEffect(() => {
    // Initial measurement after layout paint
    const timer = setTimeout(() => {
      measureCoords();
    }, 150);

    window.addEventListener("resize", measureCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureCoords);
    };
  }, [measureCoords]);

  // Easing function: easeInOutCubic
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // 2. requestAnimationFrame Loop (Direct DOM updates for buttery-smooth 60 FPS)
  useEffect(() => {
    if (!layoutReady || coords.length !== 9) return;

    let animId: number;
    let lastTime = performance.now();

    // Duration specifications (in seconds)
    const FORWARD_DURATION = 9.30;
    const PAUSE_DURATION = 2.00;
    const RETRACT_DURATION = 1.50;
    const WAIT_DURATION = 0.50;

    let currentPhase: "FORWARD" | "PAUSE" | "RETRACT" | "WAIT" = "FORWARD";
    let elapsed = 0; // seconds in current phase

    const x_0 = coords[0].x;
    const x_8 = coords[8].x;
    
    // Reel glide bounds (straight horizontal path above the logo)
    const x_start = x_0 - 80;
    const x_end = x_8 + 60;
    
    // Bottom of the reel (radius 24px) should sit exactly tangent to the top of the letters.
    // So y_reel + 24 = coords[0].yTop -> y_reel = coords[0].yTop - 24.
    const y_reel = coords[0].yTop - 24;

    // Reset trigger times at start
    letterTriggerTimes.current = Array(9).fill(-1);

    const update = (timestamp: number) => {
      const dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      elapsed += dt;

      let x_r = x_start;
      const letterOffsets = Array(9).fill(0);

      // Phase 1: FORWARD (Slow, continuous, ease-in-out movement)
      if (currentPhase === "FORWARD") {
        if (elapsed >= FORWARD_DURATION) {
          currentPhase = "PAUSE";
          elapsed = 0;
          x_r = x_end;
        } else {
          const p = elapsed / FORWARD_DURATION;
          const easedP = easeInOutCubic(p);
          x_r = x_start + easedP * (x_end - x_start);

          // Update letter animations based on physical touch coordinates
          allLetters.forEach((_, i) => {
            const letterX = coords[i].x;

            // Trigger animation ONLY when the film roll's FRONT edge (x_r + 24px) touches the letter
            if (x_r + 24 >= letterX && letterTriggerTimes.current[i] === -1) {
              letterTriggerTimes.current[i] = elapsed;
            }

            // If the letter was already triggered, calculate its offset
            if (letterTriggerTimes.current[i] !== -1) {
              const tau = elapsed - letterTriggerTimes.current[i];
              
              if (tau <= 0.90) {
                // Motion Profile: 0.9s duration
                if (tau <= 0.25) {
                  // 1. Move DOWN smoothly to 20px (0.25s duration)
                  const ratio = tau / 0.25;
                  const easedRatio = 1 - Math.pow(1 - ratio, 3); // soft ease-out
                  letterOffsets[i] = 20 * easedRatio;
                } else if (tau <= 0.40) {
                  // 2. Hold at 20px for 0.15s (from 0.25s to 0.40s)
                  letterOffsets[i] = 20;
                } else {
                  // 3. Return smoothly to original position (0.50s duration, from 0.40s to 0.90s)
                  const ratio = (tau - 0.40) / 0.50;
                  const easedRatio = Math.pow(1 - ratio, 3); // soft spring deceleration (no overshoot)
                  letterOffsets[i] = 20 * easedRatio;
                }
              } else {
                // Return to still position once 0.9s completes
                letterOffsets[i] = 0;
              }
            }
          });
        }
      }
      // Phase 2: PAUSE at the end for 2 seconds
      else if (currentPhase === "PAUSE") {
        if (elapsed >= PAUSE_DURATION) {
          currentPhase = "RETRACT";
          elapsed = 0;
          x_r = x_end;
        } else {
          x_r = x_end;
        }
      }
      // Phase 3: RETRACT (Smooth return to starting position)
      else if (currentPhase === "RETRACT") {
        if (elapsed >= RETRACT_DURATION) {
          currentPhase = "WAIT";
          elapsed = 0;
          x_r = x_start;
        } else {
          const p = elapsed / RETRACT_DURATION;
          const easedP = easeInOutCubic(p);
          x_r = x_end - easedP * (x_end - x_start);
        }
      }
      // Phase 4: WAIT at the start for 0.5 seconds before repeating
      else if (currentPhase === "WAIT") {
        if (elapsed >= WAIT_DURATION) {
          currentPhase = "FORWARD";
          elapsed = 0;
          x_r = x_start;
          // Reset trigger timers for the next loop
          letterTriggerTimes.current = Array(9).fill(-1);
        } else {
          x_r = x_start;
        }
      }

      // 3. Update letter positions directly on the DOM (bypasses React virtual DOM for pure 60 FPS performance)
      allLetters.forEach((_, i) => {
        const el = letterRefs.current[i];
        if (el) {
          el.style.transform = `translateY(${letterOffsets[i]}px)`;
        }
      });

      // 4. Update film roll rotation and position
      const dist = x_r - x_start;
      const rotationAngle = (dist / 151) * 360; // Circumference of radius 24 is ~151px

      if (rollRef.current) {
        rollRef.current.setAttribute("transform", `translate(${x_r}, ${y_reel}) rotate(${rotationAngle})`);
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [layoutReady, coords]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-center min-h-[220px] overflow-visible select-none"
    >
      <style>{`
        .cinematic-letter-wrap {
          display: inline-block;
          margin: 0 0.04em;
        }

        .cinematic-letter {
          display: inline-block;
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: clamp(48px, 9.5vw, 130px);
          line-height: 1.1;
          color: #111111;
          position: relative;
          will-change: transform;
          transform: translateY(0px);
        }

        .cinematic-letter.gradient {
          background: linear-gradient(135deg, #FF6B00 0%, #FFA500 50%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Main Logo */}
      <h1 className="flex flex-wrap items-center justify-center select-none text-center gap-x-[0.25em] md:gap-x-[0.3em] pointer-events-none">
        {/* FILM */}
        <span className="flex">
          {firstWord.map((letter, i) => (
            <span key={i} className="cinematic-letter-wrap">
              <span
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                className="cinematic-letter"
              >
                {letter}
              </span>
            </span>
          ))}
        </span>

        {/* DAPPA */}
        <span className="flex">
          {secondWord.map((letter, i) => {
            const globalIndex = i + 4;
            return (
              <span key={i} className="cinematic-letter-wrap">
                <span
                  ref={(el) => {
                    letterRefs.current[globalIndex] = el;
                  }}
                  className="cinematic-letter gradient"
                >
                  {letter}
                </span>
              </span>
            );
          })}
        </span>
      </h1>

      {/* Dynamic 3D Golden Movie Reel SVG Overlay */}
      {layoutReady && coords.length === 9 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          style={{ zIndex: 30 }}
        >
          <defs>
            {/* Rich Gold Gradient for Film Reel */}
            <linearGradient id="goldGradient3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9D6" />
              <stop offset="35%" stopColor="#FFD700" />
              <stop offset="70%" stopColor="#C59B27" />
              <stop offset="100%" stopColor="#8B6508" />
            </linearGradient>

            {/* Drop Shadow for the Golden Reel */}
            <filter id="rollShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity="0.22" />
            </filter>
          </defs>

          {/* 3D GOLDEN FILM ROLL (Prominent scaled-up size: R=24px) */}
          <g ref={rollRef} filter="url(#rollShadow)">
            {/* Reel 3D shadow extrusion */}
            <circle cx="1.5" cy="2" r="24" fill="#5F4300" opacity="0.8" />

            {/* Main Gold Outer Rim */}
            <circle
              cx="0"
              cy="0"
              r="24"
              fill="url(#goldGradient3D)"
              stroke="#8B6508"
              strokeWidth="0.5"
            />

            {/* Inner Dark Celluloid Canister Center */}
            <circle cx="0" cy="0" r="19" fill="#141414" />

            {/* 6 Circular Spokes/Cutouts in Gold */}
            {Array.from({ length: 6 }).map((_, idx) => {
              const deg = idx * 60;
              return (
                <circle
                  key={idx}
                  cx="0"
                  cy="-12"
                  r="3.7"
                  fill="url(#goldGradient3D)"
                  stroke="#8B6508"
                  strokeWidth="0.4"
                  transform={`rotate(${deg})`}
                />
              );
            })}

            {/* Central golden core */}
            <circle
              cx="0"
              cy="0"
              r="8.5"
              fill="url(#goldGradient3D)"
              stroke="#8B6508"
              strokeWidth="0.5"
            />

            {/* Center spindle axis hole */}
            <circle cx="0" cy="0" r="2.5" fill="#000000" />
          </g>
        </svg>
      )}
    </div>
  );
}
