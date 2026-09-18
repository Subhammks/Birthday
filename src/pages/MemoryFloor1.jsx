import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const quotes = [
  "Every little moment became a star.",
  "Some memories never stop shining.",
  "You turned ordinary moments into beautiful ones.",
  "Maybe some people are written in the stars.",
  "Every memory found its place in our universe.",
];
 
const stars = [
  [12, 18],
  [19, 32],
  [28, 14],
  [36, 27],
  [44, 12],
  [52, 23],
  [61, 14],
  [70, 28],
  [78, 17],
  [88, 30],
  [9, 55],
  [18, 68],
  [29, 51],
  [39, 65],
  [49, 54],
  [59, 68],
  [69, 51],
  [80, 64],
  [91, 55],
  [14, 82],
  [27, 90],
  [42, 78],
  [57, 91],
  [73, 82],
  [87, 91],
];

const constellation = [
  [38, 58],
  [43, 52],
  [49, 55],
  [55, 52],
  [60, 58],
  [57, 66],
  [49, 76],
  [41, 66],
  [38, 58],
];

export default function MemoryFloor1() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activeStar, setActiveStar] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="memoryUniverse">
      {/* BACKGROUND GLOW */}
      <div className="nebula nebulaOne" />
      <div className="nebula nebulaTwo" />
      <div className="nebula nebulaThree" />

      {/* STARS */}
      <div className="starField">
        {stars.map(([x, y], i) => (
          <motion.span
            key={i}
            className="star"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
            animate={{
              opacity: [0.25, 1, 0.25],
              scale: [0.7, 1.4, 0.7],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.08,
            }}
          />
        ))}
      </div>

      {/* CONSTELLATION */}
      <svg className="constellation" viewBox="0 0 100 100">
        <motion.polyline
          points={constellation.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke="rgba(255,145,210,.45)"
          strokeWidth=".12"
          strokeDasharray="1 1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 3,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* CONSTELLATION STARS */}
      {constellation.slice(0, -1).map(([x, y], i) => (
        <motion.div
          key={i}
          className="constellationStar"
          style={{
            left: `${x}%`,
            top: `${y}%`,
          }}
          whileHover={{
            scale: 2.2,
            boxShadow: "0 0 12px #fff, 0 0 30px #ff79bd, 0 0 60px #ff79bd",
          }}
          onMouseEnter={() => setActiveStar(i)}
          onMouseLeave={() => setActiveStar(null)}
        >
          {activeStar === i && (
            <motion.div
              className="starMessage"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {
                [
                  "That day...",
                  "That laugh...",
                  "That moment...",
                  "That smile...",
                  "That feeling...",
                  "That memory...",
                  "That little world...",
                  "That was you.",
                ][i]
              }
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* TOP BRAND */}
      <div className="brand">
        <span>♡</span>
        HAPPINESS
      </div>

      <div className="chapter">CHAPTER 02 / 06</div>

      {/* MAIN CONTENT */}
      <main className="memoryContent">
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, letterSpacing: "3px" }}
          animate={{ opacity: 1, letterSpacing: "7px" }}
          transition={{ duration: 1.5 }}
        >
          A LITTLE CONSTELLATION
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4 }}
        >
          Every memory
          <br />
          <span>became a star.</span>
        </motion.h1>

        <motion.p
          className="subtext"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          And somehow, they all led back to you.
        </motion.p>

        {/* QUOTE */}
        <div className="quoteBox">
          <span className="quoteMark">“</span>

          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              className="quote"
              initial={{
                opacity: 0,
                y: 10,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -10,
                filter: "blur(8px)",
              }}
              transition={{ duration: 0.45 }}
            >
              {quotes[quoteIndex]}
            </motion.div>
          </AnimatePresence>

          <span className="quoteMark bottom">”</span>
        </div>

        {/* HEART */}
        <motion.div
          className="heart"
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          ♡
        </motion.div>

        <div className="instruction">HOVER OVER THE STARS</div>
      </main>

      {/* ENTER BUTTON */}
      <Link to="/memory" className="nextLink">
        <motion.button
          className="enterButton"
          whileHover={{
            scale: 1.06,
            boxShadow: "0 0 25px rgba(255,105,180,.3)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span>ENTER THE MEMORY</span>
          <b>→</b>
        </motion.button>
      </Link>

      {/* FOOTER */}
      <div className="footerLeft">
        02 / 06
        <span className="activeDot" />
        <span />
        <span />
        <span />
        <span />
        <em>THE CONSTELLATION</em>
      </div>

      <div className="footerCenter">
        EVERY LITTLE MOMENT
        <br />
        FOUND ITS PLACE IN THE SKY.
      </div>

      <div className="footerRight">OUR LITTLE UNIVERSE</div>

      <style>{`

        *{
          box-sizing:border-box;
        }

        .memoryUniverse{
          position:relative;
          width:100%;
          height:100vh;
          min-height:650px;
          overflow:hidden;

          background:
            radial-gradient(
              circle at 50% 48%,
              rgba(65,35,90,.42),
              transparent 32%
            ),
            radial-gradient(
              circle at 82% 25%,
              rgba(120,35,95,.18),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #03030b 0%,
              #080516 45%,
              #110719 100%
            );

          color:white;
          font-family:'Montserrat',sans-serif;
        }

        /* NEBULA */

        .nebula{
          position:absolute;
          border-radius:50%;
          pointer-events:none;
          filter:blur(90px);
          opacity:.35;
        }

        .nebulaOne{
          width:500px;
          height:500px;
          left:25%;
          top:20%;
          background:rgba(104,50,160,.2);
        }

        .nebulaTwo{
          width:450px;
          height:450px;
          right:5%;
          bottom:-100px;
          background:rgba(190,50,130,.16);
        }

        .nebulaThree{
          width:350px;
          height:350px;
          left:-100px;
          bottom:0;
          background:rgba(45,65,160,.12);
        }

        /* STAR FIELD */

        .starField{
          position:absolute;
          inset:0;
          pointer-events:none;
        }

        .star{
          position:absolute;
          width:2px;
          height:2px;
          border-radius:50%;
          background:white;
          box-shadow:
            0 0 5px white,
            0 0 12px rgba(255,255,255,.7);
        }

        /* CONSTELLATION */

        .constellation{
          position:absolute;
          width:72vw;
          height:72vw;
          max-width:950px;
          max-height:950px;

          left:50%;
          top:52%;

          transform:
            translate(-50%,-50%);

          pointer-events:none;

          filter:
            drop-shadow(
              0 0 8px rgba(255,120,190,.4)
            );
        }

        .constellationStar{
          position:absolute;

          width:7px;
          height:7px;

          border-radius:50%;

          background:#fff;

          transform:
            translate(-50%,-50%);

          box-shadow:
            0 0 8px white,
            0 0 18px #ff79bd,
            0 0 30px rgba(255,105,180,.5);

          cursor:pointer;

          z-index:5;
        }

        .starMessage{
          position:absolute;

          left:50%;
          top:-30px;

          transform:translateX(-50%);

          white-space:nowrap;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size:18px;
          font-style:italic;

          color:#f8d8e9;

          text-shadow:
            0 0 15px rgba(255,120,190,.7);
        }

        /* BRAND */

        .brand{
          position:absolute;
          top:38px;
          left:50px;

          display:flex;
          align-items:center;
          gap:18px;

          font-size:11px;
          font-weight:500;
          letter-spacing:7px;

          color:rgba(255,255,255,.65);
        }

        .brand span{
          font-family:
            'Cormorant Garamond',
            serif;

          font-size:30px;
          color:#ff78bb;

          text-shadow:
            0 0 12px rgba(255,105,180,.8);
        }

        .chapter{
          position:absolute;
          right:50px;
          top:40px;

          font-size:9px;
          letter-spacing:5px;

          color:rgba(255,255,255,.35);
        }

        /* CONTENT */

        .memoryContent{
          position:absolute;

          left:7%;
          top:16%;

          width:430px;

          z-index:10;
        }

        .eyebrow{
          font-size:10px;
          color:rgba(255,255,255,.42);
          margin-bottom:22px;
        }

        h1{
          margin:0;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size:64px;
          line-height:.95;
          font-weight:400;

          letter-spacing:-2px;

          text-shadow:
            0 0 30px rgba(255,255,255,.06);
        }

        h1 span{
          color:#f080bd;

          text-shadow:
            0 0 25px rgba(240,128,189,.25);
        }

        .subtext{
          margin-top:28px;

          width:300px;

          color:rgba(255,255,255,.48);

          font-size:14px;
          line-height:1.8;
        }

        /* QUOTE */

        .quoteBox{
          position:absolute;

          left:48vw;
          top:67vh;

          width:360px;

          text-align:center;

          z-index:20;
        }

        .quote{
          font-family:
            'Cormorant Garamond',
            serif;

          font-size:21px;
          font-style:italic;

          color:rgba(255,255,255,.8);

          min-height:30px;
        }

        .quoteMark{
          display:block;

          color:#ff75b8;

          font-size:30px;

          line-height:20px;
        }

        .quoteMark.bottom{
          margin-top:4px;
        }

        .heart{
          position:absolute;

          left:50%;
          bottom:4%;

          transform:translateX(-50%);

          color:#ff75b8;

          font-family:
            'Cormorant Garamond',
            serif;

          font-size:30px;

          text-shadow:
            0 0 15px #ff75b8,
            0 0 35px rgba(255,105,180,.5);
        }

        .instruction{
          position:absolute;

          left:50%;
          top:55%;

          transform:translateX(-50%);

          font-size:9px;
          letter-spacing:5px;

          color:rgba(255,255,255,.35);

          white-space:nowrap;
        }

        /* BUTTON */

        .nextLink{
          position:absolute;

          right:6%;
          bottom:9%;

          z-index:50;
        }

        .enterButton{
          display:flex;
          align-items:center;
          gap:35px;

          padding:16px 22px 16px 28px;

          border-radius:50px;

          background:
            rgba(255,255,255,.035);

          border:
            1px solid rgba(255,255,255,.15);

          color:white;

          backdrop-filter:blur(15px);

          font-size:9px;
          letter-spacing:4px;

          box-shadow:
            0 15px 50px rgba(0,0,0,.4);

          transition:
            .4s ease;
        }

        .enterButton b{
          width:34px;
          height:34px;

          display:flex;
          align-items:center;
          justify-content:center;

          border-radius:50%;

          background:rgba(255,105,180,.12);

          color:#ff79bd;

          font-size:17px;
        }

        /* FOOTER */

        .footerLeft{
          position:absolute;

          left:4%;
          bottom:4%;

          display:flex;
          align-items:center;
          gap:8px;

          font-size:9px;
          letter-spacing:3px;

          color:rgba(255,255,255,.3);
        }

        .footerLeft span{
          width:7px;
          height:7px;

          border-radius:50%;

          border:1px solid rgba(255,255,255,.25);
        }

        .footerLeft .activeDot{
          background:#ff79bd;

          box-shadow:
            0 0 12px #ff79bd;
        }

        .footerLeft em{
          margin-left:15px;

          font-style:normal;

          color:rgba(255,255,255,.25);
        }

        .footerCenter{
          position:absolute;

          left:50%;
          bottom:4%;

          transform:translateX(-50%);

          text-align:center;

          font-size:8px;
          line-height:1.8;
          letter-spacing:4px;

          color:rgba(255,255,255,.22);
        }

        .footerRight{
          position:absolute;

          right:4%;
          bottom:4%;

          font-size:8px;
          letter-spacing:4px;

          color:rgba(255,255,255,.22);
        }

        /* MOBILE */

        @media(max-width:768px){

          .brand{
            left:22px;
            top:25px;
            font-size:8px;
            letter-spacing:4px;
          }

          .brand span{
            font-size:25px;
          }

          .chapter{
            right:22px;
            top:28px;
            font-size:7px;
            letter-spacing:3px;
          }

          .memoryContent{
            left:25px;
            top:18%;
            width:calc(100% - 50px);
          }

          h1{
            font-size:48px;
          }

          .subtext{
            width:260px;
            font-size:12px;
          }

          .constellation{
            width:120vw;
            height:120vw;
            top:58%;
          }

          .quoteBox{
            left:50%;
            top:72%;
            width:280px;
          }

          .quote{
            font-size:17px;
          }

          .instruction{
            top:61%;
            font-size:7px;
            letter-spacing:3px;
          }

          .nextLink{
            right:50%;
            transform:translateX(50%);
            bottom:9%;
          }

          .footerLeft{
            display:none;
          }

          .footerCenter{
            display:none;
          }

          .footerRight{
            display:none;
          }
        }

      `}</style>
    </div>
  );
}
