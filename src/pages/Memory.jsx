import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Memory() {
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const navigate = useNavigate();

  const react = (emoji) => {
    setSelectedEmoji(emoji);

    setTimeout(() => {
      setSelectedEmoji(null);
    }, 4000);
  };

  return (
    <div className="memoryPage">
      <div className="memoryCard">
        <div className="memoryTag">MEMORY #01</div>

        <h1 className="memoryTitle">Raaz Ki Talash</h1>

        <p className="memoryText">
          This is where everything started.
          <br />
          Among clues, laughter, confusion and endless running around...
          <br />I found my favourite person.
          <br />Tum Hamesa bolti ho na maine tmarhi help nai ki aur tmko nai Jitya So, uske Liye Ek gift to banta hai na 
          <br/>"Tmare Liye mai Hamesa Available Rahunga Su. You are always my first Priority"
        </p>

        <div className="reactionBox">
          <button onClick={() => react("❤️")}>❤️</button>

          <button onClick={() => react("😍")}>😍</button>

          <button onClick={() => react("😂")}>😂</button>

          <button onClick={() => react("🥹")}>🥹</button>
        </div>

        <button className="nextBtn" onClick={() => navigate("/floor2")}>
          UNLOCK FLOOR 2 →
        </button>
      </div>

      {selectedEmoji &&
        [...Array(80)].map((_, i) => (
          <span
            key={i}
            className="emojiRain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${20 + Math.random() * 30}px`,
            }}
          >
            {selectedEmoji}
          </span>
        ))}

      <style>{`

      .memoryPage{

        min-height:100vh;

        background:
          linear-gradient(
            rgba(0,0,0,.55),
            rgba(0,0,0,.8)
          ),
          url("/images/raaz.jpg");

        background-size:cover;
        background-position:center;
        background-repeat:no-repeat;

        overflow:hidden;

        display:flex;
        justify-content:center;
        align-items:center;

        position:relative;
      }

      .memoryCard{

        width:750px;
        max-width:90%;

        background:
        rgba(0,0,0,.45);

        backdrop-filter:blur(18px);

        border:
        1px solid rgba(255,255,255,.15);

        border-radius:30px;

        padding:50px;

        text-align:center;

        box-shadow:
        0 0 50px rgba(0,0,0,.6),
        0 0 80px rgba(120,180,255,.15);

        animation:
        fadeInCard 1.5s ease;

        z-index:5;
      }

      .memoryTag{

        color:#ff6464;

        letter-spacing:5px;

        font-weight:700;

        margin-bottom:20px;
      }

      .memoryTitle{

        color:white;

        font-size:3rem;

        letter-spacing:4px;

        margin-bottom:25px;

        text-shadow:
        0 0 15px rgba(255,255,255,.6),
        0 0 40px rgba(120,180,255,.4);
      }

      .memoryText{

        color:#e6eef8;

        line-height:2;

        font-size:1.1rem;
      }

      .reactionBox{

        margin-top:35px;

        display:flex;
        justify-content:center;
        gap:20px;
      }

      .reactionBox button{

        font-size:2.2rem;

        border:none;
        background:none;

        cursor:pointer;

        transition:.3s;
      }

      .reactionBox button:hover{

        transform:
        scale(1.4)
        rotate(10deg);
      }

      .nextBtn{

        margin-top:40px;

        padding:18px 45px;

        border:none;

        border-radius:999px;

        background:
        linear-gradient(
          135deg,
          #ff4444,
          #990000
        );

        color:white;

        font-size:1rem;

        font-weight:700;

        letter-spacing:3px;

        cursor:pointer;

        box-shadow:
        0 0 25px red,
        0 0 60px rgba(255,0,0,.3);

        transition:.4s;
      }

      .nextBtn:hover{

        transform:
        translateY(-4px)
        scale(1.05);

        box-shadow:
        0 0 40px red,
        0 0 90px red;
      }

      .emojiRain{

        position:absolute;

        top:-50px;

        z-index:10;

        animation:
        fall 4s linear forwards;
      }

      @keyframes fall{

        from{
          transform:
          translateY(-50px)
          rotate(0deg);
        }

        to{
          transform:
          translateY(120vh)
          rotate(360deg);
        }
      }

      @keyframes fadeInCard{

        from{
          opacity:0;
          transform:
          translateY(50px)
          scale(.9);
        }

        to{
          opacity:1;
          transform:
          translateY(0)
          scale(1);
        }
      }

      @media(max-width:768px){

        .memoryCard{
          padding:30px;
        }

        .memoryTitle{
          font-size:2rem;
        }

        .memoryText{
          font-size:1rem;
        }
      }

      `}</style>
    </div>
  );
}
