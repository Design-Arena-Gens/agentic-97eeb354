"use client";

import { useEffect, useRef } from "react";

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

export type VideoCanvasHandle = {
  canvas: HTMLCanvasElement | null;
};

export interface VideoCanvasProps {
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
}

export function VideoCanvas({ onCanvasReady }: VideoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpi = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpi;
    canvas.height = CANVAS_HEIGHT * dpi;
    canvas.style.width = `${CANVAS_WIDTH / 3}px`;
    canvas.style.height = `${CANVAS_HEIGHT / 3}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpi, dpi);

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      size: Math.random() * 2 + 0.5,
      twinkleOffset: Math.random() * Math.PI * 2
    }));

    const rings = Array.from({ length: 4 }, (_, idx) => ({
      radius: 170 + idx * 35,
      rotation: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.002 + 0.001
    }));

    let startTime = performance.now();

    const draw = (timestamp: number) => {
      const elapsed = (timestamp - startTime) / 1000;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, "#030712");
      gradient.addColorStop(0.5, "#0b1022");
      gradient.addColorStop(1, "#02040a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const star of stars) {
        const twinkle = (Math.sin(elapsed * 2 + star.twinkleOffset) + 1) / 2;
        ctx.fillStyle = `rgba(110, 242, 255, ${0.15 + twinkle * 0.7})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      const centerX = CANVAS_WIDTH / 2;
      const centerY = CANVAS_HEIGHT * 0.48;

      const planetGradient = ctx.createRadialGradient(
        centerX - 60,
        centerY - 120,
        80,
        centerX,
        centerY,
        320
      );
      planetGradient.addColorStop(0, "#6ef2ff");
      planetGradient.addColorStop(0.5, "#1f7fd6");
      planetGradient.addColorStop(1, "rgba(3, 7, 18, 0.9)");
      ctx.fillStyle = planetGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 310, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 305, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(110, 242, 255, 0.3)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(247, 248, 251, 0.08)";
      for (const ring of rings) {
        const offset = elapsed * ring.drift;
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.radius * 1.8, ring.radius, offset, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(elapsed * 0.1);
      ctx.strokeStyle = "rgba(110, 242, 255, 0.25)";
      ctx.lineWidth = 2.4;
      for (let i = 0; i < 360; i += 36) {
        const angle = (i * Math.PI) / 180;
        const inner = 120 + Math.sin(elapsed * 1.5 + i) * 25;
        const outer = 280 + Math.cos(elapsed * 1.2 + i) * 40;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
        ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-elapsed * 0.08);
      ctx.fillStyle = "rgba(110, 242, 255, 0.25)";
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 150 + Math.sin(elapsed * 2 + angle * 4) * 40;
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * 90, Math.sin(angle) * 90, radius * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      const bandHeight = 360;
      ctx.beginPath();
      ctx.rect(0, centerY - bandHeight / 2, CANVAS_WIDTH, bandHeight);
      const bandGradient = ctx.createLinearGradient(0, centerY - bandHeight / 2, 0, centerY + bandHeight / 2);
      bandGradient.addColorStop(0, "rgba(3, 7, 18, 0)");
      bandGradient.addColorStop(0.5, "rgba(12, 16, 28, 0.9)");
      bandGradient.addColorStop(1, "rgba(3, 7, 18, 0)");
      ctx.fillStyle = bandGradient;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(elapsed * 0.12);
      ctx.strokeStyle = "rgba(110, 242, 255, 0.5)";
      ctx.lineWidth = 2;
      const arcCount = 30;
      for (let i = 0; i < arcCount; i++) {
        const progress = (i / arcCount) * Math.PI * 2;
        const arcRadius = 200 + Math.sin(elapsed * 1.3 + progress * 3) * 25;
        const sweep = Math.PI / 6;
        ctx.beginPath();
        ctx.arc(0, 0, arcRadius, progress, progress + sweep);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "rgba(110, 242, 255, 0.18)";
      const pulseRadius = 200 + Math.sin(elapsed * 2.5) * 30;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = "rgba(247, 248, 251, 0.9)";
      ctx.textAlign = "center";
      ctx.font = "bold 164px 'Bebas Neue', 'Inter', sans-serif";
      ctx.fillText("AI COVER", centerX, CANVAS_HEIGHT * 0.82);
      ctx.font = "bold 164px 'Bebas Neue', 'Inter', sans-serif";
      ctx.fillStyle = "rgba(110, 242, 255, 0.95)";
      ctx.fillText("THE WORLD", centerX, CANVAS_HEIGHT * 0.92);

      ctx.font = "38px 'Inter', sans-serif";
      ctx.fillStyle = "rgba(247, 248, 251, 0.75)";
      ctx.fillText("Future Atlas • 2024", centerX, CANVAS_HEIGHT * 0.97);

      rafRef.current = window.requestAnimationFrame(draw);
    };

    rafRef.current = window.requestAnimationFrame(draw);
    onCanvasReady?.(canvas);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      onCanvasReady?.(null);
    };
  }, [onCanvasReady]);

  return <canvas ref={canvasRef} />;
}

export const CANVAS_DIMENSIONS = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT
};
