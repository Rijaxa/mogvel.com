'use client';

import { useEffect, useState } from 'react';

/**
 * Client-side hook to check permissions
 * Note: This is for UI purposes only. Always verify permissions on the server side.
 */
export function usePermission(resource: string, action: string) {
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function checkPermission() {
            try {
                const response = await fetch('/api/permissions/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resource, action }),
                });

                const data = await response.json();
                setHasPermission(data.allowed || false);
            } catch (error) {
                console.error('Permission check failed:', error);
                setHasPermission(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkPermission();
    }, [resource, action]);

    return { hasPermission, isLoading };
}

/**
 * Component to conditionally render children based on permissions
 */
interface ProtectedProps {
    resource: string;
    action: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function Protected({ resource, action, children, fallback = null }: ProtectedProps) {
    const { hasPermission, isLoading } = usePermission(resource, action);

    if (isLoading) {
        return null; // or a loading skeleton
    }

    return hasPermission ? <>{children}</> : <>{fallback}</>;
}
