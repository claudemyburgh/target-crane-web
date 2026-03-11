import React from 'react';
import Navigation from '@/layouts/frontend/navigation';
import { cn } from '@/lib/utils';


export default ({ children, ...props }: any) => (
    <div {...props} className={cn('min-h-screen',)}>
        <Navigation/>
        {children}
    </div>
);
