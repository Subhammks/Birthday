import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GiftBox3D from "../components/GiftBox3D";

export default function MemoryFloor1() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="scene">
      <div className="roomGlow"></div>

      {!opened && (
        <>
          <h1 className="heading">MISSION LOG #001</h1>

          <GiftBox3D onOpen={() => setOpened(true)} />

          <p className="hint">Click the gift box</p>
        </>
      )}

      <AnimatePresence>
        {opened && (
          <motion.div
            className="memoryCard"
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateY: -90,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateY: 0,
            }}
            transition={{
              duration: 1,
            }}
          >
            <img src="/src/assets/childhood.jpg" alt="" />

            <h2>Childhood Memories</h2>

            <p>Every beautiful story starts with a beautiful beginning.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .scene{
          height:100vh;

          background:
          radial-gradient(
            circle at center,
            #101826,
            #020202
          );

          display:flex;
          flex-direction:column;

          justify-content:center;
          align-items:center;

          overflow:hidden;

          perspective:1800px;
        }

        .roomGlow{
          position:absolute;

          width:600px;
          height:600px;

          border-radius:50%;

          background:
          radial-gradient(
            circle,
            rgba(100,180,255,.15),
            transparent
          );

          filter:blur(80px);
        }

        .heading{
          color:white;

          letter-spacing:8px;

          margin-bottom:40px;
        }

        .hint{
          color:#c8dfff;
        }

        .memoryCard{
          width:800px;

          background:
          rgba(255,255,255,.08);

          backdrop-filter:blur(20px);

          border:
          1px solid rgba(255,255,255,.15);

          border-radius:30px;

          padding:30px;

          transform-style:preserve-3d;

          box-shadow:
          0 50px 100px rgba(0,0,0,.5);
        }

        .memoryCard img{
          width:100%;
          border-radius:20px;

          transform:
          translateZ(40px);
        }

        .memoryCard h2{
          color:white;
          margin-top:20px;
        }

        .memoryCard p{
          color:#dfe8f5;
        }
      `}</style>
    </div>
  );
}
