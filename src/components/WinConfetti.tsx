import { useEffect, useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;
  s: number;
  c: string;
};

export default function WinConfetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!active || reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let pieces: Piece[] = [];
    let last = performance.now();
    const begin = last;

    const colors = ['#8b5cf6', '#22d3ee', '#10b981', '#f59e0b', '#f472b6'];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      const cx = width / 2;
      const cy = Math.min(height * 0.35, 280);
      const count = Math.min(160, Math.max(90, Math.round(width / 7)));
      pieces = Array.from({ length: count }, () => {
        const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 1.35;
        const speed = 4.6 + Math.random() * 6.2;
        return {
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.22,
          s: 4 + Math.random() * 6,
          c: colors[Math.floor(Math.random() * colors.length)]!,
        };
      });
    };

    const tick = (t: number) => {
      const dt = Math.min(0.032, (t - last) / 1000);
      last = t;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      for (const p of pieces) {
        p.vy += 18 * dt;
        p.vx *= 0.992;
        p.vy *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.95;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      }

      const elapsed = t - begin;
      if (elapsed < 1400) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    resize();
    spawn();
    rafRef.current = window.requestAnimationFrame(tick);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, width, height);
    };
  }, [active, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1290,
        pointerEvents: 'none',
      }}
    />
  );
}
