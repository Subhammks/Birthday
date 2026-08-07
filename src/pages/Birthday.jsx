import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Birthday() {
  const navigate = useNavigate();

  const names = [
    "Suhani 🫰",
    "Su 😋",
    "Cutu 🥰",
    "Bachhu 💕",
    "11:11 ✨",
    "Happiness ❤️",
  ];

  const emojis = ["❤️", "✨", "🎂", "🥳", "💕", "😋","🫰", "🎈"];

  const [currentName, setCurrentName] = useState(0);
  const [showRain, setShowRain] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showCake, setShowCake] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentName((prev) => (prev + 1) % names.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="birthdayPage">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        <div className="heroSection">
          <div className="birthdayTag">HAPPY BIRTHDAY</div>

          <h1 className="changingName">{names[currentName]}</h1>

          <p className="heroText">
            Every memory... Every laugh... Every moment... Led to this day.
          </p>

          <button className="reactionBtn" onClick={() => setShowRain(true)}>
            ❤️ SEND LOVE ❤️
          </button>

          <button className="giftBtn" onClick={() => setShowCake(true)}>
            🎂 START CELEBRATION
          </button>
        </div>

        {showCake && (
          <div className="cakeScreen">
            {!cakeCut ? (
              <>
                <h1 className="cakeTitle">Make A Wish ✨</h1>

                <img
                  src="/images/tiramisu1.png
                  "
                  alt="Tiramisu Cake"
                  className="cakeImage"
                />

                <button
                  className="cutCakeBtn"
                  onClick={() => {
                    setCakeCut(true);
                    setShowRain(true);

                    setTimeout(() => {
                      setShowGift(true);
                    }, 2500);
                  }}
                >
                  🔪 CUT THE CAKE
                </button>
              </>
            ) : (
              <>
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

                <h1 className="celebrateText">HAPPY BIRTHDAY SU ❤️</h1>

                <p>May all your wishes come true ✨</p>
                <button
                  className="finalNoteBtn"
                  onClick={() => navigate("/final-note")}
                >
                  💌 Read My Final Message
                </button>
              </>
            )}
          </div>
        )}

        {showRain &&
          Array.from({ length: 80 }).map((_, i) => (
            <span
              key={i}
              className="emojiRain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            >
              {emojis[Math.floor(Math.random() * emojis.length)]}
            </span>
          ))}

        {/* <button className="replayBtn" onClick={() => navigate("/")}>
          ↺ REPLAY JOURNEY
        </button> */}
      </div>

      <style>{`

      .heroSection,
.giftCard,
.replayBtn,
.emojiRain{
  position:relative;
  z-index:5;
}
.birthdayTag{
  font-family:'Cormorant Garamond', serif;
}
 
        .birthdayPage{
  min-height:100vh;
  overflow:hidden;
  position:relative;
  color:white;

  background:
    linear-gradient(
      -45deg,
      #240046,
      #b690db,
      #f98dbc,
      #eb5656,
      #92f78f
    );

  background-size:400% 400%;

  animation:dreamyBG 15s ease infinite;

  .birthdayPage::before{
  content:"";

  position:absolute;
  inset:-20%;

  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(255,255,255,.15),
      transparent 30%
    ),
    radial-gradient(
      circle at 80% 30%,
      rgba(255,0,110,.25),
      transparent 35%
    ),
    radial-gradient(
      circle at 50% 80%,
      rgba(58,134,255,.25),
      transparent 35%
    );

  animation:floatingLights 12s ease-in-out infinite;

  z-index:0;
}
}


        .heroSection{
          min-height:100vh;

          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;

          text-align:center;

          padding:20px;
        }
          .cakeImage{
  width:350px;
  max-width:80vw;

  animation:
  floatCake 2s ease-in-out infinite,
  glowCake 2s infinite;

  filter:
  drop-shadow(0 0 20px rgba(255,255,255,.4))
  drop-shadow(0 0 60px rgba(255,211,105,.6));
}
  .star{
  position:absolute;

  width:4px;
  height:4px;

  background:white;

  border-radius:50%;

  box-shadow:
    0 0 10px white,
    0 0 20px white;

  animation:twinkle 3s infinite;
}

@keyframes twinkle{

  50%{
    opacity:.2;
    transform:scale(.5);
  }
}

        .birthdayTag{
          color:#ffd369;
          letter-spacing:10px;
          margin-bottom:20px;
          font-weight:700;
        }

        .changingName{
          font-size:7rem;

          text-shadow:
          0 0 20px white,
          0 0 60px #ff006e,
          0 0 120px #ff006e;

          animation:namePulse 2s infinite;
        }

        .heroText{
          margin-top:20px;
          max-width:700px;
          font-size:1.4rem;
          color:#ddd;
        }

        .reactionBtn,
        .giftBtn{
          margin-top:25px;

          padding:18px 45px;

          border:none;

          border-radius:999px;

          cursor:pointer;

          font-weight:700;

          color:white;

          background:
          linear-gradient(
            135deg,
            #ff006e,
            #ff4d6d
          );

          box-shadow:
          0 0 20px #ff006e;

          transition:.3s;
        }

        .reactionBtn:hover,
        .giftBtn:hover{
          transform:scale(1.05);
        }

        .giftCard{
          position:fixed;

          top:50%;
          left:50%;

          transform:translate(-50%,-50%);

          width:90%;
          max-width:800px;

          padding:50px;

          background:
          rgba(15,15,15,.95);

          backdrop-filter:blur(20px);

          border-radius:25px;

          text-align:center;

          line-height:2;

          z-index:99999;

          box-shadow:
          0 0 40px rgba(255,0,110,.4);
        }

        .closeBtn{
          position:absolute;

          top:15px;
          right:20px;

          background:none;
          border:none;

          color:white;

          font-size:28px;

          cursor:pointer;
        }

        .finalName{
          color:#ff4d6d;

          text-shadow:
          0 0 20px #ff4d6d,
          0 0 50px #ff4d6d;
        }

        .emojiRain{
          position:fixed;

          top:-50px;

          font-size:2rem;

          animation:fall 5s linear infinite;

          z-index:9999;
        }

        .replayBtn{
          position:fixed;

          bottom:30px;
          right:30px;

          padding:18px 35px;

          border:none;

          border-radius:999px;

          color:white;

          cursor:pointer;

          background:
          linear-gradient(
            135deg,
            #ff006e,
            #ff4d6d
          );

          box-shadow:
          0 0 30px #ff006e;

          z-index:99999;
        }
          @keyframes floatingLights{

  0%,100%{
    transform:
      translateY(0px)
      scale(1);
  }

  50%{
    transform:
      translateY(-40px)
      scale(1.1);
  }
}

        @keyframes fall{
          from{
            transform:translateY(-100px);
          }

          to{
            transform:translateY(120vh);
          }
        }

        @keyframes namePulse{
          50%{
            transform:scale(1.08);
          }
        }
          .cakeScreen{
  position:fixed;
  inset:0;

  background:
  radial-gradient(
    circle,
    rgba(0,0,0,.75),
    rgba(0,0,0,.95)
  );
  .finalNoteBtn{
  margin-top:40px;

  padding:18px 55px;

  border-radius:999px;
  border:1px solid rgba(255,255,255,.2);

  background:
  rgba(255,255,255,.08);

  backdrop-filter:blur(15px);
  -webkit-backdrop-filter:blur(15px);

  color:white;

  font-size:1rem;
  font-weight:700;

  letter-spacing:2px;

  cursor:pointer;

  position:relative;
  overflow:hidden;

  box-shadow:
    0 0 20px rgba(255,0,110,.4),
    0 0 60px rgba(131,56,236,.3),
    inset 0 1px 1px rgba(255,255,255,.2);

  transition:all .4s ease;
}

  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;

  z-index:999999;
}
  .cutCakeContainer{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:0;
  margin-top:30px;
  position:relative;
}

.cakeHalf{
  width:280px;
  max-width:40vw;

  filter:
    drop-shadow(0 0 20px rgba(255,255,255,.3))
    drop-shadow(0 0 50px rgba(255,211,105,.5));

  animation-duration:1.5s;
  animation-fill-mode:forwards;
}

.leftHalf{
  animation-name:splitLeft;
}

.rightHalf{
  animation-name:splitRight;
}

@keyframes splitLeft{
  from{
    transform:translateX(0) rotate(0deg);
    opacity:1;
  }

  to{
    transform:translateX(-140px) rotate(-8deg);
    opacity:1;
  }
}

@keyframes splitRight{
  from{
    transform:translateX(0) rotate(0deg);
    opacity:1;
  }

  to{
    transform:translateX(140px) rotate(8deg);
    opacity:1;
  }
}

.cakeTitle{
  color:#ffd369;
  margin-bottom:20px;
  letter-spacing:4px;
}

.cakeEmoji{
  font-size:10rem;

  animation:
  floatCake 2s ease-in-out infinite;
}

.cutCakeBtn{
  margin-top:30px;

  padding:20px 50px;

  border:none;
  border-radius:999px;

  cursor:pointer;

  color:white;

  font-weight:700;

  background:
  linear-gradient(
    135deg,
    #ff006e,
    #ff4d6d
  );

  box-shadow:
  0 0 30px #ff006e;
}

.cakeCut{
  font-size:8rem;
}

.celebrateText{
  margin-top:20px;

  text-shadow:
  0 0 20px #ff006e,
  0 0 60px #ff006e;
}
@keyframes dreamyBG{
  0%{
    background-position:0% 50%;
  }

  50%{
    background-position:100% 50%;
  }

  100%{
    background-position:0% 50%;
  }
}
@keyframes floatCake{
  50%{
    transform:
    translateY(-15px);
  }
}

        @media(max-width:768px){

          .changingName{
            font-size:3rem;
          }

          .heroText{
            font-size:1rem;
          }

          .giftCard{
            padding:30px 20px;
          }

        }

      `}</style>
    </>
  );
}
