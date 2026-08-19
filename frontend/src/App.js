import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import LegalPage from "@/pages/LegalPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/refunds" element={<LegalPage type="refunds" />} />
          <Route path="/support" element={<LegalPage type="support" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
