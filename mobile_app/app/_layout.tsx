import { AuthProvider, useAuth } from '../context/auth-context';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

function RootNavigator() {
    const { isLoading, token } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Protected guard={!token}>
                <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Protected guard={!!token}>
                <Stack.Screen name="index" options={{ title: 'Courses' }} />
                <Stack.Screen name="courses/[courseId]/students" options={{ title: 'Students' }} />
                <Stack.Screen name="courses/[courseId]/students/[studentId]/capture" options={{ title: 'Verify Attendance' }} />
            </Stack.Protected>
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}
