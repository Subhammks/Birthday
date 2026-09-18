import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { motion, AnimatePresence } from "framer-motion";

export default function Floor2() {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [callActive, setCallActive] = useState(true);

  const navigate = useNavigate();

  const cardRef = useRef(null);

  // --------------------------------------------------
  // 3D CARD TILT
  // --------------------------------------------------

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    cardRef.current.style.transform = `
      perspective(1400px)
      rotateX(${-y * 5}deg)
      rotateY(${x * 5}deg)
      translateZ(0)
    `;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    cardRef.current.style.transform = `
      perspective(1400px)
      rotateX(0deg)
      rotateY(0deg)
    `;
  };

  // --------------------------------------------------
  // REACTION
  // --------------------------------------------------

  const react = (emoji) => {
    setSelectedEmoji(emoji);

    setTimeout(() => {
      setSelectedEmoji(null);
    }, 3500);
  };

  return (
    <div className="floor2Page">
      {/* BACKGROUND */}
      <div className="backgroundOverlay" />

      {/* ------------------------------------------------
          CINEMATIC PARTICLES
      ------------------------------------------------ */}

      <div className="particleField">
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 8}s`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      {/* ------------------------------------------------
          AMBIENT HEARTS
      ------------------------------------------------ */}

      <div className="ambientHearts">
        <span>♡</span>
        <span>♡</span>
        <span>✦</span>
        <span>♡</span>
        <span>✦</span>
      </div>

      {/* ------------------------------------------------
          MAIN SCENE
      ------------------------------------------------ */}

      <main className="callScene">
        {/* SMALL MEMORY LABEL */}

        <motion.div
          className="sceneLabel"
          initial={{ opacity: 0, letterSpacing: "12px" }}
          animate={{ opacity: 1, letterSpacing: "6px" }}
          transition={{ duration: 1.5 }}
        >
          MEMORY #02
        </motion.div>

        {/* ------------------------------------------------
            PHONE CALL UI
        ------------------------------------------------ */}

        <motion.div
          className="callContainer"
          initial={{
            opacity: 0,
            scale: 0.65,
            y: 50,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 1.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* CALL GLOW */}

          <div className="callGlow" />

          {/* RINGS */}

          <motion.div
            className="callRing ring1"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.3, 0.05, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <motion.div
            className="callRing ring2"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.25, 0.02, 0.25],
            }}
            transition={{
              duration: 3,
              delay: 0.5,
              repeat: Infinity,
            }}
          />

          {/* AVATAR */}

          <motion.div
            className="callAvatar"
            animate={{
              boxShadow: [
                "0 0 20px rgba(255,179,198,.25)",
                "0 0 55px rgba(255,179,198,.55)",
                "0 0 20px rgba(255,179,198,.25)",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
          >
            <div className="avatarInner">:)</div>
          </motion.div>

          {/* CALL TEXT */}

          <motion.div
            className="callingText"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {callActive ? "Connected" : "Call ended"}
          </motion.div>

          <h1 className="callName">You</h1>

          {/* DURATION */}

          <motion.div
            className="callDuration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            09 : 08 : 05
          </motion.div>

          <div className="durationCaption">our first call</div>

          {/* SOUND WAVES */}

          <div className="soundWave">
            {[...Array(17)].map((_, i) => (
              <motion.span
                key={i}
                animate={{
                  height: [
                    5 + Math.random() * 10,
                    12 + Math.random() * 22,
                    5 + Math.random() * 10,
                  ],
                }}
                transition={{
                  duration: 0.7 + Math.random() * 0.7,
                  repeat: Infinity,
                  delay: i * 0.04,
                }}
              />
            ))}
          </div>

          {/* CALL CONTROLS */}

          <div className="callControls">
            <button
              className="callControl"
              onClick={() => setCallActive(!callActive)}
            >
              {callActive ? "◼" : "▶"}
            </button>

            <button className="callControl heartControl">♡</button>

            <button className="callControl">⌁</button>
          </div>
        </motion.div>

        {/* ------------------------------------------------
            STORY CARD
        ------------------------------------------------ */}

        <motion.div
          ref={cardRef}
          className="storyCard"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{
            opacity: 0,
            y: 60,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="storyTop">
            <span>THAT NIGHT</span>

            <span className="tinyHeart">♡</span>

            <span>01:?? AM</span>
          </div>

          <h2 className="storyTitle">
            That Night <i>Conversation</i>
          </h2>

          <div className="storyLine" />

          <p className="storyText">
            <Typewriter
              words={[
                "I don't know kya bolu mai usko Ek random coincidence ya already planned destiny. But jo bhi hua achha hua shayd agar us raat baat nai huie hoti to shayd ajj bhi baat nai hoti aur aisa kuch nai ho raha hota. Wo puri raat ki long conversation that was literally mai explain nai ker sakta. Ek Random conversation jo ab favourite part of my day ban gaya hai. And before I realised it... you became special.",
              ]}
              loop={1}
              cursor
              cursorStyle="|"
              typeSpeed={18}
              deleteSpeed={0}
              delaySpeed={999999}
            />
          </p>

          <div className="messageBubble">
            <span className="onlineDot" />
            <span>Some conversations change everything...</span>
          </div>
        </motion.div>

        {/* ------------------------------------------------
            REACTIONS
        ------------------------------------------------ */}

        <motion.div
          className="reactionArea"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 2,
            duration: 0.8,
          }}
        >
          <span className="reactionHint">You can react to this memory ♡</span>

          <div className="reactionBox">
            {["❤️", "😍", "😂", "🥹"].map((emoji) => (
              <motion.button
                key={emoji}
                whileHover={{
                  scale: 1.3,
                  y: -6,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                onClick={() => react(emoji)}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ------------------------------------------------
            NEXT BUTTON
        ------------------------------------------------ */}

        <motion.button
          className="nextBtn"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 2.3,
          }}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.96,
          }}
          onClick={() => navigate("/floor3")}
        >
          <span>CONTINUE THE STORY</span>
          <span className="arrow">→</span>
        </motion.button>
      </main>

      {/* ------------------------------------------------
          EMOJI RAIN
      ------------------------------------------------ */}

      <AnimatePresence>
        {selectedEmoji &&
          [...Array(70)].map((_, i) => (
            <motion.span
              key={i}
              className="emojiRain"
              initial={{
                y: -80,
                opacity: 0,
              }}
              animate={{
                y: "110vh",
                opacity: [0, 1, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 0.7,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${18 + Math.random() * 30}px`,
              }}
            >
              {selectedEmoji}
            </motion.span>
          ))}
      </AnimatePresence>

      {/* ------------------------------------------------
          STYLES
      ------------------------------------------------ */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        .floor2Page {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;

          display: flex;
          justify-content: center;

          background:
            url("/images/floor2.png");

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          font-family: "Manrope", sans-serif;

          color: white;
        }

        /* ------------------------------------------------
           BACKGROUND
        ------------------------------------------------ */

        .backgroundOverlay {
          position: fixed;
          inset: 0;

          background:
            radial-gradient(
              circle at 50% 30%,
              rgba(255, 179, 198, 0.12),
              transparent 40%
            ),

            linear-gradient(
              rgba(8, 4, 18, 0.35),
              rgba(8, 4, 18, 0.78)
            );

          pointer-events: none;
          z-index: 0;
        }

        /* ------------------------------------------------
           PARTICLES
        ------------------------------------------------ */

        .particleField {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;

          border-radius: 50%;

          background: #ffdce7;

          box-shadow:
            0 0 8px rgba(255, 210, 225, 0.8);

          animation: particleFloat linear infinite;

          opacity: 0;
        }

        @keyframes particleFloat {

          0% {
            transform:
              translateY(20px)
              scale(.5);

            opacity: 0;
          }

          20% {
            opacity: .8;
          }

          80% {
            opacity: .5;
          }

          100% {
            transform:
              translateY(-120px)
              scale(1.2);

            opacity: 0;
          }
        }

        /* ------------------------------------------------
           HEARTS
        ------------------------------------------------ */

        .ambientHearts {
          position: fixed;
          inset: 0;

          pointer-events: none;

          z-index: 2;
        }

        .ambientHearts span {
          position: absolute;

          color: rgba(255, 190, 210, .25);

          font-family:
            "Cormorant Garamond",
            serif;

          font-size: 2rem;

          animation:
            floatingHeart
            8s ease-in-out
            infinite;
        }

        .ambientHearts span:nth-child(1) {
          left: 10%;
          top: 25%;
        }

        .ambientHearts span:nth-child(2) {
          right: 12%;
          top: 20%;
          animation-delay: 2s;
        }

        .ambientHearts span:nth-child(3) {
          left: 18%;
          bottom: 20%;
          animation-delay: 1s;
        }

        .ambientHearts span:nth-child(4) {
          right: 18%;
          bottom: 25%;
          animation-delay: 3s;
        }

        .ambientHearts span:nth-child(5) {
          left: 50%;
          top: 10%;
          animation-delay: 4s;
        }

        @keyframes floatingHeart {

          0%,100% {
            transform:
              translateY(0)
              rotate(0deg);

            opacity: .15;
          }

          50% {
            transform:
              translateY(-25px)
              rotate(10deg);

            opacity: .45;
          }
        }

        /* ------------------------------------------------
           MAIN SCENE
        ------------------------------------------------ */

        .callScene {
          width: 100%;

          min-height: 100vh;

          padding:
            60px
            20px
            80px;

          display: flex;

          flex-direction: column;

          align-items: center;

          position: relative;

          z-index: 10;
        }

        /* ------------------------------------------------
           LABEL
        ------------------------------------------------ */

        .sceneLabel {
          color: #ffb3c6;

          font-size: .75rem;

          font-weight: 700;

          letter-spacing: 6px;

          margin-bottom: 20px;

          text-shadow:
            0 0 15px
            rgba(255, 150, 180, .5);
        }

        /* ------------------------------------------------
           CALL CONTAINER
        ------------------------------------------------ */

        .callContainer {
          width: 360px;
          height: 430px;

          position: relative;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          border-radius: 40px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.12),
              rgba(255,255,255,.025)
            );

          border:
            1px solid
            rgba(255,210,225,.2);

          backdrop-filter:
            blur(22px);

          -webkit-backdrop-filter:
            blur(22px);

          box-shadow:
            0 40px 100px
            rgba(0,0,0,.5),

            0 0 80px
            rgba(255,140,180,.12),

            inset 0 1px
            rgba(255,255,255,.15);

          overflow: visible;
        }

        .callGlow {
          position: absolute;

          width: 240px;
          height: 240px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(255,150,190,.25),
              transparent 70%
            );

          filter: blur(30px);

          pointer-events: none;
        }

        /* ------------------------------------------------
           CALL RINGS
        ------------------------------------------------ */

        .callRing {
          position: absolute;

          width: 170px;
          height: 170px;

          border-radius: 50%;

          border:
            1px solid
            rgba(255,179,198,.25);

          pointer-events: none;
        }

        .ring1 {
          width: 170px;
          height: 170px;
        }

        .ring2 {
          width: 210px;
          height: 210px;
        }

        /* ------------------------------------------------
           AVATAR
        ------------------------------------------------ */

        .callAvatar {
          width: 105px;
          height: 105px;

          border-radius: 50%;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at 30% 25%,
              #ffdce7,
              #ff9db8 45%,
              #8d4260 100%
            );

          border:
            2px solid
            rgba(255,255,255,.35);

          position: relative;

          z-index: 2;
        }

        .avatarInner {
          font-family:
            "Cormorant Garamond",
            serif;

          font-size: 4rem;

          color: white;

          text-shadow:
            0 0 20px
            rgba(255,255,255,.8);
        }

        /* ------------------------------------------------
           CALL TEXT
        ------------------------------------------------ */

        .callingText {
          margin-top: 22px;

          color: #ffcad7;

          font-size: .8rem;

          letter-spacing: 4px;

          text-transform: uppercase;
        }

        .callName {
          margin: 8px 0 0;

          font-family:
            "Cormorant Garamond",
            serif;

          font-size: 2.2rem;

          font-weight: 500;

          letter-spacing: 1px;
        }

        .callDuration {
          margin-top: 8px;

          font-family:
            "Manrope",
            sans-serif;

          font-size: 1rem;

          letter-spacing: 5px;

          color: rgba(255,255,255,.9);
        }

        .durationCaption {
          margin-top: 5px;

          font-size: .7rem;

          letter-spacing: 3px;

          text-transform: uppercase;

          color: rgba(255,210,220,.55);
        }

        /* ------------------------------------------------
           SOUND WAVE
        ------------------------------------------------ */

        .soundWave {
          height: 35px;

          margin-top: 20px;

          display: flex;

          align-items: center;

          gap: 3px;
        }

        .soundWave span {
          width: 3px;

          min-height: 4px;

          border-radius: 10px;

          background:
            linear-gradient(
              #ffd2df,
              #ff8eae
            );

          box-shadow:
            0 0 7px
            rgba(255,150,180,.5);
        }

        /* ------------------------------------------------
           CONTROLS
        ------------------------------------------------ */

        .callControls {
          display: flex;

          gap: 15px;

          margin-top: 22px;
        }

        .callControl {
          width: 40px;
          height: 40px;

          border-radius: 50%;

          background:
            rgba(255,255,255,.07);

          border:
            1px solid
            rgba(255,255,255,.15);

          color: white;

          font-size: .85rem;

          cursor: pointer;

          transition: .3s;
        }

        .callControl:hover {
          transform: scale(1.15);

          background:
            rgba(255,179,198,.18);

          box-shadow:
            0 0 20px
            rgba(255,150,180,.25);
        }

        .heartControl {
          color: #ffb3c6;

          font-size: 1.2rem;
        }

        /* ------------------------------------------------
           STORY CARD
        ------------------------------------------------ */

        .storyCard {
          width: 760px;

          max-width: 92vw;

          margin-top: 40px;

          padding:
            38px
            45px;

          border-radius: 28px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.09),
              rgba(255,255,255,.025)
            );

          border:
            1px solid
            rgba(255,215,225,.17);

          backdrop-filter:
            blur(20px);

          -webkit-backdrop-filter:
            blur(20px);

          box-shadow:
            0 35px 80px
            rgba(0,0,0,.45),

            inset 0 1px
            rgba(255,255,255,.12);

          text-align: center;

          transition:
            transform .45s
            cubic-bezier(.22,1,.36,1);
        }

        .storyTop {
          display: flex;

          justify-content: space-between;

          color:
            rgba(255,205,218,.55);

          font-size: .65rem;

          letter-spacing: 3px;

          text-transform: uppercase;
        }

        .tinyHeart {
          color: #ff9fb9;

          font-size: 1rem;
        }

        .storyTitle {
          margin:
            18px
            0
            15px;

          font-family:
            "Cormorant Garamond",
            serif;

          font-size: 3rem;

          font-weight: 500;

          letter-spacing: .5px;
        }

        .storyTitle i {
          color: #ffb4c8;

          font-style: italic;

          text-shadow:
            0 0 20px
            rgba(255,150,180,.3);
        }

        .storyLine {
          width: 70px;

          height: 1px;

          margin: 0 auto 24px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #ffb3c6,
              transparent
            );
        }

        .storyText {
          max-width: 650px;

          margin: auto;

          color:
            rgba(255,255,255,.86);

          font-size: 1rem;

          line-height: 2;

          font-weight: 400;
        }

        .messageBubble {
          margin-top: 25px;

          display: inline-flex;

          align-items: center;

          gap: 9px;

          padding:
            10px
            18px;

          border-radius: 999px;

          background:
            rgba(126,200,255,.08);

          border:
            1px solid
            rgba(126,200,255,.18);

          color:
            rgba(220,235,255,.8);

          font-size: .75rem;

          letter-spacing: 1px;
        }

        .onlineDot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #7ec8ff;

          box-shadow:
            0 0 10px
            #7ec8ff;
        }

        /* ------------------------------------------------
           REACTIONS
        ------------------------------------------------ */

        .reactionArea {
          display: flex;

          flex-direction: column;

          align-items: center;

          margin-top: 30px;
        }

        .reactionHint {
          font-size: .7rem;

          color:
            rgba(255,220,230,.45);

          letter-spacing: 2px;
        }

        .reactionBox {
          display: flex;

          gap: 18px;

          margin-top: 12px;
        }

        .reactionBox button {
          width: 48px;
          height: 48px;

          border-radius: 50%;

          border:
            1px solid
            rgba(255,255,255,.08);

          background:
            rgba(255,255,255,.05);

          font-size: 1.3rem;

          cursor: pointer;

          transition: .3s;
        }

        .reactionBox button:hover {
          background:
            rgba(255,179,198,.15);
        }

        /* ------------------------------------------------
           NEXT BUTTON
        ------------------------------------------------ */

        .nextBtn {
          margin-top: 35px;

          padding:
            15px
            35px;

          border-radius: 999px;

          border:
            1px solid
            rgba(255,220,230,.25);

          background:
            linear-gradient(
              135deg,
              rgba(255,179,198,.9),
              rgba(126,200,255,.85)
            );

          color: #100914;

          font-weight: 700;

          letter-spacing: 2px;

          font-size: .75rem;

          cursor: pointer;

          box-shadow:
            0 0 30px
            rgba(255,170,195,.25);

          display: flex;

          align-items: center;

          gap: 15px;
        }

        .arrow {
          font-size: 1.1rem;
        }

        /* ------------------------------------------------
           EMOJI
        ------------------------------------------------ */

        .emojiRain {
          position: fixed;

          top: -50px;

          z-index: 100;

          pointer-events: none;
        }

        /* ------------------------------------------------
           MOBILE
        ------------------------------------------------ */

        @media(max-width:768px) {

          .callScene {
            padding:
              40px
              15px
              60px;
          }

          .callContainer {
            width: 310px;
            height: 390px;
          }

          .storyCard {
            padding:
              28px
              22px;
          }

          .storyTitle {
            font-size: 2.3rem;
          }

          .storyText {
            font-size: .92rem;

            line-height: 1.85;
          }

          .storyTop {
            font-size: .55rem;
          }

          .nextBtn {
            width: 90%;

            justify-content: center;
          }
        }

        @media(max-width:400px) {

          .callContainer {
            width: 285px;
          }

          .callDuration {
            font-size: .85rem;
          }

          .storyTitle {
            font-size: 2rem;
          }
        }

        @media(prefers-reduced-motion:reduce) {

          .particle,
          .ambientHearts {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
