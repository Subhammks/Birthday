export default function DreamyBackground() {
  return (
    <>
      <div className="happiness-bg">
        <div className="blue-overlay"></div>

        <div className="blood-overlay"></div>

        <div className="rain"></div>

        <div className="red-warning left"></div>
        <div className="red-warning right"></div>

        <div className="vignette"></div>
      </div>

      <style>{`
        .happiness-bg{
          position:fixed;
          inset:0;
          z-index:-10;

          background-image:
          url("/src/assets/happiness-bg.jpg");

          background-size:cover;
          background-position:center;
          background-repeat:no-repeat;

          overflow:hidden;

          animation:zoomBg 25s ease-in-out infinite alternate;
        }

        @keyframes zoomBg{
          from{
            transform:scale(1);
          }
          to{
            transform:scale(1.08);
          }
        }

        .blue-overlay{
          position:absolute;
          inset:0;

          background:
          linear-gradient(
            rgba(10,25,45,.45),
            rgba(0,0,0,.65)
          );
        }

        .blood-overlay{
          position:absolute;
          inset:0;

          background:
          radial-gradient(
            circle at top left,
            rgba(180,0,0,.18),
            transparent 25%
          ),
          radial-gradient(
            circle at top right,
            rgba(180,0,0,.18),
            transparent 25%
          );

          mix-blend-mode:screen;
        }

        .rain{
          position:absolute;
          inset:-100px;

          background:
          repeating-linear-gradient(
            -75deg,
            transparent 0px,
            transparent 8px,
            rgba(255,255,255,.15) 9px,
            transparent 10px
          );

          animation:rainFall .22s linear infinite;
        }

        @keyframes rainFall{
          from{
            transform:translateY(-60px);
          }
          to{
            transform:translateY(60px);
          }
        }

        .red-warning{
          position:absolute;

          width:450px;
          height:450px;

          border-radius:50%;

          background:
          radial-gradient(
            circle,
            rgba(255,0,0,.22),
            transparent 70%
          );

          filter:blur(80px);

          animation:siren 3s infinite;
        }

        .left{
          top:10%;
          left:-100px;
        }

        .right{
          top:10%;
          right:-100px;
          animation-duration:4s;
        }

        @keyframes siren{
          50%{
            opacity:.3;
            transform:scale(1.15);
          }
        }

        .vignette{
          position:absolute;
          inset:0;

          background:
          radial-gradient(
            circle,
            transparent 45%,
            rgba(0,0,0,.8) 100%
          );
        }
      `}</style>
    </>
  );
}
