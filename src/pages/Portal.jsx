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
import { useEffect, useRef, useState } from "react";

import DreamyBackground from "../components/DreamyBackground";

const ease = [0.16, 1, 0.3, 1];

/* "ENTER SAFE ZONE" yahan jaayega.
   Agar universe page ka route alag hai (jaise "/universe"), sirf ye ek line badalni hai. */
const NEXT_PAGE = "/elevator";

/* Isi session mein dobara aane pe intro tez chalta hai (testing/replay ke liye) */
const SEEN_KEY = "intro-seen-this-session";

const TITLE = "Happiness";
const DAYS = 365;

const STORY = [
  {
    text: "A mysterious outbreak has spread through the city.",
    hot: false,
    at: 2.5,
  },
  { text: "But one person remains immune.", hot: false, at: 3.6 },
  { text: "Today is her birthday.", hot: true, at: 4.7 },
];

/* =====================================
   SEALED BUILDING EMBLEM
   Poori building andheri hai, sirf ek khidki (floor 8, unit 08 = "0808")
   mein roshni hai. Wahi "ek insaan jo immune hai".
===================================== */

const COLS = 8;
const ROWS = 10;
const LIT_ROW = 2; // upar se 3rd row = 8th floor (10 floors)
const LIT_COL = 7; // 8th unit
const FLICKER = new Set([5, 19, 24, 37, 46, 58, 63, 71]);

const pad = (n, len = 2) => String(n).padStart(len, "0");

/* word-by-word blur reveal */
function Words({ text, delay, className }) {
  return (
    <div className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="word"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: delay + i * 0.08, ease }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

/* CCTV timecode (bottom-right) — chalta rehta hai */
function Timecode({ color, glow }) {
  const [t, setT] = useState(20 * 3600 + 7 * 60 + 41);

  useEffect(() => {
    const id = setInterval(() => setT((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = Math.floor(t / 3600) % 24;
  const mm = Math.floor(t / 60) % 60;
  const ss = t % 60;

  return (
    <div className="rec">
      <motion.span
        className="recDot"
        style={{ backgroundColor: color, boxShadow: glow }}
      />
      <span>REC</span>
      <span className="tc">
        {pad(hh)}:{pad(mm)}:{pad(ss)}
      </span>
    </div>
  );
}

export default function Intro() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [canParallax, setCanParallax] = useState(false);
  const [warmed, setWarmed] = useState(false);
  const [warp, setWarp] = useState(null);

  // pehli baar full timeline, us session mein dobara aane pe tez
  const [speed] = useState(() => {
    try {
      return window.sessionStorage.getItem(SEEN_KEY) ? 0.4 : 1;
    } catch {
      return 1;
    }
  });

  const d = (s) => (reduceMotion ? 0 : s * speed);

  const leavingRef = useRef(false);
  const timerRef = useRef(null);
  const ctaRef = useRef(null);
  const numRef = useRef(null);

  /* =====================================
     WARM SHIFT
     Scene cold (ice-blue, clinical) se shuru hota hai; "Today is her birthday"
     pe wahi pink ban jaata hai jo universe page ka hai.
  ===================================== */

  const warm = useMotionValue(0);

  const coldOpacity = useTransform(warm, [0, 1], [1, 0.25]);
  const dotColor = useTransform(warm, [0, 1], ["#a8ffd3", "#ff83c5"]);
  const dotGlow = useTransform(
    warm,
    [0, 1],
    ["0 0 10px rgba(168,255,211,.85)", "0 0 12px rgba(255,131,197,.95)"],
  );
  const recColor = useTransform(warm, [0, 1], ["#ff5468", "#ff83c5"]);
  const recGlow = useTransform(
    warm,
    [0, 1],
    ["0 0 10px rgba(255,84,104,.9)", "0 0 12px rgba(255,131,197,.95)"],
  );
  const litColor = useTransform(warm, [0, 1], ["#d6e9ff", "#ff83c5"]);
  const litGlow = useTransform(
    warm,
    [0, 1],
    [
      "0 0 10px rgba(190,220,255,.95), 0 0 26px rgba(150,190,255,.55)",
      "0 0 10px rgba(255,131,197,.95), 0 0 28px rgba(255,90,170,.6)",
    ],
  );

  useEffect(() => {
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      warm.set(1);
      setWarmed(true);
      return undefined;
    }

    let controls;

    const t = setTimeout(() => {
      setWarmed(true);
      controls = animate(warm, 1, { duration: 2.6, ease: "easeInOut" });
    }, 4700 * speed);

    return () => {
      clearTimeout(t);
      if (controls) controls.stop();
    };
  }, [reduceMotion, speed, warm]);

  /* =====================================
     DAY COUNTER  000 -> 365
     365 din ek jhalak mein guzar jaate hain, aakhri din pe aakar rukta hai
  ===================================== */

  const count = useMotionValue(0);
  const progress = useTransform(count, [0, DAYS], [0, 1]);

  useEffect(() => {
    const unsub = count.on("change", (v) => {
      if (numRef.current) {
        numRef.current.textContent = pad(Math.round(v), 3);
      }
    });

    return unsub;
  }, [count]);

  useEffect(() => {
    if (reduceMotion) {
      count.set(DAYS);
      return undefined;
    }

    const controls = animate(count, DAYS, {
      duration: 2 * speed,
      delay: 0.5 * speed,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [reduceMotion, speed, count]);

  /* =====================================
     PARALLAX (sirf atmosphere glow pe, text stable rehta hai)
  ===================================== */

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springX = useSpring(mx, { stiffness: 55, damping: 20 });
  const springY = useSpring(my, { stiffness: 55, damping: 20 });

  const farX = useTransform(springX, [-1, 1], [-14, 14]);
  const farY = useTransform(springY, [-1, 1], [-9, 9]);

  useEffect(() => {
    setCanParallax(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!canParallax || reduceMotion) return undefined;

    const move = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      mx.set((e.clientX - cx) / cx);
      my.set((e.clientY - cy) / cy);
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, [canParallax, reduceMotion, mx, my]);

  /* =====================================
     MAGNETIC BUTTON
  ===================================== */

  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);

  const btnSpringX = useSpring(btnX, { stiffness: 180, damping: 18 });
  const btnSpringY = useSpring(btnY, { stiffness: 180, damping: 18 });

  const handleBtnMove = (e) => {
    if (!canParallax || reduceMotion || !ctaRef.current) return;

    const rect = ctaRef.current.getBoundingClientRect();

    btnX.set((e.clientX - (rect.left + rect.width / 2)) * 0.16);
    btnY.set((e.clientY - (rect.top + rect.height / 2)) * 0.16);
  };

  const resetBtn = () => {
    btnX.set(0);
    btnY.set(0);
  };

  /* =====================================
     CLICK -> WARP -> UNIVERSE PAGE
     (universe page ke planet-click wala hi transition. Aakhir mein screen
      #05030d ho jaati hai = universe ka base, toh page change pe flash nahi)
  ===================================== */

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleEnter = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    e.preventDefault();
    if (leavingRef.current) return;
    leavingRef.current = true;

    if (reduceMotion) {
      navigate(NEXT_PAGE);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    setWarp({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      r: Math.hypot(window.innerWidth, window.innerHeight),
    });

    timerRef.current = setTimeout(() => navigate(NEXT_PAGE), 1100);
  };

  /* =====================================
     TITLE LETTERS
  ===================================== */

  const letterReveal = {
    hidden: { opacity: 0, y: 40, rotateX: 50, filter: "blur(14px)" },
    show: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: { duration: 1.4, delay: d(0.7) + i * 0.08, ease },
    }),
  };

  return (
    <>
      <DreamyBackground />

      <main className="intro">
        {/* =====================================
            LEGIBILITY + ATMOSPHERE
            Photo BG wahi hai. Text ke peeche ek soft scrim hai (taaki
            padhna asaan ho aur chehre na dhakein), uske upar cold->warm glow.
        ===================================== */}

        <div className="scrim" aria-hidden="true" />

        <motion.div
          className="aurora"
          style={{ x: farX, y: farY }}
          aria-hidden="true"
        >
          <motion.span
            className="auroraCold"
            style={{ opacity: coldOpacity }}
          />
          <motion.span className="auroraWarm" style={{ opacity: warm }} />
        </motion.div>

        {/* CCTV frame corners */}
        <motion.div
          className="frame"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: d(0.2) }}
        >
          <span className="fc tl" />
          <span className="fc tr" />
          <span className="fc bl" />
          <span className="fc br" />
        </motion.div>

        {/* =====================================
            CORNERS (universe page ke same corners)
        ===================================== */}

        <motion.div
          className="topLeft"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: d(0.4) }}
        >
          <span className="brandHeart">♡</span>
          <span>CAM 08 · STAIRWELL</span>
        </motion.div>

        <motion.div
          className="topRight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: d(0.6) }}
        >
          <div>RESIDENT FILE #0808</div>

          <div className="statusRow">
            <motion.span
              className="statusDot"
              style={{ backgroundColor: dotColor, boxShadow: dotGlow }}
            />

            <AnimatePresence mode="wait">
              <motion.span
                key={warmed ? "warm" : "cold"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.5, ease }}
              >
                {warmed ? "A UNIVERSE, FOR YOU" : "STATUS · IMMUNE"}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* =====================================
            CONTENT (left column — poster jaisa)
        ===================================== */}

        <div className="stage">
          {/* sealed building + day counter */}
          <div className="header">
            <div className="windows" aria-hidden="true">
              {Array.from({ length: ROWS * COLS }, (_, i) => {
                const r = Math.floor(i / COLS);
                const c = i % COLS;

                if (r === LIT_ROW && c === LIT_COL) {
                  return (
                    <motion.span
                      key={i}
                      className="win lit"
                      style={{ backgroundColor: litColor, boxShadow: litGlow }}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.1, delay: d(2.1), ease }}
                    />
                  );
                }

                const flick = FLICKER.has(i);

                return (
                  <motion.span
                    key={i}
                    className={`win ${flick ? "flick" : ""}`}
                    style={
                      flick
                        ? {
                            "--fd": `${5 + (i % 5)}s`,
                            "--fo": `${(i % 7) * -1.3}s`,
                          }
                        : undefined
                    }
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: d(0.9 + r * 0.06 + c * 0.015),
                    }}
                  />
                );
              })}
            </div>

            <div className="dayBlock">
              <div className="dayRow">
                <span className="dayLabel">DAY</span>
                <span className="dayNum" ref={numRef}>
                  000
                </span>
              </div>

              <div className="dayTrack">
                <motion.span
                  className="dayFill"
                  style={{
                    scaleX: progress,
                    backgroundColor: litColor,
                    boxShadow: litGlow,
                  }}
                />
              </div>

              <div className="unit">
                UNIT 0808
                <span className="unitSub">ONE LIGHT STILL ON</span>
              </div>
            </div>
          </div>

          {/* TITLE */}
          <h1 className="title" aria-label={TITLE}>
            <span className="titleLine" aria-hidden="true">
              {TITLE.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  className="titleChar"
                  custom={i}
                  variants={letterReveal}
                  initial="hidden"
                  animate="show"
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* STORY */}
          <div className="story">
            {STORY.map((line) => (
              <Words
                key={line.text}
                text={line.text}
                delay={d(line.at)}
                className={`storyLine ${line.hot ? "hot" : ""}`}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="ctaEntrance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: d(5.6), ease }}
          >
            <motion.div
              className="ctaInner"
              style={{ x: btnSpringX, y: btnSpringY }}
              onMouseMove={handleBtnMove}
              onMouseLeave={resetBtn}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link
                ref={ctaRef}
                to={NEXT_PAGE}
                className="cta"
                onClick={handleEnter}
              >
                <span className="ctaLabel">Enter safe zone</span>
                <span className="ctaHeart">♡</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="quote"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: d(6.1), ease }}
          >
            “In a world full of fear, one person remained my happiness.”
          </motion.div>
        </div>

        {/* =====================================
            BOTTOM — universe page wala hi navigation + CCTV timecode
        ===================================== */}

        <motion.div
          className="bottomNav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: d(5.6) }}
        >
          <span>00 / 05</span>

          <span className="dots">
            <span className="pre" />
            <span />
            <span />
            <span />
            <span />
          </span>

          <span className="prologue">PROLOGUE</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: d(0.8) }}
        >
          <Timecode color={recColor} glow={recGlow} />
        </motion.div>
      </main>

      {/* =====================================
          WARP OVERLAY
      ===================================== */}

      <AnimatePresence>
        {warp && (
          <motion.div
            className="warp"
            initial={{ clipPath: `circle(0px at ${warp.x}px ${warp.y}px)` }}
            animate={{
              clipPath: `circle(${warp.r}px at ${warp.x}px ${warp.y}px)`,
            }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          >
            <motion.span
              className="warpGlow"
              style={{
                background: `radial-gradient(circle at ${warp.x}px ${warp.y}px, #ffffff 0, #ff8acb 8%, #7a2a9c 30%, #14061f 62%, #05030d 100%)`,
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`

        /* =====================================
           LAYOUT — poster jaisa left column
           (chehre BG mein beech/right mein hain, text left mein rehta hai)
        ===================================== */

        .intro {
          position: relative;
          z-index: 5;

          min-height: 100svh;
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: flex-start;

          padding: 96px max(6vw, 60px) 110px;

          overflow-x: hidden;
        }

        .intro *,
        .intro *::before,
        .intro *::after {
          box-sizing: border-box;
        }

        .stage {
          position: relative;

          display: flex;
          flex-direction: column;
          align-items: flex-start;

          width: min(600px, 46vw);

          text-align: left;
        }

        /* =====================================
           SCRIM + ATMOSPHERE
           (centering / positioning margin-inset se, CSS transform se nahi,
            taaki framer ka x/y usko overwrite na kare)
        ===================================== */

        .scrim {
          position: absolute;
          inset: 0;

          z-index: -1;
          pointer-events: none;

          background:
            linear-gradient(
              90deg,
              rgba(8,4,18,.9) 0%,
              rgba(8,4,18,.8) 26%,
              rgba(8,4,18,.46) 46%,
              rgba(8,4,18,0) 68%
            ),
            linear-gradient(
              0deg,
              rgba(8,4,18,.6) 0%,
              rgba(8,4,18,0) 26%
            ),
            linear-gradient(
              180deg,
              rgba(8,4,18,.55) 0%,
              rgba(8,4,18,0) 20%
            );
        }

        .aurora {
          position: absolute;
          inset: -6%;

          z-index: -1;
          pointer-events: none;
        }

        .auroraCold,
        .auroraWarm {
          position: absolute;
          inset: 0;

          animation: auroraDrift 16s ease-in-out infinite alternate;
        }

        .auroraCold {
          background:
            radial-gradient(
              ellipse 45% 55% at 16% 58%,
              rgba(110,150,255,.2),
              transparent 70%
            ),
            radial-gradient(
              ellipse 35% 35% at 40% 105%,
              rgba(90,190,255,.12),
              transparent 70%
            );
        }

        .auroraWarm {
          background:
            radial-gradient(
              ellipse 45% 55% at 16% 62%,
              rgba(255,110,190,.25),
              transparent 70%
            ),
            radial-gradient(
              ellipse 35% 40% at 42% 105%,
              rgba(190,110,255,.2),
              transparent 70%
            );

          animation-duration: 19s;
        }

        @keyframes auroraDrift {
          from { transform: scale(1) translate3d(0, 0, 0); }
          to   { transform: scale(1.06) translate3d(1.5%, -1.5%, 0); }
        }

        /* CCTV frame corners */

        .frame {
          position: absolute;
          inset: 20px;

          pointer-events: none;
        }

        .fc {
          position: absolute;

          width: 22px;
          height: 22px;

          border: 0 solid rgba(255,255,255,.3);
        }

        .fc.tl { top: 0;    left: 0;  border-top-width: 1px;    border-left-width: 1px;  }
        .fc.tr { top: 0;    right: 0; border-top-width: 1px;    border-right-width: 1px; }
        .fc.bl { bottom: 0; left: 0;  border-bottom-width: 1px; border-left-width: 1px;  }
        .fc.br { bottom: 0; right: 0; border-bottom-width: 1px; border-right-width: 1px; }

        /* =====================================
           CORNERS
        ===================================== */

        .topLeft {
          position: absolute;
          top: 40px;
          left: 60px;

          display: flex;
          align-items: center;
          gap: 20px;

          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 5px;

          color: rgba(255,255,255,.7);

          pointer-events: none;
        }

        .brandHeart {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          color: #ff83c5;

          text-shadow:
            0 0 10px rgba(255,100,190,.8),
            0 0 30px rgba(255,70,180,.5);
        }

        .topRight {
          position: absolute;
          top: 32px;
          right: 60px;

          text-align: right;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          letter-spacing: 4px;
          line-height: 2;

          color: rgba(255,255,255,.55);

          pointer-events: none;
        }

        .statusRow {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;

          min-height: 18px;
        }

        .statusDot {
          display: block;

          width: 5px;
          height: 5px;

          border-radius: 50%;

          animation: statusPulse 2.4s ease-in-out infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: .35; transform: scale(.8); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }

        /* =====================================
           HEADER: sealed building + day counter
        ===================================== */

        .header {
          --cell: 7px;

          display: flex;
          align-items: center;
          gap: 24px;

          margin-bottom: 30px;
        }

        .windows {
          display: grid;
          grid-template-columns: repeat(${COLS}, var(--cell));
          gap: calc(var(--cell) * .5);

          flex-shrink: 0;
        }

        .win {
          display: block;

          width: var(--cell);
          height: var(--cell);

          border: 1px solid rgba(255,255,255,.3);
          background: rgba(255,255,255,.05);
        }

        .win.flick {
          animation: flick var(--fd, 6s) linear infinite;
          animation-delay: var(--fo, 0s);
        }

        @keyframes flick {
          0%, 86%, 90%, 100% { background: rgba(255,255,255,.05); }
          87%, 92%           { background: rgba(255,236,200,.4); }
        }

        .win.lit {
          border-color: transparent;

          animation: litPulse 2.6s ease-in-out infinite;
        }

        @keyframes litPulse {
          0%, 100% { filter: brightness(1); }
          50%      { filter: brightness(1.4); }
        }

        .dayBlock {
          display: flex;
          flex-direction: column;
          gap: 10px;

          width: min(300px, 32vw);
        }

        .dayRow {
          display: flex;
          align-items: baseline;
          gap: 14px;
        }

        .dayLabel {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 6px;

          color: rgba(255,255,255,.6);
        }

        .dayNum {
          font-family: 'Montserrat', sans-serif;
          font-size: 34px;
          font-weight: 300;
          letter-spacing: .1em;
          font-variant-numeric: tabular-nums;
          line-height: 1;

          color: #fff;

          text-shadow: 0 2px 20px rgba(8,4,18,.7);
        }

        .dayTrack {
          width: 100%;
          height: 1px;

          background: rgba(255,255,255,.2);
        }

        .dayFill {
          display: block;

          width: 100%;
          height: 100%;

          transform-origin: left center;
        }

        .unit {
          display: flex;
          flex-direction: column;
          gap: 4px;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 4px;

          color: rgba(255,255,255,.7);
        }

        .unitSub {
          color: rgba(255,255,255,.42);
          letter-spacing: 3px;
        }

        /* =====================================
           TITLE
        ===================================== */

        .title {
          margin: 0;

          font-family: 'Cormorant Garamond', serif !important;
          font-size: clamp(3.4rem, min(9vw, 14vh), 8rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -.02em;
          text-align: left;

          filter:
            drop-shadow(0 4px 26px rgba(8,4,18,.75))
            drop-shadow(0 0 40px rgba(255,150,215,.2));
        }

        .titleLine {
          display: inline-block;
          perspective: 900px;
        }

        .titleChar {
          display: inline-block;

          padding: 0 .015em;

          font-family: 'Cormorant Garamond', serif !important;
          line-height: 1.12;

          background: linear-gradient(
            180deg,
            #ffffff 22%,
            #ffe1f2 62%,
            #f4a9d6 100%
          );

          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        /* =====================================
           STORY
           (font-family !important: tumhare project mein global span rule
            font override kar raha tha, isliye story sans-serif dikh rahi thi)
        ===================================== */

        .story {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;

          margin-top: 22px;
        }

        .storyLine {
          margin: 0;

          font-family: 'Cormorant Garamond', serif !important;
          font-size: clamp(1.25rem, .9vw + 1rem, 1.7rem);
          font-weight: 500;
          line-height: 1.45;

          color: rgba(244,247,255,.93);

          text-shadow:
            0 1px 2px rgba(8,4,18,.7),
            0 4px 28px rgba(8,4,18,.85);

          text-wrap: balance;
        }

        .storyLine.hot {
          margin-top: 8px;

          font-style: italic;
          font-size: clamp(1.45rem, 1.2vw + 1.05rem, 2rem);

          color: #ffdff1;

          text-shadow:
            0 1px 2px rgba(8,4,18,.6),
            0 0 26px rgba(255,120,190,.55),
            0 0 60px rgba(255,90,170,.28);
        }

        .word {
          display: inline-block;
          margin-right: .28em;

          font-family: 'Cormorant Garamond', serif !important;
        }

        .word:last-child {
          margin-right: 0;
        }

        /* =====================================
           CTA
        ===================================== */

        .ctaEntrance {
          margin-top: 32px;
        }

        .ctaInner {
          position: relative;
          display: inline-block;
          border-radius: 999px;
        }

        .ctaInner::before,
        .ctaInner::after {
          content: "";

          position: absolute;
          inset: 0;

          border-radius: 999px;
          border: 1px solid rgba(255,140,205,.5);

          pointer-events: none;

          animation: ctaRipple 3.4s ease-out infinite;
        }

        .ctaInner::after {
          animation-delay: 1.7s;
        }

        @keyframes ctaRipple {
          0%   { transform: scale(1);         opacity: .5; }
          100% { transform: scale(1.35, 1.9); opacity: 0;  }
        }

        .cta {
          position: relative;

          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;

          min-width: 250px;
          height: 56px;
          padding: 0 34px;

          border-radius: 999px;
          border: 1px solid transparent;

          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .26em;
          text-transform: uppercase;
          text-decoration: none;

          color: rgba(255,255,255,.95);

          background:
            linear-gradient(rgba(14,8,26,.78), rgba(14,8,26,.78)) padding-box,
            linear-gradient(
              120deg,
              rgba(255,160,220,.8),
              rgba(180,140,255,.55),
              rgba(255,255,255,.25)
            ) border-box;

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          box-shadow:
            0 16px 45px rgba(0,0,0,.3),
            0 0 34px rgba(255,110,190,.16),
            inset 0 1px rgba(255,255,255,.14);

          overflow: hidden;

          transition:
            box-shadow .35s ease,
            color .35s ease;
        }

        .cta::before {
          content: "";

          position: absolute;
          top: 0;
          left: -120%;

          width: 100%;
          height: 100%;

          background: linear-gradient(
            100deg,
            transparent,
            rgba(255,255,255,.26),
            transparent
          );

          transition: left .8s ease;
          pointer-events: none;
        }

        .cta:hover {
          color: #fff;

          box-shadow:
            0 18px 55px rgba(0,0,0,.35),
            0 0 50px rgba(255,110,190,.3),
            inset 0 1px rgba(255,255,255,.22);
        }

        .cta:hover::before {
          left: 120%;
        }

        .cta:focus-visible {
          outline: 2px solid rgba(255,255,255,.85);
          outline-offset: 5px;
        }

        .ctaHeart {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          letter-spacing: 0;
          line-height: 1;

          color: #ff83c5;

          text-shadow: 0 0 14px rgba(255,100,190,.9);

          animation: heartTick 2.4s ease-in-out infinite;
        }

        @keyframes heartTick {
          0%, 100% { transform: scale(1); }
          14%      { transform: scale(1.25); }
          28%      { transform: scale(1); }
          42%      { transform: scale(1.15); }
        }

        .quote {
          max-width: 480px;
          margin-top: 26px;

          font-family: 'Cormorant Garamond', serif !important;
          font-size: clamp(1.02rem, .4vw + .92rem, 1.2rem);
          font-style: italic;
          line-height: 1.6;

          color: rgba(255,232,245,.72);

          text-shadow: 0 2px 20px rgba(8,4,18,.85);
        }

        /* =====================================
           BOTTOM: nav + CCTV timecode
        ===================================== */

        .bottomNav {
          position: absolute;

          left: 60px;
          bottom: 36px;

          display: flex;
          align-items: center;
          gap: 18px;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          letter-spacing: 3px;

          color: rgba(255,255,255,.55);

          pointer-events: none;
        }

        .dots {
          display: flex;
          gap: 8px;
        }

        .dots span {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          border: 1px solid rgba(255,255,255,.35);
        }

        .dots .pre {
          border-color: rgba(255,127,189,.9);

          box-shadow: 0 0 10px rgba(255,127,189,.5);

          animation: statusPulse 2.4s ease-in-out infinite;
        }

        .prologue {
          margin-left: 8px;
        }

        .rec {
          position: absolute;

          right: 60px;
          bottom: 36px;

          display: flex;
          align-items: center;
          gap: 10px;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          letter-spacing: 3px;

          color: rgba(255,255,255,.6);

          pointer-events: none;
        }

        .recDot {
          display: block;

          width: 6px;
          height: 6px;

          border-radius: 50%;

          animation: recBlink 1.6s steps(1, end) infinite;
        }

        @keyframes recBlink {
          0%, 60% { opacity: 1; }
          61%, 100% { opacity: .15; }
        }

        .tc {
          margin-left: 6px;

          font-variant-numeric: tabular-nums;
          letter-spacing: 2px;
        }

        /* =====================================
           WARP
        ===================================== */

        .warp {
          position: fixed;
          inset: 0;

          z-index: 200;

          background: #05030d;

          pointer-events: all;
        }

        .warpGlow {
          position: absolute;
          inset: 0;
        }

        /* =====================================
           SHORT LAPTOP SCREENS
        ===================================== */

        @media (max-height: 820px) {

          .intro {
            padding-top: 84px;
            padding-bottom: 96px;
          }

          .header {
            --cell: 6px;

            margin-bottom: 22px;
          }

          .story {
            margin-top: 16px;
          }

          .ctaEntrance {
            margin-top: 24px;
          }

          .quote {
            margin-top: 18px;
          }
        }

        /* =====================================
           TABLET / MOBILE
           (chehre beech mein aa jaate hain, toh text neeche shift hota hai
            aur neeche se ek gehra gradient photo ko dheere fade karta hai)
        ===================================== */

        @media (max-width: 900px) {

          .intro {
            align-items: flex-end;

            padding: 90px 28px 84px;
          }

          .stage {
            width: 100%;
            max-width: 560px;
          }

          .scrim {
            background:
              linear-gradient(
                0deg,
                rgba(8,4,18,.95) 0%,
                rgba(8,4,18,.88) 42%,
                rgba(8,4,18,.4) 68%,
                rgba(8,4,18,0) 88%
              ),
              linear-gradient(
                180deg,
                rgba(8,4,18,.6) 0%,
                rgba(8,4,18,0) 22%
              );
          }

          .auroraCold,
          .auroraWarm {
            background-position: center 80%;
          }

          .topLeft {
            left: 44px;
          }

          .topRight {
            right: 44px;
          }

          .bottomNav {
            left: 44px;
          }

          .rec {
            right: 44px;
          }
        }

        @media (max-width: 600px) {

          .frame {
            inset: 12px;
          }

          .fc {
            width: 14px;
            height: 14px;
          }

          .intro {
            padding: 84px 22px 76px;
          }

          .topLeft {
            top: 26px;
            left: 26px;

            gap: 8px;

            font-size: 8px;
            letter-spacing: 3px;
          }

          .brandHeart {
            font-size: 24px;
          }

          .topRight {
            top: 22px;
            right: 26px;

            font-size: 6.5px;
            letter-spacing: 2px;
          }

          .statusRow {
            gap: 6px;
          }

          .header {
            --cell: 5px;

            gap: 16px;
            margin-bottom: 18px;
          }

          .dayBlock {
            width: min(220px, 52vw);
          }

          .dayNum {
            font-size: 28px;
          }

          .title {
            font-size: clamp(3.4rem, 17vw, 5.2rem);
          }

          .storyLine {
            font-size: 1.2rem;
          }

          .storyLine.hot {
            font-size: 1.4rem;
          }

          .cta {
            min-width: 224px;
            height: 52px;

            font-size: 10px;
            letter-spacing: .22em;
          }

          .quote {
            font-size: 1rem;
          }

          .bottomNav {
            left: 26px;
            bottom: 24px;

            font-size: 7px;
          }

          .rec {
            right: 26px;
            bottom: 24px;

            font-size: 7px;
          }
        }

        /* =====================================
           REDUCED MOTION
        ===================================== */

        @media (prefers-reduced-motion: reduce) {
          .auroraCold,
          .auroraWarm,
          .statusDot,
          .win.flick,
          .win.lit,
          .recDot,
          .ctaInner::before,
          .ctaInner::after,
          .ctaHeart,
          .dots .pre {
            animation: none !important;
          }
        }

      `}</style>
    </>
  );
}
