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

const STORY = [
  {
    text: "A mysterious outbreak has spread through the city.",
    hot: false,
    at: 1.9,
  },
  { text: "But one person remains immune.", hot: false, at: 3.1 },
  { text: "Today is her birthday.", hot: true, at: 4.3 },
];

/* orbit rings: chhote-chhote "planets" jo universe page ki jhalak dete hain */
const RINGS = [
  { rx: 305, ry: 62, dur: 46, begin: -8 },
  { rx: 235, ry: 50, dur: 34, begin: -21 },
  { rx: 162, ry: 38, dur: 24, begin: -4 },
];

/* word-by-word blur reveal — typewriter cursor se zyada cinematic */
function Words({ text, delay, className }) {
  return (
    <p className={className}>
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
    </p>
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

  /* =====================================
     WARM SHIFT
     Story cold (ice-blue, clinical) se shuru hoti hai aur jaise hi
     "Today is her birthday" aata hai, poora scene pink mein pighal jaata hai —
     wahi pink jo universe page ka hai.
  ===================================== */

  const warm = useMotionValue(0);

  const coldOpacity = useTransform(warm, [0, 1], [1, 0.2]);
  const dotColor = useTransform(warm, [0, 1], ["#a8ffd3", "#ff83c5"]);
  const dotGlow = useTransform(
    warm,
    [0, 1],
    ["0 0 10px rgba(168,255,211,.85)", "0 0 12px rgba(255,131,197,.95)"],
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
    }, 4300 * speed);

    return () => {
      clearTimeout(t);
      if (controls) controls.stop();
    };
  }, [reduceMotion, speed, warm]);

  /* =====================================
     PARALLAX
  ===================================== */

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springX = useSpring(mx, { stiffness: 55, damping: 20 });
  const springY = useSpring(my, { stiffness: 55, damping: 20 });

  const nearX = useTransform(springX, [-1, 1], [-4, 4]);
  const nearY = useTransform(springY, [-1, 1], [-3, 3]);
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
     (universe page ke planet-click wala hi transition, taaki dono pages ek hi
      kahani lagein. Aakhir mein screen #05030d ho jaati hai = universe ka base)
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
      transition: { duration: 1.4, delay: d(0.55) + i * 0.08, ease },
    }),
  };

  return (
    <>
      <DreamyBackground />

      <main className="intro">
        {/* =====================================
            ATMOSPHERE
            (BG wahi hai; upar se soft cold->warm glow taaki screen
             "kaali" na lage)
        ===================================== */}

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

        {/* searchlight — sirf ek insaan pe */}
        <motion.div
          className="beam"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduceMotion ? 0.7 : [0.45, 0.85, 0.45] }}
          transition={{
            duration: reduceMotion ? 0 : 7,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay: d(0.3),
          }}
        />

        <div className="grain" aria-hidden="true" />

        {/* =====================================
            TOP LEFT / TOP RIGHT
            (universe page ke same corners — text kahani ke saath badalta hai)
        ===================================== */}

        <motion.div
          className="topLeft"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: d(0.4) }}
        >
          <span className="brandHeart">♡</span>
          <span>QUARANTINE&nbsp; DAY 365</span>
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
            CENTER STAGE
        ===================================== */}

        <div className="stage">
          {/* BEACON: immune heart + orbit rings (universe ka chhota sa trailer) */}
          <motion.div className="beaconParallax" style={{ x: farX, y: farY }}>
            <motion.div
              className="beacon"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, delay: d(0.2), ease }}
            >
              <svg className="rings" viewBox="0 0 640 220" aria-hidden="true">
                <defs>
                  <linearGradient
                    id="introRingFade"
                    x1="0"
                    x2="1"
                    y1="0"
                    y2="0"
                  >
                    <stop offset="0" stopColor="#ff9ad5" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#ffb3e0" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#c59bff" stopOpacity="0" />
                  </linearGradient>

                  <radialGradient id="introDotGlow">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="0.35" stopColor="#ffb3e0" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#ff7fbd" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <g transform="rotate(-7 320 110)">
                  {RINGS.map((r) => (
                    <ellipse
                      key={`ring-${r.rx}`}
                      cx="320"
                      cy="110"
                      rx={r.rx}
                      ry={r.ry}
                      fill="none"
                      stroke="url(#introRingFade)"
                      strokeWidth="1"
                    />
                  ))}

                  {RINGS.map((r) => (
                    <g
                      key={`dot-${r.rx}`}
                      transform={
                        reduceMotion
                          ? `translate(${320 - r.rx} 110)`
                          : undefined
                      }
                    >
                      <circle r="7" fill="url(#introDotGlow)" opacity="0.9" />
                      <circle r="1.8" fill="#ffffff" />

                      {!reduceMotion && (
                        <animateMotion
                          dur={`${r.dur}s`}
                          begin={`${r.begin}s`}
                          repeatCount="indefinite"
                          path={`M ${320 - r.rx} 110 a ${r.rx} ${r.ry} 0 1 0 ${
                            2 * r.rx
                          } 0 a ${r.rx} ${r.ry} 0 1 0 ${-2 * r.rx} 0`}
                        />
                      )}
                    </g>
                  ))}
                </g>
              </svg>

              <div className="coreSlot">
                <span className="coreRipple" />
                <span className="coreRipple second" />

                <motion.div
                  className="core"
                  animate={reduceMotion ? {} : { scale: [1, 1.13, 1, 1.08, 1] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.14, 0.28, 0.42, 1],
                  }}
                >
                  <motion.span
                    className="coreCold"
                    style={{ opacity: coldOpacity }}
                  />
                  <motion.span className="coreWarm" style={{ opacity: warm }} />
                  <span className="coreHeart">♡</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

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

          <motion.span
            className="hair"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.3, delay: d(1.6), ease }}
          />

          {/* STORY */}
          <motion.div className="story" style={{ x: nearX, y: nearY }}>
            {STORY.map((line) => (
              <Words
                key={line.text}
                text={line.text}
                delay={d(line.at)}
                className={`storyLine ${line.hot ? "hot" : ""}`}
              />
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="ctaEntrance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: d(5.2), ease }}
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

          <motion.p
            className="quote"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: d(5.7), ease }}
          >
            “In a world full of fear, one person remained my happiness.”
          </motion.p>
        </div>

        {/* =====================================
            BOTTOM — universe page wala hi navigation (01/05 yahan se shuru)
        ===================================== */}

        <motion.div
          className="bottomNav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: d(5.4) }}
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
           INTRO — layout
        ===================================== */

        .intro {
          position: relative;
          z-index: 5;

          min-height: 100svh;
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 84px 24px 84px;

          text-align: center;

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
          align-items: center;

          width: 100%;
          max-width: 760px;
        }

        /* =====================================
           ATMOSPHERE (cold -> warm)
           NOTE: centering yahan margin se hai, CSS transform se nahi,
           taaki framer ka x/y usko overwrite na kare
        ===================================== */

        .aurora {
          position: absolute;
          inset: -8%;

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
              ellipse 60% 45% at 50% 28%,
              rgba(120,170,255,.26),
              transparent 70%
            ),
            radial-gradient(
              ellipse 45% 40% at 18% 82%,
              rgba(110,100,255,.17),
              transparent 70%
            ),
            radial-gradient(
              ellipse 40% 35% at 85% 70%,
              rgba(90,190,255,.11),
              transparent 70%
            );
        }

        .auroraWarm {
          background:
            radial-gradient(
              ellipse 60% 45% at 50% 30%,
              rgba(255,110,190,.28),
              transparent 70%
            ),
            radial-gradient(
              ellipse 45% 40% at 82% 78%,
              rgba(190,110,255,.22),
              transparent 70%
            ),
            radial-gradient(
              ellipse 40% 35% at 15% 75%,
              rgba(255,150,210,.14),
              transparent 70%
            );

          animation-duration: 19s;
        }

        @keyframes auroraDrift {
          from { transform: scale(1) translate3d(0, 0, 0); }
          to   { transform: scale(1.07) translate3d(1.5%, -1.5%, 0); }
        }

        .beam {
          position: absolute;

          top: -6%;
          left: 0;
          right: 0;
          margin: 0 auto;

          width: min(560px, 84vw);
          height: 64%;

          z-index: -1;
          pointer-events: none;

          background: linear-gradient(
            to bottom,
            rgba(215,232,255,0),
            rgba(215,232,255,.13) 35%,
            rgba(255,190,230,0)
          );

          clip-path: polygon(46% 0, 54% 0, 100% 100%, 0 100%);
          filter: blur(14px);
        }

        .grain {
          position: absolute;
          inset: 0;

          z-index: -1;
          pointer-events: none;

          opacity: .07;

          background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* =====================================
           CORNERS (universe page se same)
        ===================================== */

        .topLeft {
          position: absolute;
          top: 38px;
          left: 48px;

          display: flex;
          align-items: center;
          gap: 20px;

          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 5px;

          color: rgba(255,255,255,.62);

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
          top: 30px;
          right: 48px;

          text-align: right;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          letter-spacing: 4px;
          line-height: 2;

          color: rgba(255,255,255,.36);

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
           BEACON
        ===================================== */

        .beaconParallax {
          width: min(640px, 92vw, 72vh);
        }

        .beacon {
          position: relative;

          width: 100%;
          aspect-ratio: 640 / 220;
        }

        .rings {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          overflow: visible;
        }

        .coreSlot {
          position: absolute;
          inset: 0;
          margin: auto;

          width: 13%;
          aspect-ratio: 1;
          height: auto;

          display: grid;
          place-items: center;
        }

        .core {
          position: relative;

          width: 100%;
          height: 100%;

          border-radius: 50%;

          display: grid;
          place-items: center;
        }

        .coreCold,
        .coreWarm {
          position: absolute;
          inset: 0;

          border-radius: 50%;
        }

        .coreCold {
          background:
            radial-gradient(
              circle at 35% 30%,
              #fff,
              #e2f1ff 22%,
              #8fc3ff 50%,
              #3b5fb0 78%,
              #16244a
            );

          box-shadow:
            0 0 25px rgba(140,190,255,.8),
            0 0 70px rgba(110,160,255,.5),
            0 0 140px rgba(110,120,255,.25);
        }

        .coreWarm {
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
            0 0 25px rgba(255,100,190,.85),
            0 0 70px rgba(255,70,170,.55),
            0 0 140px rgba(190,70,220,.3);
        }

        .coreHeart {
          position: relative;

          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 3.2vw, 30px);

          color: #fff;

          text-shadow:
            0 0 10px #fff,
            0 0 25px rgba(255,140,204,.9);
        }

        .coreRipple {
          position: absolute;
          inset: 0;

          border-radius: 50%;
          border: 1px solid rgba(255,190,230,.5);

          pointer-events: none;

          animation: coreRipple 4s ease-out infinite;
        }

        .coreRipple.second {
          animation-delay: 2s;
        }

        @keyframes coreRipple {
          0%   { transform: scale(1);   opacity: .5; }
          100% { transform: scale(3.2); opacity: 0;  }
        }

        /* =====================================
           TITLE
        ===================================== */

        .title {
          margin: -6px 0 0;

          font-family: 'Cormorant Garamond', serif !important;
          font-size: clamp(3.6rem, min(12vw, 17vh), 9.5rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -.02em;

          filter:
            drop-shadow(0 0 26px rgba(255,150,215,.22))
            drop-shadow(0 0 60px rgba(150,170,255,.16));
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

        .hair {
          display: block;

          width: 120px;
          height: 1px;
          margin: 16px auto 26px;

          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,190,230,.7),
            transparent
          );
        }

        /* =====================================
           STORY
        ===================================== */

        .story {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;

          min-height: 132px;
        }

        .storyLine {
          margin: 0;

          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.25rem, 1.4vw + .9rem, 1.85rem);
          font-weight: 400;
          line-height: 1.5;

          color: rgba(228,236,250,.68);
        }

        .storyLine.hot {
          margin-top: 8px;

          font-style: italic;
          font-size: clamp(1.4rem, 1.7vw + .95rem, 2.1rem);

          color: #ffd9ef;

          text-shadow:
            0 0 26px rgba(255,120,190,.5),
            0 0 60px rgba(255,90,170,.25);
        }

        .word {
          display: inline-block;
          margin-right: .28em;
        }

        .word:last-child {
          margin-right: 0;
        }

        /* =====================================
           CTA
        ===================================== */

        .ctaEntrance {
          margin-top: 34px;
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
          0%   { transform: scale(1);              opacity: .5; }
          100% { transform: scale(1.35, 1.9);      opacity: 0;  }
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

          color: rgba(255,255,255,.92);

          background:
            linear-gradient(rgba(14,8,26,.72), rgba(14,8,26,.72)) padding-box,
            linear-gradient(
              120deg,
              rgba(255,160,220,.75),
              rgba(180,140,255,.5),
              rgba(255,255,255,.22)
            ) border-box;

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          box-shadow:
            0 16px 45px rgba(0,0,0,.25),
            0 0 34px rgba(255,110,190,.14),
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
            0 18px 55px rgba(0,0,0,.3),
            0 0 50px rgba(255,110,190,.28),
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
          max-width: 560px;
          margin: 30px 0 0;

          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.02rem, .5vw + .9rem, 1.2rem);
          font-style: italic;
          line-height: 1.6;

          color: rgba(255,226,243,.5);
        }

        /* =====================================
           BOTTOM NAV (universe page jaisa)
        ===================================== */

        .bottomNav {
          position: absolute;

          left: 4%;
          bottom: 32px;

          display: flex;
          align-items: center;
          gap: 18px;

          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          letter-spacing: 3px;

          color: rgba(255,255,255,.4);

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

          border: 1px solid rgba(255,255,255,.3);
        }

        .dots .pre {
          border-color: rgba(255,127,189,.85);

          box-shadow: 0 0 10px rgba(255,127,189,.5);

          animation: statusPulse 2.4s ease-in-out infinite;
        }

        .prologue {
          margin-left: 8px;
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

        @media (max-height: 780px) {

          .intro {
            padding-top: 72px;
            padding-bottom: 72px;
          }

          .hair {
            margin: 12px auto 18px;
          }

          .story {
            min-height: 116px;
          }

          .ctaEntrance {
            margin-top: 26px;
          }

          .quote {
            margin-top: 22px;
          }
        }

        /* =====================================
           TABLET
        ===================================== */

        @media (max-width: 1100px) {

          .topLeft {
            left: 32px;
          }

          .topRight {
            right: 32px;
          }
        }

        /* =====================================
           MOBILE
        ===================================== */

        @media (max-width: 768px) {

          .intro {
            padding: 76px 20px 84px;
          }

          .topLeft {
            top: 22px;
            left: 20px;

            gap: 8px;

            font-size: 8px;
            letter-spacing: 3px;
          }

          .brandHeart {
            font-size: 24px;
          }

          .topRight {
            top: 20px;
            right: 20px;

            font-size: 6.5px;
            letter-spacing: 2px;
          }

          .statusRow {
            gap: 6px;
          }

          .title {
            font-size: clamp(3.4rem, 17vw, 5.4rem);
          }

          .story {
            min-height: 150px;
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
            max-width: 90%;
            font-size: 1rem;
          }

          .bottomNav {
            left: 20px;
            bottom: 20px;

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
          .coreRipple,
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
