import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

export default function FinalNote() {
  const navigate = useNavigate();

  return (
    <div className="finalNote">
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>

      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      <div className="letter">
        <h1>
          <Typewriter
            words={["❤️ Happy Birthday Bachu ❤️"]}
            loop={1}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={0}
            delaySpeed={999999}
          />
        </h1>

        <div className="line line1">
          <Typewriter
            words={["Tmare liye Mera Dher Sara PAYAR aur mera Sara WAQT."]}
            loop={1}
            cursor={false}
            typeSpeed={40}
          />
        </div>

        <div className="line line2">
          <Typewriter
            words={[
              "Hamesa Khus Raho tm. Achhi lagti ho jab smile kerti ho, CUTU si smile hai tmari.",
            ]}
            loop={1}
            cursor={false}
            typeSpeed={35}
          />
        </div>

        <div className="line line3">
          <Typewriter
            words={["I am always there for u Su. ❤️"]}
            loop={1}
            cursor={false}
            typeSpeed={40}
          />
        </div>

        <div className="line line4">
          <Typewriter
            words={[
              "I guess more beautiful memories are still waiting to be written
                Arz kiya hai humne bhi Likha hai kuchh tere baare mein hai 
                                     ऐसे तू लगे कि ग़ुलाब है",
            ]}
            loop={1}
            cursor={false}
            typeSpeed={35}
          />
        </div>
        </div>

        <h2 className="endingText">✨ Forever Your Biggest Fan ✨</h2>

        <button className="replayBtn" onClick={() => navigate("/")}>
          ↺ Replay Our Story
        </button>
      </div>

      <style>{`

        .finalNote{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:40px;
          overflow:hidden;
          position:relative;

          background:
          linear-gradient(
            135deg,
            #050816,
            #1b1035,
            #3b1f66,
            #5c2f8e,
            #8c52ff
          );

          color:white;
        }

        .cloud{
          position:absolute;
          border-radius:50%;
          filter:blur(100px);
          z-index:1;
        }

        .cloud1{
          width:500px;
          height:250px;

          background:rgba(255,255,255,.08);

          top:5%;
          left:-10%;

          animation:floatCloud 25s linear infinite;
        }

        .cloud2{
          width:600px;
          height:300px;

          background:rgba(255,180,255,.08);

          bottom:10%;
          right:-10%;

          animation:floatCloud 35s linear infinite reverse;
        }

        .cloud3{
          width:450px;
          height:250px;

          background:rgba(140,180,255,.08);

          top:50%;
          left:30%;

          animation:floatCloud 30s linear infinite;
        }

        .orb{
          position:absolute;
          border-radius:50%;
          filter:blur(40px);
          z-index:1;
        }

        .orb1{
          width:200px;
          height:200px;

          background:rgba(255,0,110,.25);

          top:15%;
          right:20%;

          animation:floatOrb 8s ease-in-out infinite;
        }

        .orb2{
          width:250px;
          height:250px;

          background:rgba(131,56,236,.25);

          bottom:20%;
          left:10%;

          animation:floatOrb 10s ease-in-out infinite;
        }

        .orb3{
          width:180px;
          height:180px;

          background:rgba(58,134,255,.25);

          top:60%;
          right:15%;

          animation:floatOrb 12s ease-in-out infinite;
        }

        @keyframes floatCloud{
          0%{
            transform:translateX(0);
          }

          50%{
            transform:translateX(120px);
          }

          100%{
            transform:translateX(0);
          }
        }

        @keyframes floatOrb{
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

        .letter{
          max-width:850px;
          text-align:center;

          background:rgba(255,255,255,.08);
          backdrop-filter:blur(20px);

          border:1px solid rgba(255,255,255,.15);

          padding:60px;
          border-radius:30px;

          z-index:10;

          box-shadow:
          0 0 40px rgba(255,255,255,.08);
        }

        h1{
          font-size:3rem;
          margin-bottom:30px;

          text-shadow:
          0 0 20px rgba(255,255,255,.4);
        }

        p{
          line-height:2;
          margin-bottom:18px;
          font-size:1.1rem;
        }

        h2{
          margin-top:40px;
          color:#ffd369;
        }

        .replayBtn{
          margin-top:50px;

          padding:18px 50px;

          border:none;
          border-radius:999px;

          cursor:pointer;

          color:white;
          font-size:1rem;
          font-weight:700;

          background:rgba(255,255,255,.08);

          border:1px solid rgba(255,255,255,.2);

          backdrop-filter:blur(15px);

          box-shadow:
            0 0 20px rgba(255,255,255,.15),
            0 0 40px rgba(255,180,255,.2);

          transition:.4s ease;

          position:relative;
          overflow:hidden;
        }

        .replayBtn::before{
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
            rgba(255,255,255,.35),
            transparent
          );

          transition:.8s;
        }

        .replayBtn:hover{
          transform:
          translateY(-5px)
          scale(1.05);

          box-shadow:
          0 0 30px #ffb6ff,
          0 0 80px #d5a6ff;
        }

        .replayBtn:hover::before{
          left:120%;
        }

        @media(max-width:768px){

          .letter{
            padding:35px 25px;
          }

          h1{
            font-size:2rem;
          }

          p{
            font-size:1rem;
          }

          .replayBtn{
            width:100%;
          }

        }

      `}</style>
    </div>
  );
}
