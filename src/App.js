import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import ScriptTransformer from './pages/ScriptTransformer';
import VideoAnalyzer from './pages/VideoAnalyzer';

const App = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuth(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Home />} />
        <Route path="/signup" element={<Signup setAuth={setAuth} />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/script-transformer" element={<ScriptTransformer />} />
        <Route path="/video-analyzer" element={<VideoAnalyzer />} />

      </Routes>
    </Router>
  );
};

export default App;