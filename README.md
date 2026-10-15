# EditFlux Web Editor Pro

This package upgrades the starter editor with:
- FFmpeg WASM MP4 export attempt (720p / 1080p / 4K)
- WebM export fallback
- Browser SpeechRecognition auto-caption mode where supported
- Production API skeleton for captions/background removal/AI editing
- Monetization hooks without fake ad views or fake rewards
- Environment-variable guidance for private API keys

Important:
1. Browser-side FFmpeg can be heavy on mobile devices. For reliable large/4K exports, use server-side FFmpeg/WebCodecs infrastructure.
2. Real Google rewarded ads require your approved ad account/SDK setup and verified reward callbacks. Do not simulate ad completion.
3. Real AI editing/background removal/captioning requires a provider and a backend endpoint.
4. Firebase/Google login can be added by putting the public Firebase configuration in config.js and using Firebase Auth; private service credentials stay server-side.

Static deployment:
- Upload index.html, style.css, app.js and config.js to Vercel/static hosting.
Backend:
- server.js is an integration skeleton; adapt it to Vercel Functions or another Node server.
