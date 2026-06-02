import React, { useEffect, useRef } from "react";

const BACKGROUND = "#ccff00";
const FOREGROUND = "#050505";

function seededOffset(index, time) {
  const wave = Math.sin(index * 12.9898 + time * 0.018);
  const jitter = Math.sin(index * 78.233 + time * 0.031);
  return wave * 0.62 + jitter * 0.38;
}

export function DistortedWordmark({ text = "YANG" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const source = document.createElement("canvas");
    const sourceCtx = source.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId;
    let intensity = 0;
    let targetIntensity = 0;
    let pointerY = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const drawSource = () => {
      source.width = canvas.width;
      source.height = canvas.height;
      sourceCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sourceCtx.fillStyle = BACKGROUND;
      sourceCtx.fillRect(0, 0, width, height);
      sourceCtx.fillStyle = FOREGROUND;
      sourceCtx.textAlign = "center";
      sourceCtx.textBaseline = "middle";
      sourceCtx.font = `900 ${Math.round(height * 0.92)}px Inter, Arial Black, sans-serif`;
      sourceCtx.fillText(text, width / 2, height * 0.54, width * 0.94);
    };

    const draw = (time = 0) => {
      intensity += (targetIntensity - intensity) * 0.13;
      if (targetIntensity === 0 && intensity < 0.005) intensity = 0;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, width, height);

      const sliceHeight = Math.max(4, Math.round(height / 22));
      for (let y = 0, index = 0; y < height; y += sliceHeight, index += 1) {
        const center = y + sliceHeight / 2;
        const proximity = 1 - Math.min(Math.abs(center - pointerY) / height, 1);
        const spread = 0.42 + proximity * 0.9;
        const offset = seededOffset(index, time) * width * 0.16 * intensity * spread;
        const verticalOffset = Math.sin(index * 4.2 + time * 0.012) * 2 * intensity;
        ctx.drawImage(
          source,
          0,
          y * dpr,
          source.width,
          sliceHeight * dpr,
          offset,
          y + verticalOffset,
          width,
          sliceHeight,
        );
      }

      if (intensity > 0 || targetIntensity > 0) {
        frameId = requestAnimationFrame(draw);
      }
    };

    const renderStatic = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      pointerY = height / 2;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      drawSource();
      renderStatic();
    };

    const onPointerMove = (event) => {
      if (reduceMotion.matches) return;
      const rect = canvas.getBoundingClientRect();
      pointerY = event.clientY - rect.top;
      targetIntensity = 1;
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(draw);
    };

    const onPointerLeave = () => {
      if (reduceMotion.matches) return;
      targetIntensity = 0;
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      className="block h-28 w-full md:h-44"
      role="img"
      aria-label={`${text} interactive wordmark`}
    />
  );
}
