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

### Expo Go SDK compatibility

This project is pinned to **Expo SDK 54** on purpose, not the newest SDK. The Expo Go app on the Play
Store/App Store only ever supports the current-and-recent SDKs — pinning newer than what Expo Go
actually ships gives an "Project is incompatible with this version of Expo Go" error with no fix
except downgrading. If you ever bump the `expo` package, run `npx expo install --fix` immediately
after so every `expo-*`/`react-native` package stays aligned, and check
`https://exp.host/--/api/v2/versions` (the `expoGoSdkVersion` field) for the SDK the public Expo Go
build currently supports before upgrading.

## What it does

- `app/login.tsx` — invigilator logs in with email/password (issues a Sanctum token, stored via `expo-secure-store`).
- `app/index.tsx` — lists courses with registered students for the active academic session/semester.
- `app/courses/[courseId]/students.tsx` — lists onboarded, registered students for a course and their attendance status.
- `app/courses/[courseId]/students/[studentId]/capture.tsx` — camera capture → face match check → invigilator confirms/overrides → attendance is recorded.
