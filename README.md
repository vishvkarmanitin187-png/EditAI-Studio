# EditFlux Real Video Editor

EditFlux is a production-ready, original web video editor built with a React + Vite frontend and a Node.js + Express + FFmpeg backend for real video processing and rendering.

---

## 📁 Complete File Tree
```
├── server.js              # Node.js + Express + FFmpeg Backend
├── package.json           # Project dependencies & scripts
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── README.md              # Documentation & deployment guide
├── public/                # Static assets & HTML
└── src/                   # React frontend application
```

---

## 🔍 Architecture Overview
- **Backend**: `server.js` (Contains Express routes for upload, trim, split, speed, rotate, volume, text overlay, and real MP4 export using `fluent-ffmpeg`).
- **Frontend**: React + Vite (Mobile-first dark video editor interface with timeline, preview, scrubbing, and toolbars).

---

## 🚀 Installation & Local Development

1. **Clone the repository & install dependencies**:
   ```bash
   git clone https://github.com/your-username/editflux.git
   cd editflux
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and set your variables:
   ```bash
   cp .env.example .env
   ```

3. **Run the Backend Server & Frontend**:
   ```bash
   npm start
   ```

---

## 🚀 GitHub Upload Instructions

1. Initialize git in your local project directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: EditFlux video editor"
   ```
2. Create a new repository on GitHub.
3. Link your remote and push:
   ```bash
   git remote add origin https://github.com/your-username/editflux.git
   git branch -M main
   git push -u origin main
   ```

---

## 🌐 Deployment Instructions

### 1. Vercel Frontend Deployment
*Note: Vercel serverless functions cannot reliably run heavy FFmpeg video rendering tasks. Deploy the React frontend to Vercel and point it to your dedicated Node/FFmpeg backend.*

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Build Command: `npm run build`
4. Set the Output Directory: `dist`
5. Add Environment Variable in Vercel Dashboard:
   - `VITE_API_URL` = `https://your-backend-server.render.com` (or your cloud server URL)

### 2. Backend Deployment (Render / Railway / Docker VPS)
*Deploy `server.js` and FFmpeg to a container or server supporting FFmpeg:*

1. Create a Web Service on Render.com or Railway.app connected to your GitHub repository.
2. Ensure the build command installs FFmpeg (Render/Railway node environments include FFmpeg or buildpacks install it automatically).
3. Start Command: `node server.js`
4. Set Environment Variables:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
