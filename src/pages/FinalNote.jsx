import { useEffect, useMemo, useState } from "react";
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
                ? "I am always there for U. ❤️"
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

  const [leftGift, setLeftGift] = useState(false);
  const [rightGift, setRightGift] = useState(false);

  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(getNextBirthday()),
  );

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

      <div className="moon">
        <div className="moonGlow"></div>
        <div className="moonSurface"></div>
      </div>

      <Stars />
      <FloatingHearts />

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
        className="letter"
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
        <div className="letterGlow"></div>

        <div className="letterTopLine">
          <span></span>
          <i>♡</i>
          <span></span>
        </div>

        <div className="letterContent">
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

          <div className="goldDivider">
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

          background:
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
              rgba(255,80,180,.22),
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


        /* =====================================================
           MAIN LETTER
        ===================================================== */

        .letter{
          width:min(560px, 42vw);
          min-width:480px;

          max-height:86vh;

          position:relative;
          z-index:10;

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

          transform-style:preserve-3d;

          overflow:hidden;
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

          transform:translateZ(35px);
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

          .letter{
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

          .letter{
            width:calc(100vw - 50px);
            min-width:0;
            max-width:550px;
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

          .moon{
            width:90px;
            height:90px;
            opacity:.45;
            top:60px;
          }

          .letter{
            width:calc(100vw - 30px);
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
