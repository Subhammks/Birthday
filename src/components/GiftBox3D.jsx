import { motion } from "framer-motion";

export default function GiftBox3D({ onOpen }) {
  return (
    <motion.div
      className="giftBox"
      onClick={onOpen}
      animate={{
        rotateY: [0, 360],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
      }}
    >
      🎁
      <style>{`
        .giftBox{
          font-size:180px;

          cursor:pointer;

          transform-style:preserve-3d;

          filter:
          drop-shadow(
            0 20px 30px rgba(0,0,0,.5)
          );
        }
      `}</style>
    </motion.div>
  );
}
