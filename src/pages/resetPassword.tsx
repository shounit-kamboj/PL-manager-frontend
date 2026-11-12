import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    // one switch for both password fields, so the coach can compare them
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) return;
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }

        setSubmitting(true);
        const { error } = await authClient.resetPassword({ newPassword: password, token });

        if (error) {
            setError(error.message ?? 'This link is invalid or has expired');
            setSubmitting(false);
            return;
        }

        navigate('/sign-in');
    };

    // the eye button inside both password fields
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
                            <div className="space-y-1">
                                <InputGroup>
                                    <InputGroupInput
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="New password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="text-ring placeholder:text-muted-foreground"
                                        autoComplete="new-password"
                                        required
                                    />
                                    {showHideButton}
                                </InputGroup>
                                <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                            </div>
                            <InputGroup>
                                <InputGroupInput
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="text-ring placeholder:text-muted-foreground"
                                    autoComplete="new-password"
                                    required
                                />
                                {showHideButton}
                            </InputGroup>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? 'Resetting...' : 'Reset password'}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;