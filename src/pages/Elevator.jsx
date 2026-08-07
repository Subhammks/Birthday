import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HappinessCorridor from "../components/HappinessCorridor";

export default function Elevator() {
  const [floor, setFloor] = useState("P");
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [travelling, setTravelling] = useState(false);
  const [openDoor, setOpenDoor] = useState(true);
  const [showCorridor, setShowCorridor] = useState(false);

  const navigate = useNavigate();

  const goToFloor = (targetFloor) => {
    if (travelling) return;

    setTravelling(true);
    setSelectedFloor(targetFloor);

    setOpenDoor(false);
    setShowCorridor(false);

    let current = 0;

    const timer = setInterval(() => {
      current++;

      setFloor(current.toString());

      if (current >= targetFloor) {
        clearInterval(timer);

        setTimeout(() => {
          setOpenDoor(true);
        }, 1000);

        setTimeout(() => {
          setShowCorridor(true);
        }, 2500);
      }
    }, 1000);
  };

  return (
    <>
      <div className="elevator">
        {!showCorridor && (
          <>
            <div className="building">BUILDING 101</div>

            <div className="quarantine">QUARANTINE BLOCK</div>

            <div className="display">FLOOR {floor}</div>

            <div className="scanLine"></div>

            <div className="panel">
              <button>P</button>

              <button
                onClick={() => goToFloor(1)}
                className={selectedFloor === 1 ? "active" : ""}
              >
                1
              </button>

              <button
                onClick={() => goToFloor(2)}
                className={selectedFloor === 2 ? "active" : ""}
              >
                2
              </button>

              <button
                onClick={() => goToFloor(3)}
                className={selectedFloor === 3 ? "active" : ""}
              >
                3
              </button>

              <button
                onClick={() => goToFloor(4)}
                className={selectedFloor === 4 ? "active" : ""}
              >
                4
              </button>
            </div>
          </>
        )}

        <div className="doorFrame">
          {showCorridor && (
            <div className="corridorWrapper">
              <HappinessCorridor onGiftClick={() => navigate("/memory")} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .elevator{
          height:100vh;
          overflow:hidden;
          background:#000;
          color:white;
          perspective:3000px;
          position:relative;
        }
          .corridorWrapper{
  position:absolute;
  inset:0;

  animation:walkIntoCorridor 3s ease forwards;

  transform-origin:center center;
}

@keyframes walkIntoCorridor{

  0%{
    opacity:0;
    transform:
      scale(1.3)
      translateZ(-1000px);
  }

  100%{
    opacity:1;
    transform:
      scale(1)
      translateZ(0);
  }
}

        .building{
          position:absolute;
          top:50px;
          width:100%;
          text-align:center;
          color:#ff4444;
          letter-spacing:8px;
          font-weight:700;
          z-index:200;
        }

        .quarantine{
          position:absolute;
          top:90px;
          width:100%;
          text-align:center;
          opacity:.7;
          z-index:200;
        }

        .display{
          position:absolute;
          top:150px;
          left:50%;
          transform:translateX(-50%);
          width:260px;
          height:90px;
          background:#000;
          border:2px solid red;
          display:flex;
          justify-content:center;
          align-items:center;
          font-size:2rem;
          font-weight:700;
          box-shadow:
          0 0 20px red,
          inset 0 0 20px red;
          z-index:200;
        }

        .scanLine{
          position:absolute;
          inset:0;
          background:
          linear-gradient(
            transparent,
            rgba(255,0,0,.08),
            transparent
          );
          animation:scan 3s linear infinite;
          pointer-events:none;
          z-index:150;
        }

        .panel{
          position:absolute;
          bottom:80px;
          left:50%;
          transform:translateX(-50%);
          display:grid;
          grid-template-columns:repeat(2,80px);
          gap:15px;
          z-index:200;
        }

        .panel button{
          width:80px;
          height:80px;
          border:none;
          border-radius:50%;
          background:#222;
          color:white;
          font-size:1.3rem;
          cursor:pointer;
          transition:.3s;
        }

        .panel button:hover{
          transform:scale(1.08);
        }

        .active{
          background:#ff4444 !important;

          box-shadow:
          0 0 20px red,
          0 0 40px red,
          0 0 80px red;
        }

        .doorFrame{
          position:fixed;
          inset:0;
          overflow:hidden;
          perspective:3000px;
        }

        .door{
          position:absolute;
          top:0;
          width:50%;
          height:100%;

          background:
          linear-gradient(
            90deg,
            #8c8c8c,
            #222
          );

          z-index:100;

          transition:
          2.5s cubic-bezier(
            .22,
            1,
            .36,
            1
          );

          box-shadow:
          inset 0 0 60px rgba(255,255,255,.2),
          0 0 50px rgba(0,0,0,.7);
        }

        .leftDoor{
  left:0;
  transform-origin:left center;
}

.rightDoor{
  right:0;
  transform-origin:right center;
}

        .openLeft{
  transform:
    translateX(-100%)
    rotateY(75deg);
}

.openRight{
  transform:
    translateX(100%)
    rotateY(-75deg);
}

        @keyframes scan{
          from{
            transform:translateY(-100%);
          }

          to{
            transform:translateY(100%);
          }
        }

        @media(max-width:768px){

          .display{
            width:220px;
            font-size:1.7rem;
          }

          .panel{
            grid-template-columns:
            repeat(2,70px);
          }

          .panel button{
            width:70px;
            height:70px;
          }
        }
      `}</style>
    </>
  );
}
