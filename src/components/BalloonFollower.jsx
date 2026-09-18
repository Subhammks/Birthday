import { useEffect } from "react";

export default function BalloonFollower() {
  useEffect(() => {
    const balloon = document.getElementById("balloon");

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", move);

    function animate() {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;

      if (balloon) {
        balloon.style.left = currentX + "px";
        balloon.style.top = currentY + "px";
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <div
      id="balloon"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        fontSize: "50px",
        pointerEvents: "none",
        zIndex: 99999,
        filter: "drop-shadow(0 0 20px red)",
      }}
    >
      🎈
    </div>
  );
}
