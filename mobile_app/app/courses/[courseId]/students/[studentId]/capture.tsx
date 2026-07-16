import { api, FaceCheckResult } from '../../../../../lib/api';
import axios from 'axios';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Stage = 'camera' | 'checking' | 'result' | 'submitting';

export default function CaptureScreen() {
    const { courseId, studentId } = useLocalSearchParams<{ courseId: string; studentId: string }>();
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const [stage, setStage] = useState<Stage>('camera');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [result, setResult] = useState<FaceCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!permission) {
        return <View style={styles.center} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.message}>Camera access is required to verify attendance.</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant Camera Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const buildPhotoFormPart = (uri: string) => ({
        uri,
        name: 'capture.jpg',
        type: 'image/jpeg',
    });

    const capture = async () => {
        if (!cameraRef.current) return;

        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        if (!photo) return;

        setPhotoUri(photo.uri);
        setStage('checking');
        setError(null);

        try {
            const formData = new FormData();
            formData.append('student_id', studentId);
            formData.append('course_id', courseId);
            formData.append('photo', buildPhotoFormPart(photo.uri) as unknown as Blob);

            const response = await api.post<FaceCheckResult>('/invigilator/attendances/check', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setResult(response.data);
            setStage('result');
        } catch (err) {
            const message = axios.isAxiosError(err) ? (err.response?.data as { message?: string } | undefined)?.message : undefined;
            setError(message ?? 'Could not verify the photo. Please try again.');
            setStage('camera');
        }
    };

    const retake = () => {
        setPhotoUri(null);
        setResult(null);
        setError(null);
        setStage('camera');
    };

    const submit = async (status: 'matched' | 'mismatch_confirmed' | 'absent') => {
        setStage('submitting');

        try {
            const formData = new FormData();
            formData.append('student_id', studentId);
            formData.append('course_id', courseId);
            formData.append('status', status);

            if (result) {
                formData.append('match_score', String(result.match_score));
            }

            if (status !== 'absent' && photoUri) {
                formData.append('photo', buildPhotoFormPart(photoUri) as unknown as Blob);
            }

            await api.post('/invigilator/attendances', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            router.back();
        } catch {
            Alert.alert('Error', 'Could not save attendance. Please try again.');
            setStage('result');
        }
    };

    if (stage === 'camera') {
        return (
            <View style={styles.container}>
                <CameraView ref={cameraRef} style={styles.camera} facing="back" />
                {error && <Text style={styles.error}>{error}</Text>}
                <TouchableOpacity style={styles.button} onPress={capture}>
                    <Text style={styles.buttonText}>Capture Photo</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (stage === 'checking') {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.message}>Checking face match…</Text>
            </View>
        );
    }

    const isMatch = result?.is_match ?? false;

    return (
        <View style={styles.container}>
            {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}

            <View style={styles.resultBox}>
                <Text style={isMatch ? styles.matchText : styles.mismatchText}>
                    {isMatch ? 'Face Match' : 'Face Mismatch'}
                </Text>
                <Text style={styles.scoreText}>Match score: {result?.match_score}%</Text>
            </View>

            {stage === 'submitting' ? (
                <ActivityIndicator size="large" />
            ) : isMatch ? (
                <TouchableOpacity style={styles.button} onPress={() => submit('matched')}>
                    <Text style={styles.buttonText}>Confirm Attendance</Text>
                </TouchableOpacity>
            ) : (
                <>
                    <TouchableOpacity style={styles.button} onPress={() => submit('mismatch_confirmed')}>
                        <Text style={styles.buttonText}>Mark Present Anyway</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => submit('absent')}>
                        <Text style={styles.buttonText}>Mark Absent</Text>
                    </TouchableOpacity>
                </>
            )}

            {stage !== 'submitting' && (
                <TouchableOpacity style={styles.retakeButton} onPress={retake}>
                    <Text style={styles.retakeText}>Retake Photo</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
    camera: { flex: 1, borderRadius: 12, overflow: 'hidden' },
    preview: { width: '100%', height: 280, borderRadius: 12, marginBottom: 16 },
    message: { textAlign: 'center', color: '#374151' },
    error: { color: '#dc2626', textAlign: 'center', marginVertical: 8 },
    resultBox: { alignItems: 'center', marginBottom: 20 },
    matchText: { fontSize: 20, fontWeight: '700', color: '#059669' },
    mismatchText: { fontSize: 20, fontWeight: '700', color: '#dc2626' },
    scoreText: { fontSize: 14, color: '#6b7280', marginTop: 4 },
    button: {
        backgroundColor: '#111827',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 12,
    },
    secondaryButton: { backgroundColor: '#dc2626' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    retakeButton: { alignItems: 'center', marginTop: 16 },
    retakeText: { color: '#2563eb', fontWeight: '600' },
});
