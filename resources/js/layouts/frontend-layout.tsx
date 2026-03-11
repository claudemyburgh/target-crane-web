import React from 'react';
import Navigation from '@/layouts/frontend/navigation';
import { cn } from '@/lib/utils';


export default ({ children, ...props }: any) => (
    <div {...props} className={cn('bg-white text-gray-700 flex-1 min-h-screen',)}>
        <Navigation/>
        {children}
    </div>
);
