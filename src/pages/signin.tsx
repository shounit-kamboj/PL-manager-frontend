import React, { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { signIn, useSession } from '@/lib/auth-client.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const { error } = await signIn.email({ email, password });

        if (error) {
            setError(error.message ?? 'Invalid email or password');
            return;
        }
    };

    if (session) return <Navigate to="/" replace />;


    return (
        <div className="flex items-center justify-center min-h-svh px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign in to CollarPL</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
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
                        <Link to="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                            Forgot password?
                        </Link>

                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>

                        <div className="border-t pt-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-2"
                                asChild
                            >
                                <Link to="/sign-up">
                                    Create an account
                                </Link>
                            </Button>
                        </div>
                        <br />
                        <p className="text-xs text-muted-foreground text-center">
                            By creating an account you agree to our{' '}
                            <Link to="/privacy" className="underline">Privacy Policy</Link>.
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignIn;

