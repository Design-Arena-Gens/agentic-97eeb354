"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { VideoCanvas } from "./VideoCanvas";
import { useCanvasRecorder } from "@/hooks/useCanvasRecorder";

interface ScriptBeat {
  id: number;
  timestamp: string;
  visual: string;
  narration: string;
  prompt: string;
}

const HERO_TAGLINES = [
  "The planet is your canvas.",
  "Intelligence with a global pulse.",
  "From satellites to city streets.",
  "Tomorrow's atlas is AI powered.",
  "See the world, augmented."
];

const INTRO_VARIANTS = [
  {
    visual: "Title burst over neon earth.",
    narration: "AI is rewriting how we see our planet.",
    prompt: "Close-up orbital shot, neon holographic earth, cinematic lighting"
  },
  {
    visual: "Neon earth ignites with data arcs.",
    narration: "AI vision redraws the map in real time.",
    prompt: "Orbital macro lens, glowing data threads, deep blues"
  },
  {
    visual: "Planetary mesh builds from a single spark.",
    narration: "Machine intelligence is stitching a living atlas.",
    prompt: "Point-cloud planet, iridescent glow, volumetric atmosphere"
  }
];

function buildScript(seed: number): ScriptBeat[] {
  const intro = INTRO_VARIANTS[seed % INTRO_VARIANTS.length];
  const beats: ScriptBeat[] = [
    {
      id: 1,
      timestamp: "0.0s",
      visual: intro.visual,
      narration: intro.narration,
      prompt: intro.prompt
    },
    {
      id: 2,
      timestamp: "1.2s",
      visual: "Data rings sweep continents.",
      narration: "Every city becomes a live pulse of data.",
      prompt: "Glowing data rings wrapping continents, volumetric fog, cyberpunk"
    },
    {
      id: 3,
      timestamp: "2.4s",
      visual: "Drone POV dives toward skyline.",
      narration: "Vision models chart opportunity in real time.",
      prompt: "Futuristic drone flythrough, glass skyscrapers, sunrise rim light"
    },
    {
      id: 4,
      timestamp: "3.6s",
      visual: "Networks stitch global grid.",
      narration: "Networks sync ideas from Lagos to Tokyo.",
      prompt: "Global network mesh wires, luminous nodes, deep blues"
    },
    {
      id: 5,
      timestamp: "4.8s",
      visual: "Logo and CTA flare out.",
      narration: "This is your world—amplified by AI.",
      prompt: "Minimal logo outro, particle trails, bold typography"
    }
  ];

  return beats;
}

export function VideoStudio() {
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const { start, stop, state } = useCanvasRecorder();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const script = useMemo(() => buildScript(taglineIndex), [taglineIndex]);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement | null) => {
    setCanvasEl(canvas);
  }, []);

  const handleRecordToggle = useCallback(() => {
    if (state.isRecording) {
      const blob = stop();
      if (blob) {
        const url = URL.createObjectURL(blob);
        setDownloadUrl(prev => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      }
      return;
    }

    start(canvasEl);
  }, [start, stop, canvasEl, state.isRecording]);

  const handleTaglineShuffle = useCallback(() => {
    setTaglineIndex(prev => (prev + 1) % HERO_TAGLINES.length);
  }, []);

  return (
    <div className="studio">
      <div className="preview">
        <div className="tagline-card">
          <span className="pill">Instagram Reel • 9:16</span>
          <h1>AI Cover the World</h1>
          <p>{HERO_TAGLINES[taglineIndex]}</p>
          <div className="tagline-actions">
            <button onClick={handleTaglineShuffle}>Shuffle hook</button>
            <button onClick={handleRecordToggle} className={state.isRecording ? "danger" : "primary"}>
              {state.isRecording ? "Stop capture" : "Record 6s loop"}
            </button>
          </div>
          <span className="status">{state.statusMessage}</span>
          {downloadUrl ? (
            <a className="download" href={downloadUrl} download="ai-cover-the-world.webm">
              Download latest take
            </a>
          ) : null}
        </div>
        <VideoCanvas onCanvasReady={handleCanvasReady} />
      </div>
      <aside className="sidebar">
        <section>
          <h2>Shot List</h2>
          <ul>
            {script.map(beat => (
              <li key={beat.id}>
                <div className="stamp">{beat.timestamp}</div>
                <div>
                  <strong>{beat.visual}</strong>
                  <p>{beat.narration}</p>
                  <code>{beat.prompt}</code>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Upload Checklist</h2>
          <ol>
            <li>Download the WebM take and convert to MP4 (FFmpeg or Handbrake).</li>
            <li>Trim to 5.5s in CapCut or Premiere for seamless loop.</li>
            <li>Add voiceover using the narration beats above.</li>
            <li>Set cover frame to the first second (title burst).</li>
            <li>Use hashtags: #FutureAtlas #AIReels #GlobalVision</li>
          </ol>
        </section>
      </aside>
      <style jsx>{`
        .studio {
          display: grid;
          gap: 2.5rem;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 360px);
          padding: 3rem clamp(1.5rem, 2vw, 3rem);
        }

        .preview {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          justify-content: center;
        }

        .tagline-card {
          max-width: 320px;
          padding: 1.75rem;
          border-radius: 1.5rem;
          background: rgba(8, 11, 20, 0.8);
          box-shadow: 0 20px 40px rgba(5, 6, 10, 0.35);
          backdrop-filter: blur(18px);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .tagline-card h1 {
          font-size: 2.4rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1.1;
        }

        .tagline-card p {
          color: var(--muted);
          line-height: 1.4;
        }

        .pill {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .tagline-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        button {
          padding: 0.65rem 1.1rem;
          border-radius: 999px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        button:hover {
          transform: translateY(-2px);
        }

        button.primary {
          background: linear-gradient(120deg, rgba(110, 242, 255, 0.85), rgba(53, 209, 255, 0.65));
          color: #02040a;
          font-weight: 600;
        }

        button.danger {
          background: rgba(209, 67, 67, 0.85);
          color: #fff;
          font-weight: 600;
        }

        .tagline-card button:not(.primary):not(.danger) {
          background: transparent;
          border-color: rgba(110, 242, 255, 0.35);
          color: var(--accent);
        }

        .status {
          min-height: 1.25rem;
          font-size: 0.75rem;
          color: var(--muted);
        }

        .download {
          color: var(--accent);
          font-weight: 600;
          text-decoration: none;
        }

        canvas {
          border-radius: 1.8rem;
          box-shadow: 0 25px 60px rgba(3, 7, 18, 0.65);
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 1.8rem;
          border-radius: 1.5rem;
          background: rgba(8, 11, 20, 0.85);
          box-shadow: inset 0 0 0 1px rgba(110, 242, 255, 0.08);
          max-height: calc(100vh - 6rem);
          overflow: auto;
        }

        .sidebar section h2 {
          font-size: 1rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(247, 248, 251, 0.85);
          margin-bottom: 0.75rem;
        }

        ul {
          list-style: none;
          display: grid;
          gap: 1rem;
        }

        li {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.75rem;
          align-items: start;
          background: rgba(12, 16, 28, 0.55);
          padding: 1rem;
          border-radius: 1rem;
          border: 1px solid rgba(110, 242, 255, 0.1);
        }

        .stamp {
          font-size: 0.75rem;
          color: rgba(110, 242, 255, 0.8);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        li strong {
          display: block;
          font-size: 1rem;
          margin-bottom: 0.35rem;
        }

        li p {
          color: var(--muted);
          font-size: 0.9rem;
          margin-bottom: 0.35rem;
        }

        code {
          font-family: "Space Mono", "Fira Code", monospace;
          font-size: 0.75rem;
          color: rgba(110, 242, 255, 0.85);
          background: rgba(3, 7, 18, 0.55);
          padding: 0.35rem 0.45rem;
          border-radius: 0.5rem;
          display: inline-block;
        }

        ol {
          display: grid;
          gap: 0.65rem;
          color: var(--muted);
          counter-reset: checklist;
          font-size: 0.9rem;
        }

        ol li {
          position: relative;
          padding-left: 1.75rem;
        }

        ol li::before {
          counter-increment: checklist;
          content: counter(checklist);
          position: absolute;
          left: 0;
          top: 0;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          background: rgba(110, 242, 255, 0.18);
          border: 1px solid rgba(110, 242, 255, 0.35);
          color: rgba(110, 242, 255, 0.85);
          font-size: 0.75rem;
          display: grid;
          place-items: center;
        }

        @media (max-width: 1200px) {
          .studio {
            grid-template-columns: 1fr;
          }

          .preview {
            flex-direction: column-reverse;
            align-items: center;
          }

          .tagline-card {
            width: 100%;
            max-width: 100%;
          }

          .sidebar {
            max-height: initial;
          }
        }

        @media (max-width: 768px) {
          .studio {
            padding: 2rem 1.25rem 3.5rem;
          }

          canvas {
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}
