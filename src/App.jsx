import React, { useEffect, useRef, useState } from "react";

const id = () => Math.random().toString(36).slice(2, 10);

export default function App() {
  const fileInput = useRef(null);
  const video = useRef(null);

  const [media, setMedia] = useState(null);
  const [clips, setClips] = useState([]);
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);

  const [tool, setTool] = useState("Media");
  const [text, setText] = useState("");
  const [texts, setTexts] = useState([]);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);
  const [speed, setSpeed] = useState(1);

  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const currentClip =
    clips.find((clip) => clip.id === selected) || null;

  const saveHistory = () => {
    setHistory((h) => [
      ...h.slice(-30),
      {
        clips: structuredClone(clips),
        texts: structuredClone(texts),
        brightness,
        contrast,
        saturation,
        rotate,
        scale,
        speed
      }
    ]);
    setFuture([]);
  };

  const restore = (state) => {
    setClips(state.clips);
    setTexts(state.texts);
    setBrightness(state.brightness);
    setContrast(state.contrast);
    setSaturation(state.saturation);
    setRotate(state.rotate);
    setScale(state.scale);
    setSpeed(state.speed);
  };

  const undo = () => {
    if (!history.length) return;

    const previous = history.at(-1);

    setFuture((f) => [
      {
        clips: structuredClone(clips),
        texts: structuredClone(texts),
        brightness,
        contrast,
        saturation,
        rotate,
        scale,
        speed
      },
      ...f
    ]);

    setHistory((h) => h.slice(0, -1));
    restore(previous);
  };

  const redo = () => {
    if (!future.length) return;

    const next = future[0];

    saveHistory();
    setFuture((f) => f.slice(1));
    restore(next);
  };

  const importMedia = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("video/") &&
      !file.type.startsWith("image/")
    ) {
      alert("Video ya image select karein.");
      return;
    }

    const url = URL.createObjectURL(file);

    const item = {
      id: id(),
      name: file.name,
      type: file.type,
      url,
      duration: 0
    };

    setMedia(item);
    setClips([item]);
    setSelected(item.id);
    setTool("Media");
  };

  const addText = () => {
    if (!text.trim()) return;

    saveHistory();

    setTexts((items) => [
      ...items,
      {
        id: id(),
        value: text.trim(),
        x: 50,
        y: 50,
        size: 34
      }
    ]);

    setText("");
  };

  const deleteClip = () => {
    if (!selected) return;

    saveHistory();

    setClips((items) =>
      items.filter((item) => item.id !== selected)
    );

    setSelected(null);
    setMedia(null);
  };

  const duplicateClip = () => {
    if (!currentClip) return;

    saveHistory();

    const copy = {
      ...currentClip,
      id: id(),
      name: currentClip.name + " Copy"
    };

    setClips((items) => [...items, copy]);
    setSelected(copy.id);
  };

  const splitClip = () => {
    if (!currentClip || !video.current) return;

    const position = video.current.currentTime;
    const duration = video.current.duration;

    if (
      position <= 0.05 ||
      position >= duration - 0.05
    ) {
      alert("Timeline me split point par playhead rakhein.");
      return;
    }

    saveHistory();

    const first = {
      ...currentClip,
      id: id(),
      name: currentClip.name + " A"
    };

    const second = {
      ...currentClip,
      id: id(),
      name: currentClip.name + " B"
    };

    setClips((items) =>
      items.flatMap((item) =>
        item.id === currentClip.id
          ? [first, second]
          : [item]
      )
    );

    setSelected(second.id);
  };

  const togglePlay = () => {
    if (!video.current) return;

    if (video.current.paused) {
      video.current.play();
    } else {
      video.current.pause();
    }
  };

  const addSticker = (emoji) => {
    saveHistory();

    setTexts((items) => [
      ...items,
      {
        id: id(),
        value: emoji,
        x: 50,
        y: 50,
        size: 55
      }
    ]);
  };

  const exportVideo = () => {
    if (!media) {
      alert("Pehle video import karein.");
      return;
    }

    alert(
      "EditFlux preview export ready hai. Professional MP4/4K export ke liye FFmpeg rendering backend connect karna hoga."
    );
  };

  useEffect(() => {
    if (video.current) {
      video.current.playbackRate = speed;
    }
  }, [speed]);

  const filter = `
    brightness(${brightness}%)
    contrast(${contrast}%)
    saturate(${saturation}%)
  `;

  return (
    <div className="app">

      <header className="topbar">

        <div className="logo">
          <span>E</span>
          <strong>EditFlux</strong>
        </div>

        <div className="topButtons">
          <button
            onClick={undo}
            disabled={!history.length}
          >
            ↶
          </button>

          <button
            onClick={redo}
            disabled={!future.length}
          >
            ↷
          </button>

          <button
            className="export"
            onClick={exportVideo}
          >
            Export
          </button>
        </div>

      </header>

      <main>

        <section className="editor">

          <div className="previewBox">

            {media ? (

              media.type.startsWith("video/") ? (

                <video
                  ref={video}
                  src={media.url}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onLoadedMetadata={() => {
                    const duration =
                      video.current?.duration || 0;

                    setClips((items) =>
                      items.map((item) =>
                        item.id === selected
                          ? { ...item, duration }
                          : item
                      )
                    );
                  }}
                  style={{
                    filter,
                    transform:
                      `scale(${scale}) rotate(${rotate}deg)`
                  }}
                />

              ) : (

                <img
                  src={media.url}
                  alt="EditFlux"
                  style={{
                    filter,
                    transform:
                      `scale(${scale}) rotate(${rotate}deg)`
                  }}
                />

              )

            ) : (

              <div className="empty">

                <div className="emptyIcon">E</div>

                <h2>Start your EditFlux project</h2>

                <p>
                  Video ya photo import karke editing start karein
                </p>

                <button
                  className="mainButton"
                  onClick={() => fileInput.current?.click()}
                >
                  + Import Media
                </button>

              </div>

            )}

            {texts.map((item) => (

              <div
                key={item.id}
                className="canvasText"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  fontSize: `${item.size}px`
                }}
              >
                {item.value}
              </div>

            ))}

          </div>

          <div className="player">

            <button onClick={togglePlay}>
              {playing ? "❚❚" : "▶"}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              defaultValue="0"
              onChange={(e) => {
                if (!video.current) return;

                if (video.current.duration) {
                  video.current.currentTime =
                    video.current.duration *
                    (Number(e.target.value) / 100);
                }
              }}
            />

          </div>

        </section>

        <section className="timelineCard">

          <div className="timelineTitle">
            <strong>Timeline</strong>
            <span>{clips.length} clips</span>
          </div>

          <div className="timeline">

            {clips.map((clip, index) => (

              <button
                key={clip.id}
                className={
                  selected === clip.id
                    ? "clip selected"
                    : "clip"
                }
                onClick={() => {
                  setSelected(clip.id);
                  setMedia(clip);
                }}
              >

                <b>{index + 1}</b>
                {clip.name}

              </button>

            ))}

            {!clips.length && (
              <div className="timelineEmpty">
                Imported clips yahan dikhenge
              </div>
            )}

          </div>

          <div className="timelineButtons">

            <button onClick={splitClip}>
              ✂ Split
            </button>

            <button onClick={duplicateClip}>
              ▣ Duplicate
            </button>

            <button onClick={deleteClip}>
              🗑 Delete
            </button>

          </div>

        </section>

        <section className="tools">

          <div className="tabs">

            {[
              "Media",
              "Text",
              "Audio",
              "Adjust",
              "Transform",
              "Stickers",
              "Captions"
            ].map((item) => (

              <button
                key={item}
                className={
                  tool === item ? "active" : ""
                }
                onClick={() => setTool(item)}
              >
                {item}
              </button>

            ))}

          </div>

          <div className="toolContent">

            {tool === "Media" && (

              <div className="grid">

                <button
                  className="tool"
                  onClick={() =>
                    fileInput.current?.click()
                  }
                >
                  <b>＋</b>
                  Import
                </button>

                <button
                  className="tool"
                  onClick={duplicateClip}
                >
                  <b>▣</b>
                  Duplicate
                </button>

                <button
                  className="tool"
                  onClick={splitClip}
                >
                  <b>✂</b>
                  Split
                </button>

                <button
                  className="tool"
                  onClick={deleteClip}
                >
                  <b>⌫</b>
                  Delete
                </button>

              </div>

            )}

            {tool === "Text" && (

              <div className="form">

                <textarea
                  value={text}
                  onChange={(e) =>
                    setText(e.target.value)
                  }
                  placeholder="Apna text likhein..."
                />

                <button
                  className="mainButton"
                  onClick={addText}
                >
                  Add Text
                </button>

              </div>

            )}

            {tool === "Audio" && (

              <div className="form">

                <label className="upload">

                  🎵 Music / Audio

                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file =
                        e.target.files?.[0];

                      if (file) {
                        alert(
                          `Audio selected: ${file.name}`
                        );
                      }
                    }}
                  />

                </label>

                <button
                  className="secondary"
                  onClick={() =>
                    alert(
                      "Voice recording ko MediaRecorder se connect kiya ja sakta hai."
                    )
                  }
                >
                  🎙 Voice Record
                </button>

              </div>

            )}

            {tool === "Adjust" && (

              <div className="controls">

                <label>
                  Brightness
                  <b>{brightness}</b>

                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) =>
                      setBrightness(+e.target.value)
                    }
                  />

                </label>

                <label>
                  Contrast
                  <b>{contrast}</b>

                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={contrast}
                    onChange={(e) =>
                      setContrast(+e.target.value)
                    }
                  />

                </label>

                <label>
                  Saturation
                  <b>{saturation}</b>

                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) =>
                      setSaturation(+e.target.value)
                    }
                  />

                </label>

              </div>

            )}

            {tool === "Transform" && (

              <div className="grid">

                <button
                  className="tool"
                  onClick={() =>
                    setRotate((r) => r + 90)
                  }
                >
                  ↻
                  Rotate
                </button>

                <button
                  className="tool"
                  onClick={() =>
                    setRotate((r) => r - 90)
                  }
                >
                  ↺
                  Rotate Back
                </button>

                <button
                  className="tool"
                  onClick={() =>
                    setScale((s) =>
                      Math.min(2, s + 0.1)
                    )
                  }
                >
                  ＋ Zoom
                </button>

                <button
                  className="tool"
                  onClick={() =>
                    setScale((s) =>
                      Math.max(0.5, s - 0.1)
                    )
                  }
                >
                  − Zoom
                </button>

                <button
                  className="tool"
                  onClick={() =>
                    setSpeed((s) =>
                      s >= 2 ? 0.5 : s + 0.5
                    )
                  }
                >
                  {speed}× Speed
                </button>

              </div>

            )}

            {tool === "Stickers" && (

              <div className="stickers">

                {[
                  "✨",
                  "🔥",
                  "❤️",
                  "😂",
                  "⭐",
                  "🎉",
                  "🚀",
                  "💯",
                  "🎵",
                  "🌈"
                ].map((emoji) => (

                  <button
                    key={emoji}
                    onClick={() =>
                      addSticker(emoji)
                    }
                  >
                    {emoji}
                  </button>

                ))}

              </div>

            )}

            {tool === "Captions" && (

              <div className="form">

                <button
                  className="mainButton"
                  onClick={() =>
                    alert(
                      "Real auto captions ke liye speech-to-text API ko backend se connect karna hoga."
                    )
                  }
                >
                  ✨ Auto Captions
                </button>

                <p className="info">
                  Production version me API key ko frontend
                  me nahi rakhna chahiye.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>

      <input
        ref={fileInput}
        type="file"
        accept="video/*,image/*"
        hidden
        onChange={importMedia}
      />

    </div>
  );
}