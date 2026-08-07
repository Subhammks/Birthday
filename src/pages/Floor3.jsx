import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Floor3() {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="floor3">
      <div className="overlay"></div>

      <div className="content">
        <div className="tag">MEMORY #03</div>

        <h1>Favourite Moment</h1>

        {/* <div className="gallery">
          <div className="photo">
            <img src="/images/memory1.jpg" alt="Memory 1" />
          </div>

          <div className="photo">
            <img src="/images/memory2.jpg" alt="Memory 2" />
          </div>

          <div className="photo">
            <img src="/images/memory3.jpg" alt="Memory 3" />
          </div>
        </div> */}

        {!opened ? (
          <button className="letterBtn" onClick={() => setOpened(true)}>
            💌 OPEN LETTER
          </button>
        ) : (
          <div className="letter">
            <h2>For Happiness ❤️</h2>

            <p>Some people become memories.</p>
            <p>You became a part of my story.</p>
            <p>Wo morning usko kya mai bolu. Wo meri College ki best memory hai aur usko koi replace nai ker sakta. Agar meko chance mile college ke kisi din ko wapas se jeene ko to mai hamesa us morning ko choose kerunga. Matlab mai us feeling ko explain nai ker sakta bas when i think about that morning mai khus ho jatta hu. Waise bhi bas wahi ek tmari memory hai mere pass. Kassh us subh kuch photos click ker liye hote tmaree...
              Just like this as my favourite memory you will always my favourite person.
            </p>
          </div>
        )}
      </div>

      <button className="nextBtn" onClick={() => navigate("/birthday")}>
        🎂 FINAL FLOOR →
      </button>

      <style>{`

        .floor3{
          min-height:100vh;
          padding:50px 20px;
          position:relative;

          background:url("/images/Floorr3.png");
          background-size:cover;
          background-position:center;
          background-attachment:fixed;

          overflow-y:auto;
        }

        .overlay{
          position:fixed;
          inset:0;

          background:
          linear-gradient(
            rgba(0,0,0,.65),
            rgba(0,0,0,.9)
          );

          z-index:1;
        }

        .content{
          position:relative;
          z-index:10;

          max-width:1200px;
          margin:auto;

          text-align:center;
          color:white;

          padding-bottom:180px;
        }

        .tag{
          color:#ffd369;
          letter-spacing:8px;
          font-size:1rem;
          margin-bottom:10px;
        }

        h1{
          font-size:5rem;
          margin-bottom:50px;

          text-shadow:
          0 0 20px rgba(255,255,255,.4),
          0 0 60px rgba(255,255,255,.2);
        }

        .gallery{
          display:flex;
          justify-content:center;
          flex-wrap:wrap;
          gap:30px;

          margin-bottom:40px;
        }

        .photo{
  width:220px;
  height:280px;

  background:white;

  padding:10px;

  border-radius:15px;

  position:relative;

  box-shadow:
  0 20px 40px rgba(0,0,0,.5);

  animation:
  memoryFloat 6s ease-in-out infinite;

  transition:.4s;
}

.photo:nth-child(1){
  animation-delay:0s;
  transform:rotate(-8deg);
}

.photo:nth-child(2){
  animation-delay:2s;
  transform:rotate(5deg);
}

.photo:nth-child(3){
  animation-delay:4s;
  transform:rotate(-4deg);
}

.photo:hover{
  transform:
  scale(1.1)
  rotate(0deg);

  z-index:100;

  box-shadow:
  0 20px 60px rgba(255,255,255,.3),
  0 0 100px rgba(255,255,255,.2);
}

@keyframes memoryFloat{

  0%{
    transform:
    translateY(0px)
    rotate(-5deg);
  }

  25%{
    transform:
    translateY(-15px)
    rotate(-2deg);
  }

  50%{
    transform:
    translateY(-30px)
    rotate(3deg);
  }

  75%{
    transform:
    translateY(-15px)
    rotate(-2deg);
  }

  100%{
    transform:
    translateY(0px)
    rotate(-5deg);
  }

}
  .photo::before{
  content:"";

  position:absolute;
  inset:-20px;

  border-radius:20px;

  background:
  
  radial-gradient(
    circle,
    rgba(255,255,255,.25),
    transparent
  );

  filter:blur(20px);

  z-index:-1;
}

        .photo:hover{
          transform:
          translateY(-10px)
          scale(1.05);
        }

        .photo img{
          width:100%;
          height:100%;
          object-fit:cover;
          border-radius:10px;
        }

        .letterBtn{
          padding:18px 50px;

          border:none;
          border-radius:999px;

          background:
          linear-gradient(
            135deg,
            #ffd369,
            #ff9d00
          );

          color:black;

          font-weight:700;
          cursor:pointer;

          box-shadow:
          0 0 30px rgba(255,211,105,.5);
        }

        .letter{
          margin-top:40px;

          max-width:850px;

          margin-left:auto;
          margin-right:auto;

          padding:40px;

          border-radius:25px;

          background:
          rgba(255,255,255,.08);

          backdrop-filter:blur(15px);

          line-height:2;
        }

        .letter h2{
          color:#ffd369;
          margin-bottom:20px;
        }

        .nextBtn{
  position:fixed;

  right:30px;
  bottom:30px;

  z-index:999999;

  padding:20px 45px;

  border:none;
  border-radius:999px;

  background:
  linear-gradient(
    135deg,
    #ff006e,
    #ff4d6d
  );

  color:white;

  font-size:1rem;
  font-weight:800;

  letter-spacing:3px;
  text-transform:uppercase;

  cursor:pointer;

  box-shadow:
  0 0 20px rgba(255,0,110,.7),
  0 0 50px rgba(255,0,110,.5),
  0 0 120px rgba(255,0,110,.3);

  animation:
  floatBtn 3s ease-in-out infinite,
  pulseGlow 2s infinite;

  transition:.3s;
}

.nextBtn::before{
  content:"";

  position:absolute;

  inset:-4px;

  border-radius:999px;

  background:
  linear-gradient(
    135deg,
    rgba(255,255,255,.5),
    transparent
  );

  opacity:.4;

  z-index:-1;

  filter:blur(10px);
}

.nextBtn:hover{
  transform:
  translateY(-5px)
  scale(1.08);

  box-shadow:
  0 0 30px #ff006e,
  0 0 80px #ff006e,
  0 0 180px #ff006e;
}

@keyframes floatBtn{

  0%{
    transform:translateY(0px);
  }

  50%{
    transform:translateY(-12px);
  }

  100%{
    transform:translateY(0px);
  }

}

@keyframes pulseGlow{

  0%{
    box-shadow:
    0 0 20px rgba(255,0,110,.7),
    0 0 50px rgba(255,0,110,.5);
  }

  50%{
    box-shadow:
    0 0 40px rgba(255,0,110,1),
    0 0 100px rgba(255,0,110,.8),
    0 0 180px rgba(255,0,110,.5);
  }

  100%{
    box-shadow:
    0 0 20px rgba(255,0,110,.7),
    0 0 50px rgba(255,0,110,.5);
  }

}

        .nextBtn:hover{
          transform:
          translateX(-50%)
          scale(1.05);
        }

        @media(max-width:768px){

          h1{
            font-size:3rem;
          }

          .photo{
            width:160px;
            height:220px;
          }

          .nextBtn{
            width:90%;
            padding:18px;
          }
        }

      `}</style>
    </div>
  );
}
