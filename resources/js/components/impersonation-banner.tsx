import { Link, usePage } from '@inertiajs/react';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {stop}from "@/routes/admin/impersonate"
import type { Auth } from '@/types';
export function ImpersonationBanner() {
    const page = usePage();
    const { auth, impersonating } = page.props as {
        auth: Auth;
        impersonating?: boolean;
    };

    const isImpersonating = Boolean(auth?.impersonating ?? impersonating);
    if (!isImpersonating) {
        return null;
    }

    return (
        <Alert
            variant="default"
            className="rounded-none border-x-0 border-t-0 bg-yellow-50 dark:bg-yellow-950"
        >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
                <span className="font-medium">
                    You are currently impersonating {auth.user?.name}.
                </span>
                <Link
                    href={stop()}
                    method="post"
                    as="button"
                    className="ml-4 inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                    <X className="mr-2 h-4 w-4" />
                    Stop Impersonating
                </Link>
            </AlertDescription>
        </Alert>
    );
}
