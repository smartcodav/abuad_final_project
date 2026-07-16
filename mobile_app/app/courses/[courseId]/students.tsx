import { api, ApiStudent } from '../../../lib/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STATUS_LABELS: Record<string, string> = {
    matched: 'Present (matched)',
    mismatch_confirmed: 'Present (override)',
    absent: 'Absent',
};

export default function CourseStudentsScreen() {
    const { courseId } = useLocalSearchParams<{ courseId: string }>();
    const router = useRouter();
    const [students, setStudents] = useState<ApiStudent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadStudents = useCallback(async () => {
        setError(null);

        try {
            const response = await api.get<{ students: ApiStudent[] }>(`/invigilator/courses/${courseId}/students`);
            setStudents(response.data.students);
        } catch {
            setError('Could not load students. Pull down to retry.');
        }
    }, [courseId]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await loadStudents();
            setIsLoading(false);
        })();
    }, [loadStudents]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadStudents();
        setIsRefreshing(false);
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {error && <Text style={styles.error}>{error}</Text>}

            <FlatList
                data={students}
                keyExtractor={(student) => String(student.id)}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                contentContainerStyle={students.length === 0 ? styles.center : undefined}
                ListEmptyComponent={<Text style={styles.empty}>No onboarded, registered students for this course yet.</Text>}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => router.push(`/courses/${courseId}/students/${item.id}/capture`)}
                    >
                        {item.photo_url ? (
                            <Image source={{ uri: item.photo_url }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]} />
                        )}

                        <View style={styles.rowText}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.matric}>{item.matric_number}</Text>
                        </View>

                        <Text style={item.latest_attendance ? styles.statusMarked : styles.statusPending}>
                            {item.latest_attendance ? STATUS_LABELS[item.latest_attendance.status] : 'Not marked'}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    error: { color: '#dc2626', padding: 16 },
    empty: { color: '#666', textAlign: 'center' },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginHorizontal: 16,
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
    avatarPlaceholder: { backgroundColor: '#e5e7eb' },
    rowText: { flex: 1 },
    name: { fontSize: 15, fontWeight: '600' },
    matric: { fontSize: 12, color: '#6b7280', marginTop: 2 },
    statusMarked: { fontSize: 12, color: '#059669', fontWeight: '600' },
    statusPending: { fontSize: 12, color: '#9ca3af' },
});
