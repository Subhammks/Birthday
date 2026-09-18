import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/* =========================================================
   PREMIUM 3D GLASS CARD
========================================================= */

function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glow = true,
  style = {},
}) {
  const ref = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(my, [-0.5, 0.5], [maxTilt, -maxTilt]),
    {
      stiffness: 150,
      damping: 20,
    },
  );

  const rotateY = useSpring(
    useTransform(mx, [-0.5, 0.5], [-maxTilt, maxTilt]),
    {
      stiffness: 150,
      damping: 20,
    },
  );

  const glowX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);

  const handleMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`tiltCard ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        "--glow-x": glowX,
        "--glow-y": glowY,
        ...style,
      }}
    >
      {glow && <div className="tiltGlow" />}

      <div className="tiltInner">{children}</div>
    </motion.div>
  );
}

/* =========================================================
   PREMIUM PARTICLES
========================================================= */

function ParticleField({ count = 35 }) {
  const particles = useRef(
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 5,
    })),
  ).current;

  return (
    <div className="particleField">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="premiumParticle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.4, 0.5],
            y: [0, -20, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   ORBITING LIGHT
========================================================= */

function OrbitLight() {
  return (
    <div className="orbitSystem">
      <div className="orbit orbitOne" />
      <div className="orbit orbitTwo" />

      <motion.div
        className="orbitDot"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <span />
      </motion.div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Birthday() {
  const navigate = useNavigate();

  const names = [
    { name: "Suhani", emoji: "🫰" },
    { name: "Su", emoji: "😋" },
    { name: "Cutu", emoji: "🥰" },
    { name: "Bachhu", emoji: "💕" },
    { name: "11:11", emoji: "✨" },
    { name: "Happiness", emoji: "❤️" },
  ];

  const emojis = ["❤️", "✨", "🎂", "🥳", "💕", "😋", "🫰", "🎈"];

  const [currentName, setCurrentName] = useState(0);
  const [showRain, setShowRain] = useState(false);
  const [showCake, setShowCake] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [showAgeReveal, setShowAgeReveal] = useState(false);
  const [age, setAge] = useState(0);

  /* ---------------------------------------------------------
     NAME ROTATION
  --------------------------------------------------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentName((prev) => (prev + 1) % names.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  /* ---------------------------------------------------------
     AGE COUNTER
  --------------------------------------------------------- */

  useEffect(() => {
    if (!showAgeReveal) return;

    let current = 0;

    const timer = setInterval(() => {
      current++;

      setAge(current);

      if (current >= 21) {
        clearInterval(timer);

        setTimeout(() => {
          navigate("/final-note");
        }, 10000);
      }
    }, 180);

    return () => clearInterval(timer);
  }, [showAgeReveal, navigate]);

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */

  return (
    <>
      <div className="birthdayPage">
        {/* BACKGROUND */}

        <div className="backgroundNoise" />
        <div className="cinematicVignette" />

        <div className="lightOrb orbLeft" />
        <div className="lightOrb orbRight" />
        <div className="lightOrb orbBottom" />

        <ParticleField />
        <OrbitLight />

        {/* =================================================
            HERO
        ================================================= */}

        <AnimatePresence mode="wait">
          {!showCake && (
            <motion.section
              className="heroSection"
              key="hero"
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.04,
                filter: "blur(8px)",
              }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* TOP LABEL */}

              <motion.div
                className="heroEyebrow"
                initial={{
                  opacity: 0,
                  y: -15,
                  letterSpacing: "2px",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  letterSpacing: "7px",
                }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                }}
              >
                A LITTLE CELEBRATION
              </motion.div>

              {/* DECORATIVE LINE */}

              <motion.div
                className="goldLine"
                initial={{
                  width: 0,
                  opacity: 0,
                }}
                animate={{
                  width: 90,
                  opacity: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                }}
              />

              {/* MAIN TITLE */}

              <div className="nameStage">
                <div className="nameHalo" />

                <motion.div
                  className="birthdaySmall"
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                  }}
                >
                  HAPPY BIRTHDAY
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentName}
                    className="changingName"
                    initial={{ opacity: 0, y: 25, rotateX: 40 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -25, rotateX: -40 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    <span className="nameText">{names[currentName].name}</span>

                    <motion.span
                      className="nameEmoji"
                      initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.12,
                        type: "spring",
                        stiffness: 300,
                        damping: 12,
                      }}
                    >
                      {names[currentName].emoji}
                    </motion.span>
                  </motion.h1>
                </AnimatePresence>

                <motion.div
                  className="underName"
                  initial={{
                    width: 0,
                    opacity: 0,
                  }}
                  animate={{
                    width: 130,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.8,
                  }}
                />
              </div>

              {/* DESCRIPTION */}

              <motion.p
                className="heroText"
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.9,
                }}
              >
                Every memory... Every laugh... Every moment...
                <br />
                Led to this day.
              </motion.p>

              {/* BUTTONS */}

              <motion.div
                className="heroButtons"
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.9,
                  delay: 1.15,
                }}
              >
                <motion.button
                  className="premiumButton secondaryButton"
                  onClick={() => setShowRain(true)}
                  whileHover={{
                    scale: 1.04,
                    y: -4,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                >
                  <span className="buttonIcon">♡</span>
                  SEND LOVE
                </motion.button>

                <motion.button
                  className="premiumButton primaryButton"
                  onClick={() => setShowCake(true)}
                  whileHover={{
                    scale: 1.04,
                    y: -4,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                >
                  <span className="buttonIcon">✦</span>
                  START CELEBRATION
                </motion.button>
              </motion.div>

              {/* BOTTOM HINT */}

              <motion.div
                className="scrollHint"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 1.8,
                }}
              >
                <span />
                SOMETHING SPECIAL AWAITS
                <span />
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* =================================================
            CAKE SCREEN
        ================================================= */}

        <AnimatePresence>
          {showCake && (
            <motion.div
              className="cakeScreen"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.8,
              }}
            >
              <div className="cakeBackgroundGlow" />

              {!cakeCut ? (
                <motion.div
                  className="cakeStage"
                  initial={{
                    opacity: 0,
                    y: 40,
                    scale: 0.92,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="cakeEyebrow">ONE LITTLE WISH</div>

                  <h1 className="cakeTitle">
                    Make A Wish
                    <span> ✨</span>
                  </h1>

                  <p className="cakeSubtitle">
                    Close your eyes for a second...
                    <br />
                    and make it count.
                  </p>

                  <TiltCard className="cakeTilt" maxTilt={10}>
                    <div className="cakeImageFrame">
                      <div className="cakeFrameGlow" />

                      <img
                        src="/images/tiramisu1.png"
                        alt="Tiramisu Cake"
                        className="cakeImage"
                      />
                    </div>
                  </TiltCard>

                  <motion.button
                    className="premiumButton cutCakeBtn"
                    whileHover={{
                      scale: 1.05,
                      y: -4,
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    onClick={() => {
                      setCakeCut(true);
                      setShowRain(true);

                      setTimeout(() => {
                        setShowAgeReveal(true);
                      }, 2000);
                    }}
                  >
                    <span className="buttonIcon">✦</span>
                    CUT THE CAKE
                  </motion.button>

                  <div className="cakeFooter">
                    <span>09</span>
                    <i>•</i>
                    <span>AUGUST</span>
                    <i>•</i>
                    <span>2005</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="cutStage"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.7,
                  }}
                >
                  <div className="cutCakeContainer">
                    <img
                      src="/images/tiramisu-left.png"
                      alt=""
                      className="cakeHalf leftHalf"
                    />

                    <img
                      src="/images/tiramisu-right.png"
                      alt=""
                      className="cakeHalf rightHalf"
                    />
                  </div>

                  <motion.div
                    className="celebrateEyebrow"
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.6,
                    }}
                  >
                    TODAY IS YOUR DAY
                  </motion.div>

                  <motion.h1
                    className="celebrateText"
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay: 0.8,
                      duration: 0.8,
                    }}
                  >
                    HAPPY BIRTHDAY
                    <br />
                    <span>SU ❤️</span>
                  </motion.h1>

                  <motion.p
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      delay: 1.2,
                    }}
                  >
                    May all your wishes come true ✨
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================
            AGE REVEAL
        ================================================= */}

        <AnimatePresence>
          {showAgeReveal && (
            <motion.div
              className="ageReveal"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 1,
              }}
            >
              <div className="ageBackground" />

              {/* DECORATIVE RINGS */}

              <div className="luxuryRing ringA" />
              <div className="luxuryRing ringB" />
              <div className="luxuryRing ringC" />

              <TiltCard className="ageRevealCard" maxTilt={4}>
                <div className="cardTopLine">
                  <span />
                  A NEW CHAPTER
                  <span />
                </div>

                <motion.p
                  className="storyText"
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                  }}
                >
                  From 09 August 2005
                </motion.p>

                {/* PROFILE */}

                <div className="profileOrbit">
                  <svg className="progressRing" viewBox="0 0 240 240">
                    <defs>
                      <linearGradient
                        id="ringGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#f9d976" />

                        <stop offset="50%" stopColor="#f39ab5" />

                        <stop offset="100%" stopColor="#d66efd" />
                      </linearGradient>
                    </defs>

                    <circle
                      className="progressRingBg"
                      cx="120"
                      cy="120"
                      r="106"
                    />

                    <circle
                      className="progressRingFg"
                      cx="120"
                      cy="120"
                      r="106"
                      style={{
                        strokeDasharray: 2 * Math.PI * 106,

                        strokeDashoffset:
                          2 * Math.PI * 106 * (1 - Math.min(age, 21) / 21),
                      }}
                    />
                  </svg>

                  <div className="profileWrapper">
                    <div className="profileGlow" />

                    <img
                      src="/images/su-bitmoji.png"
                      alt="Suhani"
                      className="birthdayBitmoji"
                    />
                  </div>
                </div>

                {/* AGE */}

                <div className="age3D">
                  {age}
                  <span className="yearsText">YEARS</span>
                </div>

                {/* STATS */}

                <AnimatePresence>
                  {age === 21 && (
                    <motion.div
                      className="birthdayStats"
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div className="birthdayStatsTitle">
                        21 looks beautiful on you.
                      </div>

                      <h2>
                        HAPPY BIRTHDAY
                        <span> SU ❤️</span>
                      </h2>

                      <div className="statsRow">
                        {[
                          {
                            icon: "✦",
                            value: "21",
                            label: "YEARS",
                          },
                          {
                            icon: "☾",
                            value: "252",
                            label: "MONTHS",
                          },
                          {
                            icon: "∞",
                            value: "7670",
                            label: "DAYS",
                          },
                        ].map((s, i) => (
                          <TiltCard
                            key={s.label}
                            className="statTilt"
                            maxTilt={10}
                          >
                            <motion.div
                              className="statCard"
                              initial={{
                                opacity: 0,
                                y: 20,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              transition={{
                                duration: 0.5,
                                delay: 0.2 + i * 0.15,
                              }}
                            >
                              <span className="statIcon">{s.icon}</span>

                              <strong>{s.value}</strong>

                              <small>{s.label}</small>
                            </motion.div>
                          </TiltCard>
                        ))}
                      </div>

                      <h3 className="birthdayLine">
                        ✦ Of making the world brighter ✦
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TiltCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================
            LOVE RAIN
        ================================================= */}

        {showRain &&
          Array.from({ length: 70 }).map((_, i) => (
            <span
              key={i}
              className="emojiRain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            >
              {emojis[Math.floor(Math.random() * emojis.length)]}
            </span>
          ))}
      </div>

      {/* =====================================================
          PREMIUM CSS
      ===================================================== */}

      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Manrope:wght@300;400;500;600;700&display=swap');


        /* =====================================================
           GLOBAL
        ===================================================== */

        * {
          box-sizing: border-box;
        }

        .birthdayPage {
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          position: relative;

          background:
            radial-gradient(
              circle at 50% 30%,
              #29182d 0%,
              #120c18 38%,
              #08060d 72%,
              #040308 100%
            );

          color: white;

          font-family: 'Manrope', sans-serif;
        }


        /* =====================================================
           BACKGROUND
        ===================================================== */

        .backgroundNoise {
          position: fixed;
          inset: 0;

          pointer-events: none;

          opacity: .035;

          z-index: 2;

          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E");
        }


        .cinematicVignette {
          position: fixed;
          inset: 0;

          pointer-events: none;

          z-index: 8;

          background:
            radial-gradient(
              ellipse at center,
              transparent 30%,
              rgba(0,0,0,.22) 65%,
              rgba(0,0,0,.8) 100%
            );
        }


        .lightOrb {
          position: fixed;

          border-radius: 50%;

          pointer-events: none;

          filter: blur(90px);

          opacity: .45;

          z-index: 0;
        }


        .orbLeft {
          width: 420px;
          height: 420px;

          left: -180px;
          top: 10%;

          background: rgba(208, 92, 139, .22);

          animation: orbFloat 12s ease-in-out infinite;
        }


        .orbRight {
          width: 400px;
          height: 400px;

          right: -170px;
          top: 25%;

          background: rgba(166, 91, 210, .16);

          animation:
            orbFloat 15s ease-in-out infinite reverse;
        }


        .orbBottom {
          width: 500px;
          height: 300px;

          left: 50%;
          bottom: -220px;

          transform: translateX(-50%);

          background: rgba(220, 124, 142, .14);
        }


        @keyframes orbFloat {

          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-40px);
          }

        }


        /* =====================================================
           PARTICLES
        ===================================================== */

        .particleField {
          position: fixed;
          inset: 0;

          pointer-events: none;

          z-index: 3;
        }


        .premiumParticle {
          position: absolute;

          border-radius: 50%;

          background: #f9d9bc;

          box-shadow:
            0 0 8px rgba(249,217,188,.7),
            0 0 20px rgba(249,217,188,.2);
        }


        /* =====================================================
           ORBITS
        ===================================================== */

        .orbitSystem {
          position: fixed;

          width: 520px;
          height: 520px;

          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          pointer-events: none;

          z-index: 1;

          opacity: .25;
        }


        .orbit {
          position: absolute;
          inset: 0;

          border-radius: 50%;

          border: 1px solid rgba(245, 205, 170, .12);
        }


        .orbitTwo {
          inset: 55px;

          border-style: dashed;

          border-color: rgba(245, 174, 202, .09);

          animation: rotateOrbit 35s linear infinite reverse;
        }


        .orbitDot {
          position: absolute;

          inset: 0;

          border-radius: 50%;

          animation: rotateOrbit 22s linear infinite;
        }


        .orbitDot span {
          position: absolute;

          top: -2px;
          left: 50%;

          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #f9d9bc;

          box-shadow:
            0 0 10px #f9d9bc,
            0 0 25px rgba(249,217,188,.6);
        }


        @keyframes rotateOrbit {

          to {
            transform: rotate(360deg);
          }

        }


        /* =====================================================
           HERO
        ===================================================== */

        .heroSection {
          position: relative;

          z-index: 10;

          min-height: 100vh;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          text-align: center;

          padding: 30px;
        }


        .heroEyebrow {
          font-size: .68rem;

          font-weight: 600;

          color: rgba(249,217,188,.85);

          margin-bottom: 18px;
        }


        .goldLine {
          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #f9d9bc,
              transparent
            );

          margin-bottom: 42px;

          box-shadow:
            0 0 12px rgba(249,217,188,.4);
        }


        .nameStage {
          position: relative;

          padding: 20px 45px;
        }


        .nameHalo {
          position: absolute;

          width: 500px;
          height: 240px;

          left: 50%;
          top: 50%;

          transform: translate(-50%, -50%);

          background:
            radial-gradient(
              ellipse,
              rgba(229,145,166,.16),
              transparent 68%
            );

          filter: blur(25px);

          pointer-events: none;
        }


        .birthdaySmall {
          position: relative;

          font-size: .75rem;

          letter-spacing: 8px;

          font-weight: 600;

          color: #f5d7bd;

          margin-bottom: 12px;
        }


        .changingName {
  font-family: 'Cormorant Garamond', serif;
  font-size: 7rem;
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;

  margin: 0;

  text-shadow:
    0 0 30px rgba(255,255,255,.25);

  animation: namePulse 2s infinite;
}

/* ONLY the actual name gets the gradient */
.nameText {
  background: linear-gradient(
    90deg,
    #ffffff,
    #ffd6f7,
    #ffd369,
    #ffffff
  );

  background-size: 300% auto;

  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: transparent;
  color: transparent;

  animation: shimmer 5s linear infinite;
}

/* Emoji stays completely independent */
.nameEmoji {
  display: inline-block;

  font-family:
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Noto Color Emoji",
    sans-serif;

  font-size: 0.62em;

  -webkit-text-fill-color: initial;
  color: initial;

  background: none !important;
  -webkit-background-clip: initial !important;
  background-clip: initial !important;

  filter:
    drop-shadow(0 0 8px rgba(255,255,255,.25))
    drop-shadow(0 0 18px rgba(255,180,210,.35));

  transform-origin: center;
}


        @keyframes luxuryShimmer {

          0% {
            background-position: 0% center;
          }

          100% {
            background-position: 250% center;
          }

        }


        .underName {
          height: 1px;

          margin: 25px auto 0;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(249,217,188,.8),
              transparent
            );
        }


        .heroText {
          position: relative;

          max-width: 600px;

          margin: 42px auto 0;

          color: rgba(255,255,255,.62);

          font-size: 1rem;

          line-height: 1.9;

          font-weight: 300;

          letter-spacing: .4px;
        }


        /* =====================================================
           BUTTONS
        ===================================================== */

        .heroButtons {
          display: flex;

          gap: 14px;

          flex-wrap: wrap;

          justify-content: center;

          margin-top: 34px;
        }


        .premiumButton {
          position: relative;

          min-width: 210px;

          padding: 16px 28px;

          border-radius: 999px;

          border: 1px solid
            rgba(255,255,255,.14);

          color: white;

          font-family: 'Manrope', sans-serif;

          font-size: .72rem;

          font-weight: 700;

          letter-spacing: 2px;

          cursor: pointer;

          overflow: hidden;

          backdrop-filter: blur(18px);

          transition:
            border-color .4s,
            box-shadow .4s;
        }


        .premiumButton::before {
          content: "";

          position: absolute;

          top: 0;
          left: -120%;

          width: 80%;
          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.25),
              transparent
            );

          transform: skewX(-20deg);

          transition: left .8s;
        }


        .premiumButton:hover::before {
          left: 140%;
        }


        .primaryButton {
          background:
            linear-gradient(
              135deg,
              rgba(227,145,169,.95),
              rgba(177,100,150,.9)
            );

          border-color:
            rgba(255,220,228,.35);

          box-shadow:
            0 10px 40px rgba(191,101,143,.25);
        }


        .secondaryButton {
          background:
            rgba(255,255,255,.045);

          color:
            rgba(255,255,255,.85);
        }


        .secondaryButton:hover {
          border-color:
            rgba(249,217,188,.35);

          box-shadow:
            0 10px 35px
            rgba(249,217,188,.1);
        }


        .buttonIcon {
          margin-right: 10px;

          color: #f9d9bc;

          font-size: 1rem;
        }


        .scrollHint {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-top: 75px;

          font-size: .55rem;

          letter-spacing: 4px;

          color: rgba(255,255,255,.28);
        }


        .scrollHint span {
          width: 25px;

          height: 1px;

          background:
            rgba(255,255,255,.2);
        }


        /* =====================================================
           TILT CARD
        ===================================================== */

        .tiltCard {
          position: relative;

          transform-style: preserve-3d;
        }


        .tiltInner {
          position: relative;

          z-index: 2;

          transform: translateZ(30px);
        }


        .tiltGlow {
          position: absolute;

          inset: 0;

          z-index: 1;

          border-radius: inherit;

          pointer-events: none;

          background:
            radial-gradient(
              circle at var(--glow-x) var(--glow-y),
              rgba(255,255,255,.16),
              transparent 45%
            );
        }


        /* =====================================================
           CAKE
        ===================================================== */

        .cakeScreen {
          position: fixed;

          inset: 0;

          z-index: 1000;

          display: flex;

          align-items: center;
          justify-content: center;

          text-align: center;

          overflow: auto;

          background:
            radial-gradient(
              circle at 50% 45%,
              rgba(115,56,83,.32),
              transparent 40%
            ),
            #07050a;
        }


        .cakeBackgroundGlow {
          position: absolute;

          width: 700px;
          height: 700px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(220,128,154,.18),
              transparent 68%
            );

          filter: blur(30px);

          animation: cakeGlow 5s ease-in-out infinite;
        }


        @keyframes cakeGlow {

          50% {
            transform: scale(1.12);

            opacity: .7;
          }

        }


        .cakeStage {
          position: relative;

          z-index: 3;

          display: flex;

          flex-direction: column;

          align-items: center;

          padding: 40px 20px;
        }


        .cakeEyebrow {
          font-size: .6rem;

          letter-spacing: 6px;

          color: #f9d9bc;

          margin-bottom: 12px;
        }


        .cakeTitle {
          margin: 0;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 3.6rem;

          font-weight: 500;

          font-style: italic;

          color: white;
        }


        .cakeTitle span {
          color: #f9d9bc;
        }


        .cakeSubtitle {
          margin: 12px 0 28px;

          color:
            rgba(255,255,255,.5);

          font-size: .85rem;

          line-height: 1.7;
        }


        .cakeTilt {
          position: relative;

          padding: 20px;

          border-radius: 30px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.10),
              rgba(255,255,255,.025)
            );

          border: 1px solid
            rgba(255,255,255,.13);

          box-shadow:
            0 30px 100px
              rgba(0,0,0,.65),
            0 0 70px
              rgba(221,127,156,.12);
        }


        .cakeImageFrame {
          position: relative;

          padding: 8px;

          border-radius: 22px;
        }


        .cakeFrameGlow {
          position: absolute;

          inset: 20%;

          background:
            rgba(248,199,174,.15);

          filter: blur(40px);

          z-index: -1;
        }


        .cakeImage {
          width: 350px;

          max-width: 70vw;

          display: block;

          filter:
            drop-shadow(
              0 20px 35px
              rgba(0,0,0,.45)
            );

          animation:
            floatCake 4s ease-in-out infinite;
        }


        @keyframes floatCake {

          0%,100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }

        }


        .cutCakeBtn {
          margin-top: 30px;
        }


        .cakeFooter {
          margin-top: 35px;

          display: flex;

          gap: 12px;

          align-items: center;

          color:
            rgba(255,255,255,.32);

          font-size: .55rem;

          letter-spacing: 4px;
        }


        .cakeFooter i {
          color: #d997ad;

          font-style: normal;
        }


        /* =====================================================
           CUT CAKE
        ===================================================== */

        .cutStage {
          position: relative;

          z-index: 5;

          display: flex;

          flex-direction: column;

          align-items: center;
        }


        .cutCakeContainer {
          display: flex;

          align-items: center;

          justify-content: center;

          position: relative;

          margin-bottom: 25px;
        }


        .cakeHalf {
          width: 280px;

          max-width: 40vw;

          filter:
            drop-shadow(
              0 20px 40px
              rgba(0,0,0,.5)
            );

          animation-duration: 1.5s;

          animation-fill-mode: forwards;
        }


        .leftHalf {
          animation-name: splitLeft;
        }


        .rightHalf {
          animation-name: splitRight;
        }


        @keyframes splitLeft {

          from {
            transform:
              translateX(0)
              rotate(0);
          }

          to {
            transform:
              translateX(-130px)
              rotate(-7deg);
          }

        }


        @keyframes splitRight {

          from {
            transform:
              translateX(0)
              rotate(0);
          }

          to {
            transform:
              translateX(130px)
              rotate(7deg);
          }

        }


        .celebrateEyebrow {
          font-size: .6rem;

          letter-spacing: 7px;

          color: #f9d9bc;

          margin-top: 15px;
        }


        .celebrateText {
          margin: 15px 0;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size:
            clamp(3rem, 7vw, 6rem);

          line-height: .9;

          font-weight: 500;

          color: white;
        }


        .celebrateText span {
          font-style: italic;

          background:
            linear-gradient(
              120deg,
              #f9d9bc,
              #e89ab8,
              #fff
            );

          -webkit-background-clip: text;
          background-clip: text;

          color: transparent;
        }


        .cutStage p {
          color:
            rgba(255,255,255,.5);

          font-size: .85rem;
        }


        /* =====================================================
           AGE REVEAL
        ===================================================== */

        .ageReveal {
          position: fixed;

          inset: 0;

          z-index: 2000;

          display: flex;

          justify-content: center;
          align-items: center;

          overflow: auto;

          padding: 30px;

          background:
            radial-gradient(
              circle at 50% 40%,
              rgba(133,70,104,.3),
              transparent 45%
            ),
            #060509;
        }


        .ageBackground {
          position: absolute;

          inset: 0;

          background:
            radial-gradient(
              ellipse at center,
              transparent 20%,
              rgba(0,0,0,.55) 80%
            );
        }


        /* =====================================================
           LUXURY RINGS
        ===================================================== */

        .luxuryRing {
          position: absolute;

          border-radius: 50%;

          border: 1px solid
            rgba(249,217,188,.1);

          pointer-events: none;
        }


        .ringA {
          width: 600px;
          height: 600px;

          animation:
            ringRotate 35s linear infinite;
        }


        .ringB {
          width: 800px;
          height: 800px;

          border-style: dashed;

          opacity: .5;

          animation:
            ringRotate 55s linear infinite reverse;
        }


        .ringC {
          width: 1000px;
          height: 1000px;

          opacity: .22;

          animation:
            ringRotate 80s linear infinite;
        }


        @keyframes ringRotate {

          to {
            transform: rotate(360deg);
          }

        }


        /* =====================================================
           AGE CARD
        ===================================================== */

        .ageRevealCard {
          position: relative;

          z-index: 5;

          width: min(520px, 94vw);

          padding:
            38px 35px 35px;

          border-radius: 32px;

          text-align: center;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.085),
              rgba(255,255,255,.025)
            );

          border:
            1px solid
            rgba(255,255,255,.13);

          backdrop-filter:
            blur(28px);

          box-shadow:
            0 50px 120px
              rgba(0,0,0,.7),
            0 0 100px
              rgba(208,107,149,.12),
            inset
              0 1px 0
              rgba(255,255,255,.12);
        }


        .cardTopLine {
          display: flex;

          justify-content: center;

          align-items: center;

          gap: 12px;

          font-size: .5rem;

          letter-spacing: 5px;

          color:
            rgba(249,217,188,.7);

          margin-bottom: 16px;
        }


        .cardTopLine span {
          width: 25px;

          height: 1px;

          background:
            rgba(249,217,188,.4);
        }


        .storyText {
          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 1.2rem;

          font-style: italic;

          color: #f9d9bc;

          margin-bottom: 12px;
        }


        /* =====================================================
           PROFILE
        ===================================================== */

        .profileOrbit {
          position: relative;

          width: 240px;
          height: 240px;

          margin: 5px auto 12px;

          display: flex;

          align-items: center;
          justify-content: center;
        }


        .progressRing {
          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;

          transform: rotate(-90deg);

          filter:
            drop-shadow(
              0 0 12px
              rgba(236,157,181,.4)
            );
        }


        .progressRingBg {
          fill: none;

          stroke:
            rgba(255,255,255,.08);

          stroke-width: 4;
        }


        .progressRingFg {
          fill: none;

          stroke:
            url(#ringGrad);

          stroke-width: 4;

          stroke-linecap: round;

          transition:
            stroke-dashoffset .18s linear;
        }


        .profileWrapper {
          position: relative;

          width: 198px;
          height: 198px;

          border-radius: 50%;

          display: flex;

          align-items: center;
          justify-content: center;
        }


        .profileGlow {
          position: absolute;

          inset: 10%;

          border-radius: 50%;

          background:
            rgba(221,126,158,.2);

          filter: blur(30px);
        }


        .birthdayBitmoji {
          position: relative;

          width: 100%;
          height: 100%;

          border-radius: 50%;

          object-fit: cover;

          border:
            5px solid
            rgba(255,255,255,.12);

          box-shadow:
            0 15px 50px
              rgba(0,0,0,.5),
            0 0 50px
              rgba(225,132,161,.25);

          animation:
            portraitFloat 5s ease-in-out infinite;
        }


        @keyframes portraitFloat {

          0%,100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }

        }


        /* =====================================================
           AGE NUMBER
        ===================================================== */

        .age3D {
          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 5rem;

          font-weight: 600;

          line-height: .75;

          color: white;

          text-shadow:
            0 0 30px
              rgba(244,174,194,.35);

          animation:
            ageFloat 3s ease-in-out infinite;
        }


        @keyframes ageFloat {

          50% {
            transform:
              translateY(-7px);
          }

        }


        .yearsText {
          display: block;

          margin-top: 12px;

          font-family:
            'Manrope', sans-serif;

          font-size: .5rem;

          letter-spacing: 7px;

          color: #f9d9bc;
        }


        /* =====================================================
           STATS
        ===================================================== */

        .birthdayStats {
          margin-top: 25px;
        }


        .birthdayStatsTitle {
          color:
            rgba(255,255,255,.42);

          font-size: .7rem;

          letter-spacing: 1px;

          margin-bottom: 8px;
        }


        .birthdayStats h2 {
          margin: 0 0 18px;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 1.8rem;

          font-weight: 500;

          color: white;
        }


        .birthdayStats h2 span {
          color: #f0aec2;

          font-style: italic;
        }


        .statsRow {
          display: flex;

          justify-content: center;

          gap: 10px;
        }


        .statTilt {
          flex: 1;

          min-width: 0;
        }


        .statCard {
          padding: 17px 10px;

          border-radius: 18px;

          background:
            rgba(255,255,255,.045);

          border:
            1px solid
            rgba(255,255,255,.08);

          transition:
            transform .3s,
            background .3s;
        }


        .statCard:hover {
          background:
            rgba(255,255,255,.08);
        }


        .statIcon {
          display: block;

          font-size: .9rem;

          color: #f9d9bc;

          margin-bottom: 7px;
        }
          @media


        .statCard strong {
          display: block;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 2rem;

          font-weight: 600;
        }


        .statCard small {
          display: block;

          margin-top: 4px;

          font-size: .45rem;

          letter-spacing: 3px;

          color:
            rgba(255,255,255,.38);
        }


        .birthdayLine {
          margin-top: 23px;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size: 1rem;

          font-style: italic;

          font-weight: 400;

          color: #f9d9bc;
        }


        /* =====================================================
           EMOJI RAIN
        ===================================================== */

        .emojiRain {
          position: fixed;

          top: -50px;

          z-index: 5000;

          font-size: 1.7rem;

          pointer-events: none;

          animation:
            premiumFall 5s linear infinite;

          filter:
            drop-shadow(
              0 0 8px
              rgba(255,255,255,.2)
            );
        }


        @keyframes premiumFall {

          from {
            transform:
              translateY(-80px)
              rotate(0deg);

            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          90% {
            opacity: .9;
          }

          to {
            transform:
              translateY(120vh)
              rotate(360deg);

            opacity: 0;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

         @media(max-width:768px){

  .changingName{
    font-size:3rem;
    gap:12px;
  }

  .nameEmoji{
    font-size:.65em;
  }

  .heroText{
    font-size:1rem;
  }

  .ageRevealCard{
    padding:36px 22px 30px;
    border-radius:24px;
  }

  .profileOrbit{
    width:170px;
    height:170px;
  }

  .profileWrapper{
    width:146px;
    height:146px;
  }

  .age3D{
    font-size:2.8rem;
  }

  .statsRow{
    gap:10px;
  }

  .statCard{
    padding:14px 16px;
  }

  .sparkleRing{
    width:260px;
    height:260px;
  }

  .sparkleRing2{
    width:320px;
    height:320px;
  }
}


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }

        }

      `}</style>
    </>
  );
}
