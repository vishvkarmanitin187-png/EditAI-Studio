import React, { useState, useRef, useEffect } from 'react';

export default function App() {
  const [route, setRoute] = useState('home'); // 'home', 'video', 'photo', 'thumbnail', 'audio'

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'editor/video') setRoute('video');
      else if (hash === 'editor/photo') setRoute('photo');
      else if (hash === 'editor/thumbnail') setRoute('thumbnail');
      else if (hash === 'editor/audio') setRoute('audio');
      else setRoute('home');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newRoute) => {
    if (newRoute === 'home') window.location.hash = '';
    else window.location.hash = newRoute;
    setRoute(newRoute);
  };

  return (
    <div className="flex flex-col h-screen bg-[#07090e] text-gray-100 font-sans overflow-hidden select-none">
      {route === 'home' && <HomeScreen onNavigate={navigate} />}
      {route === 'video' && <VideoEditorScreen onBack={() => navigate('home')} />}
      {route === 'photo' && <PhotoEditorScreen onBack={() => navigate('home')} />}
      {route === 'thumbnail' && <ThumbnailEditorScreen onBack={() => navigate('home')} />}
      {route === 'audio' && <AudioEditorScreen onBack={() => navigate('home')} />}
    </div>
  );
}

// ==================== 1. HOME SCREEN ====================
function HomeScreen({ onNavigate }) {
  const [recentProjects] = useState([
    { id: 1, title: 'Travel Vlog #1', type: 'video', time: '02:45' },
    { id: 2, title: 'Tech Review Thumbnail', type: 'thumbnail', time: '16:9' },
    { id: 3, title: 'Reels Beat Sync', type: 'video', time: '00:30' }
  ]);

  const handleImport = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'video' ? 'video/*' : type === 'photo' ? 'image/*' : 'audio/*';
    input.onchange = (e) => {
      if (e.target.files[0]) {
        if (type === 'video') onNavigate('video');
        else if (type === 'photo') onNavigate('photo');
        else onNavigate('audio');
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] text-gray-100 overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#111827] border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg">
            EF
          </div>
          <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            EditFlux
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => handleImport('video')} className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1.5 rounded-xl font-semibold border border-gray-700 transition">
            📂 Import
          </button>
          <button onClick={() => onNavigate('video')} className="bg-pink-600 hover:bg-pink-500 text-xs px-3.5 py-1.5 rounded-xl font-bold shadow-lg shadow-pink-600/30 transition">
            + New
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Four Compact Action Cards */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Studio Modes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div onClick={() => onNavigate('video')} className="bg-gray-900/90 border border-gray-800 hover:border-pink-500/50 p-4 rounded-xl cursor-pointer transition flex flex-col items-center text-center group">
              <span className="text-2xl mb-2">🎬</span>
              <span className="font-bold text-sm text-gray-200 group-hover:text-pink-400">Video</span>
            </div>
            <div onClick={() => onNavigate('photo')} className="bg-gray-900/90 border border-gray-800 hover:border-purple-500/50 p-4 rounded-xl cursor-pointer transition flex flex-col items-center text-center group">
              <span className="text-2xl mb-2">🎨</span>
              <span className="font-bold text-sm text-gray-200 group-hover:text-purple-400">Photo</span>
            </div>
            <div onClick={() => onNavigate('thumbnail')} className="bg-gray-900/90 border border-gray-800 hover:border-amber-500/50 p-4 rounded-xl cursor-pointer transition flex flex-col items-center text-center group">
              <span className="text-2xl mb-2">🖼️</span>
              <span className="font-bold text-sm text-gray-200 group-hover:text-amber-400">Thumbnail</span>
            </div>
            <div onClick={() => onNavigate('audio')} className="bg-gray-900/90 border border-gray-800 hover:border-cyan-500/50 p-4 rounded-xl cursor-pointer transition flex flex-col items-center text-center group">
              <span className="text-2xl mb-2">🎵</span>
              <span className="font-bold text-sm text-gray-200 group-hover:text-cyan-400">Audio</span>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentProjects.map(p => (
              <div key={p.id} onClick={() => onNavigate(p.type === 'thumbnail' ? 'thumbnail' : 'video')} className="bg-gray-900 border border-gray-800 p-3.5 rounded-xl cursor-pointer hover:border-gray-700 transition flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-gray-200">{p.title}</h4>
                  <span className="text-[10px] text-gray-500">{p.type} • {p.time}</span>
                </div>
                <span className="text-pink-500 font-bold text-sm">→</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ==================== 2. VIDEO EDITOR SCREEN ====================
function VideoEditorScreen({ onBack }) {
  const [videoSrc, setVideoSrc] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [activeTool, setActiveTool] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [filter, setFilter] = useState('normal');
  const [overlayText, setOverlayText] = useState('EditFlux Video');

  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleExport = () => {
    const a = document.createElement('a');
    a.href = videoSrc;
    a.download = 'editflux-export.mp4';
    a.click();
  };

  return (
    <div className="flex flex-col h-full bg-black text-gray-100">
      {/* TOP BAR */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg font-semibold">
            ← Back
          </button>
          <span className="font-bold text-xs text-gray-200">Project: Cinematic Vlog</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => alert('Undo')} className="w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-xs">↩</button>
          <button onClick={() => alert('Redo')} className="w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-xs">↪</button>
          <button onClick={handleExport} className="bg-pink-600 hover:bg-pink-500 text-xs px-3.5 py-1 rounded-lg font-bold shadow-lg shadow-pink-600/30">
            Export
          </button>
        </div>
      </header>

      {/* MIDDLE: LARGE VIDEO PREVIEW AREA */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        <div className={`transition-all bg-black flex items-center justify-center shadow-2xl ${
          aspectRatio === '9:16' ? 'h-full aspect-[9/16]' :
          aspectRatio === '1:1' ? 'h-full aspect-square' : 'w-full h-full aspect-video'
        }`}>
          <video
            ref={videoRef}
            src={videoSrc}
            className="max-h-full max-w-full object-contain"
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${filter === 'grayscale' ? 'grayscale(100%)' : ''}`,
              transform: `rotate(${rotation}deg)`
            }}
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 15)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
        {overlayText && (
          <div className="absolute bottom-4 bg-black/70 backdrop-blur px-3 py-1 rounded text-xs font-bold text-pink-400 border border-white/10">
            {overlayText}
          </div>
        )}
      </div>

      {/* BELOW PREVIEW: PLAY / TIME / FULLSCREEN */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111827] border-t border-gray-800 text-xs text-gray-400">
        <div className="flex items-center space-x-3">
          <button onClick={handlePlayPause} className="w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <span className="font-mono">{Math.floor(currentTime)}s / {Math.floor(duration)}s</span>
        </div>
        <div className="flex items-center space-x-2">
          {['16:9', '9:16', '1:1'].map(r => (
            <button key={r} onClick={() => setAspectRatio(r)} className={`px-2 py-0.5 rounded text-[10px] font-semibold ${aspectRatio === r ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{r}</button>
          ))}
          <button onClick={() => videoRef.current?.requestFullscreen?.()} className="hover:text-white ml-2">⛶</button>
        </div>
      </div>

      {/* TIMELINE AREA */}
      <div className="h-32 bg-[#0d1322] border-t border-gray-800 p-2.5 flex flex-col justify-between">
        <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium">
          <span>Timeline (Scrollable)</span>
          <span className="text-pink-400">Playhead Active</span>
        </div>
        <div className="space-y-1 overflow-x-auto py-1">
          <div className="h-8 bg-pink-950/40 border border-pink-800/60 rounded flex items-center px-3 text-xs text-pink-300 font-semibold justify-between">
            <span>🎬 Video Clip 1 [Selected]</span>
            <span className="text-[9px] bg-pink-900 px-1.5 py-0.5 rounded">Speed: {speed}x</span>
          </div>
          <div className="h-6 bg-cyan-950/40 border border-cyan-800/60 rounded flex items-center px-3 text-[11px] text-cyan-300">
            <span>🎵 Audio Track</span>
          </div>
          <div className="h-6 bg-purple-950/40 border border-purple-800/60 rounded flex items-center px-3 text-[11px] text-purple-300">
            <span>💬 Captions Track</span>
          </div>
        </div>
      </div>

      {/* BOTTOM TOOLBAR */}
      <div className="bg-[#111827] border-t border-gray-800">
        <div className="flex overflow-x-auto py-2 px-2 space-x-2 border-b border-gray-800 scrollbar-none">
          {[
            { id: 'edit', label: 'Edit' },
            { id: 'audio', label: 'Audio' },
            { id: 'text', label: 'Text' },
            { id: 'sticker', label: 'Sticker' },
            { id: 'caption', label: 'Caption' },
            { id: 'effects', label: 'Effects' },
            { id: 'filter', label: 'Filter' },
            { id: 'adjust', label: 'Adjust' },
            { id: 'speed', label: 'Speed' },
            { id: 'volume', label: 'Volume' },
            { id: 'crop', label: 'Crop' },
            { id: 'rotate', label: 'Rotate' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTool(activeTool === t.id ? null : t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${activeTool === t.id ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* BOTTOM PANEL CONTROLS */}
        {activeTool && (
          <div className="p-3 bg-gray-900 border-t border-gray-800 flex items-center justify-between text-xs">
            {activeTool === 'speed' && (
              <div className="flex items-center space-x-3 w-full">
                <span>Speed:</span>
                {[0.5, 1.0, 1.5, 2.0].map(s => (
                  <button key={s} onClick={() => setSpeed(s)} className={`px-2.5 py-1 rounded font-bold ${speed === s ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{s}x</button>
                ))}
              </div>
            )}
            {activeTool === 'rotate' && (
              <div className="flex items-center space-x-3 w-full">
                <span>Rotate:</span>
                {[0, 90, 180, 270].map(deg => (
                  <button key={deg} onClick={() => setRotation(deg)} className={`px-2.5 py-1 rounded font-bold ${rotation === deg ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{deg}°</button>
                ))}
              </div>
            )}
            {activeTool === 'volume' && (
              <div className="flex items-center space-x-3 w-full max-w-sm">
                <span>Volume ({volume}%):</span>
                <input type="range" min="0" max="200" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-pink-500" />
              </div>
            )}
            {activeTool === 'adjust' && (
              <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                <div><span>Bright</span><input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-pink-500" /></div>
                <div><span>Contrast</span><input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-pink-500" /></div>
                <div><span>Sat</span><input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-pink-500" /></div>
              </div>
            )}
            {activeTool === 'text' && (
              <div className="flex items-center space-x-2 w-full max-w-sm">
                <input type="text" value={overlayText} onChange={e => setOverlayText(e.target.value)} placeholder="Overlay text..." className="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-xs w-full focus:outline-none focus:border-pink-500" />
              </div>
            )}
            {['edit', 'audio', 'sticker', 'caption', 'effects', 'filter', 'crop'].includes(activeTool) && (
              <div className="text-gray-400">Tool <span className="text-pink-400 font-bold uppercase">{activeTool}</span> active.</div>
            )}
            <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-white font-bold ml-2">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== 3. PHOTO EDITOR SCREEN ====================
function PhotoEditorScreen({ onBack }) {
  const [photoSrc, setPhotoSrc] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [filter, setFilter] = useState('normal');

  return (
    <div className="flex flex-col h-full bg-black text-gray-100">
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-gray-800">
        <button onClick={onBack} className="text-xs bg-gray-800 px-3 py-1 rounded-lg font-semibold">← Back</button>
        <span className="font-bold text-xs">Photo Editor</span>
        <button onClick={() => alert('Photo exported!')} className="bg-pink-600 text-xs px-3 py-1 rounded-lg font-bold">Export</button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <img
          src={photoSrc}
          alt="Photo"
          className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-gray-800"
          style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${filter === 'grayscale' ? 'grayscale(100%)' : ''}` }}
        />
      </div>

      <div className="bg-[#111827] border-t border-gray-800 p-4 space-y-3">
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-xs">
          <div><span>Brightness</span><input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-pink-500" /></div>
          <div><span>Contrast</span><input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-pink-500" /></div>
          <div><span>Saturation</span><input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-pink-500" /></div>
        </div>
      </div>
    </div>
  );
}

// ==================== 4. THUMBNAIL EDITOR SCREEN ====================
function ThumbnailEditorScreen({ onBack }) {
  const [titleText, setTitleText] = useState('VIRAL THUMBNAIL');
  const [textColor, setTextColor] = useState('#ec4899');

  return (
    <div className="flex flex-col h-full bg-black text-gray-100">
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-gray-800">
        <button onClick={onBack} className="text-xs bg-gray-800 px-3 py-1 rounded-lg font-semibold">← Back</button>
        <span className="font-bold text-xs">Thumbnail Maker (16:9)</span>
        <button onClick={() => alert('Thumbnail exported!')} className="bg-pink-600 text-xs px-3 py-1 rounded-lg font-bold">Export</button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-3xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80" alt="BG" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <h1 style={{ color: textColor }} className="text-4xl font-black uppercase tracking-wider drop-shadow-[0_5px_8px_rgba(0,0,0,0.9)]">
            {titleText}
          </h1>
        </div>
      </div>

      <div className="bg-[#111827] border-t border-gray-800 p-4 flex justify-center space-x-3">
        <input type="text" value={titleText} onChange={e => setTitleText(e.target.value)} className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded text-xs w-64" />
        <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent" />
      </div>
    </div>
  );
}

// ==================== 5. AUDIO EDITOR SCREEN ====================
function AudioEditorScreen({ onBack }) {
  const [volume, setVolume] = useState(100);

  return (
    <div className="flex flex-col h-full bg-black text-gray-100">
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-gray-800">
        <button onClick={onBack} className="text-xs bg-gray-800 px-3 py-1 rounded-lg font-semibold">← Back</button>
        <span className="font-bold text-xs">Audio Waveform Editor</span>
        <button onClick={() => alert('Audio exported!')} className="bg-pink-600 text-xs px-3 py-1 rounded-lg font-bold">Export</button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-20 h-20 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-xl">
          🎵
        </div>
        <div className="text-center">
          <h3 className="font-bold text-sm">Background Music Track.mp3</h3>
          <p className="text-[11px] text-gray-400">Duration: 02:30 • Waveform loaded</p>
        </div>
        <div className="w-full max-w-sm bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between text-gray-400"><span>Volume</span><span>{volume}%</span></div>
          <input type="range" min="0" max="200" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
      </div>
    </div>
  );
}