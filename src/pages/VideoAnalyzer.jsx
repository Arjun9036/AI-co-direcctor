import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, X, Loader2, CheckCircle, Sparkles, XCircle, Mic } from 'lucide-react';

const VIDEO_API_URL = "https://arjun9036-multimodal-emotion-backend.hf.space/predict";

const EMOTION_COLORS = {
  anger: 'bg-red-500',
  disgust: 'bg-purple-500',
  fear: 'bg-orange-500',
  joy: 'bg-yellow-400',
  neutral: 'bg-gray-400',
  sadness: 'bg-blue-400',
  surprise: 'bg-pink-400',
};

const VideoAnalyzer = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [intendedEmotion, setIntendedEmotion] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("user_emotion", intendedEmotion);

      const response = await fetch(VIDEO_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Server Error");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Analysis Failed:", err);
      setError("Failed to analyze video. Ensure the file isn't too large and the backend is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <div className="ambient-glow" style={{ background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, rgba(0, 0, 0, 0) 70%)' }}></div>
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">Video <span className="text-blue-500">Analyzer</span></h2>
          <p className="text-gray-400">Upload performance footage for AI-driven emotional feedback.</p>
        </div>

        {/* Upload Panel */}
        <div className="glass-panel rounded-2xl p-6 mb-8">
          {!preview ? (
            <div className="border-2 border-dashed border-white/10 rounded-xl p-12 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-center group cursor-pointer relative">
              <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-gray-400 group-hover:text-blue-400"><UploadCloud size={32} /></span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Upload Performance</h3>
              <p className="text-gray-500 text-sm">Drag & drop or click to browse (MP4, MOV)</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-white/10">
                <video src={preview} controls className="w-full h-full object-contain" />
                <button
                  onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1 rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-col justify-center gap-4">
                <div>
                  <label className="text-sm text-gray-400">Intended Emotion</label>
                  <select
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none mt-1"
                    value={intendedEmotion}
                    onChange={(e) => setIntendedEmotion(e.target.value)}
                  >
                    <option value="">Select an emotion...</option>
                    <option value="anger">Anger</option>
                    <option value="disgust">Disgust</option>
                    <option value="fear">Fear</option>
                    <option value="joy">Joy</option>
                    <option value="neutral">Neutral</option>
                    <option value="sadness">Sadness</option>
                    <option value="surprise">Surprise</option>
                  </select>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20 px-6 py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {loading ? "Analyzing Frames..." : "Start Analysis"}
                </button>
              </div>
            </div>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-4 text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="h-2 w-64 bg-white/10 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-blue-400 mt-3 text-sm animate-pulse">Processing neural network layers...</p>
          </div>
        )}

        {/* Results Section */}
        {result && !loading && (
          <div className="flex flex-col gap-4 animate-fade-in">

            {/* Top Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel rounded-2xl p-5 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Intended</p>
                <p className="text-xl font-bold text-gray-300 capitalize">{intendedEmotion || "N/A"}</p>
              </div>
              <div className="glass-panel rounded-2xl p-5 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Predicted</p>
                <p className="text-2xl font-bold text-white capitalize">{result.predicted_emotion}</p>
              </div>
              <div className="glass-panel rounded-2xl p-5 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Confidence</p>
                {/* Backend returns 0–100 already, don't multiply again */}
                <p className="text-2xl font-bold text-blue-400">{parseFloat(result.confidence).toFixed(1)}%</p>
              </div>
              <div className={`glass-panel rounded-2xl p-5 text-center ${result.match ? '!bg-green-500/10 !border-green-500/20' : '!bg-red-500/10 !border-red-500/20'}`}>
                <p className={`text-xs uppercase tracking-widest mb-1 ${result.match ? 'text-green-400/70' : 'text-red-400/70'}`}>Match</p>
                <div className={`flex items-center justify-center gap-2 font-bold text-xl ${result.match ? 'text-green-400' : 'text-red-400'}`}>
                  {result.match ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  {result.match ? "Match" : "Mismatch"}
                </div>
              </div>
            </div>

            {/* Transcribed Text */}
            {result.transcribed_text && (
              <div className="glass-panel rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-2">
                  <Mic size={15} /> Transcribed Audio
                </h4>
                <p className="text-white italic">"{result.transcribed_text}"</p>
              </div>
            )}

            {/* Probability Breakdown */}
            {result.probabilities_breakdown && (
              <div className="glass-panel rounded-2xl p-6">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Emotion Probability Breakdown</h4>
                <div className="flex flex-col gap-3">
                  {Object.entries(result.probabilities_breakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([emotion, pct]) => (
                      <div key={emotion} className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs capitalize w-16 text-right">{emotion}</span>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${EMOTION_COLORS[emotion] || 'bg-blue-500'}`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-xs w-12 text-right">{pct.toFixed(1)}%</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Key Summary Badge */}
            {result.recommendations?.key_summary && result.recommendations.key_summary !== "No summary provided." && (
              <div className="glass-panel rounded-2xl p-4 border border-blue-500/20 bg-blue-500/5 flex items-start gap-3">
                <Sparkles size={18} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-blue-200 text-sm font-medium">{result.recommendations.key_summary}</p>
              </div>
            )}

            {/* Full AI Recommendations */}
            <div className="glass-panel rounded-2xl p-6">
              <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                <Sparkles size={18} /> AI Coach Recommendations
              </h4>
              <div className="text-gray-300 text-sm whitespace-pre-line leading-relaxed pl-3 border-l-2 border-white/10">
                {result.recommendations ? (
                  typeof result.recommendations === 'object'
                    ? (result.recommendations.full_recommendation || JSON.stringify(result.recommendations))
                    : result.recommendations
                ) : (
                  result.match
                    ? "Great job! Your performance matches the intended emotion perfectly."
                    : "No specific recommendations provided."
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalyzer;
