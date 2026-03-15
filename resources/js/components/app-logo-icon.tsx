import type { SVGAttributes } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {


    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 106.8 65.2"
            className={cn(
                'transition-all duration-300',

                props.className,
            )}
        >

            <path
                d="M.1 23.1c0 3.8 3 6.8 6.8 6.8h20.4l5.3 5.3v23.2c0 3.7 3 6.8 6.8 6.8s6.8-3 6.8-6.8v-26c0-1.9-.8-3.7-2.1-4.9h-.2v-.1l-9.1-9.1c-1.4-1.4-3.1-2-4.9-2h-23c-3.7 0-6.8 3-6.8 6.8"
                className="fill-target"
            />
            <path
                d="m88 29.8 3.2 3.2h15.6v-.8c0-1.9-.8-3.7-2.1-4.9l-9.1-9.1c-1.4-1.4-3.2-2-5.1-2H55.9c-3.7 0-6.8 3-6.8 6.8v25.9c0 1.9.8 3.7 2.1 4.9l8.8 8.8.3.3c1.3 1.3 2.9 1.9 4.6 2h31.9c4.9 0 8.9-4 8.9-8.9v-3.8c0-.5-.4-.8-.8-.8H68L62.6 46V29.7H88z"
                className={`text-foreground`}
            />
            <path
                d="M0 6.8c0 3.8 3 6.9 6.8 6.9h86.8c-.4-1-.9-1.8-1.7-2.5l.1-.1L82.9 2c-1.4-1.4-3.2-2-5-2H6.8C3.1 0 0 3 0 6.8"
                className="fill-target"
            />
        </svg>
    );
}
