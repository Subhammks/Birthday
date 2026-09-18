import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import DreamyBackground from "../components/DreamyBackground";
import { useState, useEffect, useRef } from "react";

const ease = [0.16, 1, 0.3, 1];

export default function Portal() {
  const [typed, setTyped] = useState("");
  const [canParallax, setCanParallax] = useState(false);

  const message =
    "A mysterious outbreak has spread through the city. But one person remains immune. Today is her birthday.";

  const missionText = "RESIDENT FILE #0808";

  /* =====================================
     PARALLAX
  ===================================== */

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springX = useSpring(mx, {
    stiffness: 55,
    damping: 20,
  });

  const springY = useSpring(my, {
    stiffness: 55,
    damping: 20,
  });

  const nearX = useTransform(springX, [-1, 1], [-5, 5]);

  const nearY = useTransform(springY, [-1, 1], [-4, 4]);

  const farX = useTransform(springX, [-1, 1], [-14, 14]);

  const farY = useTransform(springY, [-1, 1], [-9, 9]);

  /* =====================================
     MAGNETIC BUTTON
  ===================================== */

  const btnRef = useRef(null);

  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);

  const btnSpringX = useSpring(btnX, {
    stiffness: 180,
    damping: 18,
  });

  const btnSpringY = useSpring(btnY, {
    stiffness: 180,
    damping: 18,
  });

  /* =====================================
     DEVICE
  ===================================== */

  useEffect(() => {
    setCanParallax(window.matchMedia("(pointer: fine)").matches);
  }, []);

  /* =====================================
     MOUSE PARALLAX
  ===================================== */

  useEffect(() => {
    if (!canParallax) return;

    const move = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      mx.set((e.clientX - cx) / cx);
      my.set((e.clientY - cy) / cy);
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, [canParallax, mx, my]);

  /* =====================================
     BUTTON MAGNET
  ===================================== */

  const handleBtnMove = (e) => {
    if (!canParallax || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();

    const relX = e.clientX - (rect.left + rect.width / 2);

    const relY = e.clientY - (rect.top + rect.height / 2);

    btnX.set(relX * 0.16);
    btnY.set(relY * 0.16);
  };

  const resetBtn = () => {
    btnX.set(0);
    btnY.set(0);
  };

  /* =====================================
     TYPEWRITER
  ===================================== */

  useEffect(() => {
    let i = 0;

    const timer = setInterval(() => {
      setTyped(message.slice(0, i));

      i++;

      if (i > message.length) {
        clearInterval(timer);
      }
    }, 32);

    return () => clearInterval(timer);
  }, []);

  /* =====================================
     TITLE ANIMATION
  ===================================== */

  const letterReveal = {
    hidden: {
      opacity: 0,
      y: 35,
      rotateX: 45,
      filter: "blur(12px)",
    },

    show: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",

      transition: {
        duration: 1.25,
        delay: 0.35 + i * 0.08,
        ease,
      },
    }),
  };

  return (
    <>
      <DreamyBackground />

      <main
        className="portal"
        style={{
          perspective: 1400,
        }}
      >
        {/* =====================================
            ATMOSPHERIC GLOW
        ===================================== */}

        <motion.div
          className="portalGlow"
          style={{
            x: farX,
            y: farY,
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.35, 0.5, 0.35],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* =====================================
            TOP LABEL
        ===================================== */}

        <motion.div
          className="subtitle"
          style={{
            x: farX,
            y: farY,
          }}
          initial={{
            opacity: 0,
            letterSpacing: "2px",
          }}
          animate={{
            opacity: 1,
            letterSpacing: "7px",
          }}
          transition={{
            duration: 1.5,
            ease,
          }}
        >
          <span className="subtitleLine" />
          QUARANTINE DAY 365
          <span className="subtitleLine" />
        </motion.div>

        {/* =====================================
            MAIN TITLE
        ===================================== */}

        <motion.h1
          className="title"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <span className="titleLine">
            {"HAPPINESS".split("").map((ch, i) => (
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

          <motion.span
            className="mission"
            style={{
              x: farX,
              y: farY,
            }}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 1.25,
              ease,
            }}
          >
            {missionText}
          </motion.span>
        </motion.h1>

        {/* =====================================
            STATUS
        ===================================== */}

        <motion.div
          className="status"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 1.55,
            ease,
          }}
        >
          <span className="statusDot" />
          STATUS · IMMUNE
          <span className="statusDot" />
        </motion.div>

        {/* =====================================
            DESCRIPTION
        ===================================== */}

        <motion.p
          className="description"
          style={{
            x: nearX,
            y: nearY,
          }}
          initial={{
            opacity: 0,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1,
            delay: 1.7,
            ease,
          }}
        >
          {typed}

          <span className="typingCursor">|</span>
        </motion.p>

        {/* =====================================
            QUOTE
        ===================================== */}

        <motion.div
          className="quote"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1.1,
            delay: 2.7,
            ease,
          }}
        >
          <span className="quoteLine" />

          <span>
            “In a world full of fear, one person remained my happiness.”
          </span>

          <span className="quoteLine" />
        </motion.div>

        {/* =====================================
            FILE STATUS
        ===================================== */}

        <motion.div
          className="warning"
          style={{
            x: nearX,
            y: nearY,
          }}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 3,
            ease,
          }}
        >
          <span className="fileIndicator" />
          FILE STATUS · IMMUNE
        </motion.div>

        {/* =====================================
            BUTTON
        ===================================== */}

        <motion.div
          style={{
            x: nearX,
            y: nearY,
          }}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 3.25,
            ease,
          }}
        >
          <Link to="/elevator" className="portalLink">
            <motion.button
              ref={btnRef}
              className="magicBtn"
              onMouseMove={handleBtnMove}
              onMouseLeave={resetBtn}
              style={{
                x: btnSpringX,
                y: btnSpringY,
              }}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              <span>ENTER SAFE ZONE</span>

              <span className="buttonArrow">→</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* =====================================
            STORY PROGRESS
        ===================================== */}

        <motion.div
          className="storyProgress"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 4,
            duration: 1,
          }}
        >
          <span>01</span>

          <div className="progressTrack">
            <div className="progressFill" />
          </div>

          <span>05</span>
        </motion.div>
      </main>

      <style>{`

        /* =====================================
           PORTAL
        ===================================== */

        .portal {
          min-height: 100svh;

          width: 100%;

          display: flex;
          flex-direction: column;

          justify-content: center;
          align-items: center;

          text-align: center;

          padding: 50px 24px 90px;

          position: relative;

          z-index: 5;

          overflow: hidden;
        }


        /* =====================================
           ATMOSPHERIC GLOW
        ===================================== */

        .portalGlow {
          position: absolute;

          width: 420px;
          height: 420px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(130,180,255,.13),
              rgba(160,100,255,.06) 45%,
              transparent 70%
            );

          filter: blur(20px);

          pointer-events: none;

          z-index: -1;
        }


        /* =====================================
           SUBTITLE
        ===================================== */

        .subtitle {
          display: flex;

          align-items: center;

          gap: 14px;

          margin-bottom: 25px;

          color:
            rgba(220,235,255,.52);

          font-family:
            'Montserrat',
            sans-serif;

          font-size: 9px;

          font-weight: 500;

          letter-spacing: 7px;

          text-transform: uppercase;

          white-space: nowrap;
        }


        .subtitleLine {
          width: 30px;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(220,235,255,.35)
            );
        }


        .subtitleLine:last-child {
          background:
            linear-gradient(
              90deg,
              rgba(220,235,255,.35),
              transparent
            );
        }


        /* =====================================
           TITLE
        ===================================== */

        .title {
          margin: 0;

          font-family:
            'Cormorant Garamond',
            serif !important;

          font-size:
            clamp(5rem, 11vw, 9rem);

          font-weight: 600;

          line-height: .78;

          letter-spacing: .10em;

          text-transform: uppercase;

          color: #f8fbff;

          text-shadow:
            0 0 12px
            rgba(255,255,255,.65),

            0 0 35px
            rgba(150,220,255,.42),

            0 0 90px
            rgba(100,150,255,.2);
        }


        .titleLine {
          display: inline-block;
        }


        .titleChar {
          display: inline-block;

          font-family:
            'Cormorant Garamond',
            serif !important;

          text-shadow:
            0 0 10px
            rgba(255,255,255,.8),

            0 0 25px
            rgba(150,220,255,.55),

            0 0 60px
            rgba(100,180,255,.35);
        }


        /* =====================================
           MISSION
        ===================================== */

        .mission {
          display: block;

          margin-top: 28px;

          font-family:
            'Montserrat',
            sans-serif;

          font-size: 9px;

          font-weight: 500;

          letter-spacing: .34em;

          text-transform: uppercase;

          color:
            rgba(180,215,255,.6);
        }


        /* =====================================
           STATUS
        ===================================== */

        .status {
          display: flex;

          align-items: center;

          gap: 9px;

          margin-top: 35px;

          font-family:
            'Montserrat',
            sans-serif;

          font-size: 8px;

          font-weight: 500;

          letter-spacing: .3em;

          text-transform: uppercase;

          color:
            rgba(200,255,225,.58);
        }


        .statusDot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background:
            #a8ffd3;

          box-shadow:
            0 0 8px
            rgba(168,255,211,.8);

          animation:
            statusPulse 2.4s
            ease-in-out infinite;
        }


        @keyframes statusPulse {

          0%,
          100% {
            opacity: .35;
            transform: scale(.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.15);
          }

        }


        /* =====================================
           DESCRIPTION
        ===================================== */

        .description {
          margin-top: 32px;

          max-width: 700px;

          min-height: 92px;

          font-family:
            'Montserrat',
            sans-serif;

          font-size: 1.05rem;

          font-weight: 300;

          line-height: 1.9;

          letter-spacing: .015em;

          color:
            rgba(255,255,255,.68);

          text-shadow:
            0 5px 20px
            rgba(0,0,0,.35);
        }


        .typingCursor {
          margin-left: 2px;

          color:
            rgba(255,255,255,.7);

          animation:
            cursorBlink .8s
            step-end infinite;
        }


        @keyframes cursorBlink {

          50% {
            opacity: 0;
          }

        }


        /* =====================================
           QUOTE
        ===================================== */

        .quote {
          display: flex;

          align-items: center;

          gap: 14px;

          max-width: 800px;

          margin-top: 15px;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size:
            clamp(1.1rem, 2vw, 1.35rem);

          font-weight: 400;

          font-style: italic;

          letter-spacing: .015em;

          color:
            rgba(230,238,250,.56);
        }


        .quoteLine {
          width: 28px;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.28)
            );

          flex-shrink: 0;
        }


        .quoteLine:last-child {
          background:
            linear-gradient(
              90deg,
              rgba(255,255,255,.28),
              transparent
            );
        }


        /* =====================================
           FILE STATUS
        ===================================== */

        .warning {
          display: flex;

          align-items: center;

          gap: 9px;

          margin-top: 28px;

          padding: 8px 15px;

          border:
            1px solid
            rgba(180,210,255,.12);

          background:
            rgba(255,255,255,.035);

          backdrop-filter:
            blur(16px);

          -webkit-backdrop-filter:
            blur(16px);

          color:
            rgba(220,230,245,.42);

          font-family:
            'Montserrat',
            sans-serif;

          font-size: 7px;

          font-weight: 500;

          letter-spacing: .24em;

          text-transform: uppercase;
        }


        .fileIndicator {
          width: 4px;
          height: 4px;

          border-radius: 50%;

          background:
            rgba(180,210,255,.7);

          box-shadow:
            0 0 8px
            rgba(180,210,255,.5);
        }


        /* =====================================
           BUTTON
        ===================================== */

        .portalLink {
          display: block;

          margin-top: 34px;
        }


        .magicBtn {
          position: relative;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 15px;

          min-width: 215px;

          height: 54px;

          padding: 0 25px;

          border-radius: 999px;

          color:
            rgba(255,255,255,.9);

          font-family:
            'Montserrat',
            sans-serif;

          font-size: 9px;

          font-weight: 500;

          letter-spacing: .2em;

          text-transform: uppercase;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.11),
              rgba(255,255,255,.035)
            );

          border:
            1px solid
            rgba(255,255,255,.18);

          backdrop-filter:
            blur(20px);

          -webkit-backdrop-filter:
            blur(20px);

          box-shadow:
            0 18px 50px
            rgba(0,0,0,.2),

            inset 0 1px
            rgba(255,255,255,.16);

          overflow: hidden;

          transform-style:
            preserve-3d;

          transition:
            border-color .35s ease,
            box-shadow .35s ease,
            background .35s ease;
        }


        .magicBtn::before {
          content: "";

          position: absolute;

          top: 0;
          left: -120%;

          width: 100%;
          height: 100%;

          background:
            linear-gradient(
              100deg,
              transparent,
              rgba(255,255,255,.32),
              transparent
            );

          transition:
            left .8s ease;

          pointer-events: none;
        }


        .magicBtn:hover {
          border-color:
            rgba(255,255,255,.35);

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.16),
              rgba(255,255,255,.05)
            );

          box-shadow:
            0 20px 55px
            rgba(100,130,255,.15),

            0 0 35px
            rgba(190,150,255,.1),

            inset 0 1px
            rgba(255,255,255,.22);
        }


        .magicBtn:hover::before {
          left: 120%;
        }


        .buttonArrow {
          font-size: 16px;

          line-height: 1;

          transition:
            transform .35s ease;
        }


        .magicBtn:hover
        .buttonArrow {
          transform:
            translateX(5px);
        }


        /* =====================================
           STORY PROGRESS
        ===================================== */

        .storyProgress {
          position: absolute;

          bottom: 25px;
          left: 50%;

          transform:
            translateX(-50%);

          display: flex;

          align-items: center;

          gap: 11px;

          font-family:
            'Montserrat',
            sans-serif;

          font-size: 7px;

          letter-spacing: .12em;

          color:
            rgba(255,255,255,.35);
        }


        .progressTrack {
          width: 85px;

          height: 1px;

          background:
            rgba(255,255,255,.12);

          overflow: hidden;
        }


        .progressFill {
          width: 20%;

          height: 100%;

          background:
            rgba(255,255,255,.7);

          box-shadow:
            0 0 10px
            rgba(255,255,255,.4);
        }


        /* =====================================
           MOBILE
        ===================================== */

        @media (max-width: 768px) {

          .portal {
            padding:
              35px 18px 75px;
          }


          .portalGlow {
            width: 300px;
            height: 300px;
          }


          .subtitle {
            gap: 8px;

            font-size: 7px;

            letter-spacing: 4px;
          }


          .subtitleLine {
            width: 18px;
          }


          .title {
            font-size:
              clamp(
                3.6rem,
                17vw,
                5.5rem
              );

            letter-spacing: .06em;

            line-height: .82;
          }


          .mission {
            margin-top: 23px;

            font-size: 7px;

            letter-spacing: .22em;
          }


          .status {
            margin-top: 29px;

            font-size: 7px;

            letter-spacing: .2em;
          }


          .description {
            max-width: 92%;

            min-height: 110px;

            margin-top: 25px;

            font-size: .88rem;

            line-height: 1.8;
          }


          .quote {
            max-width: 90%;

            gap: 8px;

            font-size: 1rem;

            line-height: 1.45;
          }


          .quoteLine {
            width: 14px;
          }


          .warning {
            margin-top: 23px;

            padding:
              8px 12px;

            font-size: 6px;

            letter-spacing: .16em;
          }


          .portalLink {
            margin-top: 28px;
          }


          .magicBtn {
            min-width: 195px;

            height: 50px;

            font-size: 8px;

            letter-spacing: .16em;
          }


          .storyProgress {
            bottom: 17px;
          }

        }


        /* =====================================
           REDUCED MOTION
        ===================================== */

        @media (prefers-reduced-motion: reduce) {

          .statusDot,
          .typingCursor {
            animation: none;
          }

        }

      `}</style>
    </>
  );
}
