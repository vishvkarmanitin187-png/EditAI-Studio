const $=s=>document.querySelector(s);
const video=$("#video"), imageLayer=$("#imageLayer"), mediaInput=$("#mediaInput");
const empty=$("#emptyPreview"), clips=$("#clips"), drawer=$("#drawer");
let media=[], selected=null, audioEl=null, audioURL=null, text="";

function fmt(t){if(!isFinite(t))t=0;let m=Math.floor(t/60),s=Math.floor(t%60);return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")}
function openDrawer(html){drawer.innerHTML=html;drawer.classList.add("open")}
function closeDrawer(){drawer.classList.remove("open");drawer.innerHTML=""}

$("#chooseMedia").onclick=()=>mediaInput.click();
mediaInput.onchange=e=>{[...e.target.files].forEach(addMedia);mediaInput.value=""};
function addMedia(file){
  const url=URL.createObjectURL(file);
  const item={id:crypto.randomUUID(),file,url,type:file.type.startsWith("video")?"video":"image",name:file.name,duration:0};
  media.push(item); renderTimeline(); selectMedia(item);
}
function renderTimeline(){
  clips.innerHTML="";
  media.forEach(item=>{
    const c=document.createElement("div"); c.className="clip"+(selected?.id===item.id?" selected":""); c.dataset.id=item.id;
    if(item.type==="video"){const v=document.createElement("video");v.src=item.url;v.muted=true;c.appendChild(v)}
    else {const im=document.createElement("img");im.src=item.url;c.appendChild(im)}
    const sp=document.createElement("span");sp.textContent=item.type==="video"?item.name:"PHOTO";c.appendChild(sp);
    c.onclick=()=>selectMedia(item); clips.appendChild(c);
  });
}
function selectMedia(item){
  selected=item;renderTimeline();empty.style.display="none";
  if(item.type==="video"){
    imageLayer.classList.remove("active");video.classList.add("active");video.src=item.url;video.load();
    video.onloadedmetadata=()=>{item.duration=video.duration;$("#timeLabel").textContent=`00:00 / ${fmt(video.duration)}`}
  }else{
    video.pause();video.classList.remove("active");imageLayer.classList.add("active");imageLayer.src=item.url;
    $("#timeLabel").textContent="00:00 / 03:00";
  }
}
$("#playBtn").onclick=()=>{
  if(!selected)return;
  if(selected.type==="video"){video.paused?video.play():video.pause()}
};
video.ontimeupdate=()=>{$("#timeLabel").textContent=`${fmt(video.currentTime)} / ${fmt(video.duration)}`};
$("#muteBtn").onclick=()=>{video.muted=!video.muted;$("#muteBtn").textContent=video.muted?"🔇":"🔊"};

$("#addAudioBtn").onclick=()=>$("#audioInput").click();
$("#audioInput").onchange=e=>{
 const f=e.target.files[0];if(!f)return;
 audioURL=URL.createObjectURL(f);audioEl=new Audio(audioURL);audioEl.loop=true;
 openDrawer(`<h3>Audio</h3><p>${f.name}</p><div class="row"><label>Volume</label><input id="av" type="range" min="0" max="1" step=".01" value="1"></div><button class="primary" id="playAudio">Play/Pause</button>`);
 $("#av").oninput=e=>audioEl.volume=e.target.value;
 $("#playAudio").onclick=()=>audioEl.paused?audioEl.play():audioEl.pause();
};

document.querySelectorAll("[data-tool]").forEach(b=>b.onclick=()=>tool(b.dataset.tool));
function tool(t){
 if(t==="text")return textTool();
 if(t==="adjust")return adjustTool();
 if(t==="filters")return filtersTool();
 if(t==="sticker")return stickerTool();
 if(t==="transform")return transformTool();
 if(t==="audio")return $("#addAudioBtn").click();
 if(t==="overlay")return overlayTool();
 if(t==="effects")return effectsTool();
 if(t==="captions")return captionsTool();
 if(t==="voice")return voiceTool();
 if(t==="cutout")return cutoutTool();
}
function textTool(){
 openDrawer(`<h3>Text</h3><input id="txt" type="text" placeholder="Text..."><div class="grid">
<button class="option" data-font="Arial">Classic Light</button><button class="option" data-font="Impact">Modern Bold</button><button class="option" data-font="Georgia">Poster</button>
</div><div class="row"><label>Size</label><input id="ts" type="range" min="12" max="100" value="30"></div><button class="option" id="addText">Add Text</button>`);
 $("#txt").oninput=e=>{text=e.target.value;updateText()};
 $("#ts").oninput=e=>{$("#textLayer").firstElementChild?.style.setProperty("font-size",e.target.value+"px")};
 document.querySelectorAll("[data-font]").forEach(x=>x.onclick=()=>{$("#textLayer").firstElementChild?.style.setProperty("font-family",x.dataset.font)});
 $("#addText").onclick=()=>{const d=document.createElement("div");d.className="textItem";d.textContent=text||"EditFlux";$("#textLayer").appendChild(d)}
}
function updateText(){if($("#textLayer").firstElementChild)$("#textLayer").firstElementChild.textContent=text}
function adjustTool(){
 openDrawer(`<h3>Adjust</h3>${["brightness","contrast","saturate","blur"].map(x=>`<div class="row"><label>${x}</label><input class="adj" data-a="${x}" type="range" min="0" max="200" value="${x==="blur"?0:100}"></div>`).join("")}`);
 document.querySelectorAll(".adj").forEach(r=>r.oninput=applyAdjust);
}
function applyAdjust(){
 const vals={brightness:100,contrast:100,saturate:100,blur:0};
 document.querySelectorAll(".adj").forEach(r=>vals[r.dataset.a]=r.value);
 video.style.filter=`brightness(${vals.brightness}%) contrast(${vals.contrast}%) saturate(${vals.saturate}%) blur(${vals.blur}px)`;
 imageLayer.style.filter=video.style.filter;
}
function filtersTool(){
 const fs=[["Original","none"],["Vivid","saturate(1.6) contrast(1.1)"],["Warm","sepia(.25) saturate(1.2)"],["Cool","hue-rotate(20deg)"],["B&W","grayscale(1)"],["Vintage","sepia(.45) contrast(1.1)"]];
 openDrawer(`<h3>Filters</h3><div class="grid">${fs.map(f=>`<button class="option" data-filter="${f[1]}">${f[0]}</button>`).join("")}</div>`);
 document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{video.style.filter=b.dataset.filter;imageLayer.style.filter=b.dataset.filter});
}
function stickerTool(){
 openDrawer(`<h3>Stickers</h3><div class="grid">${["😀","🔥","❤️","✨","😂","🎉","👍","⭐","😎"].map(x=>`<button class="option stickerBtn">${x}</button>`).join("")}</div>`);
 document.querySelectorAll(".stickerBtn").forEach(b=>b.onclick=()=>{const d=document.createElement("div");d.className="stickerItem";d.textContent=b.textContent;$("#stickerLayer").appendChild(d)});
}
function transformTool(){
 openDrawer(`<h3>Transform</h3><div class="grid"><button class="option" id="rot">Rotate 90°</button><button class="option" id="flip">Mirror</button><button class="option" id="reset">Reset</button></div>`);
 $("#rot").onclick=()=>{video.style.transform=(video.style.transform||"")+" rotate(90deg)";imageLayer.style.transform=video.style.transform};
 $("#flip").onclick=()=>{video.style.transform="scaleX(-1)";imageLayer.style.transform=video.style.transform};
 $("#reset").onclick=()=>{video.style.transform=imageLayer.style.transform="none"};
}
function overlayTool(){openDrawer(`<h3>Overlay</h3><p>Use the Media + button to add another image/video, then position it with Transform.</p>`)}
function effectsTool(){openDrawer(`<h3>Effects</h3><div class="grid"><button class="option" onclick="video.style.filter='blur(3px)'">Blur</button><button class="option" onclick="video.style.filter='brightness(1.4)'">Flash</button><button class="option" onclick="video.style.opacity='.6'">Fade</button></div>`)}
function captionsTool(){openDrawer(`<h3>Captions</h3><p>Manual caption layer is available through Text. Automatic speech-to-text needs a real transcription service/API.</p><button class="option" id="captionAdd">Add Caption</button>`);$("#captionAdd").onclick=()=>textTool()}
function voiceTool(){openDrawer(`<h3>Voice</h3><p>Browser microphone recording can be connected with MediaRecorder.</p><button class="primary" id="rec">Start recording</button>`);let rec,parts=[];$("#rec").onclick=async()=>{if(!rec){const s=await navigator.mediaDevices.getUserMedia({audio:true});rec=new MediaRecorder(s);rec.ondataavailable=e=>parts.push(e.data);rec.onstop=()=>{const blob=new Blob(parts,{type:"audio/webm"});audioURL=URL.createObjectURL(blob);audioEl=new Audio(audioURL);audioEl.loop=true;openDrawer("<h3>Voice recording ready</h3><button class='primary' id='vp'>Play</button>");$("#vp").onclick=()=>audioEl.play()};rec.start();$("#rec").textContent="Stop"}else{rec.stop();rec=null}}}
function cutoutTool(){openDrawer(`<h3>Cutout / Green Screen</h3><p>Green-screen chroma key can be implemented in Canvas/WebCodecs. AI background removal requires a real external model/API.</p><div class="row"><label>Green tolerance</label><input type="range" min="0" max="100" value="40"></div>`)}
$("#renameBtn").onclick=()=>{const n=prompt("Project name",$("#projectName").textContent);if(n)$("#projectName").textContent=n};

$("#exportBtn").onclick=()=>$("#exportModal").classList.add("show");
$("#closeExport").onclick=()=>$("#exportModal").classList.remove("show");

async function exportWithFFmpeg(){
  if(!selected || selected.type!=="video"){ $("#exportStatus").textContent="पहले video clip चुनें."; return; }
  const status=$("#exportStatus"), progress=$("#exportProgress"), bar=$("#exportBar");
  status.textContent="4K/MP4 export तैयार हो रहा है...";
  progress.style.display="block"; bar.style.width="5%";
  try{
    if(!window.FFmpegWASM && !window.FFmpeg) throw new Error("FFmpeg library unavailable");
    const FFmpegClass = window.FFmpeg?.FFmpeg;
    const util = window.FFmpegUtil || {};
    if(!FFmpegClass || !util.fetchFile) throw new Error("FFmpeg browser build not loaded");
    const ffmpeg=new FFmpegClass();
    ffmpeg.on("progress", ({progress:p})=>bar.style.width=Math.max(5,Math.min(100,Math.round(p*100)))+"%");
    ffmpeg.on("log", ({message})=>{ if(message) status.textContent="Encoding: "+message.slice(-90); });
    await ffmpeg.load({coreURL:"https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js"});
    const data=await util.fetchFile(selected.url);
    await ffmpeg.writeFile("input",data);
    const q=$("#exportQuality").value;
    const scale=q==="2160"?"scale=-2:2160":q==="1080"?"scale=-2:1080":"scale=-2:720";
    await ffmpeg.exec(["-i","input","-vf",scale,"-c:v","libx264","-preset","veryfast","-crf","23","-c:a","aac","output.mp4"]);
    const out=await ffmpeg.readFile("output.mp4");
    const blob=new Blob([out.buffer],{type:"video/mp4"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${($("#projectName").textContent||"editflux").replace(/[^a-z0-9_-]/gi,"_")}-${q}p.mp4`;a.click();
    bar.style.width="100%";status.textContent="MP4 export complete.";
  }catch(err){
    console.error(err);
    status.textContent="Advanced MP4 export उपलब्ध नहीं हुआ; WebM fallback शुरू किया जा रहा है.";
    await exportWebM();
  }
}
async function exportWebM(){
  if(!selected||selected.type!=="video"){return}
  if(!video.captureStream){$("#exportStatus").textContent="इस browser में export API उपलब्ध नहीं है.";return}
  const stream=video.captureStream();
  const rec=new MediaRecorder(stream,{mimeType:"video/webm"});
  const chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
  rec.onstop=()=>{const blob=new Blob(chunks,{type:"video/webm"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="editflux-export.webm";a.click();$("#exportStatus").textContent="WebM export complete.";};
  video.currentTime=0;await video.play();rec.start();
  video.onended=()=>{rec.stop();video.onended=null};
}
$("#startExport").onclick=async()=>{
  // For a real monetized deployment, this is where your verified rewarded-ad
  // completion callback should unlock the export. No fake ad completion is used.
  const q=$("#exportQuality").value;
  if(q==="2160" && window.EDITFLUX_CONFIG?.ads?.enabled){
    // Hook for a real rewarded-ad SDK. The SDK must call the success callback
    // only after the provider confirms the reward.
    $("#exportStatus").textContent="4K export requires a verified rewarded-ad completion.";
    return;
  }
  await exportWithFFmpeg();
};

// Basic automatic captions using browser SpeechRecognition where supported.
// This creates real timed text while the microphone is speaking; for uploaded
// video transcription, connect /api/captions to a real speech-to-text service.
function startAutoCaption(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){openDrawer("<h3>Auto Captions</h3><p>इस browser में Speech Recognition उपलब्ध नहीं है। Uploaded-video captions के लिए real /api/captions service जोड़ें.</p>");return}
  const rec=new SR(); rec.lang="hi-IN"; rec.continuous=true; rec.interimResults=false;
  let started=Date.now();
  rec.onresult=e=>{
    for(let i=e.resultIndex;i<e.results.length;i++){
      const phrase=e.results[i][0].transcript.trim(); if(!phrase)continue;
      const d=document.createElement("div");d.className="textItem";d.textContent=phrase;
      d.style.top="82%";d.style.fontSize="24px";d.style.background="#000b";d.style.padding="6px 12px";d.style.borderRadius="8px";
      d.dataset.start=(Date.now()-started)/1000;$("#textLayer").appendChild(d);
    }
  };
  rec.onerror=e=>console.warn(e);
  rec.start();openDrawer("<h3>Auto Captions</h3><p>🎙 बोलना शुरू करें। Captions preview में जोड़े जा रहे हैं.</p><button class='primary' id='stopCap'>Stop</button>");
  $("#stopCap").onclick=()=>rec.stop();
}

// Replace captions tool with real browser speech recognition option.
const oldCaptionsTool=captionsTool;
captionsTool=function(){
 openDrawer(`<h3>Captions</h3><div class="grid">
 <button class="option" id="autoCap">🎙 Auto Captions</button>
 <button class="option" id="manualCap">Aa Manual</button>
 <button class="option" id="translateCap">Translate</button>
 </div>
 <p class="note">Automatic uploaded-video transcription/translation requires a real backend API. Browser speech recognition works for supported browsers.</p>`);
 $("#autoCap").onclick=startAutoCaption;
 $("#manualCap").onclick=()=>textTool();
 $("#translateCap").onclick=()=>openDrawer("<h3>Translate Captions</h3><p>Connect a translation API through /api/translate. API secrets must remain on the server.</p>");
};
