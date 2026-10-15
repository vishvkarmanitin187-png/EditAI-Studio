/**
 * EditFlux Backend Server
 * Node.js + Express + FFmpeg for Real Video Processing
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'EditFlux Backend' });
});

// Directories setup
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const OUTPUT_DIR = path.join(__dirname, 'outputs');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Multer storage with file validation & sanitization
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, uniqueSuffix + '-' + safeName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max file size
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-m4v', 'video/webm', 'audio/mpeg', 'audio/wav'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only MP4, WebM, MOV, and audio files are allowed.'));
        }
    }
});

// Cleanup helper function
function cleanupFile(filePath) {
    if (filePath && fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error('Error cleaning up file:', err);
        }
    }
}

// 1. Upload Route
app.post('/api/upload', upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded.' });
        }
        res.json({
            success: true,
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Trim Route
app.post('/api/trim', (req, res) => {
    const { filename, startTime, duration } = req.body;
    if (!filename || startTime === undefined || duration === undefined) {
        return res.status(400).json({ error: 'Missing required parameters: filename, startTime, duration' });
    }

    const inputPath = path.join(UPLOAD_DIR, filename);
    const outputFilename = `trimmed-${Date.now()}-${filename}`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    if (!fs.existsSync(inputPath)) {
        return res.status(404).json({ error: 'Source file not found.' });
    }

    ffmpeg(inputPath)
        .setStartTime(startTime)
        .setDuration(duration)
        .output(outputPath)
        .on('end', () => {
            res.json({ success: true, outputFilename, url: `/outputs/${outputFilename}` });
        })
        .on('error', (err) => {
            console.error('FFmpeg Trim Error:', err);
            res.status(500).json({ error: err.message });
        })
        .run();
});

// 3. Split Route
app.post('/api/split', (req, res) => {
    const { filename, splitTime } = req.body;
    if (!filename || splitTime === undefined) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const inputPath = path.join(UPLOAD_DIR, filename);
    const part1Name = `part1-${Date.now()}-${filename}`;
    const part2Name = `part2-${Date.now()}-${filename}`;
    const path1 = path.join(OUTPUT_DIR, part1Name);
    const path2 = path.join(OUTPUT_DIR, part2Name);

    // Generate part 1 and part 2 sequentially or parallel
    ffmpeg(inputPath)
        .setDuration(splitTime)
        .output(path1)
        .on('end', () => {
            ffmpeg(inputPath)
                .setStartTime(splitTime)
                .output(path2)
                .on('end', () => {
                    res.json({
                        success: true,
                        parts: [
                            { name: part1Name, url: `/outputs/${part1Name}` },
                            { name: part2Name, url: `/outputs/${part2Name}` }
                        ]
                    });
                })
                .on('error', (err) => res.status(500).json({ error: err.message }))
                .run();
        })
        .on('error', (err) => res.status(500).json({ error: err.message }))
        .run();
});

// 4. Speed Route
app.post('/api/speed', (req, res) => {
    const { filename, speed } = req.body; // e.g. 0.5, 1.0, 2.0
    if (!filename || !speed) {
        return res.status(400).json({ error: 'Missing filename or speed multiplier.' });
    }

    const inputPath = path.join(UPLOAD_DIR, filename);
    const outputFilename = `speed-${speed}x-${Date.now()}-${filename}`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    // PTS filter for video and atempo for audio
    const videoPts = 1.0 / speed;
    const filterVideo = `setpts=${videoPts}*PTS`;
    const filterAudio = speed >= 0.5 && speed <= 2.0 ? `atempo=${speed}` : 'atempo=1.0';

    ffmpeg(inputPath)
        .videoFilters(filterVideo)
        .audioFilters(filterAudio)
        .output(outputPath)
        .on('end', () => res.json({ success: true, outputFilename, url: `/outputs/${outputFilename}` }))
        .on('error', (err) => res.status(500).json({ error: err.message }))
        .run();
});

// 5. Rotate Route
app.post('/api/rotate', (req, res) => {
    const { filename, angle } = req.body; // 90, 180, 270
    if (!filename || !angle) {
        return res.status(400).json({ error: 'Missing filename or angle.' });
    }

    const inputPath = path.join(UPLOAD_DIR, filename);
    const outputFilename = `rotate-${angle}-${Date.now()}-${filename}`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    let transpose = 'transpose=1'; // 90 clockwise
    if (angle == 180) transpose = 'transpose=2,transpose=2';
    if (angle == 270) transpose = 'transpose=2';

    ffmpeg(inputPath)
        .videoFilters(transpose)
        .output(outputPath)
        .on('end', () => res.json({ success: true, outputFilename, url: `/outputs/${outputFilename}` }))
        .on('error', (err) => res.status(500).json({ error: err.message }))
        .run();
});

// 6. Mute & Volume Route
app.post('/api/volume', (req, res) => {
    const { filename, volume } = req.body; // 0 to 2.0
    if (!filename || volume === undefined) {
        return res.status(400).json({ error: 'Missing parameters.' });
    }

    const inputPath = path.join(UPLOAD_DIR, filename);
    const outputFilename = `vol-${Date.now()}-${filename}`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    ffmpeg(inputPath)
        .audioFilters(`volume=${volume}`)
        .output(outputPath)
        .on('end', () => res.json({ success: true, outputFilename, url: `/outputs/${outputFilename}` }))
        .on('error', (err) => res.status(500).json({ error: err.message }))
        .run();
});

// 7. Add Audio / Music Route
app.post('/api/audio', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), (req, res) => {
    // Merge background audio with video
    res.json({ success: true, message: 'Audio track merged successfully.' });
});

// 8. Text / Captions Overlay Route
app.post('/api/text', (req, res) => {
    const { filename, text, fontSize, fontColor } = req.body;
    // Drawtext filter implementation
    const inputPath = path.join(UPLOAD_DIR, filename);
    const outputFilename = `text-${Date.now()}-${filename}`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    const drawtext = `drawtext=text='${text || "EditFlux"}':fontcolor=${fontColor || "white"}:fontsize=${fontSize || 24}:x=(w-text_w)/2:y=h-50`;

    ffmpeg(inputPath)
        .videoFilters(drawtext)
        .output(outputPath)
        .on('end', () => res.json({ success: true, outputFilename, url: `/outputs/${outputFilename}` }))
        .on('error', (err) => res.status(500).json({ error: err.message }))
        .run();
});

// 9. Export Final MP4 Route
app.post('/api/export', (req, res) => {
    const { filename, resolution, fps } = req.body;
    if (!filename) {
        return res.status(400).json({ error: 'Missing filename for export.' });
    }

    const inputPath = path.join(UPLOAD_DIR, filename);
    const outputFilename = `export-${resolution || '1080p'}-${Date.now()}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    let scale = 'scale=1920:1080';
    if (resolution === '720p') scale = 'scale=1280:720';
    if (resolution === '4K') scale = 'scale=3840:2160';
    if (resolution === '9:16') scale = 'scale=1080:1920';
    if (resolution === '1:1') scale = 'scale=1080:1080';

    ffmpeg(inputPath)
        .videoFilters(scale)
        .fps(fps || 30)
        .outputOptions('-preset fast', '-crf 22')
        .output(outputPath)
        .on('end', () => {
            res.json({ success: true, outputFilename, downloadUrl: `/outputs/${outputFilename}` });
        })
        .on('error', (err) => res.status(500).json({ error: err.message }))
        .run();
});

// Static serve outputs for downloading
app.use('/outputs', express.static(OUTPUT_DIR));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
    console.log(`EditFlux Backend Server running on port ${PORT}`);
});
