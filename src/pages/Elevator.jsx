import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const quotes = [
  "If love had a sky, you would be every star.",
  "Some people don't just exist. They light up the universe.",
  "Every little moment found its place in the sky.",
  "Maybe the universe knew I would find you.",
  "Two hearts. One little universe.",
  "Even galaxies need someone to orbit.",
];

const constellation = [
  [50, 20],
  [42, 27],
  [34, 36],
  [28, 47],
  [31, 59],
  [40, 68],
  [50, 78],
  [60, 68],
  [69, 59],
  [72, 47],
  [66, 36],
  [58, 27],
  [50, 20],
  [50, 48],
];

const constellationLines = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [3, 13],
  [4, 13],
  [5, 13],
  [7, 13],
  [8, 13],
  [9, 13],
];

export default function Elevator() {
  const navigate = useNavigate();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [entering, setEntering] = useState(false);

  // Mouse movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 45,
    damping: 18,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 45,
    damping: 18,
  });

  const planetX = useTransform(smoothX, [-1, 1], [-35, 35]);
  const planetY = useTransform(smoothY, [-1, 1], [-35, 35]);

  const moonX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const moonY = useTransform(smoothY, [-1, 1], [-18, 18]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Quotes change automatically.
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: `${(i * 37.17) % 100}%`,
      top: `${(i * 61.73) % 100}%`,
      size: 1 + ((i * 13) % 3),
      delay: (i * 0.37) % 4,
      duration: 2 + ((i * 17) % 4),
    }));
  }, []);

  const enterStory = () => {
    if (entering) return;

    setEntering(true);

    setTimeout(() => {
      navigate("/memory");
    }, 900);
  };
 
  return (
    <motion.main
      className="universe-page"
      animate={
        entering
          ? {
              scale: 2.5,
              opacity: 0,
              filter: "blur(12px)",
            }
          : {
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
            }
      }
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* BACKGROUND */}

      <div className="space-background" />

      <div className="nebula nebula-one" />
      <div className="nebula nebula-two" />
      <div className="nebula nebula-three" />

      {/* STARS */}

      <div className="star-field">
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 1, 0.25],
              scale: [0.8, 1.4, 0.8],
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

      {/* TOP LEFT */}

      <div className="brand">
        <span className="brand-heart">♡</span>
        <span>HAPPINESS</span>
      </div>

      {/* TOP RIGHT */}

      <div className="chapter">
        <span>CHAPTER 02 / 06</span>
        <small>THE UNIVERSE</small>
      </div>

      {/* LEFT STORY */}

      <section className="story-copy">
        <span className="eyebrow">A LITTLE UNIVERSE</span>

        <h1>
          Every memory
          <br />
          <em>became a star.</em>
        </h1>

        <p>
          Somewhere between all the moments,
          <br />
          you became my favourite universe.
        </p>
      </section>

      {/* CENTER UNIVERSE */}

      <section className="universe-stage">
        {/* Outer orbit */}

        <motion.div
          className="orbit orbit-outer"
          style={{
            x: useTransform(smoothX, [-1, 1], [-8, 8]),
            y: useTransform(smoothY, [-1, 1], [-8, 8]),
          }}
        />

        <motion.div
          className="orbit orbit-middle"
          style={{
            x: useTransform(smoothX, [-1, 1], [-14, 14]),
            y: useTransform(smoothY, [-1, 1], [-14, 14]),
          }}
        />

        <motion.div
          className="orbit orbit-inner"
          style={{
            x: useTransform(smoothX, [-1, 1], [-20, 20]),
            y: useTransform(smoothY, [-1, 1], [-20, 20]),
          }}
        />

        {/* Glow behind constellation */}

        <motion.div
          className="heart-glow"
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* CONSTELLATION */}

        <svg
          className="constellation"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="starGlow">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* connecting lines */}

          {constellationLines.map(([a, b], index) => {
            const p1 = constellation[a];
            const p2 = constellation[b];

            return (
              <motion.line
                key={`line-${index}`}
                x1={p1[0]}
                y1={p1[1]}
                x2={p2[0]}
                y2={p2[1]}
                className="constellation-line"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 0.45,
                }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.8,
                }}
              />
            );
          })}

          {/* stars */}

          {constellation.map(([x, y], index) => (
            <motion.circle
              key={`point-${index}`}
              cx={x}
              cy={y}
              r={index === 13 ? 1.5 : 1}
              className={
                index === 13
                  ? "constellation-star center-star"
                  : "constellation-star"
              }
              filter="url(#starGlow)"
              animate={{
                opacity: [0.55, 1, 0.55],
                r: index === 13 ? [1.5, 2.2, 1.5] : [0.8, 1.5, 0.8],
              }}
              transition={{
                duration: 2 + (index % 3),
                delay: index * 0.08,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>

        {/* CENTRAL STAR */}

        <motion.button
          className="central-star"
          onClick={enterStory}
          whileHover={{
            scale: 1.18,
          }}
          whileTap={{
            scale: 0.92,
          }}
          animate={{
            boxShadow: [
              "0 0 15px rgba(255,132,203,.3)",
              "0 0 45px rgba(255,132,203,.75)",
              "0 0 15px rgba(255,132,203,.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-label="Enter the story"
        >
          <span>✦</span>
        </motion.button>

        {/* PLANET 1 */}

        <motion.div
          className="planet planet-pink"
          style={{
            x: planetX,
            y: planetY,
          }}
          whileHover={{
            scale: 1.25,
          }}
        >
          <div className="planet-shine" />
        </motion.div>

        {/* PLANET 2 */}

        <motion.div
          className="planet planet-purple"
          style={{
            x: moonX,
            y: moonY,
          }}
          whileHover={{
            scale: 1.22,
          }}
        >
          <div className="planet-shine" />
        </motion.div>

        {/* SMALL PLANET */}

        <motion.div
          className="planet planet-blue"
          style={{
            x: useTransform(smoothX, [-1, 1], [12, -12]),
            y: useTransform(smoothY, [-1, 1], [12, -12]),
          }}
        />

        {/* ORBIT DOTS */}

        <motion.div
          className="orbit-dot dot-one"
          animate={{ rotate: 360 }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="orbit-dot dot-two"
          animate={{ rotate: -360 }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </section>

      {/* QUOTE */}

      <div className="quote-container">
        <span className="quote-mark">“</span>

        <motion.div
          key={quoteIndex}
          className="quote"
          initial={{
            opacity: 0,
            y: 8,
            filter: "blur(5px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {quotes[quoteIndex]}
        </motion.div>

        <span className="quote-mark bottom">”</span>
      </div>

      {/* ENTER */}

      <motion.button
        className="enter-button"
        onClick={enterStory}
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.96,
        }}
      >
        <span className="enter-icon">→</span>
        <span>ENTER THE STORY</span>
      </motion.button>

      {/* BOTTOM */}

      <div className="bottom-left">
        <span>02 / 06</span>

        <div className="progress">
          <i />
          <i className="active" />
          <i />
          <i />
          <i />
          <i />
        </div>

        <span>THE UNIVERSE</span>
      </div>

      <div className="bottom-center">
        EVERY LITTLE MOMENT
        <br />
        FOUND ITS PLACE IN THE SKY.
      </div>

      <div className="bottom-right">OUR LITTLE UNIVERSE</div>

      <style>{`

        * {
          box-sizing: border-box;
        }

        .universe-page {
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 650px;
          overflow: hidden;
          background: #03020b;
          color: white;
          font-family: "DM Sans", sans-serif;
          isolation: isolate;
        }

        /* =========================
           BACKGROUND
        ========================= */

        .space-background {
          position: absolute;
          inset: 0;
          z-index: -10;

          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(94, 42, 130, 0.18) 0%,
              rgba(25, 13, 48, 0.14) 28%,
              rgba(3, 2, 11, 0) 60%
            ),
            radial-gradient(
              circle at 75% 30%,
              rgba(216, 69, 150, 0.16),
              transparent 32%
            ),
            radial-gradient(
              circle at 25% 75%,
              rgba(70, 71, 190, 0.14),
              transparent 35%
            ),
            #03020b;
        }

        .nebula {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(90px);
          z-index: -8;
        }

        .nebula-one {
          width: 500px;
          height: 500px;
          left: 30%;
          top: 20%;
          background: rgba(110, 54, 180, 0.1);
        }

        .nebula-two {
          width: 450px;
          height: 450px;
          right: 10%;
          top: 10%;
          background: rgba(235, 75, 160, 0.09);
        }

        .nebula-three {
          width: 500px;
          height: 400px;
          left: 5%;
          bottom: -100px;
          background: rgba(56, 80, 190, 0.08);
        }

        /* =========================
           STARS
        ========================= */

        .star-field {
          position: absolute;
          inset: 0;
          z-index: -4;
          pointer-events: none;
        }

        .star {
          position: absolute;
          border-radius: 50%;
          background: white;
          box-shadow:
            0 0 5px rgba(255,255,255,.8),
            0 0 12px rgba(190,180,255,.45);
        }

        /* =========================
           HEADER
        ========================= */

        .brand {
          position: absolute;
          top: 42px;
          left: 48px;

          display: flex;
          align-items: center;
          gap: 18px;

          font-size: 12px;
          font-weight: 600;
          letter-spacing: 7px;
          color: rgba(255,255,255,.65);
        }

        .brand-heart {
          color: #ff83c7;
          font-size: 30px;
          line-height: 1;
          text-shadow:
            0 0 10px rgba(255,100,190,.8),
            0 0 25px rgba(255,100,190,.35);
        }

        .chapter {
          position: absolute;
          right: 48px;
          top: 38px;

          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 7px;

          color: rgba(255,255,255,.35);
          font-size: 10px;
          letter-spacing: 5px;
        }

        .chapter small {
          color: rgba(255,130,200,.4);
          font-size: 8px;
          letter-spacing: 4px;
        }

        /* =========================
           STORY
        ========================= */

        .story-copy {
          position: absolute;
          left: 5%;
          top: 19%;
          z-index: 10;
        }

        .eyebrow {
          display: block;
          margin-bottom: 25px;

          font-size: 10px;
          letter-spacing: 6px;
          color: rgba(255,255,255,.38);
        }

        .story-copy h1 {
          margin: 0;

          font-family: "Cormorant Garamond", serif;
          font-size: clamp(54px, 5.5vw, 92px);
          line-height: .92;
          font-weight: 400;
          letter-spacing: -3px;
          color: #faf7fb;
        }

        .story-copy h1 em {
          color: #f087c1;
          font-weight: 400;
        }

        .story-copy p {
          margin-top: 35px;

          color: rgba(255,255,255,.47);
          font-size: 15px;
          line-height: 1.9;
          letter-spacing: .3px;
        }

        /* =========================
           CENTRAL UNIVERSE
        ========================= */

        .universe-stage {
          position: absolute;

          /*
            THIS IS THE IMPORTANT PART.
            The entire universe has its own centered
            coordinate system.
          */

          left: 50%;
          top: 50%;

          width: min(68vw, 760px);
          height: min(68vw, 760px);

          transform: translate(-50%, -50%);

          display: flex;
          align-items: center;
          justify-content: center;

          z-index: 4;
        }

        .orbit {
          position: absolute;
          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          border: 1px solid rgba(232,135,210,.14);
          border-radius: 50%;

          pointer-events: none;
        }

        .orbit-outer {
          width: 100%;
          height: 100%;
        }

        .orbit-middle {
          width: 76%;
          height: 76%;
        }

        .orbit-inner {
          width: 52%;
          height: 52%;
        }

        .heart-glow {
          position: absolute;
          width: 38%;
          height: 38%;

          border-radius: 50%;

          background: rgba(255,86,183,.16);

          filter: blur(60px);
        }

        /* =========================
           CONSTELLATION
        ========================= */

        .constellation {
          position: absolute;
          width: 62%;
          height: 62%;

          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          overflow: visible;
        }

        .constellation-line {
          stroke: rgba(255,145,211,.38);
          stroke-width: .18;
          fill: none;
        }

        .constellation-star {
          fill: #fff;
          filter:
            drop-shadow(0 0 3px rgba(255,255,255,.9))
            drop-shadow(0 0 8px rgba(255,115,203,.7));
        }

        .center-star {
          fill: #ff9ed4;
        }

        /* =========================
           CENTRAL BUTTON
        ========================= */

        .central-star {
          position: absolute;

          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          width: 62px;
          height: 62px;

          border-radius: 50%;

          border: 1px solid rgba(255,255,255,.5);

          background:
            radial-gradient(
              circle,
              rgba(255,255,255,.95) 0 5%,
              rgba(255,157,215,.7) 10%,
              rgba(255,105,190,.18) 40%,
              rgba(255,105,190,0) 70%
            );

          color: white;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          z-index: 20;
        }

        .central-star span {
          font-size: 22px;

          color: white;

          text-shadow:
            0 0 8px white,
            0 0 20px #ff86ca,
            0 0 40px #ff86ca;
        }

        /* =========================
           PLANETS
        ========================= */

        .planet {
          position: absolute;

          border-radius: 50%;

          pointer-events: auto;

          cursor: pointer;

          transition:
            box-shadow .5s ease,
            filter .5s ease;
        }

        .planet:hover {
          filter: brightness(1.25);
        }

        .planet-pink {
          width: 82px;
          height: 82px;

          right: 13%;
          top: 25%;

          background:
            radial-gradient(
              circle at 30% 25%,
              #fff 0 4%,
              #ffb4df 10%,
              #ff4b9c 43%,
              #9c1f68 75%,
              #3b0b2b
            );

          box-shadow:
            0 0 25px rgba(255,58,156,.45),
            0 0 65px rgba(255,58,156,.2);
        }

        .planet-purple {
          width: 54px;
          height: 54px;

          left: 12%;
          top: 20%;

          background:
            radial-gradient(
              circle at 32% 28%,
              #fff,
              #d9b3ff 13%,
              #914dff 48%,
              #3a155d 80%
            );

          box-shadow:
            0 0 25px rgba(154,92,255,.65),
            0 0 55px rgba(154,92,255,.2);
        }

        .planet-blue {
          width: 27px;
          height: 27px;

          left: 20%;
          bottom: 17%;

          background:
            radial-gradient(
              circle at 30% 25%,
              #fff,
              #8edfff 12%,
              #3e87ff 50%,
              #172b78
            );

          box-shadow:
            0 0 20px rgba(85,170,255,.7);
        }

        .planet-shine {
          position: absolute;

          width: 18%;
          height: 18%;

          left: 20%;
          top: 16%;

          border-radius: 50%;

          background: white;

          filter: blur(1px);

          opacity: .8;
        }

        /* =========================
           ORBIT DOTS
        ========================= */

        .orbit-dot {
          position: absolute;

          width: 9px;
          height: 9px;

          border-radius: 50%;

          background: #ff9fd7;

          box-shadow:
            0 0 10px #ff79c4,
            0 0 25px rgba(255,100,190,.6);

          transform-origin: 0 0;
        }

        .dot-one {
          left: 50%;
          top: 0;
          margin-left: 0;
        }

        .dot-two {
          left: 50%;
          bottom: 0;
          margin-left: 0;
        }

        /* =========================
           QUOTE
        ========================= */

        .quote-container {
          position: absolute;

          left: 50%;
          bottom: 13%;

          transform: translateX(-50%);

          width: min(600px, 80vw);

          text-align: center;

          z-index: 15;
        }

        .quote {
          min-height: 35px;

          color: rgba(255,255,255,.72);

          font-family: "Cormorant Garamond", serif;

          font-size: clamp(21px, 2vw, 29px);

          font-style: italic;

          letter-spacing: .2px;
        }

        .quote-mark {
          display: block;

          height: 15px;

          color: #ff76c2;

          font-family: Georgia, serif;

          font-size: 27px;

          line-height: 15px;

          text-shadow: 0 0 12px rgba(255,100,190,.8);
        }

        .quote-mark.bottom {
          margin-top: 2px;
        }

        /* =========================
           ENTER BUTTON
        ========================= */

        .enter-button {
          position: absolute;

          right: 7%;
          bottom: 12%;

          display: flex;
          align-items: center;
          gap: 17px;

          padding: 8px 13px 8px 8px;

          border-radius: 999px;

          border: 1px solid rgba(255,255,255,.18);

          background: rgba(255,255,255,.035);

          color: rgba(255,255,255,.65);

          font-family: "DM Sans", sans-serif;

          font-size: 10px;
          font-weight: 600;
          letter-spacing: 4px;

          cursor: pointer;

          backdrop-filter: blur(18px);

          z-index: 20;

          transition:
            background .4s ease,
            border-color .4s ease,
            box-shadow .4s ease;
        }

        .enter-button:hover {
          background: rgba(255,111,193,.09);

          border-color: rgba(255,130,201,.4);

          box-shadow:
            0 0 30px rgba(255,100,190,.15);
        }

        .enter-icon {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: rgba(255,111,193,.15);

          color: #ff87c8;

          font-size: 17px;

          letter-spacing: 0;
        }

        /* =========================
           BOTTOM UI
        ========================= */

        .bottom-left {
          position: absolute;

          left: 4%;
          bottom: 32px;

          display: flex;
          align-items: center;
          gap: 17px;

          color: rgba(255,255,255,.32);

          font-size: 9px;
          letter-spacing: 4px;
        }

        .progress {
          display: flex;
          gap: 7px;
        }

        .progress i {
          display: block;

          width: 7px;
          height: 7px;

          border: 1px solid rgba(255,255,255,.3);

          border-radius: 50%;
        }

        .progress i.active {
          background: #ff7cc5;

          border-color: #ff7cc5;

          box-shadow: 0 0 12px #ff7cc5;
        }

        .bottom-center {
          position: absolute;

          left: 50%;
          bottom: 30px;

          transform: translateX(-50%);

          text-align: center;

          color: rgba(255,255,255,.22);

          font-size: 8px;

          line-height: 1.8;

          letter-spacing: 4px;
        }

        .bottom-right {
          position: absolute;

          right: 4%;
          bottom: 32px;

          color: rgba(255,255,255,.25);

          font-size: 8px;

          letter-spacing: 4px;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 1000px) {

          .story-copy {
            left: 5%;
            top: 15%;
          }

          .story-copy h1 {
            font-size: 58px;
          }

          .universe-stage {
            width: 72vw;
            height: 72vw;
          }

          .quote-container {
            bottom: 10%;
          }

          .enter-button {
            right: 4%;
            bottom: 5%;
          }

        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 768px) {

          .universe-page {
            min-height: 720px;
          }

          .brand {
            top: 22px;
            left: 22px;

            font-size: 9px;
            letter-spacing: 4px;

            gap: 9px;
          }

          .brand-heart {
            font-size: 22px;
          }

          .chapter {
            top: 23px;
            right: 22px;

            font-size: 7px;
            letter-spacing: 3px;
          }

          .chapter small {
            font-size: 6px;
            letter-spacing: 2px;
          }

          .story-copy {
            left: 8%;
            top: 13%;

            z-index: 10;
          }

          .eyebrow {
            margin-bottom: 15px;

            font-size: 7px;
            letter-spacing: 4px;
          }

          .story-copy h1 {
            font-size: 43px;

            letter-spacing: -1.5px;
          }

          .story-copy p {
            margin-top: 15px;

            font-size: 11px;

            line-height: 1.7;
          }

          .universe-stage {
            width: 110vw;
            height: 110vw;

            max-width: 620px;
            max-height: 620px;

            top: 53%;
          }

          .planet-pink {
            width: 57px;
            height: 57px;

            right: 12%;
            top: 23%;
          }

          .planet-purple {
            width: 39px;
            height: 39px;

            left: 11%;
            top: 19%;
          }

          .planet-blue {
            width: 20px;
            height: 20px;
          }

          .central-star {
            width: 48px;
            height: 48px;
          }

          .central-star span {
            font-size: 18px;
          }

          .quote-container {
            bottom: 13%;

            width: 85vw;
          }

          .quote {
            font-size: 20px;
          }

          .enter-button {
            right: 50%;
            bottom: 4%;

            transform: translateX(50%);

            padding-right: 12px;

            font-size: 8px;
            letter-spacing: 3px;
          }

          .bottom-left,
          .bottom-right {
            display: none;
          }

          .bottom-center {
            bottom: 10px;

            font-size: 6px;

            letter-spacing: 2px;
          }

        }

        /* =========================
           REDUCED MOTION
        ========================= */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }

        }

      `}</style>
    </motion.main>
  );
}
