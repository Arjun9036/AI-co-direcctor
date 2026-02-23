import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ScriptTransformer from './pages/ScriptTransformer';
import VideoAnalyzer from './pages/VideoAnalyzer';
import './index.css'; // Ensure CSS is imported

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/script-transformer" element={<ScriptTransformer />} />
        <Route path="/video-analyzer" element={<VideoAnalyzer />} />
      </Routes>
    </Router>
  );
};

export default App;