import { BrowserRouter, Routes, Route } from "react-router-dom";
import Explore from "./pages/Explore";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;