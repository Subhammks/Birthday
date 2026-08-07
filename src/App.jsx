import { Routes, Route } from "react-router-dom";
import Portal from "./pages/Portal";
import Elevator from "./pages/Elevator";
import Memory from "./pages/Memory";
import Floor2 from "./pages/Floor2";
import Floor3 from "./pages/Floor3";
import Birthday from "./pages/Birthday"
import FinalNote from "./pages/FinalNote";
import MusicPlayer from "./components/MusicPlayer";

import CursorGlow from "./components/BalloonFollower";
import BalloonFollower from "./components/CursorGlow";

function App() {
  return (
    <>
      <CursorGlow />
      <BalloonFollower />
      <MusicPlayer />

      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/elevator" element={<Elevator />} />
        <Route path="/memory" element={<Memory />} />
        <Route path="/floor2" element={<Floor2 />} />
        <Route path="/floor3" element={<Floor3 />} />
        <Route path="/birthday" element={<Birthday />} />
        <Route path="/final-note" element={<FinalNote />} />

      </Routes>
    </>
  );
}

export default App;
