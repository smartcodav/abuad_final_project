import { api, ApiCourse } from '../lib/api';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CoursesScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [courses, setCourses] = useState<ApiCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadCourses = useCallback(async () => {
        setError(null);

        try {
            const response = await api.get<{ courses: ApiCourse[] }>('/invigilator/courses');
            setCourses(response.data.courses);
        } catch {
            setError('Could not load courses. Pull down to retry.');
        }
    }, []);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await loadCourses();
            setIsLoading(false);
        })();
    }, [loadCourses]);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await loadCourses();
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
            <View style={styles.header}>
                <Text style={styles.welcome}>Hi, {user?.name}</Text>
                <TouchableOpacity onPress={logout}>
                    <Text style={styles.logout}>Log out</Text>
                </TouchableOpacity>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <FlatList
                data={courses}
                keyExtractor={(course) => String(course.id)}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                contentContainerStyle={courses.length === 0 ? styles.center : undefined}
                ListEmptyComponent={<Text style={styles.empty}>No courses with registered students this semester.</Text>}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => router.push(`/courses/${item.id}/students`)}>
                        <Text style={styles.courseCode}>{item.code}</Text>
                        <Text style={styles.courseTitle}>{item.title}</Text>
                        <Text style={styles.courseMeta}>
                            {item.department} · {item.level} Level
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    welcome: { fontSize: 16, fontWeight: '600' },
    logout: { color: '#dc2626', fontWeight: '600' },
    error: { color: '#dc2626', padding: 16 },
    empty: { color: '#666', textAlign: 'center' },
    card: {
        padding: 16,
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    courseCode: { fontSize: 16, fontWeight: '700' },
    courseTitle: { fontSize: 14, color: '#374151', marginTop: 2 },
    courseMeta: { fontSize: 12, color: '#6b7280', marginTop: 6 },
});
