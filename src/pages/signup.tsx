import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
//todo:add a confirm password + be able to view password + minimun password req shown
    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');

            const result = await signUp.email({ name, email, password });

            console.log("SIGN UP RESULT:", result);

            if (result.error) {
                console.error("SIGN UP ERROR:", result.error);
                setError(result.error.message ?? 'Something went wrong');
                return;
            }

            navigate('/');
        };

    return (
        <div className="flex items-center justify-center min-h-svh px-4 bg-[url('@/components/collar-pl-weights-horizontal.png')] bg-cover bg-center bg-no-repeat">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <Button
                        variant="ghost"
                        className="w-fit px-2 -ml-2 mb-2"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </Button>
                    <CardTitle>Create your coach account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="email"
                            placeholder="Confirm email"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            required
                        />
                        {confirmEmail && confirmEmail !== email && (
                            <p className="text-sm text-destructive">Emails don't match.</p>
                        )}
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                        <Input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {confirmPassword && confirmPassword !== password && (
                            <p className="text-sm text-destructive">Passwords don't match.</p>
                        )}
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUp;

