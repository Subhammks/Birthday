import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import CustomCursor from "./CustomCursor";

const memories = [
  {
    id: 1,
    symbol: "✦",
    title: "THE MORNING",
    subtitle: "A memory I never photographed.",
    text: "That morning is still the softest memory I own.",
  },
  {
    id: 2,
    symbol: "☾",
    title: "THE FEELING",
    subtitle: "Some moments are impossible to explain.",
    text: "Whenever I think about that morning, I automatically smile.",
  },
  {
    id: 3,
    symbol: "∞",
    title: "THE MOMENT",
    subtitle: "If I could go back...",
    text: "I would choose that exact morning again.",
  },
  {
    id: 4,
    symbol: "♡",
    title: "THE PERSON",
    subtitle: "Some memories have a person attached to them.",
    text: "You became part of the memory without even knowing it.",
  },
  {
    id: 5,
    symbol: "✧",
    title: "THE PHOTO",
    subtitle: "The one thing I wish I had.",
    text: "Kaash us subah kuch photos click kar liye hote tumhare.",
  },
];

export default function Floor3() {
  const [activeMemory, setActiveMemory] = useState(null);
  const [showLetter, setShowLetter] = useState(false);

  const navigate = useNavigate();

  const sceneRef = useRef(null);

  /* ---------------- 3D SCENE ---------------- */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const sceneRotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [2.5, -2.5]),
    {
      stiffness: 80,
      damping: 20,
    },
  );

  const sceneRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), {
    stiffness: 80,
    damping: 20,
  });

  const handleMouseMove = (e) => {
    if (!sceneRef.current) return;

    const rect = sceneRef.current.getBoundingClientRect();

    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetMouse = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  /* ---------------- STARFIELD ---------------- */

  const stars = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 2.5}px`,
    delay: `${Math.random() * 4}s`,
    duration: `${2 + Math.random() * 4}s`,
  }));

  return (
    <div
      className="floor3"
      ref={sceneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
    >
      <CustomCursor />

      {/* BACKGROUND */}
      <div className="backgroundLayer" />

      {/* PREMIUM DARK OVERLAY */}
      <div className="cinematicOverlay" />

      {/* AMBIENT LIGHT */}
      <div className="ambientLight" />

      {/* STARS */}
      <div className="starField">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* MAIN 3D WORLD */}
      <motion.div
        className="world"
        style={{
          rotateX: sceneRotateX,
          rotateY: sceneRotateY,
        }}
      >
        {/* TOP LABEL */}
        <motion.div
          className="memoryNumber"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          MEMORY <span>#03</span>
        </motion.div>

        {/* TITLE */}
        <motion.h1
          className="mainTitle"
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Favourite <span className="gradientTitle">Moment</span>
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          Some memories don't need photographs.
          <br />
          They simply refuse to fade.
        </motion.p>

        {/* MEMORY ORBIT */}
        <div className="memoryUniverse">
          <div className="orbit orbit1" />
          <div className="orbit orbit2" />
          <div className="orbit orbit3" />

          {/* CENTER */}
          <motion.div
            className="memoryCore"
            animate={{
              scale: [1, 1.035, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="coreGlow" />

            <span className="coreSymbol">♡</span>

            <div className="coreText">
              ONE
              <br />
              MORNING
            </div>
          </motion.div>

          {/* MEMORY NODES */}
          {memories.map((memory, index) => {
            const positions = [
              { top: "5%", left: "50%" },
              { top: "27%", right: "4%" },
              { bottom: "8%", right: "18%" },
              { bottom: "8%", left: "18%" },
              { top: "27%", left: "4%" },
            ];

            return (
              <motion.button
                key={memory.id}
                className={`memoryNode node${index + 1}`}
                style={positions[index]}
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.7,
                  delay: 1 + index * 0.15,
                  type: "spring",
                  stiffness: 150,
                  damping: 14,
                }}
                whileHover={{
                  scale: 1.15,
                  zIndex: 30,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                onClick={() => setActiveMemory(memory)}
              >
                <span className="nodeSymbol">{memory.symbol}</span>

                <span className="nodeNumber">0{memory.id}</span>

                <span className="nodePulse" />
              </motion.button>
            );
          })}
        </div>

        {/* INSTRUCTION */}
        <motion.div
          className="interactionHint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 2,
          }}
        >
          <span>✦</span>
          Click a memory
          <span>✦</span>
        </motion.div>

        {/* LETTER BUTTON */}
        <AnimatePresence>
          {!showLetter && (
            <motion.button
              className="revealButton"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 2.2 }}
              onClick={() => setShowLetter(true)}
              whileHover={{
                scale: 1.05,
                y: -4,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <span className="buttonGlow" />✦ ONE LAST THING
            </motion.button>
          )}
        </AnimatePresence>

        {/* FULL LETTER */}
        <AnimatePresence>
          {showLetter && (
            <motion.div
              className="letterPanel"
              initial={{
                opacity: 0,
                y: 60,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="letterTop">
                <span>MEMORY #03</span>
                <span>✦</span>
              </div>

              <h2>
                For <span>Happiness</span>
              </h2>

              <p className="letterLead">Some people become memories.</p>

              <p className="letterLead">You became a part of my story.</p>

              <p className="letterBody">
                <Typewriter
                  words={[
                    "Wo morning usko kya mai bolu. Wo meri College ki best memory hai aur usko koi replace nai ker sakta. Agar meko chance mile college ke kisi din ko wapas se jeene ko to mai hamesa us morning ko choose kerunga. Matlab mai us feeling ko explain nai ker sakta bas when i think about that morning mai khus ho jatta hu. Waise bhi bas wahi ek tmari memory hai mere pass. Kassh us subh kuch photos click ker liye hote tmaree.. Just like this as my favourite memory you will always my favourite person.",
                  ]}
                  loop={1}
                  cursor
                  cursorStyle="|"
                  typeSpeed={25}
                  deleteSpeed={0}
                  delaySpeed={999999}
                />
              </p>

              <motion.div
                className="letterEnding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 3,
                }}
              >
                <span>—</span>
                <span>Some memories become forever.</span>
                <span>—</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* MEMORY POPUP */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="memoryModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMemory(null)}
          >
            <motion.div
              className="memoryModalCard"
              initial={{
                opacity: 0,
                scale: 0.7,
                rotateX: -25,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateX: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              transition={{
                duration: 0.6,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modalSymbol">{activeMemory.symbol}</div>

              <div className="modalNumber">MEMORY 0{activeMemory.id}</div>

              <h2>{activeMemory.title}</h2>

              <p className="modalSubtitle">{activeMemory.subtitle}</p>

              <div className="modalDivider" />

              <p className="modalText">{activeMemory.text}</p>

              <button
                className="closeMemory"
                onClick={() => setActiveMemory(null)}
              >
                CLOSE ✦
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEXT FLOOR */}
      <motion.button
        className="nextBtn"
        data-cursor="next"
        initial={{
          opacity: 0,
          x: 30,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          delay: 2.4,
        }}
        onClick={() => navigate("/birthday")}
        whileHover={{
          scale: 1.06,
          x: -5,
        }}
        whileTap={{
          scale: 0.96,
        }}
      >
        <span>FINAL FLOOR</span>
        <strong>→</strong>
      </motion.button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap');

        .floor3,
        .floor3 * {
          cursor: none;
        }

        /* =========================
           PAGE
        ========================= */

        .floor3 {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #05030a;
          font-family: 'Manrope', sans-serif;
          color: white;
        }

        /* =========================
           BACKGROUND
        ========================= */

        .backgroundLayer {
          position: fixed;
          inset: 0;

          background-image:
            url("/images/Floorr3.png");

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          transform: scale(1.04);

          z-index: 0;
        }

        .cinematicOverlay {
          position: fixed;
          inset: 0;

          background:
            radial-gradient(
              circle at 50% 42%,
              rgba(255, 170, 200, .10),
              transparent 45%
            ),
            linear-gradient(
              180deg,
              rgba(4, 2, 10, .38),
              rgba(5, 2, 12, .72)
            );

          z-index: 1;
          pointer-events: none;
        }

        .ambientLight {
          position: fixed;

          width: 700px;
          height: 700px;

          left: 50%;
          top: 45%;

          transform: translate(-50%, -50%);

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(255, 160, 190, .15),
              transparent 70%
            );

          filter: blur(60px);

          animation: breathe 6s ease-in-out infinite;

          z-index: 2;
          pointer-events: none;
        }

        @keyframes breathe {
          0%,100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: .6;
          }

          50% {
            transform: translate(-50%, -50%) scale(1.12);
            opacity: 1;
          }
        }

        /* =========================
           STARS
        ========================= */

        .starField {
          position: fixed;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }

        .star {
          position: absolute;

          border-radius: 50%;

          background: rgba(255, 235, 245, .9);

          box-shadow:
            0 0 8px rgba(255, 180, 210, .8);

          animation: twinkle ease-in-out infinite;
        }

        @keyframes twinkle {
          0%,100% {
            opacity: .15;
          }

          50% {
            opacity: .9;
          }
        }

        /* =========================
           WORLD
        ========================= */

        .world {
          position: relative;

          z-index: 10;

          min-height: 100vh;

          display: flex;
          flex-direction: column;
          align-items: center;

          padding-top: 70px;

          transform-style: preserve-3d;
        }

        /* =========================
           HEADER
        ========================= */

        .memoryNumber {
          font-size: .78rem;
          font-weight: 700;

          letter-spacing: 8px;

          color: #ffd6e3;
        }

        .memoryNumber span {
          color: #7ec8ff;
        }

        .mainTitle {
          margin: 12px 0 0;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 5rem;

          font-weight: 600;

          letter-spacing: 1px;

          text-shadow:
            0 0 30px rgba(255, 160, 200, .25);
        }

        .gradientTitle {
          font-style: italic;

          background:
            linear-gradient(
              120deg,
              #ffd369,
              #ff9dbf,
              #7ec8ff
            );

          -webkit-background-clip: text;
          background-clip: text;

          color: transparent;
        }

        .subtitle {
          text-align: center;

          color: rgba(255,255,255,.65);

          font-family:
            'Cormorant Garamond',
            serif;

          font-style: italic;

          font-size: 1.25rem;

          line-height: 1.5;

          margin-top: 4px;
        }

        /* =========================
           UNIVERSE
        ========================= */

        .memoryUniverse {
          position: relative;

          width: 620px;
          height: 500px;

          margin-top: 10px;

          transform-style: preserve-3d;
        }

        .orbit {
          position: absolute;

          left: 50%;
          top: 50%;

          border-radius: 50%;

          border: 1px solid rgba(255, 190, 215, .16);

          transform:
            translate(-50%, -50%)
            rotateX(70deg);

          box-shadow:
            0 0 25px rgba(255, 160, 200, .04);

          pointer-events: none;
        }

        .orbit1 {
          width: 300px;
          height: 300px;

          animation:
            orbitSpin1 18s linear infinite;
        }

        .orbit2 {
          width: 440px;
          height: 440px;

          transform:
            translate(-50%, -50%)
            rotateX(68deg)
            rotateZ(30deg);

          animation:
            orbitSpin2 25s linear infinite reverse;
        }

        .orbit3 {
          width: 580px;
          height: 390px;

          transform:
            translate(-50%, -50%)
            rotateX(73deg)
            rotateZ(-25deg);

          animation:
            orbitSpin3 30s linear infinite;
        }

        @keyframes orbitSpin1 {
          from {
            transform:
              translate(-50%, -50%)
              rotateX(70deg)
              rotateZ(0);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotateX(70deg)
              rotateZ(360deg);
          }
        }

        @keyframes orbitSpin2 {
          from {
            transform:
              translate(-50%, -50%)
              rotateX(68deg)
              rotateZ(0);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotateX(68deg)
              rotateZ(360deg);
          }
        }

        @keyframes orbitSpin3 {
          from {
            transform:
              translate(-50%, -50%)
              rotateX(73deg)
              rotateZ(0);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotateX(73deg)
              rotateZ(360deg);
          }
        }

        /* =========================
           CORE
        ========================= */

        .memoryCore {
          position: absolute;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -50%);

          width: 125px;
          height: 125px;

          border-radius: 50%;

          display: flex;
          flex-direction: column;

          justify-content: center;
          align-items: center;

          background:
            radial-gradient(
              circle at 35% 25%,
              rgba(255,255,255,.22),
              rgba(255,120,170,.08) 45%,
              rgba(10,5,20,.8)
            );

          border:
            1px solid rgba(255,210,225,.35);

          box-shadow:
            0 0 40px rgba(255,130,180,.25),
            inset 0 0 30px rgba(255,255,255,.05);

          backdrop-filter: blur(10px);

          z-index: 10;
        }

        .coreGlow {
          position: absolute;

          inset: -15px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(255, 150, 190, .18),
              transparent 70%
            );

          filter: blur(10px);

          z-index: -1;
        }

        .coreSymbol {
          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 2.2rem;

          color: #ffd2df;

          text-shadow:
            0 0 18px rgba(255,150,190,.8);
        }

        .coreText {
          font-size: .52rem;

          letter-spacing: 3px;

          text-align: center;

          color: rgba(255,255,255,.65);

          margin-top: 4px;
        }

        /* =========================
           MEMORY NODES
        ========================= */

        .memoryNode {
          position: absolute;

          width: 72px;
          height: 72px;

          border-radius: 50%;

          border:
            1px solid rgba(255,210,225,.28);

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.13),
              rgba(255,255,255,.035)
            );

          backdrop-filter: blur(12px);

          display: flex;
          align-items: center;
          justify-content: center;

          color: white;

          box-shadow:
            0 15px 40px rgba(0,0,0,.4),
            0 0 25px rgba(255,150,190,.08);

          transition:
            border .3s,
            box-shadow .3s;

          overflow: visible;
        }

        .memoryNode:hover {
          border-color:
            rgba(255,190,220,.7);

          box-shadow:
            0 0 30px rgba(255,150,190,.35),
            0 15px 40px rgba(0,0,0,.5);
        }

        .nodeSymbol {
          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 1.8rem;

          color: #ffd9e5;

          text-shadow:
            0 0 15px rgba(255,160,200,.7);
        }

        .nodeNumber {
          position: absolute;

          right: -7px;
          top: -7px;

          width: 23px;
          height: 23px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: rgba(20,10,25,.85);

          border:
            1px solid rgba(255,190,215,.25);

          font-size: .52rem;

          color: #ffd369;
        }

        .nodePulse {
          position: absolute;

          inset: -8px;

          border-radius: 50%;

          border:
            1px solid rgba(255,160,200,.18);

          animation:
            nodePulse 3s ease-out infinite;
        }

        @keyframes nodePulse {
          0% {
            transform: scale(.9);
            opacity: .8;
          }

          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        /* =========================
           HINT
        ========================= */

        .interactionHint {
          color: rgba(255,255,255,.5);

          font-size: .7rem;

          letter-spacing: 4px;

          text-transform: uppercase;

          display: flex;

          gap: 14px;

          margin-top: -5px;
        }

        .interactionHint span {
          color: #ff9dbf;
        }

        /* =========================
           REVEAL BUTTON
        ========================= */

        .revealButton {
          position: relative;

          margin-top: 25px;

          padding: 14px 32px;

          border-radius: 999px;

          border:
            1px solid rgba(255,200,220,.3);

          background:
            rgba(255,255,255,.06);

          color: #ffe6ef;

          font-size: .75rem;

          font-weight: 700;

          letter-spacing: 3px;

          backdrop-filter: blur(15px);

          overflow: hidden;

          box-shadow:
            0 0 25px rgba(255,150,190,.08);

          transition: .3s;
        }

        .revealButton:hover {
          border-color:
            rgba(255,190,220,.7);

          box-shadow:
            0 0 40px rgba(255,150,190,.2);
        }

        .buttonGlow {
          position: absolute;

          width: 70px;
          height: 100%;

          top: 0;
          left: -80px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.35),
              transparent
            );

          transform: skewX(-20deg);

          animation:
            buttonShine 3s infinite;
        }

        @keyframes buttonShine {
          0% {
            left: -80px;
          }

          50%,100% {
            left: 120%;
          }
        }

        /* =========================
           MEMORY MODAL
        ========================= */

        .memoryModal {
          position: fixed;

          inset: 0;

          z-index: 500;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            rgba(2,0,8,.7);

          backdrop-filter: blur(18px);

          padding: 20px;
        }

        .memoryModalCard {
          width: 430px;

          max-width: 90vw;

          padding: 42px;

          text-align: center;

          border-radius: 28px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.12),
              rgba(255,255,255,.035)
            );

          border:
            1px solid rgba(255,205,225,.25);

          box-shadow:
            0 40px 100px rgba(0,0,0,.65),
            0 0 60px rgba(255,120,170,.12);

          backdrop-filter: blur(25px);
        }

        .modalSymbol {
          font-size: 2.5rem;

          color: #ffb3cb;

          text-shadow:
            0 0 25px rgba(255,120,170,.7);

          margin-bottom: 15px;
        }

        .modalNumber {
          color: #ffd369;

          letter-spacing: 5px;

          font-size: .65rem;

          font-weight: 700;
        }

        .memoryModalCard h2 {
          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 3rem;

          margin: 10px 0;
        }

        .modalSubtitle {
          color: rgba(255,255,255,.6);

          font-family:
            'Cormorant Garamond',
            serif;

          font-style: italic;

          font-size: 1.2rem;
        }

        .modalDivider {
          width: 70px;

          height: 1px;

          margin: 22px auto;

          background:
            linear-gradient(
              90deg,
              transparent,
              #ff9dbf,
              transparent
            );
        }

        .modalText {
          color: rgba(255,255,255,.9);

          line-height: 1.8;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 1.25rem;

          font-style: italic;
        }

        .closeMemory {
          margin-top: 25px;

          padding: 10px 25px;

          border-radius: 999px;

          background: rgba(255,255,255,.05);

          border:
            1px solid rgba(255,255,255,.15);

          color: rgba(255,255,255,.7);

          font-size: .65rem;

          letter-spacing: 3px;
        }

        /* =========================
           LETTER
        ========================= */

        .letterPanel {
          width: 820px;

          max-width: 90vw;

          margin-top: 35px;

          padding: 42px 50px;

          border-radius: 28px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.12),
              rgba(255,255,255,.035)
            );

          border:
            1px solid rgba(255,200,220,.22);

          backdrop-filter: blur(25px);

          box-shadow:
            0 40px 100px rgba(0,0,0,.55),
            0 0 80px rgba(255,130,180,.12);

          text-align: center;
        }

        .letterTop {
          display: flex;

          justify-content: space-between;

          color: #ffb3c6;

          letter-spacing: 4px;

          font-size: .65rem;

          font-weight: 700;
        }

        .letterPanel h2 {
          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 2.7rem;

          margin: 15px 0 20px;
        }

        .letterPanel h2 span {
          color: #ffd369;

          font-style: italic;
        }

        .letterLead {
          font-family:
            'Cormorant Garamond',
            serif;

          font-style: italic;

          color: #ffe1ea;

          font-size: 1.35rem;

          margin: 4px 0;
        }

        .letterBody {
          margin-top: 25px;

          color: rgba(255,255,255,.88);

          font-size: 1.05rem;

          line-height: 2;

          text-align: left;
        }

        .letterEnding {
          margin-top: 25px;

          display: flex;

          justify-content: center;

          gap: 12px;

          color: rgba(255,210,225,.55);

          font-family:
            'Cormorant Garamond',
            serif;

          font-style: italic;

          font-size: .95rem;
        }

        /* =========================
           NEXT
        ========================= */

        .nextBtn {
          position: fixed;

          right: 28px;
          bottom: 28px;

          z-index: 1000;

          padding: 16px 27px;

          border-radius: 999px;

          border: none;

          background:
            linear-gradient(
              135deg,
              #ff9dbf,
              #ff5f91
            );

          color: white;

          font-size: .7rem;

          font-weight: 800;

          letter-spacing: 3px;

          box-shadow:
            0 0 30px rgba(255,70,130,.35);

          transition: .3s;
        }

        .nextBtn strong {
          font-size: 1.1rem;

          margin-left: 8px;
        }

        /* =========================
           MOBILE
        ========================= */

        @media(max-width: 768px) {

          .world {
            padding-top: 45px;
          }

          .mainTitle {
            font-size: 3.2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .memoryUniverse {
            width: 95vw;
            height: 430px;
          }

          .orbit3 {
            width: 90vw;
          }

          .memoryCore {
            width: 100px;
            height: 100px;
          }

          .memoryNode {
            width: 58px;
            height: 58px;
          }

          .nodeSymbol {
            font-size: 1.4rem;
          }

          .letterPanel {
            padding: 30px 24px;

            max-height: 70vh;

            overflow-y: auto;
          }

          .letterBody {
            font-size: .95rem;
          }

          .nextBtn {
            right: 15px;
            bottom: 15px;

            padding: 14px 20px;
          }
        }

        @media(prefers-reduced-motion: reduce) {

          .orbit,
          .star,
          .ambientLight,
          .memoryCore,
          .nodePulse,
          .buttonGlow {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
