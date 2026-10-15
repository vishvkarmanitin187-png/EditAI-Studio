import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {FFmpeg} from '@ffmpeg/ffmpeg';
import {fetchFile,toBlobURL} from '@ffmpeg/util';
import './styles.css';

const uid=()=>crypto.randomUUID?.()||Math.random().toString(36).slice(2);

function App(){
 const videoRef=useRef(null), inputRef=useRef(null), ff=useRef(new FFmpeg());
 const [file,setFile]=useState(null),[url,setUrl]=useState(''),[duration,setDuration]=useState(0),[time,setTime]=useState(0),[playing,setPlaying]=useState(false);
 const [trim,setTrim]=useState([0,0]),[speed,setSpeed]=useState(1),[rotate,setRotate]=useState(0),[brightness,setBrightness]=useState(0),[contrast,setContrast]=useState(1),[saturation,setSaturation]=useState(1);
 const [tab,setTab]=useState('Edit'),[exporting,setExporting]=useState(false),[progress,setProgress]=useState(0),[ffReady,setFfReady]=useState(false),[clips,setClips]=useState([]),[selected,setSelected]=useState(null),[error,setError]=useState('');
 const [history,setHistory]=useState([]),[future,setFuture]=useState([]);
 const snapshot=()=>({trim:[...trim],speed,rotate,brightness,contrast,saturation});
 const save=()=>{setHistory(h=>[...h.slice(-20),snapshot()]);setFuture([])};
 const restore=s=>{setTrim(s.trim);setSpeed(s.speed);setRotate(s.rotate);setBrightness(s.brightness);setContrast(s.contrast);setSaturation(s.saturation)};
 const undo=()=>{if(!history.length)return;const s=history.at(-1);setFuture(f=>[snapshot(),...f]);setHistory(h=>h.slice(0,-1));restore(s)};
 const redo=()=>{if(!future.length)return;const s=future[0];setHistory(h=>[...h,snapshot()]);setFuture(f=>f.slice(1));restore(s)};
 useEffect(()=>()=>{if(url)URL.revokeObjectURL(url)},[url]);
 useEffect(()=>{if(duration&&!trim[1])setTrim([0,duration])},[duration]);
 useEffect(()=>{if(videoRef.current)videoRef.current.playbackRate=speed},[speed]);
 const style=useMemo(()=>({filter:`brightness(${100+brightness}%) contrast(${contrast}) saturate(${saturation})`,transform:`rotate(${rotate}deg)`}),[brightness,contrast,saturation,rotate]);
 const loadFF=async()=>{
  if(ffReady)return;
  const f=ff.current;
  f.on('progress',({progress})=>setProgress(Math.round(progress*100)));
  const base='https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await f.load({coreURL:await toBlobURL(`${base}/ffmpeg-core.js`,'text/javascript'),wasmURL:await toBlobURL(`${base}/ffmpeg-core.wasm`,'application/wasm')});
  setFfReady(true);
 };
 const importVideo=e=>{const f=e.target.files?.[0];if(!f)return;if(!f.type.startsWith('video/')){setError('Abhi video file select karein.');return}setError('');const u=URL.createObjectURL(f);setFile(f);setUrl(u);setClips([{id:uid(),name:f.name,start:0,end:0}]);setSelected(null);setTrim([0,0]);};
 const metadata=()=>{const d=videoRef.current?.duration||0;setDuration(d);setTrim([0,d]);setClips(c=>c.map(x=>({...x,end:d})));};
 const split=()=>{if(!videoRef.current||!duration)return;const t=videoRef.current.currentTime;if(t<=trim[0]+.05||t>=trim[1]-.05){setError('Playhead ko split point par rakhein.');return}save();setClips(c=>[{id:uid(),name:'Part 1',start:trim[0],end:t},{id:uid(),name:'Part 2',start:t,end:trim[1]}]);setTrim([trim[0],t]);setError('Split point set ho gaya. Export me selected range render hoga.');};
 const del=()=>{if(!file)return;save();setFile(null);setUrl('');setClips([]);setSelected(null);setDuration(0);setTrim([0,0]);};
 const exportReal=async()=>{
  if(!file)return setError('Pehle video import karein.');
  setError('');setExporting(true);setProgress(0);
  try{
   await loadFF();const f=ff.current;
   await f.writeFile('input.mp4',await fetchFile(file));
   const filters=[];if(brightness!==0||contrast!==1||saturation!==1)filters.push(`eq=brightness=${brightness/100}:contrast=${contrast}:saturation=${saturation}`);if(rotate===90)filters.push('transpose=1');if(rotate===-90||rotate===270)filters.push('transpose=2');if(Math.abs(rotate)%360===180)filters.push('hflip,vflip');
   const args=['-ss',String(trim[0]),'-i','input.mp4','-t',String(Math.max(.05,trim[1]-trim[0])),'-vf',filters.length?filters.join(','):'null','-af','atempo='+speed,'-c:v','libx264','-preset','veryfast','-crf','20','-c:a','aac','-movflags','+faststart','output.mp4'];
   if(speed===1)args.splice(args.indexOf('-af'),2);
   await f.exec(args);const data=await f.readFile('output.mp4');const blob=new Blob([data.buffer],{type:'video/mp4'});const out=URL.createObjectURL(blob);const a=document.createElement('a');a.href=out;a.download='EditFlux-export.mp4';a.click();setTimeout(()=>URL.revokeObjectURL(out),30000);
  }catch(e){console.error(e);setError('Export fail hua. Mobile browser me FFmpeg ko memory/format limitation ho sakti hai.');}
  finally{setExporting(false)}
 };
 return <div className="app">
  <header><div className="brand"><span>E</span><b>EditFlux</b></div><div className="headBtns"><button onClick={undo} disabled={!history.length}>↶</button><button onClick={redo} disabled={!future.length}>↷</button><button className="export" onClick={exportReal} disabled={exporting}>{exporting?`Export ${progress}%`:'Export'}</button></div></header>
  <main>
   <section className="stage"><div className="preview">
    {!url?<div className="empty"><div className="mark">E</div><h2>Build your story</h2><p>Video import karke real editing start karein.</p><button onClick={()=>inputRef.current?.click()}>＋ Import video</button></div>:<video ref={videoRef} src={url} style={style} onLoadedMetadata={metadata} onTimeUpdate={()=>setTime(videoRef.current?.currentTime||0)} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} controls={false}/>} 
   </div><div className="player"><button onClick={()=>{if(!videoRef.current)return;videoRef.current.paused?videoRef.current.play():videoRef.current.pause()}}>{playing?'❚❚':'▶'}</button><input type="range" min="0" max={duration||1} step="0.01" value={time} onChange={e=>{if(videoRef.current)videoRef.current.currentTime=+e.target.value;setTime(+e.target.value)}}/><span>{time.toFixed(1)} / {duration.toFixed(1)}s</span></div></section>
   <section className="timeline"><div className="tlHead"><b>Timeline</b><span>{clips.length?clips.length+' clip':'No clip'}</span></div><div className="track">{clips.map((c,i)=><button key={c.id} className={selected===c.id?'clip active':'clip'} onClick={()=>{setSelected(c.id);setTrim([c.start,c.end||duration])}}><small>{i+1}</small>{c.name}</button>)}{!clips.length&&<div className="hint">Import a video to create your timeline.</div>}</div><div className="tlActions"><button onClick={split}>✂ Split</button><button onClick={()=>{save();setTrim([trim[0],Math.max(trim[0]+.1,trim[1]-.5)])}}>✂ Trim end</button><button onClick={del}>🗑 Delete</button></div></section>
   <section className="panel"><nav>{['Media','Edit','Audio','Adjust','Transform'].map(x=><button className={tab===x?'active':''} onClick={()=>setTab(x)} key={x}>{x}</button>)}</nav><div className="body">
    {tab==='Media'&&<div className="grid"><button onClick={()=>inputRef.current?.click()}>＋<small>Import video</small></button><button onClick={()=>{if(file){save();setClips(c=>[...c,{id:uid(),name:file.name+' copy',start:trim[0],end:trim[1]}])}}}>▣<small>Duplicate clip</small></button></div>}
    {tab==='Edit'&&<div className="controls"><label>Start <b>{trim[0].toFixed(2)}s</b><input type="range" min="0" max={duration||1} step=".01" value={trim[0]} onChange={e=>{save();setTrim(t=>[Math.min(+e.target.value,t[1]-.05),t[1]])}}/></label><label>End <b>{trim[1].toFixed(2)}s</b><input type="range" min="0" max={duration||1} step=".01" value={trim[1]} onChange={e=>{save();setTrim(t=>[t[0],Math.max(+e.target.value,t[0]+.05)])}}/></label><label>Speed <b>{speed}×</b><input type="range" min=".5" max="2" step=".25" value={speed} onChange={e=>{save();setSpeed(+e.target.value)}}/></label></div>}
    {tab==='Audio'&&<div className="note">Audio track import/mix is the next production module. The current real export preserves the video's original audio.</div>}
    {tab==='Adjust'&&<div className="controls"><label>Brightness <b>{brightness}</b><input type="range" min="-1" max="1" step=".01" value={brightness} onChange={e=>{save();setBrightness(+e.target.value)}}/></label><label>Contrast <b>{contrast.toFixed(2)}</b><input type="range" min=".5" max="1.8" step=".01" value={contrast} onChange={e=>{save();setContrast(+e.target.value)}}/></label><label>Saturation <b>{saturation.toFixed(2)}</b><input type="range" min="0" max="2" step=".01" value={saturation} onChange={e=>{save();setSaturation(+e.target.value)}}/></label></div>}
    {tab==='Transform'&&<div className="grid"><button onClick={()=>{save();setRotate(r=>r+90)}}>↻<small>Rotate 90°</small></button><button onClick={()=>{save();setRotate(r=>r-90)}}>↺<small>Rotate -90°</small></button><button onClick={()=>{save();setRotate(r=>r+180)}}>⟳<small>Rotate 180°</small></button></div>}
   </div></section>
   {error&&<div className="error">{error}</div>}
  </main><input ref={inputRef} hidden type="file" accept="video/*" onChange={importVideo}/>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
