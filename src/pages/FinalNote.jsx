import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import {
  animate,
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/* =========================================================
   SCARF SETTINGS (yahan se text/feel badal sakte ho)
========================================================= */

const HINT_LINE = "tap the red scarf ♡";
const WRAP_LINE = "Tumhe kabhi thand nahi lagne dunga. ♡";

const SAG = 9; // scarf ka halka sa jhukav jab wo card pe lipta ho

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const clamp01 = (v) => clamp(v, 0, 1);

/* =========================================================
   FLOATING STARS
========================================================= */

function Stars({ count = 90 }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 3,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 4,
      })),
    [count],
  );

  return (
    <div className="stars">
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.15, 1, 0.15],
            scale: [0.7, 1.5, 0.7],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   FLOATING HEARTS
========================================================= */

function FloatingHearts({ count = 18 }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 16,
        delay: Math.random() * 10,
        duration: 9 + Math.random() * 9,
        drift: (Math.random() - 0.5) * 120,
      })),
    [count],
  );

  return (
    <div className="heartField">
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          className="floatingHeart"
          style={{
            left: `${heart.left}%`,
            fontSize: heart.size,
          }}
          initial={{
            y: "110vh",
            opacity: 0,
          }}
          animate={{
            y: "-15vh",
            x: heart.drift,
            opacity: [0, 0.55, 0.55, 0],
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ❤️
        </motion.span>
      ))}
    </div>
  );
}

/* =========================================================
   WIND (background)
   Patli, dheere behti hawa ki lakeeren — scarf ki kahani ka mahaul
========================================================= */

function WindLayer({ count = 9 }) {
  const streaks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        y: 8 + Math.random() * 84,
        w: 90 + Math.random() * 220,
        d: 9 + Math.random() * 9,
        dl: -Math.random() * 14,
      })),
    [count],
  );

  return (
    <div className="windLayer" aria-hidden="true">
      {streaks.map((s) => (
        <span
          key={s.id}
          className="windStreak"
          style={{
            "--y": `${s.y}%`,
            "--w": `${s.w}px`,
            "--d": `${s.d}s`,
            "--dl": `${s.dl}s`,
          }}
        />
      ))}
    </div>
  );
}

/* Scarf lipatne ke waqt ek tez hawa ka jhonka */

function Gust({ trigger }) {
  const streaks = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        y: 6 + Math.random() * 88,
        w: 80 + Math.random() * 200,
        h: Math.random() > 0.7 ? 2 : 1,
        delay: Math.random() * 0.55,
        duration: 0.9 + Math.random() * 0.9,
        pink: Math.random() > 0.5,
      })),
    // naye trigger pe naye random streaks
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trigger],
  );

  if (!trigger) return null;

  return (
    <div className="gust" aria-hidden="true" key={trigger}>
      {streaks.map((s) => (
        <motion.span
          key={s.id}
          className="gustStreak"
          style={{
            top: `${s.y}%`,
            width: s.w,
            height: s.h,
            background: s.pink
              ? "linear-gradient(90deg, transparent, rgba(255,150,180,.85), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,235,245,.8), transparent)",
          }}
          initial={{ x: "-25vw", opacity: 0 }}
          animate={{ x: "125vw", opacity: [0, 0.9, 0] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            ease: [0.3, 0.1, 0.3, 1],
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   GIFT BOX
========================================================= */

function GiftBox({ side, opened, onOpen, icon, title }) {
  return (
    <motion.div
      className={`giftArea ${side}`}
      initial={{ opacity: 0, x: side === "left" ? -80 : 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 1,
        delay: side === "left" ? 0.5 : 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.button
            key="closed"
            className="giftButton"
            onClick={onOpen}
            whileHover={{
              scale: 1.08,
              y: -8,
              rotate: side === "left" ? -3 : 3,
            }}
            whileTap={{ scale: 0.94 }}
          >
            <div className="giftGlow"></div>

            <div className="giftBox">
              <div className="giftLid">
                <span></span>
              </div>

              <div className="giftBody">
                <div className="giftRibbonVertical"></div>
                <div className="giftRibbonHorizontal"></div>

                <div className="giftBow">
                  <i></i>
                  <i></i>
                </div>

                <span className="giftStar">✦</span>
              </div>
            </div>

            <div className="giftTitle">
              <span>{icon}</span>
              {title}
            </div>

            <small>tap to open ✨</small>
          </motion.button>
        ) : (
          <motion.div
            key="opened"
            className="giftMessage"
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="openedGift">🎁</div>

            <div className="messageSparkle">✦</div>

            <p>
              {side === "left"
                ? "“There’s still one heart you haven't caught yet… maybe next year.” 👀❤️"
                : "When u miss me... Call me. 📞❤️"}
            </p>

            <span>♡ a little reminder from me ♡</span>

            <button onClick={onOpen}>close gift</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* =========================================================
   THE RED SCARF

   Kaise kaam karta hai:
   - Scarf ek lambi lal patti hai jo screen ke left se hawa mein behti hui
     letter ke "gale" (heading aur message ke beech ki line) tak aati hai.
   - Click karo: patti card ke upar se guzarti hui right side tak lipat jaati
     hai, gaanth banti hai, aur do sire hawa mein lehrane lagte hain.
   - Dobara click: khul jaata hai.

   Sab kuch SVG mein khud draw kiya hai (koi image/anime asset nahi).
   Har frame pe sirf path ke coordinates update hote hain, isliye smooth hai.
========================================================= */

function fringePath(px, py, dx, dy, w, t, len = 11) {
  const nx = -dy;
  const ny = dx;

  let s = "";

  for (let k = -4; k <= 4; k += 1) {
    const off = (k / 4) * (w / 2 - 1.5);
    const bx = px + nx * off;
    const by = py + ny * off;
    const flick = Math.sin(t * 5 + k * 1.3) * 2.2;

    s += `M${bx.toFixed(1)} ${by.toFixed(1)}L${(bx + dx * len + nx * flick).toFixed(1)} ${(by + dy * len + ny * flick).toFixed(1)}`;
  }

  return s;
}

function pathOf(pts, dy = 0) {
  let s = `M${pts[0].x.toFixed(1)} ${(pts[0].y + dy).toFixed(1)}`;

  for (let i = 1; i < pts.length; i += 1) {
    s += `L${pts[i].x.toFixed(1)} ${(pts[i].y + dy).toFixed(1)}`;
  }

  return s;
}

const ScarfLayer = memo(function ScarfLayer({
  geo,
  wrapped,
  onToggle,
  reduce,
}) {
  const { W, y: y0, left, right } = geo;

  // SVG ka canvas: left offscreen se lekar right (tails ke liye) tak
  const xMin = -(left + 90);
  const xMax = W + right + 90;
  const svgW = xMax - xMin;
  const svgTop = y0 - 130;
  const svgH = 400;

  const idleX = Math.round(W * 0.16); // wrap se pehle patti ka sira yahan tak
  const endX = W + 16; // wrap ke baad patti card ke right edge ke paar

  const reveal = useMotionValue(idleX);
  const tailP = useMotionValue(0);
  const knotS = useMotionValue(0);

  const els = useRef({});
  const hoverRef = useRef(false);
  const prevWrapped = useRef(wrapped);

  const r = (key) => (el) => {
    els.current[key] = el;
  };

  /* ---------- wrap / unwrap animation ---------- */

  useEffect(() => {
    // sirf geometry badli hai (resize) — animation dobara mat chalao
    if (prevWrapped.current === wrapped) {
      reveal.set(wrapped ? endX : idleX);
      return undefined;
    }

    prevWrapped.current = wrapped;

    const dur = (s) => (reduce ? 0 : s);
    const controls = [];

    if (wrapped) {
      controls.push(
        animate(reveal, endX, {
          duration: dur(1.5),
          ease: [0.5, 0, 0.2, 1],
        }),
      );

      controls.push(
        animate(
          knotS,
          1,
          reduce
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: 240,
                damping: 13,
                delay: 1.25,
              },
        ),
      );

      controls.push(
        animate(tailP, 1, {
          duration: dur(1.4),
          delay: dur(1.35),
          ease: [0.2, 0.8, 0.25, 1],
        }),
      );
    } else {
      controls.push(animate(tailP, 0, { duration: dur(0.6), ease: "easeIn" }));

      controls.push(animate(knotS, 0, { duration: dur(0.35) }));

      controls.push(
        animate(reveal, idleX, {
          duration: dur(1.1),
          delay: dur(0.35),
          ease: [0.5, 0, 0.2, 1],
        }),
      );
    }

    return () => controls.forEach((c) => c.stop());
  }, [wrapped, idleX, endX, reduce, reveal, knotS, tailP]);

  /* ---------- per-frame drawing ---------- */

  useEffect(() => {
    const set = (key, d) => {
      const el = els.current[key];
      if (el) el.setAttribute("d", d);
    };

    const setAttr = (key, name, value) => {
      const el = els.current[key];
      if (el) el.setAttribute(name, value);
    };

    // patti ki lehar: left mein hawa mein behti hai, card pe aate hi tight
    const bandY = (x, t, wrapAmt) => {
      let y = y0;

      if (x < 0) {
        const k = Math.min(1, -x / 260);
        const amp = 30 * k * k * (3 - 2 * k);

        y +=
          (amp *
            (Math.sin(x * 0.017 - t * 2.1) +
              0.5 * Math.sin(x * 0.036 - t * 3.3 + 1.3))) /
          1.5;
      }

      if (x > 0) {
        const u = Math.min(1, x / W);
        y += SAG * wrapAmt * Math.sin(Math.PI * u);
      }

      return y;
    };

    const ribbon = (name, pts, w) => {
      const base = pathOf(pts);

      set(`${name}-sh`, pathOf(pts, 5));
      set(`${name}-base`, base);
      set(`${name}-rib`, base);
      set(`${name}-hi`, pathOf(pts, -w * 0.26));
      set(`${name}-lo`, pathOf(pts, w * 0.3));

      return base;
    };

    const kx = W - clamp(W * 0.13, 34, 72);
    const roomRight = right + 40 >= 140;

    // do sire (tails): jagah ho toh hawa mein peeche, warna chhote aur neeche
    const tails = [
      {
        name: "tA",
        ang: roomRight ? 0.16 : 0.5,
        L: roomRight ? clamp(right + 100, 150, 250) : 120,
        amp: 15,
        lam: 90,
        ph: 0,
        droop: 46,
        w: 24,
        ox: 0,
        oy: -4,
      },
      {
        name: "tB",
        ang: roomRight ? 0.5 : 0.85,
        L: roomRight ? clamp(right + 40, 120, 200) : 90,
        amp: 12,
        lam: 78,
        ph: 1.9,
        droop: 34,
        w: 24,
        ox: 2,
        oy: 5,
      },
    ];

    let raf = 0;
    let hv = 0;
    const t0 = performance.now();

    const frame = (now) => {
      const t = reduce ? 0 : (now - t0) / 1000;
      const rv = reveal.get();
      const wrapAmt = clamp01((rv - idleX) / (endX - idleX));

      /* ----- main patti ----- */

      const pts = [];

      for (let x = xMin; x < rv; x += 8) {
        pts.push({ x, y: bandY(x, t, wrapAmt) });
      }

      pts.push({ x: rv, y: bandY(rv, t, wrapAmt) });

      const base = ribbon("band", pts, 28);

      set("hit", base);
      set("glow", base);

      hv += ((hoverRef.current ? 1 : 0) - hv) * 0.12;
      setAttr("glow", "stroke-opacity", (0.1 + 0.16 * hv).toFixed(3));

      // patti ke sire ka jhalar (jab tak card ke paar nahi gaya)
      const last = pts[pts.length - 1];

      set("fringeTip", fringePath(last.x, last.y, 1, 0, 28, t, 11));
      setAttr(
        "fringeTip",
        "opacity",
        (1 - clamp01((rv - (W - 40)) / 40)).toFixed(2),
      );

      // right edge pe patti kapde ki tarah peeche mudti hui
      setAttr("edge", "opacity", wrapAmt.toFixed(2));

      /* ----- gaanth + sire ----- */

      const tp = tailP.get();
      const ks = knotS.get();
      const ky = y0 + SAG * wrapAmt * Math.sin(Math.PI * clamp01(kx / W));

      tails.forEach((tl) => {
        const Lc = tl.L * tp;

        if (Lc < 3) {
          setAttr(`${tl.name}-grp`, "opacity", "0");
          return;
        }

        setAttr(`${tl.name}-grp`, "opacity", "1");

        const ang = tl.ang + 0.05 * Math.sin(t * 0.9 + tl.ph);
        const dx = Math.cos(ang);
        const dy = Math.sin(ang);
        const nx = -dy;
        const ny = dx;

        const N = 30;
        const tpts = [];

        for (let i = 0; i <= N; i += 1) {
          const s = (i / N) * Lc;
          const u = s / tl.L;

          const wave =
            tl.amp *
            Math.pow(u, 1.15) *
            Math.sin((s / tl.lam) * Math.PI * 2 - t * 3.4 + tl.ph);

          tpts.push({
            x: kx + tl.ox + dx * s + nx * wave,
            y: ky + tl.oy + dy * s + ny * wave + tl.droop * u * u,
          });
        }

        ribbon(tl.name, tpts, tl.w);

        const a = tpts[tpts.length - 2];
        const b = tpts[tpts.length - 1];
        const ex = b.x - a.x;
        const ey = b.y - a.y;
        const el = Math.hypot(ex, ey) || 1;

        set(
          `${tl.name}-fringe`,
          fringePath(b.x, b.y, ex / el, ey / el, tl.w, t, 11),
        );
      });

      setAttr(
        "knot",
        "transform",
        `translate(${kx.toFixed(1)} ${ky.toFixed(1)}) rotate(-6) scale(${Math.max(
          ks,
          0.0001,
        ).toFixed(3)})`,
      );
      setAttr("knot", "opacity", ks < 0.02 ? "0" : "1");

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
  }, [W, y0, right, xMin, idleX, endX, reduce, reveal, tailP, knotS]);

  /* ---------- artwork ---------- */

  const layers = (name, w) => (
    <>
      <path
        ref={r(`${name}-sh`)}
        fill="none"
        stroke="rgba(0,0,0,.38)"
        strokeWidth={w + 2}
      />
      <path
        ref={r(`${name}-base`)}
        fill="none"
        stroke="#b01223"
        strokeWidth={w}
      />
      <path
        ref={r(`${name}-rib`)}
        fill="none"
        stroke="rgba(45,0,10,.32)"
        strokeWidth={w}
        strokeDasharray="1.3 5.2"
      />
      <path
        ref={r(`${name}-hi`)}
        fill="none"
        stroke="rgba(255,150,150,.3)"
        strokeWidth={w * 0.28}
      />
      <path
        ref={r(`${name}-lo`)}
        fill="none"
        stroke="rgba(60,0,12,.35)"
        strokeWidth={w * 0.3}
      />
    </>
  );

  return (
    <svg
      className="scarfSvg"
      width={svgW}
      height={svgH}
      viewBox={`${xMin} ${svgTop} ${svgW} ${svgH}`}
      style={{ left: xMin, top: svgTop }}
      role="group"
    >
      <defs>
        <linearGradient id="scarfKnotGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d4283d" />
          <stop offset="1" stopColor="#84091a" />
        </linearGradient>

        <linearGradient id="scarfEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(40,4,12,0)" />
          <stop offset="1" stopColor="rgba(40,4,12,.85)" />
        </linearGradient>

        <pattern
          id="scarfRibs"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(18)"
        >
          <rect width="1.3" height="6" fill="rgba(45,0,10,.3)" />
        </pattern>
      </defs>

      {/* halka lal glow */}
      <path
        ref={r("glow")}
        fill="none"
        stroke="#ff3b57"
        strokeWidth="46"
        strokeOpacity=".1"
      />

      {/* main patti */}
      {layers("band", 28)}

      {/* right edge: patti card ke peeche mud rahi hai */}
      <rect
        ref={r("edge")}
        x={W - 3}
        y={y0 - 15}
        width="19"
        height="30"
        rx="9"
        fill="url(#scarfEdge)"
        opacity="0"
      />

      {/* patti ka sira (wrap se pehle) */}
      <path
        ref={r("fringeTip")}
        fill="none"
        stroke="#b01223"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* sire */}
      {["tA", "tB"].map((name) => (
        <g key={name} ref={r(`${name}-grp`)} opacity="0">
          {layers(name, 24)}
          <path
            ref={r(`${name}-fringe`)}
            fill="none"
            stroke="#b01223"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* gaanth */}
      <g ref={r("knot")} opacity="0">
        <ellipse cx="0" cy="22" rx="24" ry="6" fill="rgba(0,0,0,.3)" />
        <rect
          x="-25"
          y="-21"
          width="50"
          height="42"
          rx="14"
          fill="url(#scarfKnotGrad)"
        />
        <rect
          x="-25"
          y="-21"
          width="50"
          height="42"
          rx="14"
          fill="url(#scarfRibs)"
        />
        <path
          d="M-16 -12 C -6 -4, 6 -4, 16 -12"
          fill="none"
          stroke="rgba(255,170,170,.38)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M-18 8 C -6 16, 8 16, 18 6"
          fill="none"
          stroke="rgba(50,0,10,.42)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M-4 -20 C -8 -6, -8 6, -4 20"
          fill="none"
          stroke="rgba(50,0,10,.3)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>

      {/* click karne ka ishara (sirf wrap se pehle) */}
      {!wrapped && (
        <g style={{ pointerEvents: "none" }}>
          <circle
            className="tipRing"
            cx={idleX}
            cy={y0}
            r="18"
            fill="none"
            stroke="#ff8fa3"
            strokeWidth="1.2"
          />
          <circle
            className="tipRing d2"
            cx={idleX}
            cy={y0}
            r="18"
            fill="none"
            stroke="#ff8fa3"
            strokeWidth="1.2"
          />
        </g>
      )}

      {/* click area: poori patti (transparent, mote stroke se) */}
      <path
        ref={r("hit")}
        className="scarfHit"
        fill="none"
        stroke="transparent"
        strokeWidth="56"
        role="button"
        tabIndex={0}
        aria-label={wrapped ? "Unwrap the scarf" : "Wrap the scarf"}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        onPointerEnter={() => {
          hoverRef.current = true;
        }}
        onPointerLeave={() => {
          hoverRef.current = false;
        }}
      />
    </svg>
  );
});

/* =========================================================
   COUNTDOWN
========================================================= */

function getNextBirthday() {
  const now = new Date();

  let year = now.getFullYear();

  let target = new Date(year, 7, 9, 0, 0, 0);

  if (target <= now) {
    target = new Date(year + 1, 7, 9, 0, 0, 0);
  }

  return target;
}

/*
   Calendar-aware difference.

   Instead of converting everything into milliseconds,
   this keeps MONTHS separate from DAYS.
*/

function calculateCountdown(target) {
  const now = new Date();

  let months =
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth());

  let anchor = new Date(now);

  anchor.setMonth(anchor.getMonth() + months);

  if (anchor > target) {
    months--;
    anchor = new Date(now);
    anchor.setMonth(anchor.getMonth() + months);
  }

  let remaining = target.getTime() - anchor.getTime();

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));

  remaining -= days * 1000 * 60 * 60 * 24;

  const hours = Math.floor(remaining / (1000 * 60 * 60));

  remaining -= hours * 1000 * 60 * 60;

  const minutes = Math.floor(remaining / (1000 * 60));

  remaining -= minutes * 1000 * 60;

  const seconds = Math.floor(remaining / 1000);

  return {
    months,
    days,
    hours,
    minutes,
    seconds,
  };
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function FinalNote() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [leftGift, setLeftGift] = useState(false);
  const [rightGift, setRightGift] = useState(false);

  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(getNextBirthday()),
  );

  /* ---------------- SCARF STATE ---------------- */

  const [wrapped, setWrapped] = useState(false);
  const [gust, setGust] = useState(0);
  const [geo, setGeo] = useState(null);

  const wrapRef = useRef(null);
  const contentRef = useRef(null);
  const dividerRef = useRef(null);
  const busyRef = useRef(false);

  const toggleScarf = useCallback(() => {
    if (busyRef.current) return;

    busyRef.current = true;
    setTimeout(() => {
      busyRef.current = false;
    }, 2400);

    setWrapped((w) => !w);
    setGust((g) => g + 1);
  }, []);

  /* card ke andar "gale" wali line (heading aur message ke beech) dhundho */

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const content = contentRef.current;
    const divider = dividerRef.current;

    if (!wrap || !content || !divider) return;

    const W = wrap.offsetWidth;
    const y = content.offsetTop + divider.offsetTop + divider.offsetHeight / 2;
    const parent = wrap.offsetParent;
    const pw = parent ? parent.clientWidth : window.innerWidth;
    const left = wrap.offsetLeft;
    const right = pw - left - W;

    setGeo((prev) => {
      if (
        prev &&
        Math.abs(prev.W - W) < 0.5 &&
        Math.abs(prev.y - y) < 0.5 &&
        Math.abs(prev.left - left) < 0.5 &&
        Math.abs(prev.right - right) < 0.5
      ) {
        return prev;
      }

      return { W, y, left, right };
    });
  }, []);

  useEffect(() => {
    measure();

    let ro;

    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);

      if (wrapRef.current) ro.observe(wrapRef.current);
      if (contentRef.current) ro.observe(contentRef.current);
    }

    window.addEventListener("resize", measure);

    // fonts load hone ke baad heading ki height badal sakti hai
    const t1 = setTimeout(measure, 600);
    const t2 = setTimeout(measure, 1600);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [measure]);

  /* ---------------- REAL LIVE COUNTDOWN ---------------- */

  useEffect(() => {
    const update = () => {
      const target = getNextBirthday();

      setCountdown(calculateCountdown(target));
    };

    update();

    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ---------------- 3D CARD ---------------- */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 130,
    damping: 22,
  });

  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 130,
    damping: 22,
  });

  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();

    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div className="finalUniverse">
      {/* ================= BACKGROUND ================= */}

      <div className="nebula nebula1"></div>
      <div className="nebula nebula2"></div>
      <div className="nebula nebula3"></div>

      <div className="galaxy galaxy1"></div>
      <div className="galaxy galaxy2"></div>

      <div className={`warmGlow ${wrapped ? "on" : ""}`}></div>

      <div className="moon">
        <div className="moonGlow"></div>
        <div className="moonSurface"></div>
      </div>

      <Stars />
      <WindLayer />
      <FloatingHearts />
      <Gust trigger={gust} />

      {/* hanging stars */}

      <div className="hangingStar hanging1">✦</div>
      <div className="hangingStar hanging2">✦</div>
      <div className="hangingStar hanging3">✧</div>

      {/* ================= TOP TEXT ================= */}

      <motion.div
        className="topUniverseText"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <span>♡ TO MY FAVOURITE HUMAN ♡</span>
      </motion.div>

      {/* scarf ka hint / wrap ke baad ki line (same jagah) */}

      <AnimatePresence mode="wait">
        {!wrapped ? (
          <motion.div
            key="hint"
            className="scarfNote hintNote"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 3.2 },
            }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.35 } }}
          >
            <span>{HINT_LINE}</span>
          </motion.div>
        ) : (
          <motion.div
            key="caption"
            className="scarfNote captionNote"
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 1.1, delay: 2.1 },
            }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.35 } }}
          >
            {WRAP_LINE}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= LEFT GIFT ================= */}

      <GiftBox
        side="left"
        opened={leftGift}
        onOpen={() => setLeftGift(!leftGift)}
        icon="❤️"
        title="A Little Reminder"
      />

      {/* ================= RIGHT GIFT ================= */}

      <GiftBox
        side="right"
        opened={rightGift}
        onOpen={() => setRightGift(!rightGift)}
        icon="📞"
        title="One More Thing"
      />

      {/* ================= MAIN LETTER ================= */}

      <motion.div
        ref={wrapRef}
        className="letterWrap"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1400,
          "--glow-x": glowX,
          "--glow-y": glowY,
        }}
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.94,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className={`letter ${wrapped ? "wrapped" : ""}`}>
          <div className="letterGlow"></div>

          <div className="letterTopLine">
            <span></span>
            <i>♡</i>
            <span></span>
          </div>

          <div className="letterContent" ref={contentRef}>
            {/* heading */}

            <motion.div
              className="birthdayHeading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <small>HAPPY BIRTHDAY</small>

              <h1>
                <Typewriter
                  words={["Bachu ♡"]}
                  loop={1}
                  cursor
                  cursorStyle="|"
                  typeSpeed={100}
                  deleteSpeed={0}
                  delaySpeed={999999}
                />
              </h1>
            </motion.div>

            {/* divider */}

            <div className="goldDivider" ref={dividerRef}>
              <span>✦</span>
              <div></div>
              <span>♡</span>
              <div></div>
              <span>✦</span>
            </div>

            {/* message */}

            <motion.div
              className="message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <p>
                Tmare liye mera dher sara <b>PAYAR</b>
                <br />
                aur mera sara <b>WAQT.</b> ♡
              </p>

              <p>
                Hamesa khus raho tm.
                <br />
                Achhi lagti ho jab smile kerti ho,
                <br />
                CUTU si smile hai tmari. ❤️
              </p>

              <p className="specialLine">I am always there for u. ❤️</p>

              <p className="poetry">
                I guess more beautiful memories are still
                <br />
                waiting to be written...
                <br />
                <em>Arz Kiya Hai...</em>
                <br />
                Humne bhi likha kuch tere barre mein aise,
                <br />
                tu lage ki <strong>GULAB</strong> hai. 🌹
              </p>
            </motion.div>

            {/* ================= COUNTDOWN ================= */}

            <motion.div
              className="countdownSection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 2,
                duration: 0.8,
              }}
            >
              <div className="countdownTitle">
                <span>♡</span>
                <p>UNTIL YOUR NEXT BIRTHDAY</p>
                <span>♡</span>
              </div>

              <div className="countdown">
                <CountdownBox value={countdown.months} label="MONTHS" />

                <CountdownBox value={countdown.days} label="DAYS" />

                <CountdownBox value={countdown.hours} label="HOURS" />

                <CountdownBox value={countdown.minutes} label="MINUTES" />

                <CountdownBox
                  value={countdown.seconds}
                  label="SECONDS"
                  highlight
                />
              </div>

              <div className="waitingText">
                <span>✦</span>
                because some birthdays are worth waiting for
                <span>✦</span>
              </div>

              <div className="nextBirthday">
                <span>♡</span>
                09 AUGUST
                <span>♡</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* lal scarf: card ke bahar bhi ja sakta hai, isliye .letter ke bahar */}
        {geo && (
          <ScarfLayer
            geo={geo}
            wrapped={wrapped}
            onToggle={toggleScarf}
            reduce={!!reduceMotion}
          />
        )}
      </motion.div>

      {/* ================= BOTTOM ================= */}

      <motion.div
        className="bottomSection"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
      >
        <div className="bottomQuote">
          ✨ More laughs. More adventures. More birthdays. Together. ✨
        </div>

        <motion.button
          className="replayBtn"
          onClick={() => navigate("/")}
          whileHover={{
            scale: 1.05,
            y: -3,
          }}
          whileTap={{
            scale: 0.96,
          }}
        >
          ↺ &nbsp; Replay Our Story
        </motion.button>

        <div className="fanText">Forever Your Biggest Fan ♡</div>
      </motion.div>

      {/* =====================================================
         STYLES
      ===================================================== */}

      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=Italianno&display=swap');

        *{
          box-sizing:border-box;
        }

        .finalUniverse{
          min-height:100vh;
          width:100%;
          position:relative;
          overflow:hidden;

          display:flex;
          justify-content:center;
          align-items:center;

          color:white;

          font-family:'DM Sans',sans-serif;

          /* neeche halki crimson roshni — scarf ke rang se milti hui */
          background:
            radial-gradient(
              ellipse 80% 40% at 50% 108%,
              rgba(190,30,70,.22),
              transparent 65%
            ),
            radial-gradient(
              ellipse at 50% 40%,
              #35184f 0%,
              #1b102d 38%,
              #0b0715 75%,
              #05030b 100%
            );
        }


        /* =====================================================
           SPACE
        ===================================================== */

        .nebula{
          position:absolute;
          border-radius:50%;
          filter:blur(70px);
          pointer-events:none;
          opacity:.6;
        }

        .nebula1{
          width:600px;
          height:280px;
          left:-170px;
          top:15%;

          background:
            radial-gradient(
              ellipse,
              rgba(230,94,255,.35),
              rgba(128,50,255,.12),
              transparent 70%
            );

          transform:rotate(-20deg);
          animation:nebulaMove 18s ease-in-out infinite;
        }

        .nebula2{
          width:650px;
          height:300px;
          right:-180px;
          top:5%;

          background:
            radial-gradient(
              ellipse,
              rgba(255,105,180,.3),
              rgba(105,60,255,.15),
              transparent 70%
            );

          transform:rotate(20deg);
          animation:nebulaMove 22s ease-in-out infinite reverse;
        }

        .nebula3{
          width:900px;
          height:300px;
          bottom:-100px;
          left:50%;
          transform:translateX(-50%);

          background:
            radial-gradient(
              ellipse,
              rgba(255,70,110,.24),
              transparent 70%
            );

          filter:blur(90px);
        }

        @keyframes nebulaMove{
          0%,100%{
            transform:translateY(0) rotate(-20deg) scale(1);
          }

          50%{
            transform:translateY(-35px) rotate(-15deg) scale(1.08);
          }
        }


        .galaxy{
          position:absolute;
          width:700px;
          height:700px;
          border-radius:50%;
          opacity:.22;
          pointer-events:none;
          filter:blur(1px);
        }

        .galaxy1{
          top:-430px;
          right:-200px;

          background:
            conic-gradient(
              from 20deg,
              transparent,
              rgba(255,160,220,.8),
              transparent 25%,
              rgba(120,100,255,.5),
              transparent 55%,
              rgba(255,150,220,.5),
              transparent
            );

          animation:galaxyRotate 50s linear infinite;
        }

        .galaxy2{
          bottom:-550px;
          left:-300px;

          background:
            conic-gradient(
              from 80deg,
              transparent,
              rgba(180,100,255,.5),
              transparent 30%,
              rgba(255,100,200,.5),
              transparent
            );

          animation:galaxyRotate 70s linear infinite reverse;
        }

        @keyframes galaxyRotate{
          to{
            transform:rotate(360deg);
          }
        }

        /* scarf wrap hone pe poori screen halki lal-garam ho jaati hai */

        .warmGlow{
          position:absolute;
          inset:0;
          z-index:1;
          pointer-events:none;

          opacity:0;
          transition:opacity 2.4s ease;

          background:
            radial-gradient(
              ellipse 75% 45% at 50% 105%,
              rgba(255,50,85,.3),
              transparent 70%
            ),
            radial-gradient(
              ellipse 40% 32% at 85% 46%,
              rgba(255,70,100,.13),
              transparent 70%
            ),
            radial-gradient(
              ellipse 40% 32% at 12% 46%,
              rgba(255,70,100,.1),
              transparent 70%
            );
        }

        .warmGlow.on{
          opacity:1;
        }


        /* =====================================================
           WIND
        ===================================================== */

        .windLayer{
          position:absolute;
          inset:0;
          z-index:2;
          pointer-events:none;
          overflow:hidden;
        }

        .windStreak{
          position:absolute;
          left:0;
          top:var(--y);

          width:var(--w);
          height:1px;

          opacity:0;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,210,230,.5),
              transparent
            );

          animation:windMove var(--d) linear infinite;
          animation-delay:var(--dl);
        }

        @keyframes windMove{
          0%{
            transform:translateX(-25vw);
            opacity:0;
          }

          15%,80%{
            opacity:.5;
          }

          100%{
            transform:translateX(125vw);
            opacity:0;
          }
        }

        .gust{
          position:absolute;
          inset:0;
          z-index:25;
          pointer-events:none;
          overflow:hidden;
        }

        .gustStreak{
          position:absolute;
          left:0;
          border-radius:2px;
        }


        /* =====================================================
           STARS
        ===================================================== */

        .stars{
          position:absolute;
          inset:0;
          z-index:1;
          pointer-events:none;
        }

        .star{
          position:absolute;
          background:white;
          border-radius:50%;

          box-shadow:
            0 0 5px white,
            0 0 12px rgba(255,180,240,.9);
        }


        .hangingStar{
          position:absolute;
          z-index:2;

          font-size:30px;
          color:#ffe8bd;

          text-shadow:
            0 0 12px #ffb6e6,
            0 0 30px #ff74c8;

          animation:hangingFloat 4s ease-in-out infinite;
        }

        .hanging1{
          left:18%;
          top:12%;
        }

        .hanging2{
          right:20%;
          top:17%;
          animation-delay:1.4s;
        }

        .hanging3{
          right:12%;
          top:40%;
          animation-delay:2s;
        }

        @keyframes hangingFloat{
          0%,100%{
            transform:translateY(0) rotate(-5deg);
          }

          50%{
            transform:translateY(12px) rotate(5deg);
          }
        }


        /* =====================================================
           MOON
        ===================================================== */

        .moon{
          position:absolute;
          width:230px;
          height:230px;
          left:7%;
          top:5%;

          border-radius:50%;
          z-index:2;

          background:
            radial-gradient(
              circle at 35% 30%,
              #fff4f4,
              #e9c6d6 40%,
              #9e728e 75%,
              #4c3150
            );

          box-shadow:
            0 0 35px rgba(255,190,230,.45),
            0 0 100px rgba(255,110,210,.25);

          opacity:.85;

          animation:moonFloat 8s ease-in-out infinite;
        }

        .moon::after{
          content:"";
          position:absolute;
          inset:0;

          border-radius:50%;

          background:
            radial-gradient(circle at 25% 25%, rgba(80,40,80,.3) 0 7%, transparent 8%),
            radial-gradient(circle at 65% 35%, rgba(80,40,80,.25) 0 5%, transparent 6%),
            radial-gradient(circle at 40% 70%, rgba(80,40,80,.25) 0 8%, transparent 9%);
        }

        .moonGlow{
          position:absolute;
          inset:-35px;
          border-radius:50%;

          background:rgba(255,170,230,.16);
          filter:blur(35px);
        }

        @keyframes moonFloat{
          0%,100%{
            transform:translateY(0);
          }

          50%{
            transform:translateY(-15px);
          }
        }


        /* =====================================================
           HEARTS
        ===================================================== */

        .heartField{
          position:absolute;
          inset:0;
          overflow:hidden;
          pointer-events:none;
          z-index:3;
        }

        .floatingHeart{
          position:absolute;
          bottom:0;

          filter:
            drop-shadow(0 0 8px rgba(255,100,200,.7));
        }


        /* =====================================================
           TOP TEXT
        ===================================================== */

        .topUniverseText{
          position:absolute;
          top:38px;
          left:50%;
          transform:translateX(-50%);

          z-index:20;

          white-space:nowrap;

          font-size:11px;
          letter-spacing:7px;

          color:#e8c8dc;

          text-shadow:
            0 0 15px rgba(255,150,220,.4);
        }

        /* scarf hint / caption
           (centering margin se hai, kyunki framer transform overwrite karta hai) */

        .scarfNote{
          position:absolute;
          top:64px;
          left:0;
          right:0;
          margin:0 auto;

          width:max-content;
          max-width:90vw;

          z-index:20;

          text-align:center;
          pointer-events:none;
        }

        .hintNote span{
          display:inline-block;

          font-size:10px;
          letter-spacing:5px;

          color:#ff9db3;

          text-shadow:
            0 0 14px rgba(255,70,110,.5);

          animation:hintBlink 2.6s ease-in-out infinite;
        }

        @keyframes hintBlink{
          0%,100%{
            opacity:.55;
          }

          50%{
            opacity:1;
          }
        }

        .captionNote{
          font-family:'Italianno',cursive;

          font-size:32px;
          line-height:1;

          color:#ffdbe6;

          text-shadow:
            0 0 18px rgba(255,60,100,.55),
            0 0 40px rgba(255,60,100,.25);
        }


        /* =====================================================
           MAIN LETTER
        ===================================================== */

        .letterWrap{
          width:min(560px, 42vw);
          min-width:480px;

          position:relative;
          z-index:10;
        }

        .letter{
          width:100%;

          max-height:86vh;

          position:relative;

          border-radius:28px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.11),
              rgba(255,255,255,.035)
            );

          border:1px solid rgba(255,190,230,.32);

          backdrop-filter:blur(25px);

          box-shadow:
            0 30px 90px rgba(0,0,0,.6),
            0 0 70px rgba(230,80,200,.12),
            inset 0 1px rgba(255,255,255,.18);

          overflow:hidden;

          transition:
            border-color 1.8s ease,
            box-shadow 1.8s ease;
        }

        /* scarf lipatne ke baad card ki border/glow halki lal-garam */

        .letter.wrapped{
          border-color:rgba(255,140,170,.45);

          box-shadow:
            0 30px 90px rgba(0,0,0,.6),
            0 0 80px rgba(255,70,110,.18),
            inset 0 1px rgba(255,255,255,.18);
        }

        .letter::before{
          content:"";

          position:absolute;
          inset:0;

          border-radius:inherit;

          background:
            linear-gradient(
              120deg,
              rgba(255,255,255,.12),
              transparent 25%,
              transparent 70%,
              rgba(255,120,210,.08)
            );

          pointer-events:none;
        }

        .letterGlow{
          position:absolute;
          inset:0;

          border-radius:inherit;

          background:
            radial-gradient(
              circle at var(--glow-x) var(--glow-y),
              rgba(255,190,235,.18),
              transparent 50%
            );

          pointer-events:none;
        }


        .letterTopLine{
          position:absolute;
          top:17px;
          left:50%;
          transform:translateX(-50%);

          display:flex;
          align-items:center;
          gap:10px;

          opacity:.7;
        }

        .letterTopLine span{
          width:50px;
          height:1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #eac3d8
            );
        }

        .letterTopLine span:last-child{
          transform:rotate(180deg);
        }

        .letterTopLine i{
          font-style:normal;
          color:#ffd4e8;
        }


        .letterContent{
          padding:42px 48px 35px;
          position:relative;
          z-index:2;
        }


        /* =====================================================
           SCARF (SVG)
        ===================================================== */

        .scarfSvg{
          position:absolute;
          z-index:30;

          overflow:visible;
          pointer-events:none;

          animation:scarfIn 1.4s ease 1.6s both;
        }

        @keyframes scarfIn{
          from{
            opacity:0;
          }

          to{
            opacity:1;
          }
        }

        .scarfHit{
          pointer-events:stroke;
          cursor:pointer;
          outline:none;
        }

        .tipRing{
          transform-box:fill-box;
          transform-origin:center;

          opacity:0;

          animation:tipPulse 2.4s ease-out infinite;
        }

        .tipRing.d2{
          animation-delay:1.2s;
        }

        @keyframes tipPulse{
          0%{
            transform:scale(.6);
            opacity:.8;
          }

          100%{
            transform:scale(2.4);
            opacity:0;
          }
        }


        /* =====================================================
           HEADING
        ===================================================== */

        .birthdayHeading{
          text-align:center;
        }

        .birthdayHeading small{
          display:block;

          font-family:'DM Sans',sans-serif;

          font-size:9px;
          letter-spacing:7px;

          color:#dfc1d1;

          margin-bottom:6px;
        }

        .birthdayHeading h1{
          margin:0;

          font-family:'Italianno',cursive;

          font-size:76px;
          line-height:.9;

          font-weight:400;

          background:
            linear-gradient(
              90deg,
              #fff,
              #ffd4e5,
              #f4b8dc,
              #fff
            );

          background-size:250% auto;

          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;

          animation:titleShimmer 6s linear infinite;

          filter:
            drop-shadow(0 0 18px rgba(255,150,210,.35));
        }

        @keyframes titleShimmer{
          0%{
            background-position:0%;
          }

          100%{
            background-position:250%;
          }
        }


        /* =====================================================
           DIVIDER
        ===================================================== */

        .goldDivider{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;

          margin:18px auto 22px;

          width:80%;
        }

        .goldDivider div{
          height:1px;
          flex:1;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,200,225,.55),
              transparent
            );
        }

        .goldDivider span{
          font-size:9px;
          color:#f4cadb;
        }


        /* =====================================================
           MESSAGE
        ===================================================== */

        .message{
          text-align:center;

          font-family:'Cormorant Garamond',serif;

          color:#eadbe6;

          font-size:17px;
          line-height:1.45;
        }

        .message p{
          margin:0 0 15px;
        }

        .message b{
          color:#ffd1e4;
          font-weight:700;

          text-shadow:
            0 0 10px rgba(255,120,190,.25);
        }

        .specialLine{
          font-size:19px;

          color:#ffd3e5;

          font-style:italic;

          margin:20px 0 !important;

          text-shadow:
            0 0 15px rgba(255,100,200,.3);
        }

        .poetry{
          color:#d8c8d8;
          font-size:15px;
        }

        .poetry em{
          color:#f0bfd8;
          font-family:'Italianno',cursive;
          font-size:25px;
        }

        .poetry strong{
          color:#ffb4d5;
        }


        /* =====================================================
           COUNTDOWN
        ===================================================== */

        .countdownSection{
          margin-top:22px;
          padding-top:18px;

          border-top:1px solid rgba(255,255,255,.09);
        }

        .countdownTitle{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:9px;

          margin-bottom:12px;
        }

        .countdownTitle p{
          margin:0;

          font-size:8px;
          letter-spacing:4px;

          color:#d8bfd0;
        }

        .countdownTitle span{
          color:#f6b9d7;
          font-size:10px;
        }

        .countdown{
          display:grid;

          grid-template-columns:
            repeat(5,1fr);

          gap:7px;
        }

        .timeBox{
          min-width:0;

          padding:10px 4px 8px;

          border-radius:12px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.1),
              rgba(255,255,255,.035)
            );

          border:1px solid rgba(255,255,255,.11);

          box-shadow:
            inset 0 1px rgba(255,255,255,.08);

          transition:
            transform .3s ease,
            border-color .3s ease,
            box-shadow .3s ease;
        }

        .timeBox:hover{
          transform:translateY(-4px);

          border-color:rgba(255,180,220,.4);

          box-shadow:
            0 8px 25px rgba(255,90,180,.12);
        }

        .timeNumber{
          display:block;

          font-family:'Cormorant Garamond',serif;

          font-size:26px;
          font-weight:600;

          line-height:1;

          color:#fff0f7;

          font-variant-numeric:tabular-nums;

          text-shadow:
            0 0 12px rgba(255,170,220,.3);
        }

        .timeLabel{
          display:block;

          margin-top:5px;

          font-size:6px;
          letter-spacing:1.8px;

          color:#c8afc0;
        }

        .highlightBox{
          border-color:rgba(255,180,220,.3);

          box-shadow:
            0 0 20px rgba(255,100,190,.08);
        }

        .waitingText{
          margin-top:14px;

          display:flex;
          justify-content:center;
          align-items:center;
          gap:8px;

          font-family:'Cormorant Garamond',serif;

          font-size:11px;
          font-style:italic;

          color:#cdb9c7;
        }

        .waitingText span{
          color:#f4b8d7;
        }

        .nextBirthday{
          display:flex;
          justify-content:center;
          align-items:center;
          gap:12px;

          margin-top:9px;

          font-size:9px;
          letter-spacing:4px;

          color:#f0cadc;
        }

        .nextBirthday span{
          color:#ffb5d5;
        }


        /* =====================================================
           GIFTS
        ===================================================== */

        .giftArea{
          position:absolute;

          z-index:12;

          width:210px;

          display:flex;
          justify-content:center;
        }

        .giftArea.left{
          left:4%;
          top:50%;

          transform:translateY(-50%);
        }

        .giftArea.right{
          right:4%;
          top:50%;

          transform:translateY(-50%);
        }

        .giftButton{
          border:0;
          background:none;

          color:white;

          cursor:pointer;

          position:relative;

          display:flex;
          flex-direction:column;
          align-items:center;

          padding:20px;

          font-family:'DM Sans',sans-serif;
        }

        .giftGlow{
          position:absolute;

          width:150px;
          height:100px;

          border-radius:50%;

          background:
            radial-gradient(
              ellipse,
              rgba(255,100,200,.28),
              transparent 70%
            );

          filter:blur(20px);

          animation:giftGlow 3s ease-in-out infinite;
        }

        @keyframes giftGlow{
          0%,100%{
            transform:scale(.9);
            opacity:.6;
          }

          50%{
            transform:scale(1.15);
            opacity:1;
          }
        }

        .giftBox{
          position:relative;

          width:125px;
          height:105px;

          margin-bottom:15px;

          filter:
            drop-shadow(0 15px 25px rgba(0,0,0,.45))
            drop-shadow(0 0 18px rgba(255,110,200,.25));

          animation:giftFloat 3s ease-in-out infinite;
        }

        @keyframes giftFloat{
          0%,100%{
            transform:translateY(0);
          }

          50%{
            transform:translateY(-8px);
          }
        }

        .giftBody{
          position:absolute;

          left:5px;
          right:5px;
          bottom:0;

          height:78px;

          border-radius:7px;

          background:
            linear-gradient(
              135deg,
              #c75d99,
              #773d85
            );

          border:1px solid rgba(255,210,240,.35);

          box-shadow:
            inset 0 1px rgba(255,255,255,.3),
            inset -15px -15px 30px rgba(50,10,60,.25);
        }

        .giftLid{
          position:absolute;

          z-index:3;

          left:0;
          top:13px;

          width:125px;
          height:27px;

          border-radius:6px;

          background:
            linear-gradient(
              135deg,
              #f19ac5,
              #a04d91
            );

          border:1px solid rgba(255,220,240,.45);

          box-shadow:
            0 5px 12px rgba(0,0,0,.3);
        }

        .giftRibbonVertical{
          position:absolute;

          left:50%;
          top:0;
          bottom:0;

          width:18px;

          transform:translateX(-50%);

          background:
            linear-gradient(
              90deg,
              #ffd2e5,
              #f5a5ca,
              #ffe0ed
            );

          opacity:.9;
        }

        .giftRibbonHorizontal{
          position:absolute;

          left:0;
          right:0;
          top:27px;

          height:14px;

          background:
            linear-gradient(
              90deg,
              #f9b5d3,
              #ffe0eb,
              #f9b5d3
            );

          opacity:.8;
        }

        .giftLid span{
          position:absolute;

          left:50%;
          top:0;
          transform:translateX(-50%);

          width:17px;
          height:27px;

          background:#ffe0ed;
        }

        .giftBow{
          position:absolute;

          z-index:5;

          top:-14px;
          left:50%;

          transform:translateX(-50%);

          display:flex;
          gap:0;
        }

        .giftBow i{
          display:block;

          width:35px;
          height:24px;

          border-radius:50% 50% 50% 8px;

          background:
            linear-gradient(
              135deg,
              #ffd0e4,
              #d966a3
            );

          border:1px solid rgba(255,255,255,.3);
        }

        .giftBow i:last-child{
          transform:scaleX(-1);
        }

        .giftStar{
          position:absolute;

          right:13px;
          bottom:12px;

          color:#ffd6e8;

          text-shadow:
            0 0 10px rgba(255,200,230,.8);
        }

        .giftTitle{
          position:relative;
          z-index:2;

          font-family:'Cormorant Garamond',serif;

          font-size:16px;

          color:#ead4e1;
        }

        .giftTitle span{
          margin-right:5px;
        }

        .giftButton small{
          position:relative;
          z-index:2;

          margin-top:5px;

          font-size:8px;
          letter-spacing:2px;

          color:#a995a8;
        }


        /* =====================================================
           OPENED GIFT MESSAGE
        ===================================================== */

        .giftMessage{
          width:190px;
          min-height:190px;

          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;

          padding:22px;

          text-align:center;

          border-radius:22px;

          background:
            linear-gradient(
              145deg,
              rgba(255,180,220,.12),
              rgba(130,70,170,.1)
            );

          border:1px solid rgba(255,190,225,.3);

          backdrop-filter:blur(18px);

          box-shadow:
            0 20px 50px rgba(0,0,0,.4),
            0 0 40px rgba(255,90,190,.12);

          position:relative;
        }

        .openedGift{
          font-size:35px;

          filter:
            drop-shadow(0 0 12px rgba(255,140,210,.6));
        }

        .giftMessage p{
          margin:12px 0 6px;

          font-family:'Italianno',cursive;

          font-size:29px;
          line-height:1.05;

          color:#ffe2ef;

          text-shadow:
            0 0 15px rgba(255,100,190,.35);
        }

        .giftMessage span{
          font-family:'Cormorant Garamond',serif;

          font-size:11px;

          color:#bfa9ba;
        }

        .giftMessage button{
          margin-top:13px;

          border:0;
          background:none;

          color:#c6aabd;

          font-size:8px;
          letter-spacing:2px;

          cursor:pointer;
        }

        .messageSparkle{
          position:absolute;

          top:15px;
          right:20px;

          color:#ffd0e5;

          animation:sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle{
          0%,100%{
            opacity:.3;
            transform:scale(.7) rotate(0);
          }

          50%{
            opacity:1;
            transform:scale(1.3) rotate(90deg);
          }
        }


        /* =====================================================
           BOTTOM
        ===================================================== */

        .bottomSection{
          position:absolute;

          bottom:25px;
          left:50%;

          transform:translateX(-50%);

          z-index:15;

          display:flex;
          flex-direction:column;
          align-items:center;
        }

        .bottomQuote{
          font-family:'Cormorant Garamond',serif;

          font-size:13px;
          font-style:italic;

          color:#aa99aa;

          margin-bottom:12px;

          white-space:nowrap;
        }

        .replayBtn{
          padding:12px 27px;

          border-radius:999px;

          background:
            rgba(255,255,255,.045);

          border:1px solid rgba(255,190,220,.25);

          color:#e7cbdc;

          cursor:pointer;

          font-family:'DM Sans',sans-serif;

          font-size:10px;
          letter-spacing:1px;

          backdrop-filter:blur(15px);

          box-shadow:
            0 8px 25px rgba(0,0,0,.25),
            inset 0 1px rgba(255,255,255,.1);

          transition:.3s ease;
        }

        .replayBtn:hover{
          border-color:rgba(255,180,220,.55);

          box-shadow:
            0 0 25px rgba(255,100,190,.18);
        }

        .fanText{
          margin-top:8px;

          font-family:'Italianno',cursive;

          font-size:20px;

          color:#c9aabd;

          opacity:.8;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media(max-width:1200px){

          .giftArea.left{
            left:1%;
          }

          .giftArea.right{
            right:1%;
          }

          .letterWrap{
            width:500px;
            min-width:500px;
          }

          .giftArea{
            transform:scale(.85);
          }
        }


        @media(max-width:900px){

          .moon{
            width:140px;
            height:140px;
            left:-20px;
            top:45px;
          }

          .giftArea{
            position:absolute;
            transform:scale(.72);
          }

          .giftArea.left{
            left:-25px;
            top:75%;
          }

          .giftArea.right{
            right:-25px;
            top:75%;
          }

          .letterWrap{
            width:calc(100vw - 50px);
            min-width:0;
            max-width:550px;
          }

          .letter{
            max-height:none;
          }

          .letterContent{
            padding:38px 30px 30px;
          }

          .birthdayHeading h1{
            font-size:65px;
          }

          .bottomSection{
            display:none;
          }
        }


        @media(max-width:600px){

          .finalUniverse{
            min-height:100svh;
            align-items:flex-start;
            padding-top:75px;
            padding-bottom:50px;
            overflow-y:auto;
          }

          .topUniverseText{
            top:24px;

            font-size:7px;
            letter-spacing:4px;
          }

          .scarfNote{
            top:44px;
          }

          .hintNote span{
            font-size:8px;
            letter-spacing:3px;
          }

          .captionNote{
            font-size:24px;
          }

          .moon{
            width:90px;
            height:90px;
            opacity:.45;
            top:60px;
          }

          .letterWrap{
            width:calc(100vw - 30px);
          }

          .letter{
            max-height:none;

            border-radius:22px;
          }

          .letterContent{
            padding:34px 20px 25px;
          }

          .birthdayHeading small{
            font-size:7px;
            letter-spacing:4px;
          }

          .birthdayHeading h1{
            font-size:57px;
          }

          .message{
            font-size:15px;
            line-height:1.42;
          }

          .poetry{
            font-size:14px;
          }

          .countdown{
            gap:4px;
          }

          .timeBox{
            padding:9px 2px 7px;
            border-radius:9px;
          }

          .timeNumber{
            font-size:20px;
          }

          .timeLabel{
            font-size:5px;
            letter-spacing:1px;
          }

          .waitingText{
            font-size:9px;
          }

          .nextBirthday{
            font-size:8px;
            letter-spacing:3px;
          }

          .giftArea{
            transform:scale(.48);
          }

          .giftArea.left{
            left:-55px;
            top:88%;
          }

          .giftArea.right{
            right:-55px;
            top:88%;
          }

          .hanging1,
          .hanging2,
          .hanging3{
            display:none;
          }
        }


        @media(prefers-reduced-motion:reduce){

          *,
          *::before,
          *::after{
            animation-duration:.01ms !important;
            animation-iteration-count:1 !important;
            scroll-behavior:auto !important;
          }
        }

      `}</style>
    </div>
  );
}

/* =========================================================
   COUNTDOWN BOX COMPONENT
========================================================= */

function CountdownBox({ value, label, highlight = false }) {
  return (
    <motion.div
      className={`timeBox ${highlight ? "highlightBox" : ""}`}
      animate={{
        opacity: [0.88, 1, 0.88],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
    >
      <span className="timeNumber">{String(value).padStart(2, "0")}</span>

      <span className="timeLabel">{label}</span>
    </motion.div>
  );
}
