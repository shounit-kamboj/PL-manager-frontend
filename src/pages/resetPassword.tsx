import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) return;
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }

        const { error } = await authClient.resetPassword({ newPassword: password, token });

        if (error) {
            setError(error.message ?? 'This link is invalid or has expired');
            return;
        }

        navigate('/sign-in');
    };

    return (
        <div className="flex items-center justify-center min-h-svh px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Choose a new password</CardTitle>
                </CardHeader>
                <CardContent>
                    {!token ? (
                        <p className="text-sm text-muted-foreground">
                            This reset link is invalid or has expired.{' '}
                            <Link to="/forgot-password" className="underline">Request a new one</Link>
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="password"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                            />
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <Button type="submit" className="w-full">Reset password</Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;