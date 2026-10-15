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
$("#startExport").onclick=async()=>{
 if(!selected||selected.type!=="video"){ $("#exportStatus").textContent="पहले video clip चुनें.";return }
 if(!video.captureStream){$("#exportStatus").textContent="इस browser में export API उपलब्ध नहीं है.";return}
 $("#exportStatus").textContent="Export शुरू हो रहा है...";
 const stream=video.captureStream();
 const rec=new MediaRecorder(stream,{mimeType:"video/webm"});
 const chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
 rec.onstop=()=>{const blob=new Blob(chunks,{type:"video/webm"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="editflux-export.webm";a.click();$("#exportStatus").textContent="Export complete.";};
 video.currentTime=0;await video.play();rec.start();
 video.onended=()=>{rec.stop();video.onended=null};
};
