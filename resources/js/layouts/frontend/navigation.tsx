import { Link } from '@inertiajs/react';



export default function Navigation() {
    return (
        <nav className={` py-4`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <Link href={'/'} className={`text-lg font-semibold`}>Target Cranes</Link>
            </div>
        </nav>
    )
}
