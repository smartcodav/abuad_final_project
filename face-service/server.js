const path = require('path');
const express = require('express');
const multer = require('multer');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData, loadImage } = require('@napi-rs/canvas');

// face-api.js calls `createCanvasElement()` with no arguments and sets width/height
// afterwards, but @napi-rs/canvas's Canvas constructor requires numeric dimensions
// up front — supply a placeholder size that gets immediately resized.
faceapi.env.monkeyPatch({
    Canvas,
    Image,
    ImageData,
    createCanvasElement: () => new Canvas(1, 1),
});

const MODELS_PATH = path.join(__dirname, 'models');
const PORT = process.env.PORT || 4001;

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const app = express();

let modelsReady = false;

async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
    modelsReady = true;
    console.log('face-api.js models loaded.');
}

app.get('/health', (req, res) => {
    res.json({ ok: true, modelsReady });
});

app.post('/descriptor', upload.single('photo'), async (req, res) => {
    if (!modelsReady) {
        return res.status(503).json({ success: false, message: 'Models are still loading, try again shortly.' });
    }

    if (!req.file) {
        return res.status(422).json({ success: false, message: 'No photo was uploaded.' });
    }

    try {
        const image = await loadImage(req.file.buffer);
        const detection = await faceapi
            .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            return res.status(422).json({ success: false, message: 'No face detected in the captured photo.' });
        }

        return res.json({ success: true, descriptor: Array.from(detection.descriptor) });
    } catch (error) {
        console.error('Failed to process photo:', error);
        return res.status(500).json({ success: false, message: 'Failed to process the photo.' });
    }
});

loadModels()
    .then(() => {
        app.listen(PORT, () => console.log(`face-service listening on http://127.0.0.1:${PORT}`));
    })
    .catch((error) => {
        console.error('Failed to load face-api.js models:', error);
        process.exit(1);
    });
