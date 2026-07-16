# Invigilator Mobile App

Expo (React Native + TypeScript, Expo Router) app used by invigilators to log in with the credentials the admin created for them and take exam attendance with live face verification.

## Setup

```
cd mobile_app
npm install
cp .env.example .env
```

Edit `.env` and set `EXPO_PUBLIC_API_URL` to your machine's **LAN IP** (not `localhost`/`127.0.0.1` — a physical device or emulator can't reach those), e.g. `http://192.168.1.100:8000/api`. Find your IP with `ipconfig` (Windows).

Start Laravel so it listens on the LAN interface, not just localhost:

```
php artisan serve --host=0.0.0.0 --port=8000
```

Also start the face-matching microservice (`../face-service`, see its own README) so attendance capture works — run `node server.js` from `face-service/`.

## Run

```
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) on a device connected to the **same network** as the dev machine. Make sure Windows Firewall allows inbound connections on port 8000 (Laravel) and 8081 (Metro).

## What it does

- `app/login.tsx` — invigilator logs in with email/password (issues a Sanctum token, stored via `expo-secure-store`).
- `app/index.tsx` — lists courses with registered students for the active academic session/semester.
- `app/courses/[courseId]/students.tsx` — lists onboarded, registered students for a course and their attendance status.
- `app/courses/[courseId]/students/[studentId]/capture.tsx` — camera capture → face match check → invigilator confirms/overrides → attendance is recorded.
