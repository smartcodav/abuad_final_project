import * as faceapi from 'face-api.js';
import { useEffect, useState } from 'react';

const MODEL_URL = '/models';

type ModelState = 'loading' | 'ready' | 'error';

let modelsLoadedPromise: Promise<void> | null = null;

function loadModels(): Promise<void> {
    if (!modelsLoadedPromise) {
        modelsLoadedPromise = Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]).then(() => undefined);
    }

    return modelsLoadedPromise;
}

export function useFaceApiModels(): ModelState {
    const [state, setState] = useState<ModelState>('loading');

    useEffect(() => {
        let cancelled = false;

        loadModels()
            .then(() => {
                if (!cancelled) setState('ready');
            })
            .catch(() => {
                if (!cancelled) setState('error');
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return state;
}
