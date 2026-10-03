// src/pages/sign-in.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { signIn } from '@/lib/auth-client.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from "react-router";

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const { error } = await signIn.email({ email, password });

        if (error) {
            setError(error.message ?? 'Invalid email or password');
            return;
        }

        navigate('/');
    };

    return (
        <div className="flex items-center justify-center min-h-svh px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <Button
                        variant="ghost"
                        className="w-fit px-2 -ml-2 mb-2"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </Button>
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
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignIn;

