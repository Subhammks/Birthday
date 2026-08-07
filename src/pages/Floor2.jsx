import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Floor2() {
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const navigate = useNavigate();

  const react = (emoji) => {
    setSelectedEmoji(emoji);

    setTimeout(() => {
      setSelectedEmoji(null);
    }, 4000);
  };

  return (
    <div className="floor2Page">
      <div className="overlay"></div>

      <div className="memoryCard">
        <div className="memoryTag">MEMORY #02</div>

        <h1 className="memoryTitle">That Night Conversations</h1>

        <p className="memoryText">
          I don't know kya bolu mai usko Ek random coincidence ya already planned destiny.But jo bhi hua achha hua shayd agar us din baat nai huie hoti to shayd ajj bhi baat nai hoti aur aisa kuch nai ho raha hota. Wo puri raat ki long conversation that was literally mai explain nai ker sakta. Ek Random conversation jo ab favourite part of my day ban gaya hai. 
          And before I realised it... you became special.
        </p>

        <div className="messageBubble">💬 "Online..."</div>

        <div className="reactionBox">
          <button onClick={() => react("❤️")}>❤️</button>

          <button onClick={() => react("😍")}>😍</button>

          <button onClick={() => react("😂")}>😂</button>

          <button onClick={() => react("🥹")}>🥹</button>
        </div>

        <button className="nextBtn" onClick={() => navigate("/floor3")}>
          UNLOCK FLOOR 3 →
        </button>
      </div>

      {selectedEmoji &&
        [...Array(100)].map((_, i) => (
          <span
            key={i}
            className="emojiRain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${20 + Math.random() * 35}px`,
            }}
          >
            {selectedEmoji}
          </span>
        ))}

      <style>{`

      .floor2Page{
        min-height:100vh;
        position:relative;
        overflow:hidden;

        display:flex;
        justify-content:center;
        align-items:center;

        background:url("/images/floor2.jpg");
        background-size:cover;
        background-position:center;
      }

      .overlay{
        position:absolute;
        inset:0;

        background:
        linear-gradient(
          rgba(0,0,0,.55),
          rgba(0,0,0,.85)
        );
      }

      .memoryCard{
        width:750px;
        max-width:90%;

        background:
        rgba(255,255,255,.08);

        backdrop-filter:blur(18px);

        border:
        1px solid rgba(255,255,255,.15);

        border-radius:30px;

        padding:50px;

        text-align:center;

        position:relative;
        z-index:10;

        box-shadow:
        0 0 60px rgba(255,255,255,.08);
      }

      .memoryTag{
        color:#7ec8ff;
        letter-spacing:5px;
        font-weight:700;
      }

      .memoryTitle{
        color:white;
        font-size:3rem;
        margin:20px 0;
      }

      .memoryText{
        color:white;
        line-height:2;
        font-size:1.1rem;
      }

      .messageBubble{
        margin-top:25px;

        display:inline-block;

        padding:15px 25px;

        border-radius:20px;

        background:
        rgba(126,200,255,.15);

        color:white;

        animation:
        floatBubble 3s ease-in-out infinite;
      }

      .reactionBox{
        margin-top:35px;

        display:flex;
        justify-content:center;
        gap:20px;
      }

      .reactionBox button{
        border:none;
        background:none;
        font-size:2rem;
        cursor:pointer;

        transition:.3s;
      }

      .reactionBox button:hover{
        transform:scale(1.4);
      }

      .nextBtn{
        margin-top:40px;

        padding:18px 45px;

        border:none;

        border-radius:999px;

        background:
        linear-gradient(
          135deg,
          #7ec8ff,
          #3178ff
        );

        color:white;

        font-weight:700;

        cursor:pointer;

        box-shadow:
        0 0 25px #3178ff;
      }

      .emojiRain{
        position:absolute;
        top:-50px;
        z-index:100;

        animation:
        fall 4s linear forwards;
      }

      @keyframes fall{
        to{
          transform:
          translateY(120vh)
          rotate(360deg);
        }
      }

      @keyframes floatBubble{
        50%{
          transform:translateY(-10px);
        }
      }

      `}</style>
    </div>
  );
}
