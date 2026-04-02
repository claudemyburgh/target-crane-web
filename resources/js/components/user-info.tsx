import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    const displayUrl = useMemo(() => {
        const baseUrl = user?.avatar_url ?? user?.avatar;
        if (!baseUrl) return undefined;
        const hash = `${user?.id ?? 'default'}-${user?.updated_at ?? 'default'}`;
        return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}v=${hash}`;
    }, [user?.avatar_url, user?.avatar, user?.id, user?.updated_at]);

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage
                    src={displayUrl}
                    alt={user?.name ?? 'User avatar'}
                />
                <AvatarFallback className="text-xs">
                    {getInitials(user?.name ?? '')}
                </AvatarFallback>
            </Avatar>
            {showEmail && (
                <span className="truncate text-sm">{user?.email}</span>
            )}
        </>
    );
}
