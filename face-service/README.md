# face-service

A small local Node/Express microservice that extracts a 128-length face-api.js descriptor from an uploaded photo, used by the Laravel API (`App\Services\FaceMatchService`) to verify a student's identity during mobile attendance capture.

Uses `@napi-rs/canvas` (prebuilt native binaries) and the pure-JS `@tensorflow/tfjs` backend instead of `node-canvas`/`@tensorflow/tfjs-node`, since those require a C++ build toolchain (Python + node-gyp) that isn't available on every machine. Inference is slower than the native tfjs-node backend, but this service only ever processes one photo at a time (not real-time video), so it's not a practical bottleneck.

## Setup

```
cd face-service
npm install
```

Model weights are already vendored into `face-service/models/` (same files as `public/models/` used by the browser onboarding step, so descriptors are comparable).

## Run

```
node server.js
```

Listens on `http://127.0.0.1:4001` by default (override with `PORT`). Laravel's `.env` points at it via `FACE_SERVICE_URL`.

## Endpoints

- `GET /health` — `{ ok, modelsReady }`
- `POST /descriptor` — multipart `photo` field. Returns `{ success: true, descriptor: number[128] }` or `{ success: false, message }` (422) if no face was detected.
