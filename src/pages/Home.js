import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clapperboard, FileText, Video } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="ambient-glow"></div>
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 md:px-12 z-10 glass-panel border-t-0 border-x-0 rounded-none bg-black/50 sticky top-0">
        <div className="flex items-center gap-2">
          <span className="text-orange-500"><Clapperboard size={24} /></span>
          <h1 className="text-2xl font-bold tracking-wider">STORYFLOW</h1>
        </div>
        <div className="hidden md:flex gap-4">
          <button className="text-gray-400 hover:text-white hover:bg-white/5 px-6 py-3 rounded-full font-semibold transition-all">Login</button>
          <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-900/20 px-6 py-3 rounded-full font-semibold transition-all">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 mt-12 mb-20 z-10">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Your Story,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
              AI Powered.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Professional screenwriting tools and performance analysis for the modern creator.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl animate-fade-in" style={{animationDelay: '0.2s'}}>
          {/* Script Card */}
          <div 
            onClick={() => navigate('/script-transformer')}
            className="glass-panel glass-card-hover rounded-2xl p-8 cursor-pointer text-left transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/40 transition-colors">
              <span className="text-orange-400"><FileText size={24} /></span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Script Transformer</h3>
            <p className="text-gray-400">Transform drafts into production-ready screenplays instantly.</p>
          </div>

          {/* Video Card */}
          <div 
            onClick={() => navigate('/video-analyzer')}
            className="glass-panel glass-card-hover rounded-2xl p-8 cursor-pointer text-left transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/40 transition-colors">
              <span className="text-blue-400"><Video size={24} /></span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Video Analyzer</h3>
            <p className="text-gray-400">Get real-time emotional feedback on acting performances.</p>
          </div>
        </div>
      </main>
      
      <footer className="text-center p-6 text-gray-600 text-sm glass-panel border-x-0 border-b-0">
        © 2026 StoryFlow AI. Built for Directors and Writers.
      </footer>
    </div>
  );
};

export default Home;