import React, { useState } from 'react';
import { useNotification } from '@refinedev/core';
import { Eye, EyeOff } from 'lucide-react';
import { authClient, useSession } from '@/lib/auth-client';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb.tsx';
import { ListView } from '@/components/refine-ui/views/list-view.tsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const MAX_NAME_LENGTH = 100;

const Settings = () => {
    const { data: session } = useSession();
    const { open: notify } = useNotification();

    // ---- name ----
    // safe to pre-fill: RequireAuth only renders this page once the session has loaded
    const [name, setName] = useState(session?.user.name ?? '');
    const [nameError, setNameError] = useState('');
    const [savingName, setSavingName] = useState(false);

    const saveName = async (e: React.FormEvent) => {
        e.preventDefault();
        setNameError('');

        const trimmed = name.trim();
        if (!trimmed) return setNameError("Name can't be empty");
        if (trimmed.length > MAX_NAME_LENGTH) return setNameError(`Name must be ${MAX_NAME_LENGTH} characters or fewer`);

        setSavingName(true);
        const { error } = await authClient.updateUser({ name: trimmed });
        setSavingName(false);

        if (error) return setNameError(error.message ?? 'Could not save your name');
        setName(trimmed);
        notify?.({ type: 'success', message: 'Name updated' });
    };

    // ---- password ----
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    const savePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        if (newPassword !== confirmPassword) return setPasswordError("New passwords don't match");

        setSavingPassword(true);
        const { error } = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true, // signs out every other device; this one stays signed in
        });
        setSavingPassword(false);

        if (error) return setPasswordError(error.message ?? 'Could not change your password');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        notify?.({ type: 'success', message: 'Password changed' });
    };

    const passwordType = showPasswords ? 'text' : 'password';

    // the eye button inside each password field, all toggled together
    const showHideButton = (
        <InputGroupAddon align="inline-end">
            <InputGroupButton
                type="button"
                size="icon-xs"
                aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
                title={showPasswords ? 'Hide passwords' : 'Show passwords'}
                onClick={() => setShowPasswords((prev) => !prev)}
            >
                {showPasswords ? <EyeOff /> : <Eye />}
            </InputGroupButton>
        </InputGroupAddon>
    );

    // ---- delete account ----
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deletePassword) return;
        setDeleteError('');
        setDeleting(true);

        const { error } = await authClient.deleteUser({
            password: deletePassword,
            callbackURL: `${window.location.origin}/sign-in?deleted=1`,
        });
        if (error) {
            setDeleteError(error.message ?? 'Could not delete your account');
            setDeleting(false);
            return;
        }
        setDeleting(false);
        setEmailSent(true);
    };

    return (
        <ListView className="class-view bg-[url('@/components/collar-pl-weights-horizontal.png')] bg-cover bg-center bg-no-repeat">
            <Breadcrumb />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                <h1 className="text-2xl font-bold">Settings</h1>

                {/* ---- name ---- */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your name</CardTitle>
                        <CardDescription>Shown on your dashboard and in emails from CollarPL.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={saveName} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="settings-name">Name</Label>
                                <Input
                                    id="settings-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    maxLength={MAX_NAME_LENGTH}
                                    required
                                />
                            </div>
                            {nameError && <p role="alert" className="text-sm text-destructive">{nameError}</p>}
                            <Button type="submit" disabled={savingName}>
                                {savingName ? 'Saving...' : 'Save name'}
                            </Button>
                        </form>
                    </CardContent>


                {/* ---- password ---- */}

                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>Changing it signs you out on every other device.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={savePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="settings-current-password">Current password</Label>
                                <InputGroup>
                                    <InputGroupInput
                                        id="settings-current-password"
                                        type={passwordType}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        autoComplete="current-password"
                                        required
                                    />
                                    {showHideButton}
                                </InputGroup>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="settings-new-password">New password</Label>
                                <InputGroup>
                                    <InputGroupInput
                                        id="settings-new-password"
                                        type={passwordType}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        autoComplete="new-password"
                                        required
                                    />
                                    {showHideButton}
                                </InputGroup>
                                <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="settings-confirm-password">Confirm new password</Label>
                                <InputGroup>
                                    <InputGroupInput
                                        id="settings-confirm-password"
                                        type={passwordType}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
                                        required
                                    />
                                    {showHideButton}
                                </InputGroup>
                                {confirmPassword && confirmPassword !== newPassword && (
                                    <p className="text-sm text-destructive">Passwords don't match.</p>
                                )}
                            </div>
                            {passwordError && <p role="alert" className="text-sm text-destructive">{passwordError}</p>}
                            <Button type="submit" disabled={savingPassword}>
                                {savingPassword ? 'Saving...' : 'Change password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle>Delete account</CardTitle>
                        <CardDescription>
                            Permanently deletes your account and all your athletes, payments, training blocks,
                            meet entries and custom competitions. This can't be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog
                            open={deleteOpen}
                            onOpenChange={(o) => {
                                if (deleting) return;
                                setDeleteOpen(o);
                                if (!o) { setDeletePassword(''); setDeleteError(''); setEmailSent(false); }
                            }}
                        >
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {emailSent
                                            ? "Check your email. Your account will be deleted when you open the link in this browser."
                                            : "Enter your password and we'll email you a link to confirm."}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                {emailSent ? (
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Close</AlertDialogCancel>
                                    </AlertDialogFooter>
                                ) : (
                                    <form onSubmit={handleDelete} className="grid gap-4">
                                        <Label htmlFor="delete-password">Password</Label>
                                        <Input
                                            id="delete-password"
                                            type="password"
                                            autoComplete="current-password"
                                            value={deletePassword}
                                            onChange={(e) => setDeletePassword(e.target.value)}
                                            required
                                        />
                                        {deleteError && <p role="alert" className="text-sm text-destructive">{deleteError}</p>}
                                        <AlertDialogFooter>
                                            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                                            <Button type="submit" variant="destructive" disabled={!deletePassword || deleting}>
                                                {deleting ? 'Sending...' : 'Send confirmation email'}
                                            </Button>
                                        </AlertDialogFooter>
                                    </form>
                                )}
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </ListView>
    );
};

export default Settings;