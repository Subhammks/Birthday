import { Link, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import DreamyBackground from "../components/DreamyBackground";

const ease = [0.16, 1, 0.3, 1];

/* Har planet (aur center ka heart) yahin se next page pe jaata hai.
   Planet-wise alag route chahiye toh neeche planets array mein `to` change kar do. */
const NEXT_PAGE = "/memory";

/* Pehli visit wala pulse hint ek baar planet hover/click hone ke baad
   dobara nahi dikhta (localStorage mein yaad rehta hai).
   Testing ke liye key badal do ya browser storage clear kar do. */
const HINT_KEY = "portal-planet-hint-seen";

const quotes = [
  "Somewhere in this universe, I found you.",
  "Even galaxies need someone to orbit.",
  "If I had a thousand lives, I'd still find you.",
  "You are my favorite little universe.",
  "Out of every star, somehow I found yours.",
  "My favorite place is wherever you are.",
  "Different worlds. Same you.",
  "You make my universe feel like home.",
];

/* ring  = orbit ka size (0-1)
   dur   = ek chakkar kitne seconds mein
   phase = starting position (0-1) taaki sab ek jagah na ho
   size  = planet ka size (orbit ke hisaab se)          */
const planets = [
  {
    id: "beginning",
    label: "OUR BEGINNING",
    to: NEXT_PAGE,
    tone: "pink",
    size: 0.066,
    ring: 0.34,
    dur: 16,
    phase: 0.08,
    dir: "normal",
    glow: "#ff8acb",
    trail: "255,110,190",
  },
  {
    id: "memories",
    label: "MEMORIES",
    to: NEXT_PAGE,
    tone: "purple",
    size: 0.05,
    ring: 0.5,
    dur: 24,
    phase: 0.55,
    dir: "reverse",
    glow: "#bd8cff",
    trail: "175,120,255",
  },
  {
    id: "moments",
    label: "OUR MOMENTS",
    to: NEXT_PAGE,
    tone: "blue",
    size: 0.044,
    ring: 0.66,
    dur: 34,
    phase: 0.3,
    dir: "normal",
    glow: "#80d8ff",
    trail: "110,205,255",
  },
  {
    id: "forever",
    label: "FOREVER",
    to: NEXT_PAGE,
    tone: "rose",
    size: 0.04,
    ring: 0.83,
    dur: 46,
    phase: 0.78,
    dir: "reverse",
    glow: "#ff6fae",
    trail: "255,100,160",
  },
  {
    id: "you",
    label: "YOU",
    to: NEXT_PAGE,
    tone: "white",
    size: 0.032,
    ring: 1,
    dur: 62,
    phase: 0.15,
    dir: "normal",
    glow: "#ffffff",
    trail: "235,205,255",
  },
];

const introVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};

const rise = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease },
  },
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* =========================================================
   STARDUST + CONSTELLATION
   - cursor ke peeche chhoti chamakti dhool
   - cursor ke paas ke stars glow karte hain aur lines se jud kar
     ek constellation bana dete hain
   - canvas pointer-events: none hai, toh click/drag pe asar nahi
========================================================= */

const DUST_COLORS = [
  "255,154,213",
  "197,155,255",
  "255,255,255",
  "128,216,255",
];

function StardustCanvas() {
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

    // glow sprites ek baar bana ke reuse karte hain (shadowBlur se bahut sasta)
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

      // tez move pe bhi trail toote nahi
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

      // constellation lines
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

      // cursor ke neeche halka glow
      if (cursor.strength > 0.02) {
        ctx.globalAlpha = cursor.strength * 0.35;
        ctx.drawImage(sprites[1], cursor.x - 23, cursor.y - 23, 46, 46);
      }

      // stardust
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

  return <canvas ref={canvasRef} className="stardust" aria-hidden="true" />;
}

/* =========================================================
   ORBIT PLANET
   Rotation ab CSS animation se nahi, ek shared "orbitTime" se chalti hai.
   Isi wajah se drag, fling aur smooth slow-down possible hai.
========================================================= */

function OrbitPlanet({
  p,
  index,
  orbitTime,
  counterTilt,
  hoverRef,
  hint,
  onHover,
  onEnter,
}) {
  const sign = p.dir === "reverse" ? -1 : 1;

  const angle = useTransform(
    orbitTime,
    (t) => sign * (p.phase * 360 + (t * 360) / p.dur),
  );
  const counter = useTransform(angle, (a) => -a);

  const startHover = () => {
    hoverRef.current = true;
    onHover();
  };

  const endHover = () => {
    hoverRef.current = false;
  };

  return (
    <motion.div
      className={`arm ${sign < 0 ? "rev" : ""}`}
      style={{
        rotate: angle,
        "--k": String(p.ring),
        "--t": p.trail,
        "--f": String(p.size),
        "--glow": p.glow,
      }}
    >
      <div className="trail" />

      <motion.div className="anchor" style={{ rotate: counter }}>
        <motion.div className="billboard" style={{ rotateX: counterTilt }}>
          <Link
            to={p.to}
            draggable={false}
            className={`planetLink ${hint ? "hinting" : ""}`}
            aria-label={`${p.label} - open next page`}
            onClick={(e) => onEnter(e, p)}
            onPointerEnter={startHover}
            onPointerLeave={endHover}
            onFocus={startHover}
            onBlur={endHover}
          >
            <motion.span
              className={`planet planet-${p.tone} ${hint ? "hint" : ""}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  delay: 1 + index * 0.18,
                  type: "spring",
                  stiffness: 140,
                  damping: 14,
                },
              }}
              whileHover={{
                scale: 1.45,
                boxShadow: `0 0 25px ${p.glow}, 0 0 70px ${p.glow}cc`,
                transition: { type: "spring", stiffness: 250, damping: 14 },
              }}
              whileTap={{ scale: 1.15 }}
            >
              <span className="planetHighlight" />
            </motion.span>

            <span className="planetLabel">{p.label}</span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Portal() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [warp, setWarp] = useState(null);
  const [hint, setHint] = useState(false);

  const leavingRef = useRef(false);
  const timerRef = useRef(null);

  const wrapRef = useRef(null);
  const hoverRef = useRef(false); // koi planet hover ho raha hai?
  const draggingRef = useRef(false); // abhi drag chal raha hai?
  const draggedRef = useRef(false); // abhi-abhi drag hua tha -> click ignore karo
  const velRef = useRef(1); // orbit ki speed (1 = normal drift)

  /* --------------------------------
     CHANGING ROMANTIC QUOTES
  -------------------------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  /* --------------------------------
     FIRST VISIT PULSE HINT
  -------------------------------- */

  useEffect(() => {
    let seen = false;

    try {
      seen = window.localStorage.getItem(HINT_KEY) === "1";
    } catch {
      /* storage blocked - hint dikha do */
    }

    if (seen) return undefined;

    setHint(true);

    // agar koi interact hi na kare toh 32 sec baad pulse chup ho jaata hai
    const t = setTimeout(() => setHint(false), 32000);

    return () => clearTimeout(t);
  }, []);

  const dismissHint = useCallback(() => {
    setHint(false);

    try {
      window.localStorage.setItem(HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  /* --------------------------------
     MOUSE + IDLE SWAY (3D MOVEMENT)
  -------------------------------- */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sway = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 45, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 45, damping: 20 });

  // orbit plane ka tilt (mouse upar/neeche = thoda jhukta hai)
  const planeTilt = useTransform(smoothY, [-1, 1], [64, 54]);
  // planets/sun ko seedha camera ki taraf rakhne ke liye ulta tilt
  const counterTilt = useTransform(planeTilt, (v) => -v);

  const rotateY = useTransform([smoothX, sway], ([x, s]) => x * 10 + s);
  const orbitX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const orbitY = useTransform(smoothY, [-1, 1], [-12, 12]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const controls = animate(sway, [-7, 7], {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
    });

    return () => controls.stop();
  }, [reduceMotion, sway]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, reduceMotion]);

  /* --------------------------------
     ORBIT CLOCK
     orbitTime = "virtual seconds". Har planet isi se apna angle nikalta hai.
     - normal: velRef ~ 1 (dheere ghumta rehta hai)
     - planet hover: smoothly 0 tak slow
     - drag chhodne ke baad: fling ki speed se shuru, phir dheere normal
  -------------------------------- */

  const orbitTime = useMotionValue(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!draggingRef.current) {
        const hovering = hoverRef.current;
        const target = reduceMotion || hovering ? 0 : 1;
        const rate = hovering ? 6 : 1.3;

        velRef.current +=
          (target - velRef.current) * (1 - Math.exp(-dt * rate));
        orbitTime.set(orbitTime.get() + velRef.current * dt);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [orbitTime, reduceMotion]);

  /* --------------------------------
     DRAG TO SPIN + FLING
  -------------------------------- */

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    const SECONDS_PER_PX = 0.035; // 1px drag = itne virtual seconds
    const DRAG_THRESHOLD = 6; // itna hilne ke baad hi drag maana jaata hai
    const MAX_FLING = 40;

    let pressed = false;
    let active = false;
    let startX = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;
    let pid = null;
    let clearTimer = null;

    const down = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;

      pressed = true;
      active = false;
      startX = e.clientX;
      lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
      pid = e.pointerId;
    };

    const move = (e) => {
      if (!pressed || e.pointerId !== pid) return;

      if (!active) {
        if (Math.abs(e.clientX - startX) < DRAG_THRESHOLD) return;

        active = true;
        draggingRef.current = true;
        draggedRef.current = true;
        el.classList.add("dragging");
        clearTimeout(clearTimer);
      }

      const now = performance.now();
      const dtReal = Math.max(0.008, (now - lastT) / 1000);
      const dx = e.clientX - lastX;

      // right drag = front wale planets right ki taraf
      const dv = -dx * SECONDS_PER_PX;

      orbitTime.set(orbitTime.get() + dv);

      vel = vel * 0.6 + (dv / dtReal) * 0.4;
      lastX = e.clientX;
      lastT = now;
    };

    const up = (e) => {
      if (!pressed || e.pointerId !== pid) return;

      pressed = false;

      if (active) {
        active = false;
        draggingRef.current = false;
        el.classList.remove("dragging");

        // rukkar chhoda toh fling nahi, chalte-chalte chhoda toh fling
        const idle = (performance.now() - lastT) / 1000;
        velRef.current = idle > 0.08 ? 0 : clamp(vel, -MAX_FLING, MAX_FLING);

        // drag ke turant baad wala click ignore karne ke liye
        clearTimer = setTimeout(() => {
          draggedRef.current = false;
        }, 60);
      }
    };

    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    return () => {
      clearTimeout(clearTimer);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [orbitTime]);

  /* --------------------------------
     CLICK -> WARP TRANSITION -> NEXT PAGE
  -------------------------------- */

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleEnter = useCallback(
    (e, target) => {
      // drag ke baad wala accidental click ignore
      if (draggedRef.current) {
        e.preventDefault();
        return;
      }

      // new tab / ctrl+click ko normal chalne do
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

      e.preventDefault();
      if (leavingRef.current) return;
      leavingRef.current = true;

      dismissHint();

      if (reduceMotion) {
        navigate(target.to);
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();

      setWarp({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        r: Math.hypot(window.innerWidth, window.innerHeight),
        color: target.glow,
      });

      timerRef.current = setTimeout(() => navigate(target.to), 950);
    },
    [navigate, reduceMotion, dismissHint],
  );

  return (
    <div className="universePage">
      <DreamyBackground />

      {/* cursor stardust + constellation */}
      {!reduceMotion && <StardustCanvas />}

      {/* =====================================
          SHOOTING STARS (bahut kabhi kabhi)
      ===================================== */}

      <span
        className="shootingStar"
        style={{ "--x": "85%", "--y": "18%", "--d": "4s" }}
        aria-hidden="true"
      />
      <span
        className="shootingStar"
        style={{ "--x": "62%", "--y": "10%", "--d": "11s" }}
        aria-hidden="true"
      />

      {/* =====================================
          TOP BRAND
      ===================================== */}

      <div className="universeBrand">
        <span className="brandHeart">♡</span>

        <span>H A P P I N E S S&nbsp;&nbsp; U N I V E R S E</span>
      </div>

      <div className="residentFile">
        RESIDENT FILE #0808
        <br />A UNIVERSE, FOR YOU
      </div>

      {/* =====================================
          MAIN TEXT
      ===================================== */}

      <motion.div
        className="introText"
        variants={introVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="smallLabel" variants={rise}>
          A LITTLE WORLD
        </motion.div>

        <h1>
          <motion.span className="line" variants={rise}>
            Different
          </motion.span>

          <motion.span className="line worlds" variants={rise}>
            worlds.
          </motion.span>

          <motion.em className="line" variants={rise}>
            Same you.
          </motion.em>
        </h1>

        <motion.p variants={rise}>
          Every orbit leads to a moment
          <br />
          that made you, you.
        </motion.p>
      </motion.div>

      {/* =====================================
          ROMANTIC QUOTE
      ===================================== */}

      <div className="quoteBox">
        <span className="quoteMark">“</span>

        <div className="quoteText">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease }}
            >
              {quotes[quoteIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        <span className="quoteMark bottom">”</span>

        <motion.div
          className="quoteHeart"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          ♡
        </motion.div>
      </div>

      {/* =====================================
          ORBIT SYSTEM (3D, revolving, draggable, clickable)

          orbitWrap  -> entrance fade/scale + drag area
                        (opacity yahin, 3D chain ke bahar)
          orbitStage -> perspective + centering
          orbitTilt  -> mouse parallax + rotateY
          orbitPlane -> flat "table" jo tilt hota hai (preserve-3d)
          arm        -> ring jitna bada, Z-axis pe ghumta hai
          anchor     -> arm ke upar wala point, ulta ghumta hai
          billboard  -> ulta tilt, taaki planet hamesha seedha dikhe
      ===================================== */}

      <motion.div
        ref={wrapRef}
        className="orbitWrap"
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease, delay: 0.2 }}
      >
        <div className="orbitStage">
          <div className="orbitGlow" />

          <motion.div
            className="orbitTilt"
            style={{ x: orbitX, y: orbitY, rotateY }}
          >
            <motion.div className="orbitPlane" style={{ rotateX: planeTilt }}>
              {/* ORBIT RINGS */}
              {planets.map((p, i) => (
                <div
                  key={`ring-${p.id}`}
                  className="ring"
                  style={{ "--k": String(p.ring), "--i": String(i) }}
                />
              ))}

              {/* PLANETS (har ek apni orbit mein revolve karta hai) */}
              {planets.map((p, i) => (
                <OrbitPlanet
                  key={p.id}
                  p={p}
                  index={i}
                  orbitTime={orbitTime}
                  counterTilt={counterTilt}
                  hoverRef={hoverRef}
                  hint={hint && i === 0}
                  onHover={dismissHint}
                  onEnter={handleEnter}
                />
              ))}

              {/* CENTER STAR (ye bhi clickable hai) */}
              <div className="sunSlot">
                <motion.div
                  className="sunBoard"
                  style={{ rotateX: counterTilt }}
                >
                  <Link
                    to={NEXT_PAGE}
                    draggable={false}
                    className="sunLink"
                    aria-label="Enter the universe"
                    onClick={(e) =>
                      handleEnter(e, { to: NEXT_PAGE, glow: "#ff8acb" })
                    }
                  >
                    <motion.span
                      className="sun"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [1, 1.08, 1], opacity: 1 }}
                      transition={{
                        scale: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.6,
                        },
                        opacity: { duration: 1, delay: 0.5 },
                      }}
                    >
                      <span className="sunCore">♡</span>
                    </motion.span>

                    <span className="sparkle s1" />
                    <span className="sparkle s2" />
                    <span className="sparkle s3" />
                    <span className="sparkle s4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* =====================================
          ORBIT INSTRUCTION
      ===================================== */}

      <div className="orbitInstruction">
        <span className="instructionLine" />
        DRAG TO SPIN · HOVER A PLANET
        <span className="arrow">→</span>
      </div>

      <Link
        to={NEXT_PAGE}
        draggable={false}
        className="enterOrbit"
        onClick={(e) => handleEnter(e, { to: NEXT_PAGE, glow: "#ff8acb" })}
      >
        ENTER THE ORBIT
        <span>✦</span>
      </Link>

      {/* =====================================
          RIGHT SIDE TEXT
      ===================================== */}

      <div className="sideWords">
        LOVE
        <br />
        MEMORIES
        <br />
        YOU
        <br />
        FOREVER
        <br />
        IN ALL
        <br />
        GALAXIES
      </div>

      {/* =====================================
          BOTTOM NAVIGATION
      ===================================== */}

      <div className="bottomNavigation">
        <div className="pageNumber">01 / 05</div>

        <div className="dots">
          <span className="active" />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="beginning">THE BEGINNING</div>
      </div>

      <div className="bottomMessage">
        SOME PEOPLE DON'T JUST EXIST.
        <br />
        THEY LIGHT UP THE UNIVERSE.
        <div>♡</div>
      </div>

      {/* =====================================
          WARP OVERLAY (click ke baad)
      ===================================== */}

      <AnimatePresence>
        {warp && (
          <motion.div
            className="warp"
            style={{
              background: `radial-gradient(circle at ${warp.x}px ${warp.y}px, #ffffff 0, ${warp.color} 8%, #6a1f8f 30%, #14061f 65%, #05030d 100%)`,
            }}
            initial={{ clipPath: `circle(0px at ${warp.x}px ${warp.y}px)` }}
            animate={{
              clipPath: `circle(${warp.r}px at ${warp.x}px ${warp.y}px)`,
            }}
            transition={{ duration: 0.95, ease: [0.65, 0, 0.35, 1] }}
          />
        )}
      </AnimatePresence>

      {/* =====================================
          CSS
      ===================================== */}

      <style>{`

        .universePage,
        .universePage * {
          box-sizing: border-box;
        }

        .universePage {
          position: relative;
          width: 100%;
          min-height: 100vh;
          height: 100vh;
          height: 100svh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 65% 45%,
              rgba(100,55,150,.22),
              transparent 30%
            ),
            radial-gradient(
              circle at 25% 80%,
              rgba(100,60,180,.16),
              transparent 35%
            ),
            #05030d;
          color: white;
        }

        /* decorative cheezein click na rokein */
        .universeBrand,
        .residentFile,
        .introText,
        .quoteBox,
        .sideWords,
        .bottomNavigation,
        .bottomMessage,
        .orbitInstruction,
        .shootingStar,
        .stardust {
          pointer-events: none;
        }

        /* ================================
           STARDUST CANVAS
        ================================= */

        .stardust {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          z-index: 9;
        }

        /* ================================
           SHOOTING STARS
        ================================= */

        .shootingStar {
          position: absolute;
          left: var(--x);
          top: var(--y);
          z-index: 3;

          width: 150px;
          height: 1px;

          background: linear-gradient(
            90deg,
            rgba(255,255,255,.95),
            rgba(255,170,220,.35) 40%,
            transparent
          );

          opacity: 0;

          animation: shoot 14s ease-in infinite;
          animation-delay: var(--d);
        }

        @keyframes shoot {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0) rotate(-28deg);
          }
          2% {
            opacity: 1;
          }
          9% {
            opacity: 0;
            transform: translate3d(-430px, 225px, 0) rotate(-28deg);
          }
          100% {
            opacity: 0;
            transform: translate3d(-430px, 225px, 0) rotate(-28deg);
          }
        }

        /* ================================
           TOP BRAND
        ================================= */

        .universeBrand {
          position: absolute;
          top: 38px;
          left: 48px;
          z-index: 20;

          display: flex;
          align-items: center;
          gap: 20px;

          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 5px;

          color: rgba(255,255,255,.65);
        }

        .brandHeart {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          color: #ff83c5;

          text-shadow:
            0 0 10px rgba(255,100,190,.8),
            0 0 30px rgba(255,70,180,.5);
        }

        .residentFile {
          position: absolute;
          top: 30px;
          right: 48px;
          z-index: 20;

          text-align: right;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          letter-spacing: 4px;
          line-height: 2;

          color: rgba(255,255,255,.32);
        }

        /* ================================
           INTRO
        ================================= */

        .introText {
          position: absolute;

          left: 5%;
          top: 17%;

          z-index: 10;
        }

        .smallLabel {
          margin-bottom: 20px;

          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 6px;

          color: rgba(255,255,255,.4);
        }

        .introText h1 {
          margin: 0;

          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(65px, 6vw, 100px);

          font-weight: 400;
          line-height: .88;

          letter-spacing: -3px;

          color: #fff;
        }

        .introText h1 .line {
          display: block;
        }

        .introText h1 .worlds {
          background: linear-gradient(
            90deg,
            #ef80bb,
            #ffc7e6,
            #c59bff,
            #ef80bb
          );
          background-size: 220% auto;

          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;

          animation: shimmer 7s linear infinite;
        }

        @keyframes shimmer {
          from { background-position: 0% center; }
          to   { background-position: 220% center; }
        }

        .introText h1 em {
          font-weight: 400;
        }

        .introText p {
          margin-top: 35px;

          font-family: 'Montserrat', sans-serif;
          font-size: 15px;

          line-height: 2;

          color: rgba(255,255,255,.48);
        }

        /* ================================
           QUOTE
        ================================= */

        .quoteBox {
          position: absolute;

          top: 50px;
          left: 0;
          right: 0;
          margin: 0 auto;

          width: 480px;
          max-width: 90vw;

          z-index: 30;

          text-align: center;

          font-family: 'Cormorant Garamond', serif;
          font-size: 27px;
          font-style: italic;

          color: rgba(255,255,255,.9);

          text-shadow:
            0 0 20px rgba(255,130,200,.15);
        }

        .quoteText {
          min-height: 2.4em;
          display: flex;
          align-items: center;
          justify-content: center;
          text-wrap: balance;
        }

        .quoteMark {
          display: block;

          height: 18px;

          font-size: 32px;
          line-height: 20px;

          color: #ff75bd;
        }

        .quoteMark.bottom {
          margin-top: 4px;
        }

        .quoteHeart {
          margin-top: 5px;

          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-style: normal;

          color: #ff77bf;

          text-shadow:
            0 0 15px rgba(255,80,180,.8);
        }

        /* ================================
           ORBIT: POSITIONING
           (centering CSS transform se nahi, grid se hoti hai,
            isliye framer usko overwrite nahi kar sakta)
        ================================= */

        .orbitWrap {
          position: absolute;

          top: 12%;
          bottom: 9%;
          left: 40%;
          right: 1%;

          z-index: 8;

          /* drag-to-spin ke liye */
          cursor: grab;
          touch-action: none;
          -webkit-user-select: none;
          user-select: none;
        }

        .orbitWrap.dragging,
        .orbitWrap.dragging .planetLink,
        .orbitWrap.dragging .sunLink {
          cursor: grabbing;
        }

        .orbitStage {
          --sz: min(54vw, 700px, 118vh);
          --sun: clamp(48px, calc(var(--sz) * .125), 92px);

          position: absolute;
          inset: 0;

          display: grid;
          place-items: center;

          perspective: 1400px;
        }

        .orbitGlow {
          position: absolute;
          inset: 0;
          margin: auto;

          width: calc(var(--sz) * .95);
          height: calc(var(--sz) * .55);

          border-radius: 50%;

          background: radial-gradient(
            closest-side,
            rgba(255,100,190,.17),
            transparent
          );

          filter: blur(24px);

          pointer-events: none;
        }

        /* 3D chain — is chain ke beech koi opacity / filter / overflow
           mat lagana, warna 3D flat ho jaata hai */

        .orbitTilt {
          position: relative;

          width: var(--sz);
          height: var(--sz);

          transform-style: preserve-3d;
          will-change: transform;
        }

        .orbitPlane {
          position: absolute;
          inset: 0;

          transform-style: preserve-3d;
          will-change: transform;

          pointer-events: none;
        }

        /* ================================
           ORBIT RINGS
        ================================= */

        .ring {
          position: absolute;
          inset: 0;
          margin: auto;

          width: calc(var(--k) * 100%);
          height: calc(var(--k) * 100%);

          border-radius: 50%;
          border: 1px solid rgba(255,150,220,.22);

          box-shadow:
            0 0 20px rgba(200,100,220,.06),
            inset 0 0 20px rgba(200,100,220,.04);

          pointer-events: none;

          animation: ringIn 1.6s cubic-bezier(.16,1,.3,1) both;
          animation-delay: calc(.35s + var(--i) * .14s);
        }

        @keyframes ringIn {
          from { transform: scale(.5); opacity: 0; }
          to   { transform: scale(1);  opacity: 1; }
        }

        /* ================================
           REVOLVING ARMS
           (rotation JS/framer se aati hai, CSS animation nahi)
        ================================= */

        .arm {
          position: absolute;
          inset: 0;
          margin: auto;

          width: calc(var(--k) * 100%);
          height: calc(var(--k) * 100%);

          border-radius: 50%;

          transform-style: preserve-3d;
          pointer-events: none;
        }

        .anchor {
          position: absolute;
          left: 50%;
          top: 0;

          width: 0;
          height: 0;

          transform-style: preserve-3d;
        }

        /* comet jaisi tail planet ke peeche */
        .trail {
          position: absolute;
          inset: 0;

          border-radius: 50%;

          background: conic-gradient(
            from 0deg,
            transparent 0deg 282deg,
            rgba(var(--t), .7) 360deg
          );

          -webkit-mask: radial-gradient(
            farthest-side,
            transparent calc(100% - 2px),
            #000 calc(100% - 2px)
          );
          mask: radial-gradient(
            farthest-side,
            transparent calc(100% - 2px),
            #000 calc(100% - 2px)
          );

          pointer-events: none;
        }

        .arm.rev .trail {
          transform: scaleX(-1);
        }

        /* ================================
           PLANETS
        ================================= */

        .billboard {
          position: absolute;
          left: -36px;
          top: -36px;

          width: 72px;
          height: 72px;

          pointer-events: none;
        }

        .planetLink {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 100%;
          height: 100%;

          text-decoration: none;
          cursor: pointer;
          outline: none;

          pointer-events: auto;
          -webkit-tap-highlight-color: transparent;
          -webkit-user-drag: none;
          user-select: none;
        }

        .sunLink,
        .enterOrbit {
          -webkit-user-drag: none;
          user-select: none;
        }

        .planet {
          position: relative;
          display: block;

          width: clamp(17px, calc(var(--sz) * var(--f)), 48px);
          height: clamp(17px, calc(var(--sz) * var(--f)), 48px);

          border-radius: 50%;
        }

        .planetLink:focus-visible .planet {
          outline: 2px solid rgba(255,255,255,.9);
          outline-offset: 5px;
        }

        .planetHighlight {
          position: absolute;

          width: 25%;
          height: 25%;

          top: 18%;
          left: 20%;

          border-radius: 50%;

          background: rgba(255,255,255,.9);

          filter: blur(1px);

          box-shadow:
            0 0 10px white;
        }

        .planet-pink {
          background:
            radial-gradient(
              circle at 30% 25%,
              #fff,
              #ff91ca 15%,
              #ff367f 45%,
              #9c1459 80%
            );

          box-shadow:
            0 0 20px rgba(255,70,160,.7);
        }

        .planet-purple {
          background:
            radial-gradient(
              circle at 30% 25%,
              #fff,
              #d2a5ff 20%,
              #8b49d9 55%,
              #351066
            );

          box-shadow:
            0 0 20px rgba(160,90,255,.7);
        }

        .planet-blue {
          background:
            radial-gradient(
              circle at 30% 25%,
              #fff,
              #91e4ff 20%,
              #268fd0 55%,
              #103b68
            );

          box-shadow:
            0 0 20px rgba(70,190,255,.7);
        }

        .planet-rose {
          background:
            radial-gradient(
              circle at 30% 25%,
              #fff,
              #ff9bcf 20%,
              #dc367e 60%,
              #68102f
            );

          box-shadow:
            0 0 20px rgba(255,70,160,.7);
        }

        .planet-white {
          background:
            radial-gradient(
              circle,
              white,
              #d9b7ff 35%,
              #9360ca 75%
            );

          box-shadow:
            0 0 20px white,
            0 0 40px rgba(220,170,255,.7);
        }

        /* pehli visit ka soft pulse: planet se rings phailti hain */

        .planet.hint::before,
        .planet.hint::after {
          content: "";

          position: absolute;
          inset: -3px;

          border-radius: 50%;
          border: 1.5px solid var(--glow);

          opacity: 0;
          pointer-events: none;

          animation: hintPulse 2.6s ease-out infinite;
          animation-delay: 2.6s;
        }

        .planet.hint::after {
          animation-delay: 3.9s;
        }

        @keyframes hintPulse {
          0%   { transform: scale(.85); opacity: .9; }
          100% { transform: scale(2.8); opacity: 0;  }
        }

        .planetLabel {
          position: absolute;
          left: 50%;
          top: 100%;
          margin-top: -8px;

          white-space: nowrap;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          letter-spacing: 3px;

          color: rgba(255,255,255,.85);
          text-shadow: 0 0 14px var(--glow);

          opacity: 0;
          transform: translate(-50%, 6px);

          transition:
            opacity .35s ease,
            transform .35s ease;

          pointer-events: none;
        }

        .planetLink:hover .planetLabel,
        .planetLink:focus-visible .planetLabel,
        .planetLink.hinting .planetLabel {
          opacity: 1;
          transform: translate(-50%, 0);
        }

        /* ================================
           SUN (center heart)
        ================================= */

        .sunSlot {
          position: absolute;
          left: 50%;
          top: 50%;

          width: 0;
          height: 0;

          transform-style: preserve-3d;
        }

        .sunBoard {
          position: absolute;

          width: var(--sun);
          height: var(--sun);

          left: calc(var(--sun) * -.5);
          top: calc(var(--sun) * -.5);
        }

        .sunLink {
          position: relative;

          display: grid;
          place-items: center;

          width: 100%;
          height: 100%;

          border-radius: 50%;

          cursor: pointer;
          outline: none;

          pointer-events: auto;
          -webkit-tap-highlight-color: transparent;
        }

        .sunLink:focus-visible .sun {
          outline: 2px solid rgba(255,255,255,.9);
          outline-offset: 6px;
        }

        .sunLink::before,
        .sunLink::after {
          content: "";

          position: absolute;
          inset: 0;

          border-radius: 50%;
          border: 1px solid rgba(255,140,205,.55);

          pointer-events: none;

          animation: rippleOut 3.6s ease-out infinite;
        }

        .sunLink::after {
          animation-delay: 1.8s;
        }

        @keyframes rippleOut {
          0%   { transform: scale(1);   opacity: .55; }
          100% { transform: scale(2.7); opacity: 0;   }
        }

        .sun {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 100%;
          height: 100%;

          border-radius: 50%;

          background:
            radial-gradient(
              circle at 35% 30%,
              #fff,
              #ffb3dc 20%,
              #ff5eae 45%,
              #9b2871 75%,
              #42102f
            );

          box-shadow:
            0 0 25px rgba(255,100,190,.8),
            0 0 70px rgba(255,70,170,.5),
            0 0 140px rgba(190,70,220,.25);

          transition: filter .35s ease;
        }

        .sunLink:hover .sun {
          filter: brightness(1.18) saturate(1.1);
        }

        .sunCore {
          font-family: 'Cormorant Garamond', serif;

          font-size: calc(var(--sun) * .34);

          color: white;

          text-shadow:
            0 0 10px white,
            0 0 25px #ff8ccc;
        }

        .sparkle {
          position: absolute;

          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: #fff;
          box-shadow: 0 0 8px #ff9ad5, 0 0 16px #ff6fbf;

          opacity: 0;
          pointer-events: none;

          animation: twinkle 2.8s ease-in-out infinite;
        }

        .sparkle.s1 { top: -18%;    left: 12%;   animation-delay: 0s;   }
        .sparkle.s2 { top: 8%;      right: -22%; animation-delay: .9s;  }
        .sparkle.s3 { bottom: -16%; left: 30%;   animation-delay: 1.7s; }
        .sparkle.s4 { top: 44%;     left: -24%;  animation-delay: 2.2s; }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(.4); }
          50%      { opacity: 1; transform: scale(1.3); }
        }

        /* ================================
           INSTRUCTIONS
        ================================= */

        .orbitInstruction {
          position: absolute;

          right: 4%;
          bottom: 15%;

          z-index: 30;

          display: flex;
          align-items: center;
          gap: 12px;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;

          letter-spacing: 4px;

          color: rgba(255,255,255,.4);
        }

        .instructionLine {
          width: 42px;
          height: 1px;

          background: rgba(255,255,255,.3);
        }

        .arrow {
          font-size: 16px;
          color: #ff83c5;

          animation: nudge 1.8s ease-in-out infinite;
        }

        @keyframes nudge {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(6px); }
        }

        .enterOrbit {
          position: absolute;

          left: 70%;
          bottom: 8%;
          transform: translateX(-50%);

          z-index: 30;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;

          letter-spacing: 4px;
          text-decoration: none;
          white-space: nowrap;

          color: rgba(255,255,255,.55);

          transition: color .3s ease, letter-spacing .4s ease;
        }

        .enterOrbit:hover {
          color: #fff;
          letter-spacing: 5px;
        }

        .enterOrbit span {
          display: inline-block;

          margin-left: 12px;

          color: #ff7fbd;

          font-size: 18px;

          text-shadow:
            0 0 15px #ff5cae;

          animation: spinStar 6s linear infinite;
        }

        @keyframes spinStar {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ================================
           SIDE WORDS
        ================================= */

        .sideWords {
          position: absolute;

          right: 1.5%;
          top: 40%;

          z-index: 20;

          text-align: center;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;

          line-height: 3;

          letter-spacing: 5px;

          color: rgba(255,255,255,.24);
        }

        /* ================================
           BOTTOM
        ================================= */

        .bottomNavigation {
          position: absolute;

          left: 4%;
          bottom: 32px;

          z-index: 30;

          display: flex;
          align-items: center;
          gap: 18px;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;

          letter-spacing: 3px;

          color: rgba(255,255,255,.4);
        }

        .dots {
          display: flex;
          gap: 8px;
        }

        .dots span {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          border: 1px solid rgba(255,255,255,.3);
        }

        .dots .active {
          background: #ff7fbd;

          border-color: #ff7fbd;

          box-shadow:
            0 0 12px #ff7fbd;
        }

        .beginning {
          margin-left: 8px;
        }

        .bottomMessage {
          position: absolute;

          bottom: 30px;
          left: 50%;

          transform: translateX(-50%);

          text-align: center;

          font-family: 'Montserrat', sans-serif;
          font-size: 8px;

          line-height: 1.8;

          letter-spacing: 4px;

          color: rgba(255,255,255,.22);
        }

        .bottomMessage div {
          margin-top: 12px;

          font-size: 22px;

          color: #ff72bb;

          text-shadow:
            0 0 15px #ff72bb;
        }

        /* ================================
           WARP OVERLAY
        ================================= */

        .warp {
          position: fixed;
          inset: 0;

          z-index: 200;

          pointer-events: all;
        }

        /* ================================
           TABLET
        ================================= */

        @media (max-width: 1100px) {

          .introText {
            left: 4%;
          }

          .introText h1 {
            font-size: 70px;
          }

          .orbitWrap {
            left: 38%;
          }

          .orbitStage {
            --sz: min(58vw, 560px, 118vh);
          }

          .quoteBox {
            width: 420px;
            font-size: 23px;
          }

          .enterOrbit {
            left: 68%;
          }

        }

        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 768px) {

          .universePage {
            min-height: 100svh;
            height: 100svh;
            overflow: hidden;
          }

          .universeBrand {
            top: 22px;
            left: 20px;

            font-size: 8px;
            letter-spacing: 3px;

            gap: 8px;
          }

          .brandHeart {
            font-size: 24px;
          }

          .residentFile {
            top: 20px;
            right: 20px;

            font-size: 6px;
            letter-spacing: 2px;
          }

          .introText {
            left: 25px;
            top: 15%;
          }

          .smallLabel {
            font-size: 7px;
            letter-spacing: 4px;
          }

          .introText h1 {
            font-size: 48px;
            letter-spacing: -1px;
          }

          .introText p {
            margin-top: 20px;

            font-size: 11px;

            line-height: 1.8;
          }

          .quoteBox {
            top: 28px;

            width: 240px;

            font-size: 17px;
          }

          /* mobile pe poora universe main visual banta hai */

          .orbitWrap {
            left: 0;
            right: 0;

            top: 40%;
            bottom: 7%;
          }

          .orbitStage {
            --sz: min(92vw, 420px);
          }

          .billboard {
            left: -28px;
            top: -28px;

            width: 56px;
            height: 56px;
          }

          .planetLabel {
            font-size: 7px;
            letter-spacing: 2px;
          }

          .sideWords {
            display: none;
          }

          .orbitInstruction {
            right: 20px;
            bottom: 11%;

            font-size: 6px;
            letter-spacing: 2px;
          }

          .enterOrbit {
            display: none;
          }

          .bottomNavigation {
            left: 20px;
            bottom: 18px;

            font-size: 7px;
          }

          .bottomMessage {
            display: none;
          }
        }

        /* touch devices pe hover nahi hota, labels hamesha halke dikhen */

        @media (hover: none) {
          .planetLabel {
            opacity: .7;
            transform: translate(-50%, 0);
          }
        }

        /* ================================
           REDUCED MOTION
           (orbit ka ghumna JS mein band hota hai)
        ================================= */

        @media (prefers-reduced-motion: reduce) {
          .ring,
          .shootingStar,
          .sparkle,
          .sunLink::before,
          .sunLink::after,
          .introText h1 .worlds,
          .arrow,
          .enterOrbit span,
          .planet.hint::before,
          .planet.hint::after {
            animation: none !important;
          }

          .ring {
            opacity: 1;
          }
        }

      `}</style>
    </div>
  );
}
