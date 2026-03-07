import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { type FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

type StudentMaster = {
    student_master_id: number;
    name: string;
    class_name: string;
};

export default function Register() {
    const [step, setStep] = useState<'nipd' | 'register'>('nipd');
    const [studentMaster, setStudentMaster] = useState<StudentMaster | null>(null);
    const [nipdError, setNipdError] = useState<string | null>(null);
    const [nipdLoading, setNipdLoading] = useState(false);

    const [nipd, setNipd] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        student_master_id: 0,
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleNipdSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        setNipdError(null);
        setNipdLoading(true);

        try {
            const response = await axios.post(route('auth.verify-nipd'), { nipd });
            setStudentMaster(response.data);
            setData('student_master_id', response.data.student_master_id);
            setStep('register');
        } catch (error: any) {
            setNipdError(error.response?.data?.message ?? 'Something went wrong.');
        } finally {
            setNipdLoading(false);
        }
    };

    const handleRegisterSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />

            {step === 'nipd' ? (
                <form onSubmit={handleNipdSubmit} className="flex flex-col gap-6">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="nipd">Student ID (NIPD)</Label>
                            <Input id="nipd" type="text" required autoFocus tabIndex={1} placeholder="Enter your NIPD" value={nipd} onChange={e => setNipd(e.target.value)} />
                            {nipdError && <InputError message={nipdError} />}
                        </div>

                        <Button type="submit" className="mt-2 w-full" tabIndex={2} disabled={nipdLoading}>
                            {nipdLoading && <Spinner />}
                            Verify NIPD
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <TextLink href={route('login')} tabIndex={3}>Log in</TextLink>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-6">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input type="text" value={studentMaster?.name ?? ''} readOnly disabled />
                        </div>

                        <div className="grid gap-2">
                            <Label>Class</Label>
                            <Input type="text" value={studentMaster?.class_name ?? ''} readOnly disabled />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" type="email" required tabIndex={1} autoComplete="email" placeholder="email@example.com" value={data.email} onChange={e => setData('email', e.target.value)} />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required tabIndex={2} autoComplete="new-password" placeholder="Password" value={data.password} onChange={e => setData('password', e.target.value)} />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <Input id="password_confirmation" type="password" required tabIndex={3} autoComplete="new-password" placeholder="Confirm password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button type="submit" className="mt-2 w-full" tabIndex={4} disabled={processing}>
                            {processing && <Spinner />}
                            Create account
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <TextLink href={route('login')} tabIndex={5}>Log in</TextLink>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}