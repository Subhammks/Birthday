import { useEffect, useRef } from "react";

const DUST_COLORS = [
  "255,154,213",
  "197,155,255",
  "255,255,255",
  "128,216,255",
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function StardustCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let stars = [];
    const dust = [];

    const cursor = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      ex: 0,
      ey: 0,
      active: false,
      strength: 0,
    };

    const sprites = DUST_COLORS.map((c) => {
      const s = document.createElement("canvas");
      s.width = 32;
      s.height = 32;
      const g = s.getContext("2d");
      const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, `rgba(${c},1)`);
      grad.addColorStop(0.35, `rgba(${c},0.55)`);
      grad.addColorStop(1, `rgba(${c},0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, 32, 32);
      return s;
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      w = rect.width;
      h = rect.height;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(clamp((w * h) / 16000, 40, 110));

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        r: 0.6 + Math.random() * 1.1,
        tw: Math.random() * Math.PI * 2,
        ts: 0.6 + Math.random() * 1.4,
        g: 0,
      }));
    };

    const emit = (x, y) => {
      if (dust.length >= 240) dust.shift();

      const a = Math.random() * Math.PI * 2;
      const sp = 8 + Math.random() * 26;

      dust.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp + 8,
        life: 0,
        max: 0.9 + Math.random() * 0.9,
        size: 6 + Math.random() * 10,
        c: Math.floor(Math.random() * sprites.length),
      });
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      cursor.tx = x;
      cursor.ty = y;

      if (!cursor.active) {
        cursor.active = true;
        cursor.x = x;
        cursor.y = y;
        cursor.ex = x;
        cursor.ey = y;
      }

      const dx = x - cursor.ex;
      const dy = y - cursor.ey;
      const dist = Math.hypot(dx, dy);

      if (dist < 5) return;

      const steps = Math.min(6, Math.max(1, Math.floor(dist / 12)));

      for (let s = 1; s <= steps; s += 1) {
        emit(cursor.ex + (dx * s) / steps, cursor.ey + (dy * s) / steps);
      }

      cursor.ex = x;
      cursor.ey = y;
    };

    const onLeave = () => {
      cursor.active = false;
    };
    const onUp = (e) => {
      if (e.pointerType === "touch") cursor.active = false;
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, w, h);

      const follow = 1 - Math.exp(-dt * 14);
      cursor.x += (cursor.tx - cursor.x) * follow;
      cursor.y += (cursor.ty - cursor.y) * follow;
      cursor.strength +=
        ((cursor.active ? 1 : 0) - cursor.strength) * (1 - Math.exp(-dt * 6));

      const RANGE = 190;
      const glowEase = 1 - Math.exp(-dt * 8);
      const near = [];

      ctx.fillStyle = "#ffe9f6";

      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i];

        s.x += s.vx * dt;
        s.y += s.vy * dt;

        if (s.x < -5) s.x = w + 5;
        else if (s.x > w + 5) s.x = -5;

        if (s.y < -5) s.y = h + 5;
        else if (s.y > h + 5) s.y = -5;

        s.tw += s.ts * dt;

        const d = Math.hypot(s.x - cursor.x, s.y - cursor.y);
        const target = cursor.strength > 0.02 && d < RANGE ? 1 - d / RANGE : 0;

        s.g += (target - s.g) * glowEase;

        const twinkle = 0.5 + 0.5 * Math.sin(s.tw);

        ctx.globalAlpha = Math.min(1, 0.16 + twinkle * 0.22 + s.g * 0.6);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (1 + s.g * 0.9), 0, Math.PI * 2);
        ctx.fill();

        if (s.g > 0.03) {
          near.push(s);

          const size = 16 + s.g * 14;
          ctx.globalAlpha = s.g * 0.55;
          ctx.drawImage(sprites[0], s.x - size / 2, s.y - size / 2, size, size);
        }
      }

      if (near.length) {
        near.sort((a, b) => b.g - a.g);
        const top = near.slice(0, 8);

        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;

        for (let i = 0; i < top.length; i += 1) {
          const s = top[i];
          const a = s.g * 0.5 * cursor.strength;

          ctx.strokeStyle = `rgba(255,175,225,${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(cursor.x, cursor.y);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        }

        for (let i = 0; i < top.length; i += 1) {
          for (let j = i + 1; j < top.length; j += 1) {
            const a = top[i];
            const b = top[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);

            if (d < 140) {
              const alpha =
                Math.min(a.g, b.g) * (1 - d / 140) * 0.5 * cursor.strength;

              ctx.strokeStyle = `rgba(200,160,255,${alpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      if (cursor.strength > 0.02) {
        ctx.globalAlpha = cursor.strength * 0.35;
        ctx.drawImage(sprites[1], cursor.x - 23, cursor.y - 23, 46, 46);
      }

      ctx.globalCompositeOperation = "lighter";

      const drag = Math.exp(-dt * 1.2);

      for (let i = dust.length - 1; i >= 0; i -= 1) {
        const p = dust[i];

        p.life += dt;

        if (p.life >= p.max) {
          dust.splice(i, 1);
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= drag;
          p.vy = p.vy * drag + 14 * dt;

          const t = 1 - p.life / p.max;
          const size = p.size * (0.6 + 0.4 * t);

          ctx.globalAlpha = t * t * 0.9;
          ctx.drawImage(
            sprites[p.c],
            p.x - size / 2,
            p.y - size / 2,
            size,
            size,
          );
        }
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };

    resize();
    raf = requestAnimationFrame(frame);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
