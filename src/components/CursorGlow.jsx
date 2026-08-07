import { useEffect } from "react";

export default function CursorGlow() {
  useEffect(() => {
    const outer = document.getElementById("cursorOuter");
    const dot = document.getElementById("cursorDot");

    const move = (e) => {
      if (!outer || !dot) return;

      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";

      outer.animate(
        {
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
        },
        {
          duration: 120,
          fill: "forwards",
        },
      );
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <>
      <div id="cursorOuter"></div>
      <div id="cursorDot"></div>

      <style>{`
        body{
          cursor:none;
        }

        #cursorOuter{
          position:fixed;

          width:32px;
          height:32px;

          border:2px solid rgba(255,255,255,.85);

          border-radius:50%;

          pointer-events:none;

          transform:translate(-50%,-50%);

          z-index:9999;

          background:transparent;

          box-shadow:
          0 0 8px rgba(255,255,255,.15);
        }

        #cursorDot{
          position:fixed;

          width:6px;
          height:6px;

          border-radius:50%;

          background:white;

          pointer-events:none;

          transform:translate(-50%,-50%);

          z-index:10000;
        }
      `}</style>
    </>
  );
}
