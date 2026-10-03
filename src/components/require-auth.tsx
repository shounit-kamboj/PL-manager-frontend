// src/components/require-auth.tsx
import React from 'react';
import { Navigate } from 'react-router';
import { useSession } from '@/lib/auth-client';

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = useSession();

    if (isPending) return null; // or a small loading spinner

    if (!session) return <Navigate to="/sign-in" replace />;

    return <>{children}</>;
}