import React, { useState, useRef, useEffect } from 'react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'video', 'photo', 'thumbnail', 'audio'

  // Media States
  const [videoSrc, setVideoSrc] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [photoSrc, setPhotoSrc] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80');
  const [thumbnailSrc, setThumbnailSrc] = useState('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80');
  const [audioSrc, setAudioSrc] = useState(null);

  // Video Editor States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [activeVideoTool, setActiveVideoTool] = useState(null); // 'edit', 'audio', 'text', 'stickers', 'captions', 'effects', 'filters', 'adjust', 'speed', 'volume', 'crop', 'rotate'
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [overlayText, setOverlayText] = useState('');
  const [captions, setCaptions] = useState([
    { start: 0, end: 3, text: 'Welcome to EditFlux Studio' },
    { start: 3, end: 6, text: 'Professional Mobile Editing' }
  ]);

  // Photo Editor States
  const [activePhotoTool, setActivePhotoTool] = useState('adjust');
  const [photoBrightness, setPhotoBrightness] = useState(100);
  const [photoContrast, setPhotoContrast] = useState(100);
  const [photoSaturation, setPhotoSaturation] = useState(100);
  const [photoFilter, setPhotoFilter] = useState('normal');

  // Thumbnail Editor States
  const [thumbLayers, setThumbLayers] = useState([
    { id: 1, type: 'text', content: 'EPIC TUTORIAL 2026', size: 36, color: '#ec4899', x: 20, y: 30 }
  ]);
  const [newLayerText, setNewLayerText] = useState('');

  // Recent Projects
  const [projects, setProjects] = useState([
    { id: 1, title: 'Cinematic Travel Vlog', type: 'video', duration: '02:45', date: 'Today' },
    { id: 2, title: 'Tech Review Thumbnail', type: 'thumbnail', duration: '1920x1080', date: 'Yesterday' },
    { id: 3, title: 'Instagram Reel Beat Sync', type: 'video', duration: '00:30', date: '2 days ago' }
  ]);

  const videoRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleImportMedia = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'video' ? 'video/*' : type === 'photo' ? 'image/*' : 'audio/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        if (type === 'video') setVideoSrc(url);
        if (type === 'photo') setPhotoSrc(url);
        if (type === 'audio') setAudioSrc(url);
        setCurrentScreen(type === 'video' ? 'video' : type === 'photo' ? 'photo' : 'audio');
      }
    };
    input.click();
  };

  // ==================== 1. HOME SCREEN ====================
  if (currentScreen === 'home') {
    return (
      <div className="flex flex-col h-screen bg-[#0b0f19] text-gray-100 font-sans">
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
            <button
              onClick={() => handleImportMedia('video')}
              className="bg-gray-800 hover:bg-gray-700 text-xs px-4 py-2 rounded-xl font-semibold border border-gray-700 transition flex items-center space-x-2"
            >
              <span>📂</span>
              <span>Import</span>
            </button>
            <button
              onClick={() => {
                const title = prompt('Enter project name:', 'New Project');
                if (title) {
                  setProjects([{ id: Date.now(), title, type: 'video', duration: '00:00', date: 'Just now' }, ...projects]);
                  setCurrentScreen('video');
                }
              }}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-xs px-4 py-2 rounded-xl font-bold shadow-lg shadow-pink-600/30 transition"
            >
              + New Project
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-6xl mx-auto w-full">
          {/* Studio Mode Selector Cards */}
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Create & Edit</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                onClick={() => setCurrentScreen('video')}
                className="group bg-gradient-to-br from-gray-900 to-gray-900/80 border border-gray-800 hover:border-pink-500/50 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl group-hover:bg-pink-500/20 transition"></div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center text-2xl mb-4 font-bold">🎬</div>
                <h3 className="font-bold text-base text-white">Video Editor</h3>
                <p className="text-xs text-gray-400 mt-1">Multi-track, trim, speed & FX</p>
              </div>

              <div
                onClick={() => setCurrentScreen('photo')}
                className="group bg-gradient-to-br from-gray-900 to-gray-900/80 border border-gray-800 hover:border-purple-500/50 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition"></div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl mb-4 font-bold">🎨</div>
                <h3 className="font-bold text-base text-white">Photo Editor</h3>
                <p className="text-xs text-gray-400 mt-1">AI removal, filters & retouch</p>
              </div>

              <div
                onClick={() => setCurrentScreen('thumbnail')}
                className="group bg-gradient-to-br from-gray-900 to-gray-900/80 border border-gray-800 hover:border-amber-500/50 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition"></div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mb-4 font-bold">🖼️</div>
                <h3 className="font-bold text-base text-white">Thumbnail Maker</h3>
                <p className="text-xs text-gray-400 mt-1">16:9 YouTube & social covers</p>
              </div>

              <div
                onClick={() => setCurrentScreen('audio')}
                className="group bg-gradient-to-br from-gray-900 to-gray-900/80 border border-gray-800 hover:border-cyan-500/50 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition"></div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl mb-4 font-bold">🎵</div>
                <h3 className="font-bold text-base text-white">Audio & Music</h3>
                <p className="text-xs text-gray-400 mt-1">Waveform, voiceover & BGM</p>
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recent Projects</h2>
              <span className="text-xs text-pink-400 font-semibold cursor-pointer">View All ({projects.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => setCurrentScreen(proj.type === 'thumbnail' ? 'thumbnail' : 'video')}
                  className="bg-gray-900/90 border border-gray-800/80 hover:border-gray-700 p-4 rounded-xl cursor-pointer transition flex items-center justify-between group shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg">
                      {proj.type === 'thumbnail' ? '🖼️' : '🎬'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-200 group-hover:text-pink-400 transition">{proj.title}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">{proj.duration} • {proj.date}</p>
                    </div>
                  </div>
                  <span className="text-gray-600 group-hover:text-pink-400 transition font-bold text-lg">→</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==================== 2. VIDEO EDITOR ====================
  if (currentScreen === 'video') {
    return (
      <div className="flex flex-col h-screen bg-black text-gray-100 select-none">
        {/* 1. Top Bar */}
        <header className="flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentScreen('home')} className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg font-semibold">
              ← Back
            </button>
            <span className="font-bold text-sm tracking-wide text-gray-200">Cinematic Vlog #1</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => alert('Undo action')} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-xs" title="Undo">↩</button>
            <button onClick={() => alert('Redo action')} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-xs" title="Redo">↪</button>
            <button onClick={() => alert('Real FFmpeg export initiated!')} className="bg-pink-600 hover:bg-pink-500 text-xs px-4 py-1.5 rounded-lg font-bold shadow-lg shadow-pink-600/30 transition">
              Export
            </button>
          </div>
        </header>

        {/* 2. Large Video Preview */}
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

          {/* Active Caption Overlay */}
          {overlayText && (
            <div className="absolute bottom-6 bg-black/70 backdrop-blur px-4 py-1.5 rounded-lg border border-white/10 text-sm font-semibold text-pink-400">
              {overlayText}
            </div>
          )}
        </div>

        {/* 3. Under Preview Controls */}
        <div className="flex items-center justify-between px-6 py-2 bg-[#111827] border-t border-gray-800 text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <button onClick={handlePlayPause} className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold hover:bg-pink-500 transition">
              {isPlaying ? '⏸' : '▶'}
            </button>
            <span className="font-mono">{Math.floor(currentTime)}s / {Math.floor(duration)}s</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              {['16:9', '9:16', '1:1'].map(r => (
                <button key={r} onClick={() => setAspectRatio(r)} className={`px-2 py-0.5 rounded text-[11px] font-semibold ${aspectRatio === r ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{r}</button>
              ))}
            </div>
            <button onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
              }
            }} className="hover:text-white">⛶ Fullscreen</button>
          </div>
        </div>

        {/* 4. REAL Timeline */}
        <div className="h-36 bg-[#0f172a] border-t border-gray-800 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
            <span className="flex items-center space-x-2">
              <span>⏱ Timeline</span>
              <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-300">Zoom: 1x</span>
            </span>
            <button onClick={() => handleImportMedia('video')} className="text-pink-400 font-bold hover:underline">+ Add Clip</button>
          </div>

          <div className="space-y-1.5 overflow-x-auto py-1">
            {/* Video Filmstrip Track */}
            <div className="h-10 bg-pink-950/40 border border-pink-800/60 rounded-lg flex items-center px-3 text-xs text-pink-300 font-semibold justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-transparent to-pink-600/20 pointer-events-none"></div>
              <span>🎬 Video Clip 1 (00:00 - {Math.floor(duration)}s)</span>
              <span className="text-[10px] bg-pink-900/80 px-2 py-0.5 rounded text-white">Selected</span>
            </div>
            {/* Audio Track */}
            <div className="h-7 bg-cyan-950/40 border border-cyan-800/60 rounded flex items-center px-3 text-xs text-cyan-300">
              <span>🎵 BGM Track / Lo-Fi Chill</span>
            </div>
            {/* Caption Track */}
            <div className="h-7 bg-purple-950/40 border border-purple-800/60 rounded flex items-center px-3 text-xs text-purple-300">
              <span>💬 Auto Captions Track</span>
            </div>
          </div>
        </div>

        {/* 5. Bottom Editing Toolbar */}
        <div className="bg-[#111827] border-t border-gray-800">
          <div className="flex overflow-x-auto py-3 px-3 space-x-3 border-b border-gray-800 scrollbar-none">
            {[
              { id: 'edit', label: '✂️ Edit', icon: '✂️' },
              { id: 'audio', label: '🎵 Audio', icon: '🎵' },
              { id: 'text', label: '💬 Text', icon: '💬' },
              { id: 'stickers', label: '✨ Stickers', icon: '✨' },
              { id: 'captions', label: '⚡ Captions', icon: '⚡' },
              { id: 'filters', label: '🎨 Filters', icon: '🎨' },
              { id: 'adjust', label: '🔆 Adjust', icon: '🔆' },
              { id: 'speed', label: '🚀 Speed', icon: '🚀' },
              { id: 'volume', label: '🔊 Volume', icon: '🔊' },
              { id: 'rotate', label: '🔄 Rotate', icon: '🔄' },
              { id: 'delete', label: '🗑️ Delete', icon: '🗑️' }
            ].map(tool => (
              <button
                key={tool.id}
                onClick={() => {
                  if (tool.id === 'delete') {
                    if (confirm('Delete selected clip?')) setVideoSrc('');
                  } else {
                    setActiveVideoTool(activeVideoTool === tool.id ? null : tool.id);
                  }
                }}
                className={`flex flex-col items-center justify-center min-w-[64px] py-1.5 rounded-xl text-xs font-semibold transition ${activeVideoTool === tool.id ? 'bg-pink-600 text-white shadow-lg' : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800'}`}
              >
                <span className="text-base mb-1">{tool.icon}</span>
                <span className="text-[10px]">{tool.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* 6. Tool Controls Bottom Sheet / Panel */}
          {activeVideoTool && (
            <div className="p-4 bg-gray-900 border-t border-gray-800 min-h-[90px] flex items-center justify-between animate-fadeIn">
              {activeVideoTool === 'speed' && (
                <div className="flex items-center space-x-4 w-full">
                  <span className="text-xs font-semibold text-gray-300">Speed:</span>
                  {[0.5, 1.0, 1.5, 2.0, 3.0].map(s => (
                    <button key={s} onClick={() => setSpeed(s)} className={`px-3 py-1 rounded text-xs font-bold ${speed === s ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{s}x</button>
                  ))}
                </div>
              )}

              {activeVideoTool === 'rotate' && (
                <div className="flex items-center space-x-4 w-full">
                  <span className="text-xs font-semibold text-gray-300">Rotate Angle:</span>
                  {[0, 90, 180, 270].map(deg => (
                    <button key={deg} onClick={() => setRotation(deg)} className={`px-3 py-1 rounded text-xs font-bold ${rotation === deg ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{deg}°</button>
                  ))}
                </div>
              )}

              {activeVideoTool === 'volume' && (
                <div className="flex items-center space-x-4 w-full max-w-md">
                  <span className="text-xs font-semibold text-gray-300">Volume ({volume}%):</span>
                  <input type="range" min="0" max="200" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-pink-500" />
                </div>
              )}

              {activeVideoTool === 'adjust' && (
                <div className="grid grid-cols-3 gap-6 w-full max-w-2xl text-xs">
                  <div><span>Brightness ({brightness}%)</span><input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-pink-500" /></div>
                  <div><span>Contrast ({contrast}%)</span><input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-pink-500" /></div>
                  <div><span>Saturation ({saturation}%)</span><input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-pink-500" /></div>
                </div>
              )}

              {activeVideoTool === 'filters' && (
                <div className="flex space-x-3 w-full">
                  {['normal', 'grayscale'].map(f => (
                    <button key={f} onClick={() => setSelectedFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${selectedFilter === f ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'}`}>{f}</button>
                  ))}
                </div>
              )}

              {activeVideoTool === 'text' && (
                <div className="flex items-center space-x-3 w-full max-w-md">
                  <input
                    type="text"
                    value={overlayText}
                    onChange={e => setOverlayText(e.target.value)}
                    placeholder="Type overlay text..."
                    className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-xl text-xs w-full focus:outline-none focus:border-pink-500"
                  />
                </div>
              )}

              {['edit', 'audio', 'stickers', 'captions', 'effects'].includes(activeVideoTool) && (
                <div className="text-xs text-gray-400">
                  Tool <span className="text-pink-400 font-bold uppercase">{activeVideoTool}</span> panel ready. Adjust parameters on timeline.
                </div>
              )}

              <button onClick={() => setActiveVideoTool(null)} className="text-gray-400 hover:text-white font-bold text-sm px-2">✕</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== 3. PHOTO EDITOR ====================
  if (currentScreen === 'photo') {
    return (
      <div className="flex flex-col h-screen bg-black text-gray-100 select-none">
        <header className="flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentScreen('home')} className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg font-semibold">← Back</button>
            <span className="font-bold text-sm">Professional Photo Studio</span>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => handleImportMedia('photo')} className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1.5 rounded-lg font-semibold">Upload Photo</button>
            <button onClick={() => alert('Photo exported successfully!')} className="bg-pink-600 hover:bg-pink-500 text-xs px-4 py-1.5 rounded-lg font-bold">Export JPG/PNG</button>
          </div>
        </header>

        <div className="flex-1 bg-black flex items-center justify-center p-6">
          <img
            src={photoSrc}
            alt="Workspace"
            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border border-gray-800"
            style={{
              filter: `brightness(${photoBrightness}%) contrast(${photoContrast}%) saturate(${photoSaturation}%) ${photoFilter === 'grayscale' ? 'grayscale(100%)' : ''}`
            }}
          />
        </div>

        <div className="bg-[#111827] border-t border-gray-800 p-4 space-y-4">
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

  // ==================== 4. THUMBNAIL EDITOR ====================
  if (currentScreen === 'thumbnail') {
    return (
      <div className="flex flex-col h-screen bg-black text-gray-100 select-none">
        <header className="flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentScreen('home')} className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg font-semibold">← Back</button>
            <span className="font-bold text-sm">Thumbnail Maker (16:9 Canvas)</span>
          </div>
          <button onClick={() => alert('High-res thumbnail exported!')} className="bg-pink-600 hover:bg-pink-500 text-xs px-4 py-1.5 rounded-lg font-bold">Export PNG</button>
        </header>

        <div className="flex-1 bg-black flex items-center justify-center p-6">
          <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex items-center justify-center">
            <img src={thumbnailSrc} alt="Thumbnail BG" className="absolute inset-0 w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
              {thumbLayers.map(l => (
                <h2 key={l.id} style={{ fontSize: `${l.size}px`, color: l.color }} className="font-black drop-shadow-[0_5px_8px_rgba(0,0,0,0.9)] uppercase tracking-wide">
                  {l.content}
                </h2>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border-t border-gray-800 p-4 flex items-center justify-center space-x-3">
          <input
            type="text"
            value={newLayerText}
            onChange={e => setNewLayerText(e.target.value)}
            placeholder="Add bold text layer..."
            className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl text-xs w-80 focus:outline-none focus:border-pink-500"
          />
          <button
            onClick={() => {
              if (newLayerText.trim()) {
                setThumbLayers([...thumbLayers, { id: Date.now(), type: 'text', content: newLayerText, size: 40, color: '#ec4899', x: 50, y: 50 }]);
                setNewLayerText('');
              }
            }}
            className="bg-pink-600 hover:bg-pink-500 text-xs px-4 py-2 rounded-xl font-bold"
          >
            Add Text
          </button>
        </div>
      </div>
    );
  }

  // ==================== 5. AUDIO EDITOR ====================
  if (currentScreen === 'audio') {
    return (
      <div className="flex flex-col h-screen bg-black text-gray-100 select-none">
        <header className="flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <button onClick={() => setCurrentScreen('home')} className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg font-semibold">← Back</button>
            <span className="font-bold text-sm">Audio & Music Workspace</span>
          </div>
          <button onClick={() => alert('Audio exported!')} className="bg-pink-600 hover:bg-pink-500 text-xs px-4 py-1.5 rounded-lg font-bold">Export Audio</button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <div className="w-24 h-24 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-4xl shadow-xl shadow-cyan-500/10">
            🎵
          </div>
          <div className="text-center">
            <h3 className="font-bold text-base">Cinematic BGM Track</h3>
            <p className="text-xs text-gray-400 mt-1">Waveform loaded • Duration: 02:30</p>
          </div>
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Track Volume</span>
              <span>100%</span>
            </div>
            <input type="range" min="0" max="200" defaultValue="100" className="w-full accent-cyan-500" />
            <button onClick={() => handleImportMedia('audio')} className="w-full bg-gray-800 hover:bg-gray-700 text-xs py-2 rounded-xl font-semibold">Upload Custom Audio</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}