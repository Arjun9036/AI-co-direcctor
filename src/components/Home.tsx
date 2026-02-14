// AI-CoDirector — TypeScript-ready single-file (componentized) with
// - Smooth theme transition
// - Respects system preference on first load
// - Keyboard shortcut (Ctrl+T) to toggle theme (accessible)
// - Clear component exports for easy splitting into files later
// - TypeScript types included (save as .tsx in your project)

import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";

// -------------------- Types
type Theme = "dark" | "light";
type ScriptResult = { structured_script?: string; final_script?: string; [k: string]: any } | null;
type EmotionResult = { predicted_emotion?: string; confidence?: number | string; match?: boolean; recommendations?: any } | null;

// -------------------- Config
const SCRIPT_API = "https://Arjun9036-script-writer-api.hf.space";
const EMOTION_API = "https://arjun9036-multimodal-emotion-backend.hf.space/predict";

// -------------------- Utility: inject smooth theme transition CSS once
function useInjectThemeTransition() {
  useEffect(() => {
    const id = 'ai-codirector-theme-transition-style';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = `
      .ai-theme-transition * {
        transition: background-color 280ms ease, color 280ms ease, border-color 280ms ease, box-shadow 280ms ease;
      }
    `;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);
}

// -------------------- Root App (default export)
export default function AICoDirectorApp(): JSX.Element {
  // Respect stored preference, else system preference, else default to dark
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = window.localStorage.getItem('ai_codirector_theme') as Theme | null;
      if (stored === 'dark' || stored === 'light') return stored;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch { return 'dark'; }
  });

  const [tab, setTab] = useState<'script'|'emotion'>('script');

  // Persist and set class on body
  useEffect(() => {
    try { window.localStorage.setItem('ai_codirector_theme', theme); } catch {}
    document.documentElement.setAttribute('data-ai-theme', theme);
  }, [theme]);

  // Inject the theme transition rule
  useInjectThemeTransition();

  // Keyboard shortcut: Ctrl+T or Cmd+T to toggle theme (accessible)
  useEffect(() => {
    const handler = (e: KeyboardEvent | KeyboardEventInit) => {
      // @ts-ignore - different event types across browsers
      const isCtrl = e.ctrlKey || e.metaKey;
      // Use key 't' (case-insensitive)
      // @ts-ignore
      const key = (e.key || '').toLowerCase();
      if (isCtrl && key === 't') {
        e.preventDefault();
        setTheme((s) => (s === 'dark' ? 'light' : 'dark'));
      }
    };
    window.addEventListener('keydown', handler as any);
    return () => window.removeEventListener('keydown', handler as any);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className={`ai-theme-transition ${isDark ? 'bg-gradient-to-b from-[#07060a] via-[#0b0711] to-[#0f0816] text-gray-100' : 'bg-gradient-to-b from-gray-50 via-gray-100 to-white text-gray-900'}`}>
      <Header theme={theme} setTheme={setTheme} active={tab} setActive={setTab} />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3">
          {tab === 'script' ? <ScriptWriter theme={theme} /> : <EmotionDetector theme={theme} />}
        </section>
        <aside className="space-y-6">
          <GlassCard theme={theme}>
            <h4 className={isDark ? 'text-gray-100' : 'text-gray-900'}>Quick Controls</h4>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Primary flows: Script generation & Emotion analysis. Toggle theme with the button or <strong>Ctrl/Cmd + T</strong>.</p>
          </GlassCard>

          <GlassCard theme={theme}>
            <h4 className={isDark ? 'text-gray-100' : 'text-gray-900'}>Best Practices</h4>
            <ul className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              <li>Short (3–8s) frontal clips work best.</li>
              <li>Prefer searchable PDFs for accurate extraction.</li>
            </ul>
          </GlassCard>

          <GlassCard theme={theme}>
            <h4 className={isDark ? 'text-gray-100' : 'text-gray-900'}>Brand</h4>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>AI-CoDirector — cinematic UI, now with smooth transitions & accessibility improvements.</p>
          </GlassCard>
        </aside>
      </main>

      <footer className={isDark ? 'py-6 text-center text-sm text-gray-500 border-t border-gray-900' : 'py-6 text-center text-sm text-gray-500 border-t border-gray-200'}>
        Built by <strong className={isDark ? 'text-gray-200' : 'text-gray-700'}>Arjun Goyal</strong>
      </footer>
    </div>
  );
}

// -------------------- Header
export function Header({ theme, setTheme, active, setActive }:{ theme:Theme; setTheme:(t:Theme)=>void; active:'script'|'emotion'; setActive:(s:'script'|'emotion')=>void }){
  const isDark = theme === 'dark';
  return (
    <header className={isDark ? 'backdrop-blur-sm bg-black/30 border-b border-gray-900' : 'bg-white/80 border-b border-gray-200 backdrop-blur-sm'}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xl ${isDark ? 'bg-gradient-to-br from-purple-700 via-indigo-700 to-rose-600' : 'bg-gradient-to-br from-teal-400 to-cyan-500'}`}>
            <span className={`font-bold ${isDark ? 'text-white' : 'text-white'}`}>CD</span>
          </div>

          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>AI‑CoDirector</h1>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Cinematic tools — Script & Emotion</p>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <TabButton active={active==='script'} onClick={()=>setActive('script')} theme={theme}>Script Writer</TabButton>
          <TabButton active={active==='emotion'} onClick={()=>setActive('emotion')} theme={theme}>Emotion Detector</TabButton>

          <button aria-label="Toggle theme (Ctrl/Cmd + T)" title="Toggle theme (Ctrl/Cmd + T)" onClick={()=> setTheme(isDark ? 'light' : 'dark')} className={`ml-4 px-3 py-2 rounded-md border ${isDark ? 'border-white/10 bg-white/5 text-gray-100' : 'border-gray-200 bg-white text-gray-700'}`}>
            {isDark ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
    </header>
  );
}

export function TabButton({ children, active, onClick, theme }:{ children:React.ReactNode; active:boolean; onClick:()=>void; theme:Theme }){
  const isDark = theme === 'dark';
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-md text-sm font-semibold transition ${active ? (isDark ? 'bg-gradient-to-r from-purple-600 to-amber-500 text-black shadow' : 'bg-teal-50 text-teal-600') : (isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50')}`}>
      {children}
    </button>
  );
}

// -------------------- GlassCard
export function GlassCard({ children, theme }:{ children:React.ReactNode; theme?:Theme }){
  const isDark = (theme ?? 'dark') === 'dark';
  return <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/3 border border-white/6 shadow-lg backdrop-blur' : 'bg-white shadow-sm border border-gray-100'}`}>{children}</div>;
}

// -------------------- ScriptWriter component
export function ScriptWriter({ theme }:{ theme:Theme }){
  const isDark = theme === 'dark';
  const [genre, setGenre] = useState('Drama');
  const [text, setText] = useState('');
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<ScriptResult>(null);
  const [err, setErr] = useState('');

  const submit = async (e?:React.FormEvent) => {
    e?.preventDefault(); setErr(''); setOut(null);
    if (!pdf && !text.trim()) return setErr('Please paste script text or upload a PDF.');
    setLoading(true);
    try{
      let resp: Response;
      if (pdf){ const fd = new FormData(); fd.append('file', pdf); fd.append('genre', genre); resp = await fetch(`${SCRIPT_API}/generate-script-from-pdf/`, { method: 'POST', body: fd }); }
      else { resp = await fetch(`${SCRIPT_API}/generate-script/`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ original_script: text, genre }) }); }
      const data = await resp.json(); if (!resp.ok) throw new Error(data?.detail || 'Server error'); setOut(data);
    }catch(e:any){ setErr(e?.message || String(e)); }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="rounded-3xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${isDark ? 'bg-black/40' : 'bg-white/50'} p-6 rounded-2xl border ${isDark ? 'border-white/6' : 'border-gray-100'} shadow-inner`}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>Script Writer</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mt-2`}>Generate screenplay text tailored to a genre.</p>

          <div className="mt-4 space-y-3">
            <label className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Genre</label>
            <select value={genre} onChange={(e)=>setGenre(e.target.value)} className={`w-full p-3 rounded-md ${isDark ? 'bg-black/60 text-white border border-white/8' : 'bg-white border'}`}>
              <option>Drama</option>
              <option>Thriller</option>
              <option>Comedy</option>
              <option>Action</option>
              <option>Romance</option>
            </select>

            <label className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Or paste your script</label>
            <textarea rows={6} value={text} onChange={(e)=>setText(e.target.value)} className={`w-full p-3 rounded-md ${isDark ? 'bg-black/60 text-white border border-white/8 placeholder-gray-400' : 'bg-white border'}`} placeholder="Paste screenplay (optional)" />

            <FileDrop accept="application/pdf" label="Upload PDF (optional)" onFileSelected={(f)=>setPdf(f)} theme={theme} />

            <div className="flex gap-3 mt-2">
              <button onClick={()=>submit()} disabled={loading} className={`flex-1 py-3 rounded-lg font-semibold ${isDark ? 'bg-gradient-to-r from-purple-600 to-amber-500 text-black' : 'bg-teal-600 text-white'}`}>{loading ? 'Generating…' : 'Generate'}</button>
              <button onClick={()=>{ setText(''); setPdf(null); setOut(null); setErr(''); }} className={`px-4 py-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white border'}`}>Reset</button>
            </div>

            {err && <div className="text-sm text-rose-400">{err}</div>}
          </div>
        </div>

        <div className={`${isDark ? 'col-span-2 bg-gradient-to-b from-black/70 to-black/50' : 'col-span-2 bg-white'} p-6 rounded-2xl border ${isDark ? 'border-white/6' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>Teleprompter</h3>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Monospace view for easy reading</div>
          </div>

          <div className={`h-96 overflow-auto rounded-md p-4 ${isDark ? 'bg-black/80 border border-white/8' : 'bg-gray-50 border border-gray-100'}`}>
            <pre className={`font-mono text-sm ${isDark ? 'text-white/90' : 'text-gray-800'} whitespace-pre-wrap leading-relaxed`}>
              {out ? (out.structured_script || out.final_script || JSON.stringify(out, null, 2)) : 'Your generated script will appear here — formatted for reading.'}
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// -------------------- EmotionDetector
export function EmotionDetector({ theme }:{ theme:Theme }){
  const isDark = theme === 'dark';
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState('');
  const [emotion, setEmotion] = useState('');
  const [result, setResult] = useState<EmotionResult>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(()=>{ if(!file){ setSrc(''); return;} const url = URL.createObjectURL(file); setSrc(url); return ()=> URL.revokeObjectURL(url); }, [file]);
  useEffect(()=>{ const v = videoRef.current; if(!v) return; const onTime = ()=> setProgress(v.duration ? (v.currentTime / v.duration) : 0); v.addEventListener('timeupdate', onTime); return ()=> v.removeEventListener('timeupdate', onTime); }, [src]);

  const onFileSelected = (f: File | null) =>{ setError(''); setResult(null); if(!f) return setFile(null); if(!f.type.startsWith('video/')) return setError('Please upload a valid video file'); if(f.size > 50*1024*1024) return setError('File too large (50MB max)'); setFile(f); };

  const analyze = async ()=>{ if(!file || !emotion.trim()) return setError('Upload video and enter intended emotion'); setLoading(true); setError(''); setResult(null); try{ const fd = new FormData(); fd.append('video', file); fd.append('user_emotion', emotion); const r = await fetch(EMOTION_API, { method: 'POST', body: fd }); const data = await r.json(); if(!r.ok) throw new Error(data?.detail || 'Server error'); setResult(data);}catch(e:any){ setError(e?.message || String(e)); } setLoading(false); };

  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="rounded-3xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${isDark ? 'bg-gradient-to-b from-black/80 to-black/60' : 'bg-white'} p-6 rounded-2xl border ${isDark ? 'border-white/6' : 'border-gray-100'}`}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>Video Stage</h2>
          <div className="relative rounded-md overflow-hidden bg-black/90 border border-white/8 mt-4" style={{ minHeight: 320 }}>
            {src ? (
              <>
                <video ref={videoRef} src={src} controls preload="metadata" className="w-full h-full object-contain bg-black" />
                <button onClick={()=>videoRef.current?.play()} aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full" title="Play preview"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={isDark ? 'white' : 'black'} strokeWidth="1.5"><path d="M5 3v18l15-9z" /></svg></button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center text-gray-400 p-6">
                <div className="text-2xl font-semibold">No video selected</div>
                <div className="mt-2 text-sm">Upload a short clip to preview and analyze.</div>
              </div>
            )}
          </div>

          <div className="mt-3">
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
              <div className="h-full bg-gradient-to-r from-purple-600 to-amber-500" style={{ width: `${progress*100}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              <div>{Math.floor(progress*100)}%</div>
              <div>{file ? file.name : ''}</div>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-black/40' : 'bg-white/50'} p-6 rounded-2xl border ${isDark ? 'border-white/6' : 'border-gray-100'}`}>
          <h2 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>Analyze Emotion</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mt-2`}>Tell the actor's intended emotion and run analysis.</p>

          <div className="mt-4 space-y-3">
            <FileDrop accept="video/*" onFileSelected={onFileSelected} label="Upload video" theme={theme} />
            <label className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Intended emotion</label>
            <input value={emotion} onChange={(e)=>setEmotion(e.target.value)} placeholder="e.g., joy, anger, sadness" className={`w-full p-3 rounded-md ${isDark ? 'bg-black/60 text-white border border-white/8' : 'bg-white border'}`} />

            <div className="flex gap-3 mt-2">
              <button onClick={analyze} disabled={loading} className={`flex-1 py-3 rounded-lg font-semibold ${isDark ? 'bg-gradient-to-r from-purple-600 to-amber-500 text-black' : 'bg-teal-600 text-white'}`}>{loading ? 'Analyzing…' : 'Analyze'}</button>
              <button onClick={()=>{ setFile(null); setSrc(''); setEmotion(''); setResult(null); setError(''); }} className={`px-4 py-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white border'}`}>Clear</button>
            </div>

            {error && <div className="text-sm text-rose-400">{error}</div>}

            {result && (
              <div className={`mt-4 ${isDark ? 'bg-white/5 text-gray-100' : 'bg-gray-50 text-gray-900'} p-3 rounded-md border ${isDark ? 'border-white/6' : 'border-gray-100'}`}>
                <div className="text-sm"><strong>Prediction:</strong> {result.predicted_emotion}</div>
                <div className="text-sm"><strong>Confidence:</strong> {(typeof result.confidence === 'number' ? (result.confidence*100).toFixed(2) : String(result.confidence)) + '%'}</div>
                <div className="text-sm"><strong>Match:</strong> {result.match ? 'Yes' : 'No'}</div>
                {result.recommendations && <div className="mt-2 text-sm whitespace-pre-wrap">{typeof result.recommendations === 'object' ? (result.recommendations.full_recommendation || JSON.stringify(result.recommendations, null, 2)) : result.recommendations}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// -------------------- FileDrop component (componentized)
export function FileDrop({ accept='*/*', onFileSelected, label='Upload file', theme }:{ accept?:string; onFileSelected:(f:File|null)=>void; label?:string; theme?:Theme }){
  const inputRef = useRef<HTMLInputElement|null>(null);
  const [drag, setDrag] = useState(false);
  const isDark = (theme ?? 'dark') === 'dark';
  const onFiles = (files: FileList | null) => { if(!files || files.length===0) return onFileSelected(null); onFileSelected(files[0]); };

  return (
    <div>
      <label className={`block text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{label}</label>
      <div
        onDragOver={(e)=>{ e.preventDefault(); setDrag(true); }}
        onDragLeave={()=>setDrag(false)}
        onDrop={(e)=>{ e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files); }}
        onClick={()=> inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e)=>{ if(e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        className={`w-full rounded-lg p-4 flex items-center justify-between gap-4 cursor-pointer transition border ${drag ? (isDark ? 'border-purple-500 bg-white/5' : 'border-teal-300 bg-teal-50') : (isDark ? 'border-white/6 bg-black/20' : 'border-gray-200 bg-white')}`}>

        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#e6e6e6' : '#0f172a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>

          <div className="text-left">
            <div className={`font-medium text-sm ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Drop file here or click to browse</div>
            <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Accepts: {accept}. Max size: 50MB</div>
          </div>
        </div>

        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e)=> onFiles(e.target.files)} />
      </div>
    </div>
  );
}

// End of file
