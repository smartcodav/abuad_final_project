import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import StudentOnboardingLayout from '@/layouts/student-onboarding-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Course {
    id: number;
    code: string;
    title: string;
    unit: number | null;
}

export default function CourseRegistration({ courses, registeredCourseIds }: { courses: Course[]; registeredCourseIds: number[] }) {
    const { data, setData, post, processing, errors } = useForm<{ course_ids: number[] }>({
        course_ids: registeredCourseIds,
    });

    const toggle = (courseId: number, checked: boolean) => {
        setData('course_ids', checked ? [...data.course_ids, courseId] : data.course_ids.filter((id) => id !== courseId));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('student.onboarding.step5.store'));
    };

    return (
        <StudentOnboardingLayout step={5}>
            <Head title="Course Registration" />

            <Card>
                <CardHeader>
                    <CardTitle>Course Registration</CardTitle>
                    <CardDescription>Select the courses you are registering for this semester.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        {courses.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No courses are available for your department and level yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {courses.map((course) => (
                                    <div key={course.id} className="flex items-center gap-3 rounded-md border p-3">
                                        <Checkbox
                                            id={`course-${course.id}`}
                                            checked={data.course_ids.includes(course.id)}
                                            onCheckedChange={(checked) => toggle(course.id, checked === true)}
                                        />
                                        <Label htmlFor={`course-${course.id}`} className="flex-1 cursor-pointer font-normal">
                                            <span className="font-medium">{course.code}</span> — {course.title}
                                            {course.unit ? ` (${course.unit} unit${course.unit > 1 ? 's' : ''})` : ''}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                        <InputError message={errors.course_ids} />

                        <Button disabled={processing || data.course_ids.length === 0}>Register Courses &amp; Continue</Button>
                    </form>
                </CardContent>
            </Card>
        </StudentOnboardingLayout>
    );
}
