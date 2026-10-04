import React, { useState } from 'react';
import { Link } from 'react-router';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const { error } = await authClient.requestPasswordReset({
            email,
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message ?? 'Something went wrong');
            return;
        }

        setSubmitted(true);
    };

    return (
        <div className="flex items-center justify-center min-h-svh px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Reset your password</CardTitle>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <p className="text-sm text-muted-foreground">
                            If an account exists for {email}, a reset link is on its way.
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <Button type="submit" className="w-full">Send reset link</Button>
                        </form>
                    )}
                    <Link to="/sign-in" className="block text-center text-sm text-muted-foreground hover:underline mt-4">
                        Back to sign in
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;