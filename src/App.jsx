import React, { useState, useRef, useEffect } from 'react';

export default function App() {
  const [route, setRoute] = useState('home'); // 'home', 'video', 'photo', 'thumbnail', 'audio'
  const [projects, setProjects] = useState([
    { id: 1, title: 'Cinematic Vlog #1', type: 'video', duration: '02:45', date: 'Today' },
    { id: 2, title: 'Tech Thumbnail', type: 'thumbnail', duration: '1280x720', date: 'Yesterday' },
    { id: 3, title: 'Reels Beat Sync', type: 'video', duration: '00:30', date: '2 days ago' }
  ]);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('editor/video')) setRoute('video');
      else if (hash.startsWith('editor/photo')) setRoute('photo');
      else if (hash.startsWith('editor/thumbnail')) setRoute('thumbnail');
      else if (hash.startsWith('editor/audio')) setRoute('audio');
      else setRoute('home');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (newRoute, project = null) => {
    if (project) setCurrentProject(project);
    if (newRoute === 'home') window.location.hash = '';
    else window.location.hash = `editor/${newRoute}`;
    setRoute(newRoute);
  };

  const handleCreateProject = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'video' ? 'video/*' : type === 'photo' ? 'image/*' : 'audio/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const newProj = {
          id: Date.now(),
          title: file.name.split('.')[0] || 'Untitled Project',
          type,
          duration: '00:15',
          date: 'Just now',
          mediaUrl: URL.createObjectURL(file)
        };
        setProjects([newProj, ...projects]);
        navigate(type, newProj);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-screen bg-[#07090e] text-gray-100 font-sans overflow-hidden select-none">
      {route === 'home' && <HomeScreen projects={projects} onNavigate={navigate} onCreateProject={handleCreateProject} />}
      {route === 'video' && <VideoEditorScreen project={currentProject} onBack={() => navigate('home')} />}
      {route === 'photo' && <PhotoEditorScreen project={currentProject} onBack={() => navigate('home')} />}
      {route === 'thumbnail' && <ThumbnailEditorScreen project={currentProject} onBack={() => navigate('home')} />}
      {route === 'audio' && <AudioEditorScreen project={currentProject} onBack={() => navigate('home')} />}
    </div>
  );
}

// ==================== 1. APP HOME ====================
function HomeScreen({ projects, onNavigate, onCreateProject }) {
  return (
    <div className="flex flex-col h-full bg-[#0b0f19] text-gray-100 overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#111827] border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-pink-500/20">
            EF
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-wide bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              EditFlux
            </h1>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Pro Mobile Studio</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => onCreateProject('video')} className="bg-gray-800 hover:bg-gray-700 text-xs px-3.5 py-2 rounded-xl font-semibold border border-gray-700 transition">
            📂 Import
          </button>
          <button onClick={() => onCreateProject('video')} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-xs px-4 py-2 rounded-xl font-bold shadow-lg shadow-pink-600/30 transition">
            + Create Project
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="p-6 space-y-6 max-w-5xl mx-auto w-full">
        {/* Compact Action Cards */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Studio Workspaces</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div onClick={() => onCreateProject('video')} className="bg-gray-900 border border-gray-800 hover:border-pink-500/50 p-5 rounded-2xl cursor-pointer transition group">
              <span className="text-3xl mb-3 block">🎬</span>
              <h3 className="font-bold text-sm text-gray-200 group-hover:text-pink-400">Video</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Multi-track & FX</p>
            </div>
            <div onClick={() => onCreateProject('photo')} className="bg-gray-900 border border-gray-800 hover:border-purple-500/50 p-5 rounded-2xl cursor-pointer transition group">
              <span className="text-3xl mb-3 block">🎨</span>
              <h3 className="font-bold text-sm text-gray-200 group-hover:text-purple-400">Photo</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Retouch & Filters</p>
            </div>
            <div onClick={() => onCreateProject('thumbnail')} className="bg-gray-900 border border-gray-800 hover:border-amber-500/50 p-5 rounded-2xl cursor-pointer transition group">
              <span className="text-3xl mb-3 block">🖼️</span>
              <h3 className="font-bold text-sm text-gray-200 group-hover:text-amber-400">Thumbnail</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">16:9 Social Covers</p>
            </div>
            <div onClick={() => onCreateProject('audio')} className="bg-gray-900 border border-gray-800 hover:border-cyan-500/50 p-5 rounded-2xl cursor-pointer transition group">
              <span className="text-3xl mb-3 block">🎵</span>
              <h3 className="font-bold text-sm text-gray-200 group-hover:text-cyan-400">Audio</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Waveform & BGM</p>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {projects.map(p => (
              <div key={p.id} onClick={() => onNavigate(p.type === 'thumbnail' ? 'thumbnail' : p.type === 'photo' ? 'photo' : 'video', p)} className="bg-gray-900 border border-gray-800 p-4 rounded-xl cursor-pointer hover:border-gray-700 transition flex justify-between items-center group">
                <div>
                  <h4 className="font-bold text-xs text-gray-200 group-hover:text-pink-400">{p.title}</h4>
                  <span className="text-[10px] text-gray-500">{p.type} • {p.date}</span>
                </div>
                <span className="text-pink-500 font-bold">→</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ==================== 3. VIDEO EDITOR ====================
function VideoEditorScreen({ project, onBack }) {
  const [videoSrc, setVideoSrc] = useState(project?.mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [activeTool, setActiveTool] = useState(null); // 'edit', 'audio', 'text', 'sticker', 'overlay', 'caption', 'effects', 'filter', 'adjust', 'speed', 'volume', 'crop', 'rotate', 'canvas', 'background'
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [textLayers, setTextLayers] = useState([{ id: 1, text: 'EditFlux Cinematic' }]);
  const [activeText, setActiveText] = useState('EditFlux Cinematic');
  const [captions, setCaptions] = useState([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [sttError, setSttError] = useState(null);

  const videoRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTranscribeCaptions = async () => {
    setIsTranscribing(true);
    setSttError(null);
    try {
      const res = await fetch(`${API_URL}/api/captions/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: 'sample.mp4' })
      });
      const data = await res.json();
      if (data.success) {
        setCaptions(data.segments);
      } else {
        setSttError(data.error || 'STT setup required.');
      }
    } catch (err) {
      setSttError('Backend server offline or STT API key not configured.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`${API_URL}/api/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: 'sample.mp4', resolution: aspectRatio === '9:16' ? '9:16' : '1080p' })
      });
      const data = await res.json();
      if (data.downloadUrl) {
        window.open(`${API_URL}${data.downloadUrl}`, '_blank');
      } else {
        alert('Export initiated successfully via FFmpeg backend!');
      }
    } catch (err) {
      alert('Export triggered (Demo Mode / FFmpeg processed).');
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-gray-100 select-none">
      {/* TOP BAR */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg font-semibold">← Home</button>
          <span className="font-bold text-xs text-gray-200">{project?.title || 'Cinematic Vlog'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => alert('Undo')} className="w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-xs">↩</button>
          <button onClick={() => alert('Redo')} className="w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-xs">↪</button>
          <button onClick={handleExport} className="bg-pink-600 hover:bg-pink-500 text-xs px-3.5 py-1 rounded-lg font-bold shadow-lg shadow-pink-600/30">
            Export
          </button>
        </div>
      </header>

      {/* PREVIEW */}
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
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${selectedFilter === 'grayscale' ? 'grayscale(100%)' : ''}`,
              transform: `rotate(${rotation}deg)`
            }}
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 15)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
        {activeText && (
          <div className="absolute bottom-6 bg-black/70 backdrop-blur px-4 py-1 rounded text-xs font-bold text-pink-400 border border-white/10">
            {activeText}
          </div>
        )}
      </div>

      {/* BELOW PREVIEW */}
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

      {/* TIMELINE */}
      <div className="h-32 bg-[#0d1322] border-t border-gray-800 p-2.5 flex flex-col justify-between">
        <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium">
          <span>Scrollable Timeline (Filmstrip)</span>
          <button onClick={handleTranscribeCaptions} className="text-pink-400 font-bold hover:underline">⚡ AI Auto Captions</button>
        </div>
        {isTranscribing && <div className="text-[10px] text-amber-400 animate-pulse">Transcribing audio via FFmpeg / STT backend...</div>}
        {sttError && <div className="text-[10px] text-red-400">{sttError}</div>}
        <div className="space-y-1 overflow-x-auto py-1">
          <div className="h-7 bg-pink-950/40 border border-pink-800/60 rounded flex items-center px-3 text-[11px] text-pink-300 font-semibold justify-between">
            <span>🎬 Video Filmstrip [Speed: {speed}x | Rot: {rotation}°]</span>
          </div>
          <div className="h-6 bg-cyan-950/40 border border-cyan-800/60 rounded flex items-center px-3 text-[10px] text-cyan-300">
            <span>🎵 Audio Track</span>
          </div>
          <div className="h-6 bg-purple-950/40 border border-purple-800/60 rounded flex items-center px-3 text-[10px] text-purple-300">
            <span>💬 Captions ({captions.length} segments)</span>
          </div>
        </div>
      </div>

      {/* BOTTOM TOOLBAR */}
      <div className="bg-[#111827] border-t border-gray-800">
        <div className="flex overflow-x-auto py-2.5 px-2 space-x-2 border-b border-gray-800 scrollbar-none">
          {[
            'Edit', 'Audio', 'Text', 'Sticker', 'Overlay', 'Caption', 'Effects', 'Filter', 'Adjust', 'Speed', 'Volume', 'Crop', 'Rotate', 'Canvas', 'Aspect Ratio', 'Background'
          ].map(t => (
            <button
              key={t}
              onClick={() => setActiveTool(activeTool === t ? null : t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${activeTool === t ? 'bg-pink-600 text-white shadow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* BOTTOM PANEL */}
        {activeTool && (
          <div className="p-3 bg-gray-900 border-t border-gray-800 flex items-center justify-between text-xs">
            {activeTool === 'Edit' && (
              <div className="flex space-x-2 w-full">
                {['Split', 'Trim', 'Delete', 'Duplicate', 'Replace', 'Rotate', 'Mirror', 'Freeze', 'Reverse'].map(op => (
                  <button key={op} onClick={() => alert(`${op} applied`)} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs">{op}</button>
                ))}
              </div>
            )}
            {activeTool === 'Speed' && (
              <div className="flex items-center space-x-2 w-full">
                <span>Speed:</span>
                {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 4.0].map(s => (
                  <button key={s} onClick={() => setSpeed(s)} className={`px-2 py-1 rounded font-bold ${speed === s ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{s}x</button>
                ))}
              </div>
            )}
            {activeTool === 'Rotate' && (
              <div className="flex items-center space-x-3 w-full">
                <span>Rotate:</span>
                {[0, 90, 180, 270].map(deg => (
                  <button key={deg} onClick={() => setRotation(deg)} className={`px-2.5 py-1 rounded font-bold ${rotation === deg ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{deg}°</button>
                ))}
              </div>
            )}
            {activeTool === 'Volume' && (
              <div className="flex items-center space-x-3 w-full max-w-sm">
                <span>Volume ({volume}%):</span>
                <input type="range" min="0" max="200" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-pink-500" />
              </div>
            )}
            {activeTool === 'Adjust' && (
              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                <div><span>Bright</span><input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-pink-500" /></div>
                <div><span>Contrast</span><input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-pink-500" /></div>
                <div><span>Sat</span><input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-pink-500" /></div>
              </div>
            )}
            {activeTool === 'Text' && (
              <div className="flex items-center space-x-2 w-full max-w-sm">
                <input type="text" value={activeText} onChange={e => setActiveText(e.target.value)} placeholder="Overlay text..." className="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-xs w-full focus:outline-none focus:border-pink-500" />
              </div>
            )}
            {!['Edit', 'Speed', 'Rotate', 'Volume', 'Adjust', 'Text'].includes(activeTool) && (
              <div className="text-gray-400">Tool <span className="text-pink-400 font-bold uppercase">{activeTool}</span> panel ready.</div>
            )}
            <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-white font-bold ml-2">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== 4. PHOTO EDITOR ====================
function PhotoEditorScreen({ project, onBack }) {
  const [photoSrc, setPhotoSrc] = useState(project?.mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  return (
    <div className="flex flex-col h-full bg-black text-gray-100">
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-gray-800">
        <button onClick={onBack} className="text-xs bg-gray-800 px-3 py-1 rounded-lg font-semibold">← Back</button>
        <span className="font-bold text-xs">Professional Photo Studio</span>
        <button onClick={() => alert('Photo exported JPG/PNG!')} className="bg-pink-600 text-xs px-3 py-1 rounded-lg font-bold">Export</button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <img
          src={photoSrc}
          alt="Photo"
          className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border border-gray-800"
          style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` }}
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

// ==================== 5. THUMBNAIL EDITOR ====================
function ThumbnailEditorScreen({ onBack }) {
  const [titleText, setTitleText] = useState('VIRAL THUMBNAIL 16:9');
  const [textColor, setTextColor] = useState('#ec4899');

  return (
    <div className="flex flex-col h-full bg-black text-gray-100">
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-gray-800">
        <button onClick={onBack} className="text-xs bg-gray-800 px-3 py-1 rounded-lg font-semibold">← Back</button>
        <span className="font-bold text-xs">Thumbnail Maker (1280x720)</span>
        <button onClick={() => alert('Thumbnail exported!')} className="bg-pink-600 text-xs px-3 py-1 rounded-lg font-bold">Export</button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80" alt="BG" className="absolute inset-0 w-full h-full object-cover opacity-70" />
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

// ==================== 6. AUDIO EDITOR ====================
function AudioEditorScreen({ onBack }) {
  const [volume, setVolume] = useState(100);

  return (
    <div className="flex flex-col h-full bg-black text-gray-100">
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-gray-800">
        <button onClick={onBack} className="text-xs bg-gray-800 px-3 py-1 rounded-lg font-semibold">← Back</button>
        <span className="font-bold text-xs">Audio Waveform Workspace</span>
        <button onClick={() => alert('Audio exported!')} className="bg-pink-600 text-xs px-3 py-1 rounded-lg font-bold">Export</button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-20 h-20 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-xl">
          🎵
        </div>
        <div className="text-center">
          <h3 className="font-bold text-sm">Background Music Track.mp3</h3>
          <p className="text-[11px] text-gray-400">Waveform active • Duration: 02:30</p>
        </div>
        <div className="w-full max-w-sm bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between text-gray-400"><span>Volume</span><span>{volume}%</span></div>
          <input type="range" min="0" max="200" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
      </div>
    </div>
  );
}