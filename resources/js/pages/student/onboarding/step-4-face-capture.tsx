import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFaceApiModels } from '@/hooks/use-face-api-models';
import StudentOnboardingLayout from '@/layouts/student-onboarding-layout';
import { Head, router } from '@inertiajs/react';
import * as faceapi from 'face-api.js';
import { useRef, useState } from 'react';

type CaptureState = 'idle' | 'detecting' | 'captured' | 'submitting';

export default function FaceCapture() {
    const modelState = useFaceApiModels();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [cameraReady, setCameraReady] = useState(false);
    const [captureState, setCaptureState] = useState<CaptureState>('idle');
    const [detectionError, setDetectionError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [descriptor, setDescriptor] = useState<number[] | null>(null);
    const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraReady(true);
            }
        } catch {
            setDetectionError('Could not access your camera. Please grant camera permission and try again.');
        }
    };

    const capture = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setCaptureState('detecting');
        setDetectionError(null);

        const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            setDetectionError('No face detected. Please center your face in the frame and ensure good lighting.');
            setCaptureState('idle');
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) {
                setDetectionError('Could not capture the photo. Please try again.');
                setCaptureState('idle');
                return;
            }

            setPhotoBlob(blob);
            setPreviewUrl(URL.createObjectURL(blob));
            setDescriptor(Array.from(detection.descriptor));
            setCaptureState('captured');

            const stream = video.srcObject as MediaStream | null;
            stream?.getTracks().forEach((track) => track.stop());
        }, 'image/jpeg');
    };

    const retake = () => {
        setCaptureState('idle');
        setPreviewUrl(null);
        setDescriptor(null);
        setPhotoBlob(null);
        setCameraReady(false);
        void startCamera();
    };

    const submit = () => {
        if (!descriptor || !photoBlob) return;

        setCaptureState('submitting');
        setServerError(null);

        const formData = new FormData();
        formData.append('photo', photoBlob, 'passport.jpg');
        descriptor.forEach((value, index) => formData.append(`descriptor[${index}]`, String(value)));

        router.post(route('student.onboarding.step4.store'), formData, {
            onError: (errors) => {
                setServerError(errors.photo ?? errors.descriptor ?? 'Something went wrong. Please try again.');
                setCaptureState('captured');
            },
        });
    };

    return (
        <StudentOnboardingLayout step={4}>
            <Head title="Face Capture" />

            <Card>
                <CardHeader>
                    <CardTitle>Face Capture</CardTitle>
                    <CardDescription>
                        We need a clear photo of your face to verify your identity at examination venues. Look directly at the camera in a
                        well-lit area.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {modelState === 'loading' && <p className="text-sm text-muted-foreground">Loading face recognition models…</p>}
                    {modelState === 'error' && (
                        <p className="text-sm text-destructive">Failed to load face recognition models. Please refresh the page.</p>
                    )}

                    {modelState === 'ready' && (
                        <>
                            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border bg-muted">
                                {captureState !== 'captured' && captureState !== 'submitting' ? (
                                    // eslint-disable-next-line jsx-a11y/media-has-caption
                                    <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
                                ) : (
                                    previewUrl && <img src={previewUrl} alt="Captured face" className="h-full w-full object-cover" />
                                )}
                            </div>
                            <canvas ref={canvasRef} className="hidden" />

                            <InputError message={detectionError ?? undefined} />
                            <InputError message={serverError ?? undefined} />

                            <div className="flex gap-2">
                                {!cameraReady && captureState === 'idle' && <Button onClick={startCamera}>Start Camera</Button>}

                                {cameraReady && captureState === 'idle' && <Button onClick={capture}>Capture Photo</Button>}

                                {captureState === 'detecting' && <Button disabled>Detecting face…</Button>}

                                {captureState === 'captured' && (
                                    <>
                                        <Button onClick={submit}>Use This Photo</Button>
                                        <Button variant="outline" onClick={retake}>
                                            Retake
                                        </Button>
                                    </>
                                )}

                                {captureState === 'submitting' && <Button disabled>Uploading…</Button>}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </StudentOnboardingLayout>
    );
}
