"use client"
import { useEffect, useState } from "react";

/**
 * "Olo" teaser via cone fatigue
 * =================================
 * This page tries to *hint* at the beyond-gamut colour "olo" reported by Fong et al.
 * We can't selectively stimulate single M-cones (that needs adaptive-optics lasers),
 * but we *can* bleach the L-cones with 630 nm red and then probe with 540 nm green.
 * The transient colour some people see — a vivid teal — nudges toward the olo corner
 * of LMS space, though it remains inside the normal human gamut.
 *
 * Sequence
 * --------
 *   1️⃣ 25 s #ff0000 (≈ 630 nm) deep-red bleach → L-cone sensitivity drops ≈ 10×.
 *   2️⃣ 0.8 s #00ff00 (≈ 540 nm) probe → M-cones dominate percept.
 *   3️⃣ Grey reset + prompt.
 *
 * Tips: maximise screen brightness, dim the room, and keep your gaze on the fixation
 * "+" for the full bleach period.
 */

const RED_MS = 25_000;
const GREEN_MS = 1000;
const RED_HEX = "#ff0000";   // monitor red LED peak ≈ 630 nm
const GREEN_HEX = "#5eff00"; // M-cone green LED peak ≈ 530 nm

export default function Page() {
  const [phase, setPhase] = useState<"idle" | "red" | "green" | "done">("idle");

  // timers
  useEffect(() => {
    if (phase !== "red") return;
    const id = setTimeout(() => setPhase("green"), RED_MS);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "green") return;
    const id = setTimeout(() => setPhase("done"), GREEN_MS);
    return () => clearTimeout(id);
  }, [phase]);

  const bgStyle: React.CSSProperties = {
    backgroundColor:
      phase === "red"
        ? RED_HEX
        : phase === "green"
        ? GREEN_HEX
        : phase === "idle"
        ? "#111"
        : "#e5e5e5",
  };

  return (
    <main
      className="w-screen h-screen flex flex-col items-center justify-center transition-colors duration-200"
      style={bgStyle}
    >
      {/* fixation */}
      {phase === "red" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-5xl font-semibold text-black mix-blend-overlay">{'+'}</span>
        </div>
      )}

      {/* intro */}
      {phase === "idle" && (
        <div className="flex flex-col gap-6 w-full max-w-lg px-4 text-center text-neutral-100">
          <h1 className="text-2xl sm:text-3xl font-bold">Simulating &quot;olo&quot;</h1>
          <p className="text-base sm:text-lg leading-relaxed text-neutral-300">
            Researchers recently created a new colour, <em>olo</em>, by laser-targeting individual
            M-cones. Your screen can&apos;t do that, but it <em>can</em> fatigue your L-cones with
            <span style={{ color: RED_HEX }}> red</span> light and then hit the fresher M-cones with
            <span style={{ color: GREEN_HEX }}> green</span>. Focus on the &quot;+&quot; for 25 s, watch the flash, and
            note the hue you perceive.
          </p>
          <button
            onClick={() => setPhase("red")}
            className="mx-auto rounded-xl bg-white/10 px-5 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium hover:bg-white/20 transition-colors"
          >
            Start
          </button>
        </div>
      )}

      {/* outcome */}
      {phase === "done" && (
        <div className="flex flex-col gap-5 w-full max-w-md px-4 text-center text-neutral-800">
          <h2 className="text-xl sm:text-2xl font-semibold">What colour flashed?</h2>
          <p className="text-base sm:text-lg">
            If you saw a punchy teal or blue-green, that&apos;s the closest a monitor can get to{" "}
            <em> olo</em> — M-cone signals shining through while bleached L-cones recover. The shade
            fades quickly as the L-cones wake back up.
          </p>
          <button
            onClick={() => setPhase("idle")}
            className="mx-auto rounded-xl bg-neutral-900 text-white px-4 sm:px-5 py-2 text-sm sm:text-base hover:bg-neutral-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      <footer className="absolute bottom-4 px-4 text-center w-full text-neutral-500 text-xs sm:text-sm">
        made by <a href="https://x.com/oliviali_" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-700">olivia</a>
      </footer>
    </main>
  );
}