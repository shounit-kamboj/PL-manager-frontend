import React, { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { signIn, useSession } from '@/lib/auth-client.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from "@/components/ui/input-group.tsx";
import {Eye, EyeOff} from "lucide-react";







const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { data: session } = useSession();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        setSubmitting(true);
        const { error } = await signIn.email({ email, password });

        if (error) {
            setError(error.message ?? 'Invalid email or password');
            setSubmitting(false);
            return;
        }
    };

    if (session) return <Navigate to="/" replace />;


    const showHideButton = (
        <InputGroupAddon align="inline-end">
            <InputGroupButton
                type="button"
                size="icon-xs"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
            >
                {showPassword ? <EyeOff /> : <Eye />}
            </InputGroupButton>
        </InputGroupAddon>
    );


    return (

        <div className="flex items-center justify-center min-h-svh px-4 bg-[url('@/components/collar-pl-weights-horizontal.png')] bg-cover bg-center bg-no-repeat">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-ring">
                    <CardTitle >Sign in to CollarPL</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-ring placeholder:text-muted-foreground"
                            required
                        />
                            <InputGroup>
                                <InputGroupInput
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="text-ring placeholder:text-muted-foreground"
                                    autoComplete="current-password"
                                    required
                                />
                                {showHideButton}
                            </InputGroup>


                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                        <Link to="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                            Forgot password?
                        </Link>

                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <div className="border-t pt-4 text-center">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-2"
                                asChild
                            >
                                <Link to="/sign-up">
                                    Create new account
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