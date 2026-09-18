import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { motion, AnimatePresence } from "framer-motion";
import CustomCursor from "./CustomCursor";

const memories = [
  {
    id: "m1",
    number: "01",
    title: "A Little Chaos",
    quote: "Some of the best memories were never planned.",
    text: "Aur shayad isi liye woh moments sabse zyada yaad reh jaate hain.",
  },
  {
    id: "m2",
    number: "02",
    title: "That Smile",
    quote: "Some smiles quietly become someone's favourite sight.",
    text: "Kuch smiles explain nahi karni padti... bas yaad reh jaati hain.",
  },
  {
    id: "m3",
    number: "03",
    title: "One Secret",
    quote: "Not every beautiful thing needs to be explained.",
    text: "Kuch baatein bas humare beech rehne ke liye hoti hain.",
  },
  {
    id: "m4",
    number: "04",
    title: "This Moment",
    quote: "If memories were stars, this one would still be glowing.",
    text: "Because some moments deserve their own little place in the universe.",
  },
];

export default function Memory() {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [activeMemory, setActiveMemory] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [introComplete, setIntroComplete] = useState(false);

  const navigate = useNavigate();

  /* --------------------------------------------------
     STAR FIELD
  -------------------------------------------------- */

  const stars = useMemo(() => {
    const generated = [];

    for (let i = 0; i < 65; i++) {
      generated.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.8,
        depth: 0.2 + Math.random() * 1.5,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      });
    }

    return generated;
  }, []);

  /* --------------------------------------------------
     MOUSE PARALLAX
  -------------------------------------------------- */

  useEffect(() => {
    const move = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      setMouse({
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      });
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  /* --------------------------------------------------
     INTRO
  -------------------------------------------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroComplete(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  /* --------------------------------------------------
     REACTION
  -------------------------------------------------- */

  const react = (emoji) => {
    setSelectedEmoji(emoji);

    setTimeout(() => {
      setSelectedEmoji(null);
    }, 4000);
  };

  return (
    <div className="memoryPage">
      <CustomCursor />

      {/* --------------------------------------------------
          BACKGROUND
      -------------------------------------------------- */}

      <div className="backgroundGlow glowOne" />
      <div className="backgroundGlow glowTwo" />

      {/* --------------------------------------------------
          STARS
      -------------------------------------------------- */}

      <div className="starField">
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="starDot"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              x: mouse.x * star.depth * 18,
              y: mouse.y * star.depth * 18,
              opacity: [0.25, 1, 0.35],
              scale: [0.8, 1.25, 0.8],
            }}
            transition={{
              x: {
                duration: 0.8,
                ease: "easeOut",
              },
              y: {
                duration: 0.8,
                ease: "easeOut",
              },
              opacity: {
                duration: star.duration,
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: {
                duration: star.duration,
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        ))}
      </div>

      {/* --------------------------------------------------
          ORBIT RINGS
      -------------------------------------------------- */}

      <motion.div
        className="orbit orbitOne"
        animate={{
          rotate: 360,
          x: mouse.x * -8,
          y: mouse.y * -8,
        }}
        transition={{
          rotate: {
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          },
          x: {
            duration: 1,
            ease: "easeOut",
          },
          y: {
            duration: 1,
            ease: "easeOut",
          },
        }}
      />

      <motion.div
        className="orbit orbitTwo"
        animate={{
          rotate: -360,
          x: mouse.x * -14,
          y: mouse.y * -14,
        }}
        transition={{
          rotate: {
            duration: 50,
            repeat: Infinity,
            ease: "linear",
          },
          x: {
            duration: 1,
            ease: "easeOut",
          },
          y: {
            duration: 1,
            ease: "easeOut",
          },
        }}
      />

      {/* --------------------------------------------------
          MAIN CONTENT
      -------------------------------------------------- */}

      <motion.main
        className="memoryContent"
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 35,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* HEADER */}

        <motion.div
          className="memoryTag"
          initial={{ opacity: 0, letterSpacing: "1px" }}
          animate={{
            opacity: 1,
            letterSpacing: "6px",
          }}
          transition={{
            duration: 1.2,
            delay: 0.4,
          }}
        >
          MEMORY #01
        </motion.div>

        <motion.h1
          className="memoryTitle"
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
            delay: 0.65,
          }}
        >
          Raaz Ki Talash
        </motion.h1>

        <motion.div
          className="titleLine"
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
            delay: 1,
          }}
        />

        {/* MESSAGE */}

        <motion.p
          className="memoryText"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 1.15,
          }}
        >
          This is where everything started.
          <br />
          Among clues, laughter, confusion and endless running around...
          <br />
          I found my favourite person.
          <br />
          <br />
          Tum hamesha bolti ho na maine tumhari help nahi ki aur tumko nahi
          jitaya...
          <br />
          <span className="softText">
            Toh uske liye ek gift toh banta hai na.
          </span>
          <br />
          <br />
          <span className="typewriterText">
            <Typewriter
              words={[
                "Tumhare liye mai hamesha available rahunga. You are always my first priority.",
              ]}
              loop={1}
              cursor
              cursorStyle="|"
              typeSpeed={25}
              deleteSpeed={0}
              delaySpeed={999999}
            />
          </span>
        </motion.p>

        {/* --------------------------------------------------
            CONSTELLATION
        -------------------------------------------------- */}

        <motion.section
          className="constellationSection"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: introComplete ? 1 : 0,
            y: introComplete ? 0 : 25,
          }}
          transition={{
            duration: 1,
          }}
        >
          <div className="constellationHint">
            <span>✦</span>
            <em>Some little secrets are hidden among the stars...</em>
            <span>✦</span>
          </div>

          <div className="constellation">
            {/* CONSTELLATION LINES */}

            <svg
              className="constellationLines"
              viewBox="0 0 600 300"
              preserveAspectRatio="none"
            >
              <path d="M115 125 L220 70 L380 70 L485 125" />
              <path d="M115 125 L220 225 L300 260 L380 225 L485 125" />
              <path d="M220 70 L300 150 L380 70" />
              <path d="M220 225 L300 150 L380 225" />
            </svg>

            {/* STARS */}

            {memories.map((memory, index) => {
              const positions = [
                { left: "18%", top: "34%" },
                { left: "36%", top: "18%" },
                { left: "64%", top: "18%" },
                { left: "82%", top: "34%" },
              ];

              return (
                <motion.button
                  key={memory.id}
                  className={`memoryStar star${index + 1}`}
                  style={positions[index]}
                  data-cursor="reveal"
                  initial={{
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 1.3 + index * 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.35,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onClick={() => setActiveMemory(memory)}
                >
                  <span className="starCore">✦</span>

                  <span className="starNumber">{memory.number}</span>

                  <span className="starLabel">{memory.title}</span>
                </motion.button>
              );
            })}

            {/* HEART CENTER */}

            <motion.div
              className="heartStar"
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ♡
            </motion.div>

            <div className="constellationCaption">
              every little memory became a star
            </div>
          </div>
        </motion.section>

        {/* --------------------------------------------------
            REACTIONS
        -------------------------------------------------- */}

        <motion.div
          className="reactionSection"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 1,
            delay: 2,
          }}
        >
          <span className="reactionLabel">leave a little reaction</span>

          <div className="reactionBox">
            {["❤️", "😍", "😂", "🥹"].map((emoji) => (
              <motion.button
                key={emoji}
                data-cursor="react"
                onClick={() => react(emoji)}
                whileHover={{
                  scale: 1.35,
                  y: -5,
                }}
                whileTap={{
                  scale: 0.8,
                }}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* --------------------------------------------------
            NEXT
        -------------------------------------------------- */}

        <motion.button
          className="nextBtn"
          data-cursor="next"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 2.2,
          }}
          whileHover={{
            scale: 1.04,
            y: -3,
          }}
          whileTap={{
            scale: 0.96,
          }}
          onClick={() => navigate("/floor2")}
        >
          CONTINUE THE STORY
          <span> →</span>
        </motion.button>
      </motion.main>

      {/* --------------------------------------------------
          MEMORY POPUP
      -------------------------------------------------- */}

      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="memoryOverlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setActiveMemory(null)}
          >
            <motion.div
              className="memoryReveal"
              initial={{
                opacity: 0,
                scale: 0.75,
                y: 40,
                rotateX: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotateX: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.85,
                y: 20,
              }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="revealNumber">{activeMemory.number} / 04</div>

              <div className="revealStar">✦</div>

              <h2>{activeMemory.title}</h2>

              <div className="revealLine" />

              <p className="revealQuote">"{activeMemory.quote}"</p>

              <p className="revealText">{activeMemory.text}</p>

              <button
                className="closeReveal"
                data-cursor="close"
                onClick={() => setActiveMemory(null)}
              >
                CLOSE MEMORY
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------
          EMOJI RAIN
      -------------------------------------------------- */}

      <AnimatePresence>
        {selectedEmoji &&
          [...Array(55)].map((_, i) => (
            <motion.span
              key={i}
              className="emojiRain"
              initial={{
                y: -80,
                opacity: 0,
              }}
              animate={{
                y: "120vh",
                opacity: [0, 1, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 1.2,
                ease: "linear",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${18 + Math.random() * 25}px`,
              }}
            >
              {selectedEmoji}
            </motion.span>
          ))}
      </AnimatePresence>

      <style>{`

        /* ==================================================
           PAGE
        ================================================== */

        .memoryPage,
        .memoryPage * {
          cursor:none;
        }

        .memoryPage{
          min-height:100vh;

          background:
            linear-gradient(
              rgba(0,0,0,.38),
              rgba(0,0,0,.70)
            ),
            url("/images/raaz.jpg");

          background-size:cover;
          background-position:center;
          background-repeat:no-repeat;

          overflow-x:hidden;
          overflow-y:auto;

          display:flex;
          justify-content:center;
          align-items:flex-start;

          position:relative;

          font-family:'Manrope', sans-serif;

          color:white;

          padding:80px 20px 70px;
        }


        /* ==================================================
           ATMOSPHERE
        ================================================== */

        .backgroundGlow{
          position:fixed;

          width:500px;
          height:500px;

          border-radius:50%;

          pointer-events:none;

          filter:blur(100px);

          z-index:0;
        }

        .glowOne{
          left:-150px;
          top:15%;

          background:rgba(255,100,90,.10);
        }

        .glowTwo{
          right:-150px;
          bottom:10%;

          background:rgba(150,100,255,.10);
        }


        /* ==================================================
           STARS
        ================================================== */

        .starField{
          position:fixed;

          inset:0;

          z-index:1;

          pointer-events:none;
        }

        .starDot{
          position:absolute;

          border-radius:50%;

          background:#ffe9df;

          box-shadow:
            0 0 5px rgba(255,220,205,.8),
            0 0 14px rgba(255,140,120,.4);
        }


        /* ==================================================
           ORBITS
        ================================================== */

        .orbit{
          position:fixed;

          left:50%;
          top:50%;

          border-radius:50%;

          pointer-events:none;

          z-index:1;

          transform-style:preserve-3d;
        }

        .orbitOne{
          width:700px;
          height:330px;

          margin-left:-350px;
          margin-top:-165px;

          border:
            1px solid
            rgba(255,190,170,.13);

          transform:
            rotateX(62deg)
            rotateZ(-12deg);
        }

        .orbitTwo{
          width:900px;
          height:430px;

          margin-left:-450px;
          margin-top:-215px;

          border:
            1px solid
            rgba(220,180,255,.09);

          transform:
            rotateX(68deg)
            rotateZ(20deg);
        }


        /* ==================================================
           CONTENT
        ================================================== */

        .memoryContent{
          width:850px;

          max-width:94vw;

          padding:55px 55px 50px;

          border-radius:34px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.09),
              rgba(255,255,255,.025)
            );

          border:
            1px solid
            rgba(255,255,255,.14);

          backdrop-filter:
            blur(20px)
            saturate(120%);

          -webkit-backdrop-filter:
            blur(20px)
            saturate(120%);

          box-shadow:
            0 40px 120px rgba(0,0,0,.55),
            inset 0 1px 0 rgba(255,255,255,.14);

          position:relative;

          z-index:5;

          text-align:center;
        }


        /* ==================================================
           HEADER
        ================================================== */

        .memoryTag{
          color:#ffb5a6;

          font-size:.75rem;

          font-weight:600;

          text-transform:uppercase;

          text-shadow:
            0 0 15px
            rgba(255,100,90,.5);
        }

        .memoryTitle{
          font-family:
            'Cormorant Garamond',
            serif;

          font-weight:600;

          color:#fff;

          font-size:4rem;

          line-height:1;

          letter-spacing:2px;

          margin:12px 0 18px;

          text-shadow:
            0 0 20px rgba(255,255,255,.35),
            0 0 45px rgba(255,120,100,.25);
        }

        .titleLine{
          height:1px;

          display:block;

          margin:0 auto;

          background:
            linear-gradient(
              90deg,
              transparent,
              #ffb19e,
              transparent
            );
        }


        /* ==================================================
           MESSAGE
        ================================================== */

        .memoryText{
          margin-top:28px;

          color:
            rgba(255,245,242,.86);

          font-size:1rem;

          line-height:1.9;

          font-weight:400;

          letter-spacing:.2px;
        }

        .softText{
          color:#ffd5cb;
        }

        .typewriterText{
          color:#ffc4b8;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size:1.15rem;

          font-style:italic;
        }


        /* ==================================================
           CONSTELLATION
        ================================================== */

        .constellationSection{
          margin-top:45px;

          padding-top:32px;

          border-top:
            1px solid
            rgba(255,255,255,.10);
        }

        .constellationHint{
          display:flex;

          justify-content:center;

          align-items:center;

          gap:12px;

          color:#dcbdb6;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size:1.05rem;

          margin-bottom:15px;
        }

        .constellationHint span{
          color:#ffb19d;

          text-shadow:
            0 0 15px
            rgba(255,100,80,.8);
        }

        .constellation{
          width:100%;

          max-width:650px;

          height:330px;

          margin:0 auto;

          position:relative;
        }

        .constellationLines{
          position:absolute;

          inset:0;

          width:100%;

          height:100%;

          overflow:visible;

          opacity:.45;
        }

        .constellationLines path{
          fill:none;

          stroke:
            rgba(255,190,175,.35);

          stroke-width:1;

          stroke-dasharray:4 8;

          animation:
            constellationFlow
            8s linear infinite;
        }

        @keyframes constellationFlow{
          to{
            stroke-dashoffset:-100;
          }
        }


        /* ==================================================
           MEMORY STARS
        ================================================== */

        .memoryStar{
          position:absolute;

          transform:translate(-50%,-50%);

          width:62px;
          height:62px;

          border:none;

          background:
            radial-gradient(
              circle,
              rgba(255,160,140,.28),
              rgba(255,100,80,.05) 55%,
              transparent 70%
            );

          border-radius:50%;

          display:flex;

          align-items:center;

          justify-content:center;

          transition:
            filter .4s ease;

          z-index:3;
        }

        .memoryStar:hover{
          filter:
            drop-shadow(
              0 0 15px
              rgba(255,150,130,.9)
            );
        }

        .starCore{
          font-size:2rem;

          color:#ffe8df;

          text-shadow:
            0 0 7px white,
            0 0 18px #ff947d,
            0 0 40px rgba(255,100,80,.8);

          animation:
            starPulse
            2.5s ease-in-out infinite;
        }

        @keyframes starPulse{
          50%{
            filter:brightness(1.5);
          }
        }

        .starNumber{
          position:absolute;

          top:-2px;
          right:-5px;

          font-size:.55rem;

          color:#ffc8bd;

          opacity:.7;

          font-family:
            'Manrope',
            sans-serif;
        }

        .starLabel{
          position:absolute;

          top:62px;

          left:50%;

          transform:
            translateX(-50%);

          white-space:nowrap;

          font-size:.62rem;

          letter-spacing:1.5px;

          text-transform:uppercase;

          color:
            rgba(255,225,218,.58);

          transition:.3s;
        }

        .memoryStar:hover .starLabel{
          color:#ffe5dd;

          text-shadow:
            0 0 10px
            rgba(255,120,100,.7);
        }


        /* ==================================================
           HEART
        ================================================== */

        .heartStar{
          position:absolute;

          left:50%;
          top:53%;

          transform:
            translate(-50%,-50%);

          font-family:
            'Cormorant Garamond',
            serif;

          font-size:4.5rem;

          color:
            rgba(255,175,160,.75);

          text-shadow:
            0 0 15px
            rgba(255,110,90,.7),
            0 0 45px
            rgba(255,80,70,.35);

          z-index:2;
        }

        .constellationCaption{
          position:absolute;

          bottom:5px;

          left:50%;

          transform:
            translateX(-50%);

          color:
            rgba(255,220,212,.4);

          font-family:
            'Cormorant Garamond',
            serif;

          font-style:italic;

          font-size:.9rem;

          white-space:nowrap;

          letter-spacing:1px;
        }


        /* ==================================================
           REACTIONS
        ================================================== */

        .reactionSection{
          margin-top:15px;
        }

        .reactionLabel{
          display:block;

          color:
            rgba(255,255,255,.4);

          font-size:.7rem;

          letter-spacing:2px;

          text-transform:uppercase;
        }

        .reactionBox{
          display:flex;

          justify-content:center;

          gap:18px;

          margin-top:10px;
        }

        .reactionBox button{
          border:none;

          background:none;

          font-size:1.8rem;

          transition:
            filter .3s ease;
        }

        .reactionBox button:hover{
          filter:
            drop-shadow(
              0 0 10px
              rgba(255,150,130,.8)
            );
        }


        /* ==================================================
           NEXT BUTTON
        ================================================== */

        .nextBtn{
          margin-top:28px;

          padding:16px 35px;

          border:
            1px solid
            rgba(255,190,175,.3);

          border-radius:999px;

          background:
            linear-gradient(
              135deg,
              rgba(255,120,100,.22),
              rgba(150,70,100,.16)
            );

          color:white;

          font-size:.78rem;

          font-weight:600;

          letter-spacing:3px;

          box-shadow:
            0 10px 35px
            rgba(0,0,0,.3),
            inset 0 1px 0
            rgba(255,255,255,.18);

          backdrop-filter:blur(12px);

          transition:.4s;
        }

        .nextBtn:hover{
          border-color:
            rgba(255,190,175,.6);

          box-shadow:
            0 0 30px
            rgba(255,100,80,.3),
            0 10px 40px
            rgba(0,0,0,.4);
        }

        .nextBtn span{
          font-size:1.1rem;

          margin-left:8px;
        }


        /* ==================================================
           MEMORY OVERLAY
        ================================================== */

        .memoryOverlay{
          position:fixed;

          inset:0;

          z-index:100;

          display:flex;

          align-items:center;

          justify-content:center;

          padding:20px;

          background:
            rgba(0,0,0,.68);

          backdrop-filter:
            blur(12px);
        }

        .memoryReveal{
          width:500px;

          max-width:92vw;

          padding:45px 40px;

          border-radius:30px;

          text-align:center;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.13),
              rgba(255,255,255,.035)
            );

          border:
            1px solid
            rgba(255,210,195,.22);

          box-shadow:
            0 50px 120px
            rgba(0,0,0,.65),
            0 0 70px
            rgba(255,100,80,.12);

          backdrop-filter:
            blur(25px);

          transform-style:preserve-3d;
        }

        .revealNumber{
          font-size:.65rem;

          letter-spacing:4px;

          color:#ffab99;
        }

        .revealStar{
          margin-top:15px;

          font-size:2.5rem;

          color:#ffe3db;

          text-shadow:
            0 0 15px
            rgba(255,120,100,.8);
        }

        .memoryReveal h2{
          margin:8px 0 18px;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size:2.7rem;

          font-weight:600;

          color:white;
        }

        .revealLine{
          width:60px;

          height:1px;

          margin:0 auto 22px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #ff9d88,
              transparent
            );
        }

        .revealQuote{
          color:#ffe0d8;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size:1.3rem;

          font-style:italic;

          line-height:1.5;
        }

        .revealText{
          margin-top:15px;

          color:
            rgba(255,240,235,.65);

          line-height:1.7;

          font-size:.9rem;
        }

        .closeReveal{
          margin-top:28px;

          padding:11px 22px;

          border:
            1px solid
            rgba(255,190,175,.25);

          border-radius:999px;

          background:
            rgba(255,255,255,.05);

          color:
            rgba(255,235,230,.75);

          font-size:.65rem;

          letter-spacing:2px;

          transition:.3s;
        }

        .closeReveal:hover{
          background:
            rgba(255,120,100,.12);

          border-color:
            rgba(255,190,175,.5);
        }


        /* ==================================================
           EMOJI
        ================================================== */

        .emojiRain{
          position:fixed;

          top:-60px;

          z-index:200;

          pointer-events:none;
        }


        /* ==================================================
           MOBILE
        ================================================== */

        @media(max-width:768px){

          .memoryPage{
            padding:
              55px 12px
              50px;
          }

          .memoryContent{
            padding:
              38px 20px 35px;

            border-radius:26px;
          }

          .memoryTitle{
            font-size:2.7rem;

            letter-spacing:1px;
          }

          .memoryText{
            font-size:.92rem;

            line-height:1.8;
          }

          .typewriterText{
            font-size:1rem;
          }

          .constellation{
            height:270px;
          }

          .constellationHint{
            font-size:.9rem;

            gap:7px;
          }

          .constellationHint span{
            display:none;
          }

          .memoryStar{
            width:48px;
            height:48px;
          }

          .starCore{
            font-size:1.55rem;
          }

          .starLabel{
            font-size:.5rem;

            top:50px;

            letter-spacing:1px;
          }

          .heartStar{
            font-size:3.3rem;
          }

          .constellationCaption{
            font-size:.72rem;

            bottom:0;
          }

          .orbitOne{
            width:500px;
            height:240px;

            margin-left:-250px;
            margin-top:-120px;
          }

          .orbitTwo{
            width:650px;
            height:300px;

            margin-left:-325px;
            margin-top:-150px;
          }

          .reactionBox{
            gap:13px;
          }

          .nextBtn{
            padding:
              15px 24px;

            font-size:.68rem;
          }

          .memoryReveal{
            padding:
              35px 25px;
          }

          .memoryReveal h2{
            font-size:2.2rem;
          }

          .revealQuote{
            font-size:1.1rem;
          }
        }


        /* ==================================================
           REDUCED MOTION
        ================================================== */

        @media(prefers-reduced-motion:reduce){

          .orbit,
          .starCore,
          .constellationLines path{
            animation:none !important;
          }
        }

      `}</style>
    </div>
  );
}
 