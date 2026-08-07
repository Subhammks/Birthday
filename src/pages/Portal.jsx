import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DreamyBackground from "../components/DreamyBackground";
import CursorGlow from "../components/CursorGlow";
import BalloonFollower from "../components/BalloonFollower";
import { useState, useEffect } from "react";

export default function Portal() {
  const [typed, setTyped] = useState("");

  const message =
    "A mysterious outbreak has spread through the city. But one person remains immune. Today is her birthday.";

  useEffect(() => {
    let i = 0;

    const timer = setInterval(() => {
      setTyped(message.slice(0, i));
      i++;

      if (i > message.length) {
        clearInterval(timer);
      }
    }, 35);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <DreamyBackground />
     

      <div className="portal">
        <motion.div
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          QUARANTINE DAY 365
        </motion.div>

        <motion.h1
          className="title"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
        >
          HAPPINESS
          <br />
          <span className="mission">RESIDENT FILE #0808</span>
        </motion.h1>

        <div className="status">STATUS : IMMUNE</div>

        <motion.p
          className="description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {typed}
        </motion.p>

        <div className="quote">
          "In a world full of fear, one person remained my happiness."
        </div>

        <div className="warning">⚠ EMERGENCY ALERT ⚠</div>

        <Link to="/elevator">
          <motion.button
            className="magicBtn"
            whileHover={{
              scale: 1.08,
              rotateX: 8,
              rotateY: -8,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            ENTER SAFE ZONE →
          </motion.button>
        </Link>
      </div>

      <style>{`
  .portal{
    height:100vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    text-align:center;
    padding:20px;
    position:relative;
    z-index:5;
  }

  .subtitle{
    color:#ff4040;

    letter-spacing:8px;

    font-size:.95rem;

    font-weight:800;

    text-transform:uppercase;

    margin-bottom:25px;

    text-shadow:
    0 0 10px rgba(255,0,0,.7),
    0 0 30px rgba(255,0,0,.4);
  }
.title{
  font-family:'Cormorant Garamond', serif;
}
  .title{
    font-size:7rem;

    font-weight:900;

    line-height:1;

    letter-spacing:14px;

    text-transform:uppercase;

    color:#f5fbff;

    text-shadow:
    0 0 10px rgba(255,255,255,.8),
    0 0 25px rgba(150,220,255,.8),
    0 0 60px rgba(100,180,255,.6);

    margin-bottom:10px;
  }

  .mission{
    display:block;

    margin-top:15px;

    font-size:1rem;

    font-weight:500;

    letter-spacing:8px;

    text-transform:uppercase;

    color:#b5d6ff;

    opacity:.9;
  }

  .status{
    margin-top:25px;

    color:#ff2d2d;

    font-size:1rem;

    font-weight:800;

    letter-spacing:8px;

    text-transform:uppercase;

    text-shadow:
    0 0 10px red,
    0 0 30px red;

    animation:pulseStatus 2s infinite;
  }

  @keyframes pulseStatus{
    50%{
      opacity:.6;
    }
  }

  .description{
    margin-top:40px;

    max-width:850px;

    color:#f5f5f5;

    font-size:1.35rem;

    font-weight:300;

    line-height:2;

    letter-spacing:1px;

    min-height:90px;

    text-shadow:
    0 0 10px rgba(0,0,0,.8);
  }

  .quote{
    margin-top:20px;

    color:#d7e5f7;

    font-size:1rem;

    font-style:italic;

    letter-spacing:2px;

    opacity:.85;
  }

  .warning{
    margin-top:35px;

    padding:10px 20px;

    border:1px solid rgba(255,0,0,.4);

    background:rgba(255,0,0,.08);

    color:#ff3b3b;

    font-weight:800;

    letter-spacing:6px;

    text-transform:uppercase;

    box-shadow:
    0 0 20px rgba(255,0,0,.25);

    animation:blink 1.2s infinite;
  }

  @keyframes blink{
    50%{
      opacity:.35;
    }
  }

  .magicBtn{
  margin-top:50px;

  padding:18px 50px;

  color:white;
  font-size:1.1rem;
  font-weight:600;

  border-radius:999px;

  background:rgba(255,255,255,0.08);

  border:1px solid rgba(255,255,255,0.25);

  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);

  box-shadow:
    0 8px 32px rgba(0,0,0,0.2),
    inset 0 1px 1px rgba(255,255,255,0.3);

  position:relative;
  overflow:hidden;

  transition:all .4s ease;
}

  .magicBtn::before{
  content:"";

  position:absolute;

  top:0;
  left:-120%;

  width:100%;
  height:100%;

  background:
  linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.35),
    transparent
  );

  transition:0.8s;
}
  .magicBtn:hover{
  transform:translateY(-3px);

  box-shadow:
    0 0 20px rgba(255,180,255,.5),
    0 0 40px rgba(200,150,255,.3),
    inset 0 1px 1px rgba(255,255,255,.4);
}

.magicBtn:hover::before{
  left:120%;
}
  .magicBtn{
  transform-style:preserve-3d;
}

.magicBtn:hover{
  transform:
    translateY(-3px)
    rotateX(5deg);
}

  #balloon{
    position:fixed;
    font-size:50px;

    pointer-events:none;

    transform:translate(-50%,-50%);

    z-index:999;

    filter:drop-shadow(
      0 0 15px rgba(255,0,0,.8)
    );
  }

  @media(max-width:768px){

    .title{
      font-size:3.5rem;
      letter-spacing:6px;
    }

    .mission{
      font-size:.85rem;
      letter-spacing:4px;
    }

    .status{
      font-size:.85rem;
      letter-spacing:4px;
    }

    .description{
      font-size:1rem;
      line-height:1.8;
    }

    .warning{
      font-size:.8rem;
      letter-spacing:3px;
    }

    .magicBtn{
      font-size:1rem;
      padding:18px 40px;
    }
  }
`}</style>
    </>
  );
}
