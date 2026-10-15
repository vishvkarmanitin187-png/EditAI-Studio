// Optional Vercel/Node backend skeleton.
// Put secrets only in server environment variables.
// This file does NOT fake AI results or ad rewards.
import express from "express";
import cors from "cors";

const app=express();
app.use(cors());
app.use(express.json({limit:"10mb"}));

app.get("/api/health",(req,res)=>res.json({ok:true,service:"EditFlux API"}));

app.post("/api/captions",async(req,res)=>{
  // Connect your chosen speech-to-text provider here.
  // Keep the provider key in process.env, never in frontend code.
  if(!process.env.SPEECH_API_KEY)
    return res.status(501).json({error:"Speech API not configured"});
  return res.status(501).json({error:"Implement provider-specific transcription here"});
});

app.post("/api/background-remove",async(req,res)=>{
  if(!process.env.BG_REMOVE_API_KEY)
    return res.status(501).json({error:"Background removal API not configured"});
  return res.status(501).json({error:"Implement provider-specific background removal here"});
});

app.post("/api/image-edit",async(req,res)=>{
  if(!process.env.AI_API_KEY)
    return res.status(501).json({error:"AI API not configured"});
  return res.status(501).json({error:"Implement provider-specific image editing here"});
});

export default app;
