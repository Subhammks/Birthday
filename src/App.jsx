import { Routes, Route } from "react-router-dom";

import Portal from "./pages/Portal";
import Elevator from "./pages/Elevator";
import MemoryFloor1 from "./pages/MemoryFloor1";
import Memory from "./pages/Memory";
import Floor2 from "./pages/Floor2";
import Floor3 from "./pages/Floor3";
import Birthday from "./pages/Birthday";
import FinalNote from "./pages/FinalNote";

import MusicPlayer from "./components/MusicPlayer";
import CursorGlow from "./components/CursorGlow";
import BalloonFollower from "./components/BalloonFollower";

function App() {
  return (
    <>
      <CursorGlow />
      <BalloonFollower />
      <MusicPlayer />

      <Routes>
        {/* PAGE 01 */}
        <Route path="/" element={<Portal />} />

        {/* TRANSITION PAGE */}
        <Route path="/elevator" element={<Elevator />} />

        {/* FIRST MEMORY SCENE */}
        <Route path="/memory-floor-1" element={<MemoryFloor1 />} />

        {/* MEMORY PAGE */}
        <Route path="/memory" element={<Memory />} />

        {/* OTHER PAGES */}
        <Route path="/floor2" element={<Floor2 />} />
        <Route path="/floor3" element={<Floor3 />} />
        <Route path="/birthday" element={<Birthday />} />
        <Route path="/final-note" element={<FinalNote />} />
      </Routes>
    </>
  );
}

export default App;
