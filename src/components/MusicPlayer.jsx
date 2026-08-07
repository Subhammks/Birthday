import { useEffect, useRef } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);

  useEffect(() => {
    const startMusic = () => {
      audioRef.current?.play();
      document.removeEventListener("click", startMusic);
    };

    document.addEventListener("click", startMusic);

    return () => document.removeEventListener("click", startMusic);
  }, []);

  return (
    <audio ref={audioRef} loop>
      <source src="/music/ge.mp3" type="audio/mpeg" />
    </audio>
  );
}
