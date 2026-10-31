import React, { useEffect, useRef } from "react";

const BACKGROUND = "#050505";
const FOREGROUND = "#C6FF00";

function seededOffset(index) {
  return Math.sin(index * 12.9898) * 0.62 + Math.sin(index * 78.233) * 0.38;
}

export function DistortedWordmark({ text = "YANG", background = BACKGROUND, foreground = FOREGROUND }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const source = document.createElement("canvas");
    const sourceCtx = source.getContext("2d");
    if (!ctx || !sourceCtx) return;
    let frameId = 0;
    let visible = false;
    let disposed = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let tiles = [];
    let lastPointer = null;
    let shouldReset = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const drawSource = () => {
      source.width = canvas.width;
      source.height = canvas.height;
      sourceCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sourceCtx.fillStyle = background;
      sourceCtx.fillRect(0, 0, width, height);
      sourceCtx.fillStyle = foreground;
      sourceCtx.textAlign = "center";
      sourceCtx.textBaseline = "middle";
      sourceCtx.font = `800 ${Math.round(height * 1.1)}px Syne, Inter, sans-serif`;
      sourceCtx.letterSpacing = "-0.07em";
      sourceCtx.fillText(text, width / 2, height * 0.55, width * 0.99);
    };

    const draw = () => {
      frameId = 0;
      if (disposed || !visible || document.hidden) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      if (shouldReset && tiles.every(tile => Math.abs(tile.x) < 0.08 && Math.abs(tile.y) < 0.08)) {
        tiles.forEach(tile => { tile.x = 0; tile.y = 0; });
        ctx.drawImage(source, 0, 0, width, height);
        return;
      }

      let moving = false;
      tiles.forEach((tile) => {
        if (shouldReset) {
          tile.targetX = 0;
          tile.targetY = 0;
        }
        tile.x += (tile.targetX - tile.x) * 0.16;
        tile.y += (tile.targetY - tile.y) * 0.16;
        if (Math.abs(tile.targetX - tile.x) > 0.08 || Math.abs(tile.targetY - tile.y) > 0.08) {
          moving = true;
        }
        ctx.drawImage(
          source,
          tile.left * dpr,
          tile.top * dpr,
          tile.width * dpr,
          tile.height * dpr,
          tile.left + tile.x,
          tile.top + tile.y,
          tile.width,
          tile.height,
        );
      });

      if (moving && !reducedMotion.matches) {
        frameId = requestAnimationFrame(draw);
      }
    };

    const renderStatic = () => {
      if (frameId || !visible || document.hidden || disposed) return;
      frameId = requestAnimationFrame(draw);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      drawSource();
      const columns = Math.max(18, Math.round(width / 70));
      const rows = 20;
      const tileWidth = width / columns;
      const tileHeight = height / rows;
      tiles = Array.from({ length: columns * rows }, (_, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        return {
          left: column * tileWidth,
          top: row * tileHeight,
          width: tileWidth + 1,
          height: tileHeight + 1,
          x: 0,
          y: 0,
          targetX: 0,
          targetY: 0,
        };
      });
      renderStatic();
    };

    const onPointerMove = (event) => {
      if (reducedMotion.matches || event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      const pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const velocityX = lastPointer ? pointer.x - lastPointer.x : 0;
      const velocityY = lastPointer ? pointer.y - lastPointer.y : 0;
      const radiusX = Math.max(90, width * 0.13);
      const radiusY = Math.max(46, height * 0.42);

      shouldReset = false;
      tiles.forEach((tile, index) => {
        const centerX = tile.left + tile.width / 2;
        const centerY = tile.top + tile.height / 2;
        const distance = Math.hypot((centerX - pointer.x) / radiusX, (centerY - pointer.y) / radiusY);
        if (distance >= 1) {
          tile.targetX = 0;
          tile.targetY = 0;
          return;
        }

        const strength = (1 - distance) ** 1.7;
        const random = seededOffset(index);
        tile.targetX = (random * width * 0.12 + velocityX * 1.8) * strength;
        tile.targetY = (random * 5 + velocityY * 0.28) * strength;
      });

      lastPointer = pointer;
      renderStatic();
    };

    const onPointerLeave = () => {
      lastPointer = null;
      shouldReset = true;
      renderStatic();
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) renderStatic();
      else {
        cancelAnimationFrame(frameId);
        frameId = 0;
        onPointerLeave();
      }
    });
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
        frameId = 0;
        onPointerLeave();
      } else renderStatic();
    };
    const onMotionChange = () => {
      if (reducedMotion.matches) {
        tiles.forEach(tile => { tile.x = 0; tile.y = 0; });
        onPointerLeave();
      }
    };
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener('change', onMotionChange);
    document.fonts.load("800 120px Syne").then(() => { if (!disposed) resize(); });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.removeEventListener('change', onMotionChange);
    };
  }, [text, background, foreground]);

  return (
    <canvas
      ref={canvasRef}
      className="block h-40 w-full md:h-64 lg:h-72"
      role="img"
      aria-label={`${text} interactive wordmark`}
    />
  );
}
