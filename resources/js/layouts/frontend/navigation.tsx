import { Link } from '@inertiajs/react';

export default function Navigation() {
    return (
        <header className="bg-gray-900 text-white">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="flex items-center justify-between py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="https://targetcranes.co.za/wp-content/uploads/2024/08/Target-Cranes-Logo.svg"
                            alt="Target Cranes"
                            className="h-12 w-auto"
                        />
                    </Link>
                    <div className="flex items-center gap-6">
                        <a
                            href="tel:0636737500"
                            className="hidden text-sm text-gray-300 hover:text-white md:block"
                        >
                            063 673 7500
                        </a>
                        <Link
                            href="/contact-us"
                            className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                            Contact us
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
