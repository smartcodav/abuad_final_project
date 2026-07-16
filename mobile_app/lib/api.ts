import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
    console.warn('EXPO_PUBLIC_API_URL is not set — set it in mobile_app/.env (see .env.example).');
}

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: 'application/json',
    },
});

export function setApiToken(token: string | null) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
}

export interface ApiCourse {
    id: number;
    code: string;
    title: string;
    level: number;
    department: string;
}

export interface ApiAttendance {
    status: 'matched' | 'mismatch_confirmed' | 'absent';
    match_score: string | number | null;
    marked_at: string;
}

export interface ApiStudent {
    id: number;
    name: string;
    matric_number: string;
    photo_url: string | null;
    latest_attendance: ApiAttendance | null;
}

export interface FaceCheckResult {
    distance: number;
    match_score: number;
    is_match: boolean;
}
