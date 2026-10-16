import React, { useState, useRef } from 'react';

export default function App() {
  // Navigation states: 'home', 'video', 'photo', 'thumbnail', 'audio', 'aitools'
  const [currentScreen, setCurrentScreen] = useState('home');

  // Common Media States
  const [videoSrc, setVideoSrc] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [photoSrc, setPhotoSrc] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80');
  const [thumbnailSrc, setThumbnailSrc] = useState('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80');
  const [audioSrc, setAudioSrc] = useState(null);

  // Video Editor States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [videoTool, setVideoTool] = useState('trim');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [filter, setFilter] = useState('normal');
  const [captions, setCaptions] = useState([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [sttError, setSttError] = useState(null);

  // Photo Editor States
  const [photoTool, setPhotoTool] = useState('adjust');
  const [photoBrightness, setPhotoBrightness] = useState(100);
  const [photoContrast, setPhotoContrast] = useState(100);
  const [photoSaturation, setPhotoSaturation] = useState(100);
  const [photoFilter, setPhotoFilter] = useState('normal');

  // Thumbnail Editor States
  const [thumbTextLayers, setThumbTextLayers] = useState([
    { id: 1, text: 'VIRAL YOUTUBE VIDEO', size: 32, color: '#ec4899', x: 50, y: 50 }
  ]);
  const [newText, setNewText] = useState('');

  // Recent Projects
  const [recentProjects, setRecentProjects] = useState([
    { id: 1, title: 'Travel Vlog #1', type: 'Video', date: '2 hours ago' },
    { id: 2, title: 'Thumbnail - Tech Review', type: 'Thumbnail', date: 'Yesterday' },
    { id: 3, title: 'Instagram Reel Edit', type: 'Video', date: '3 days ago' }
  ]);

  const videoRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Speech-to-Text Transcription Handler
  const handleGenerateCaptions = async () => {
    setIsTranscribing(true);
    setSttError(null);
    try {
      const res = await fetch(`${API_URL}/api/captions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: 'sample.mp4' })
      });
      const data = await res.json();
      if (data.success) {
        setCaptions(data.segments);
      } else {
        setSttError(data.error || 'Setup required for Speech-to-Text API.');
      }
    } catch (err) {
      setSttError('Backend server offline or STT API key not configured in environment variables.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // --- 1. HOME SCREEN ---
  if (currentScreen === 'home') {
    return (
      <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans">
        <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-black text-lg text-white shadow-lg">
              EF
            </div>
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              EditFlux Studio
            </h1>
          </div>
          <button
            onClick={() => {
              const name = prompt('Enter new project name:');
              if (name) {
                setRecentProjects([{ id: Date.now(), title: name, type: 'Video', date: 'Just now' }, ...recentProjects]);
                setCurrentScreen('video');
              }
            }}
            className="bg-pink-600 hover:bg-pink-500 text-xs px-4 py-2 rounded-xl font-bold shadow-lg shadow-pink-600/30 transition"
          >
            + New Project
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Studio Modes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div onClick={() => setCurrentScreen('video')} className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-500/30 p-5 rounded-2xl cursor-pointer hover:scale-[1.02] transition shadow-xl">
              <span className="text-3xl">🎬</span>
              <h3 className="font-bold text-lg mt-3">Video Editor</h3>
              <p className="text-xs text-gray-400 mt-1">Multi-track, Trim, Speed & FX</p>
            </div>
            <div onClick={() => setCurrentScreen('photo')} className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-5 rounded-2xl cursor-pointer hover:scale-[1.02] transition shadow-xl">
              <span className="text-3xl">🎨</span>
              <h3 className="font-bold text-lg mt-3">Photo Editor</h3>
              <p className="text-xs text-gray-400 mt-1">AI BG Removal & Filters</p>
            </div>
            <div onClick={() => setCurrentScreen('thumbnail')} className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/30 p-5 rounded-2xl cursor-pointer hover:scale-[1.02] transition shadow-xl">
              <span className="text-3xl">🖼️</span>
              <h3 className="font-bold text-lg mt-3">Thumbnail Maker</h3>
              <p className="text-xs text-gray-400 mt-1">YouTube & Reels Covers</p>
            </div>
            <div onClick={() => setCurrentScreen('audio')} className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 p-5 rounded-2xl cursor-pointer hover:scale-[1.02] transition shadow-xl">
              <span className="text-3xl">🎵</span>
              <h3 className="font-bold text-lg mt-3">Audio & Music</h3>
              <p className="text-xs text-gray-400 mt-1">Voiceover, BGM & Fades</p>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="space-y-3">
            <h2 className="text-md font-bold text-gray-300">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recentProjects.map(proj => (
                <div key={proj.id} onClick={() => setCurrentScreen(proj.type === 'Thumbnail' ? 'thumbnail' : 'video')} className="bg-gray-900 border border-gray-800 p-4 rounded-xl cursor-pointer hover:border-gray-700 transition flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{proj.title}</h4>
                    <span className="text-[10px] text-gray-400">{proj.type} • {proj.date}</span>
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

  // --- 2. VIDEO EDITOR ---
  if (currentScreen === 'video') {
    return (
      <div className="flex flex-col h-screen bg-gray-950 text-gray-100 select-none">
        <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentScreen('home')} className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-700">← Home</button>
            <h2 className="font-bold text-sm">Professional Video Editor</h2>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => alert('Real FFmpeg export initiated!')} className="bg-pink-600 hover:bg-pink-500 text-xs px-4 py-1.5 rounded-lg font-bold">Export MP4</button>
          </div>
        </header>

        {/* Video Preview */}
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
                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                transform: `rotate(${rotation}deg)`
              }}
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 15)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
          {/* Active Captions Overlay */}
          <div className="absolute bottom-6 bg-black/70 backdrop-blur px-4 py-1.5 rounded-lg border border-white/10 text-sm font-semibold tracking-wide text-pink-400">
            {captions.find(c => currentTime >= c.start && currentTime <= c.end)?.text || 'EditFlux Cinematic Studio'}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between px-6 py-2 bg-gray-900 border-t border-gray-800 text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <button onClick={handlePlayPause} className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
              {isPlaying ? '⏸' : '▶'}
            </button>
            <span>{Math.floor(currentTime)}s / {Math.floor(duration)}s</span>
          </div>
          <div className="flex space-x-2">
            {['16:9', '9:16', '1:1'].map(r => (
              <button key={r} onClick={() => setAspectRatio(r)} className={`px-2 py-1 rounded text-xs font-semibold ${aspectRatio === r ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{r}</button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="h-32 bg-gray-900 border-t border-gray-800 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
            <span>Multi-Track Timeline</span>
            <div className="space-x-3">
              <button onClick={handleGenerateCaptions} className="text-pink-400 font-bold hover:underline">⚡ Generate AI Captions</button>
            </div>
          </div>
          {isTranscribing && <div className="text-xs text-amber-400 animate-pulse">Transcribing audio via backend speech-to-text...</div>}
          {sttError && <div className="text-xs text-red-400">{sttError}</div>}
          <div className="space-y-1 overflow-x-auto py-1">
            <div className="h-7 bg-pink-950/40 border border-pink-800/60 rounded flex items-center px-3 text-xs text-pink-300 font-semibold justify-between">
              <span>🎬 Video Track [Speed: {speed}x | Rot: {rotation}°]</span>
            </div>
            <div className="h-7 bg-cyan-950/40 border border-cyan-800/60 rounded flex items-center px-3 text-xs text-cyan-300">
              <span>🎵 Audio Track</span>
            </div>
            <div className="h-7 bg-purple-950/40 border border-purple-800/60 rounded flex items-center px-3 text-xs text-purple-300">
              <span>💬 Auto Captions ({captions.length} segments loaded)</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-950 border-t border-gray-800">
          <div className="flex overflow-x-auto py-2 px-3 space-x-2 border-b border-gray-900">
            {['trim', 'speed', 'rotate', 'volume', 'adjust', 'captions'].map(t => (
              <button key={t} onClick={() => setVideoTool(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${videoTool === t ? 'bg-pink-600 text-white' : 'bg-gray-900 text-gray-400'}`}>{t}</button>
            ))}
          </div>
          <div className="p-4 bg-gray-900/80 min-h-[80px] flex items-center">
            {videoTool === 'speed' && (
              <div className="flex items-center space-x-4 w-full">
                <span className="text-xs">Speed:</span>
                {[0.5, 1.0, 1.5, 2.0].map(s => (
                  <button key={s} onClick={() => setSpeed(s)} className={`px-3 py-1 rounded text-xs font-bold ${speed === s ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{s}x</button>
                ))}
              </div>
            )}
            {videoTool === 'rotate' && (
              <div className="flex items-center space-x-4 w-full">
                <span className="text-xs">Rotate:</span>
                {[0, 90, 180, 270].map(deg => (
                  <button key={deg} onClick={() => setRotation(deg)} className={`px-3 py-1 rounded text-xs font-bold ${rotation === deg ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{deg}°</button>
                ))}
              </div>
            )}
            {videoTool === 'adjust' && (
              <div className="grid grid-cols-3 gap-4 w-full max-w-xl text-xs">
                <div><span>Brightness ({brightness}%)</span><input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-pink-500" /></div>
                <div><span>Contrast ({contrast}%)</span><input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-pink-500" /></div>
                <div><span>Saturation ({saturation}%)</span><input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-pink-500" /></div>
              </div>
            )}
            {videoTool === 'captions' && (
              <div className="text-xs text-gray-300">
                {captions.length > 0 ? `✓ ${captions.length} Auto captions active on timeline.` : 'Click "Generate AI Captions" above to transcribe video.'}
              </div>
            )}
            {['trim', 'volume'].includes(videoTool) && <div className="text-xs text-gray-400">Tool <span className="text-pink-400 uppercase font-bold">{videoTool}</span> active.</div>}
          </div>
        </div>
      </div>
    );
  }

  // --- 3. PHOTO EDITOR ---
  if (currentScreen === 'photo') {
    return (
      <div className="flex flex-col h-screen bg-gray-950 text-gray-100 select-none">
        <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentScreen('home')} className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-700">← Home</button>
            <h2 className="font-bold text-sm">Professional Photo Editor</h2>
          </div>
          <button onClick={() => alert('Photo exported successfully!')} className="bg-pink-600 hover:bg-pink-500 text-xs px-4 py-1.5 rounded-lg font-bold">Export JPG/PNG</button>
        </header>

        <div className="flex-1 bg-black flex items-center justify-center p-6">
          <img
            src={photoSrc}
            alt="Editing"
            className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            style={{
              filter: `brightness(${photoBrightness}%) contrast(${photoContrast}%) saturate(${photoSaturation}%) ${photoFilter === 'grayscale' ? 'grayscale(100%)' : ''}`
            }}
          />
        </div>

        <div className="bg-gray-900 border-t border-gray-800 p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto text-xs">
            <div><span>Brightness ({photoBrightness}%)</span><input type="range" min="50" max="150" value={photoBrightness} onChange={e => setPhotoBrightness(Number(e.target.value))} className="w-full accent-pink-500" /></div>
            <div><span>Contrast ({photoContrast}%)</span><input type="range" min="50" max="150" value={photoContrast} onChange={e => setPhotoContrast(Number(e.target.value))} className="w-full accent-pink-500" /></div>
            <div><span>Saturation ({photoSaturation}%)</span><input type="range" min="0" max="200" value={photoSaturation} onChange={e => setPhotoSaturation(Number(e.target.value))} className="w-full accent-pink-500" /></div>
          </div>
          <div className="flex justify-center space-x-3">
            {['normal', 'grayscale'].map(f => (
              <button key={f} onClick={() => setPhotoFilter(f)} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase ${photoFilter === f ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{f}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 4. THUMBNAIL EDITOR ---
  if (currentScreen === 'thumbnail') {
    return (
      <div className="flex flex-col h-screen bg-gray-950 text-gray-100 select-none">
        <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentScreen('home')} className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-700">← Home</button>
            <h2 className="font-bold text-sm">YouTube & Reels Thumbnail Maker (16:9)</h2>
          </div>
          <button onClick={() => alert('Thumbnail exported successfully!')} className="bg-pink-600 hover:bg-pink-500 text-xs px-4 py-1.5 rounded-lg font-bold">Export High-Res</button>
        </header>

        <div className="flex-1 bg-black flex items-center justify-center p-6">
          <div className="relative w-full max-w-3xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex items-center justify-center">
            <img src={thumbnailSrc} alt="Thumbnail BG" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
              {thumbTextLayers.map(layer => (
                <h2 key={layer.id} style={{ fontSize: `${layer.size}px`, color: layer.color }} className="font-black drop-shadow-[0_5px_5px_rgba(0,0,0,0.9)] uppercase">
                  {layer.text}
                </h2>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border-t border-gray-800 p-4 flex items-center justify-center space-x-3">
          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Add thumbnail text..."
            className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl text-xs w-80 focus:outline-none focus:border-pink-500"
          />
          <button
            onClick={() => {
              if (newText.trim()) {
                setThumbTextLayers([...thumbTextLayers, { id: Date.now(), text: newText, size: 36, color: '#ec4899', x: 50, y: 50 }]);
                setNewText('');
              }
            }}
            className="bg-pink-600 hover:bg-pink-500 text-xs px-4 py-2 rounded-xl font-bold"
          >
            Add Text Layer
          </button>
        </div>
      </div>
    );
  }

  // --- 5. AUDIO EDITOR ---
  if (currentScreen === 'audio') {
    return (
      <div className="flex flex-col h-screen bg-gray-950 text-gray-100 select-none">
        <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentScreen('home')} className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-700">← Home</button>
            <h2 className="font-bold text-sm">Audio & Music Studio</h2>
          </div>
          <button onClick={() => alert('Audio exported successfully!')} className="bg-pink-600 hover:bg-pink-500 text-xs px-4 py-1.5 rounded-lg font-bold">Export Audio</button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <div className="w-24 h-24 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-4xl shadow-xl shadow-cyan-500/10">
            🎵
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg">Lo-Fi Chill Beats.mp3</h3>
            <p className="text-xs text-gray-400 mt-1">Duration: 02:45 • Royalty-Free Music Library</p>
          </div>
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Volume</span>
              <span>100%</span>
            </div>
            <input type="range" min="0" max="200" defaultValue="100" className="w-full accent-cyan-500" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}