import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wand2, Download, FileText } from 'lucide-react';

const SCRIPT_API_URL_TEXT = "https://Arjun9036-script-writer-api.hf.space/generate-script/";

const ScriptTransformer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [genre, setGenre] = useState(''); // Changed default to empty string for manual input
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if(!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    // Use user input or default to "Screenplay" if empty
    const selectedGenre = genre.trim() || "Screenplay";

    try {
      const response = await fetch(SCRIPT_API_URL_TEXT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_script: text, genre: selectedGenre }),
      });

      if (!response.ok) throw new Error("Failed to generate script. Check API.");
      const data = await response.json();
      setResult(data.structured_script || data.final_script);
      
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the backend. Please check if the API is active.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `script_${genre || 'generated'}.txt`;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <div className="ambient-glow"></div>
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 animate-fade-in items-start">
        {/* Input Section */}
        <div className="space-y-6 h-full">
          <div>
            <h2 className="text-4xl font-bold mb-2">Script <span className="text-orange-500">Transformer</span></h2>
            <p className="text-gray-400">Convert standard text into industry-format screenplays.</p>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Target Genre</label>
            
            {/* Manual Text Input for Genre */}
            <input 
              type="text" 
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Sci-Fi, Rom-Com, Noir..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all mb-6"
            />

            <label className="block text-sm font-medium text-gray-400 mb-2">Your Draft / Ideas</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none script-font"
              placeholder="John sits at the cafe waiting for Sarah. He is nervous..."
            ></textarea>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-gray-500">
                Powered by AI
              </div>
              <button 
                onClick={handleGenerate} 
                disabled={loading || !text} 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-900/20 px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Wand2 size={18} />
                {loading ? "Transforming..." : "Generate Script"}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </div>
        </div>

        {/* Output Section */}
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-end mb-4 h-10">
            <div>
              <h3 className="text-xl font-bold text-white">Result</h3>
              <p className="text-sm text-gray-500">Industry Standard Format</p>
            </div>
            {result && (
              <button 
                onClick={handleDownload}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 text-sm"
              >
                <Download size={18} /> Save Script
              </button>
            )}
          </div>

          <div className="glass-panel bg-black/60 rounded-xl p-8 flex-grow min-h-[500px] border-l-4 border-l-orange-500 overflow-y-auto script-font shadow-inner">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p>AI is rewriting your scene...</p>
              </div>
            ) : result ? (
              <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">{result}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <span className="opacity-20 mb-2"><FileText size={48} /></span>
                <p>Generated script will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptTransformer;