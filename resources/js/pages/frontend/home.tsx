// Import all images from resources/images
import aboutImage from '@/../images/455128947_453920860965371_2221904459537108085_n.jpg';
import heroImage from '@/../images/455953670_457748863915904_4005894369628636547_n.jpg';
import constructionImage from '@/../images/construction.jpg';
import energyPowerImage from '@/../images/energy-power.jpg';
import manufacturingImage from '@/../images/manufacturing.jpg';
import miningImage from '@/../images/mining.jpg';
import portsImage from '@/../images/ports.jpg';
import telecommunicationsImage from '@/../images/telecommunications.jpg';
import FrontendLayout from '@/layouts/frontend-layout';

const industries = [
    {
        title: 'Construction & Infrastructure',
        image: constructionImage,
    },
    {
        title: 'Energy & Power',
        image: energyPowerImage,
    },
    {
        title: 'Mining & Resources',
        image: miningImage,
    },
    {
        title: 'Manufacturing & Industrial',
        image: manufacturingImage,
    },
    {
        title: 'Ports & Maritime',
        image: portsImage,
    },
    {
        title: 'Telecommunications',
        image: telecommunicationsImage,
    },
];

const services = [
    'Heavy Haulage',
    'Rigging',
    'Repairs',
    'Hiring',
    'Consulting',
];

const stats = [
    { value: '25+', label: 'Years of Experience' },
    { value: '500+', label: 'Successful Projects' },
    { value: '24/7', label: 'Availability' },
];

export default function Home() {
    return (
        <FrontendLayout>
            {/* Hero Section */}
            <section className="relative min-h-[600px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Crane operations"
                        className="h-full w-full object-cover"
                    />
                    <div className="from-opacity-95 via-opacity-80 to-opacity-40 absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900" />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:py-32">
                    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                        <div>
                            <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
                                Your Heavy{' '}
                                <span className="text-red-500">Lifting</span>{' '}
                                Solution
                            </h1>
                            <p className="mb-6 text-lg text-gray-300 md:text-xl">
                                Whether you're lifting heavy machinery,
                                constructing high-rise buildings, or handling
                                complex industrial projects, our skilled team
                                and modern fleet of cranes are here to support
                                your needs.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="/contact-us"
                                    className="inline-block rounded bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
                                >
                                    Contact us
                                </a>
                                <a
                                    href="/services"
                                    className="inline-block rounded border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-gray-900"
                                >
                                    Our Services
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who We Are */}
            <section className="bg-white py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div className="relative aspect-video overflow-hidden rounded-lg shadow-xl">
                            <img
                                src={aboutImage}
                                alt="Target Cranes team"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded bg-red-500" />
                        </div>
                        <div>
                            <span className="mb-2 inline-block text-sm font-semibold tracking-wider text-red-500 uppercase">
                                Who we are
                            </span>
                            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                                Welcome to Target Cranes
                            </h2>
                            <p className="mb-4 text-lg text-gray-600">
                                At Target Cranes, we pride ourselves on
                                delivering top-notch crane services with a focus
                                on safety, efficiency, and customer
                                satisfaction.
                            </p>
                            <p className="text-lg text-gray-600">
                                With over 25 years of experience, our skilled
                                team and modern fleet are ready to handle your
                                most challenging lifting needs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Industries We Serve */}
            <section className="bg-gray-50 py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="mb-12 text-center">
                        <span className="mb-2 inline-block text-sm font-semibold tracking-wider text-red-500 uppercase">
                            Industries
                        </span>
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                            Industries We Serve
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            At Target Cranes, our versatile fleet and skilled
                            operators provide essential support across a wide
                            range of industries.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {industries.map((industry) => (
                            <div
                                key={industry.title}
                                className="group relative overflow-hidden rounded-lg shadow-md transition hover:shadow-xl"
                            >
                                <div className="aspect-[4/3]">
                                    <img
                                        src={industry.image}
                                        alt={industry.title}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition group-hover:opacity-100">
                                    <p className="text-lg font-semibold text-white">
                                        {industry.title}
                                    </p>
                                </div>
                                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <p className="text-sm font-medium text-white">
                                        {industry.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 24/7 Service Support */}
            <section className="relative overflow-hidden bg-gray-900 py-16 md:py-24">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src={heroImage}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 md:px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <span className="mb-2 inline-block text-sm font-semibold tracking-wider text-red-500 uppercase">
                                Emergency
                            </span>
                            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                                24/7 Service Support
                            </h2>
                            <p className="mb-6 text-lg text-gray-300">
                                Emergencies can happen anytime. That's why we
                                offer 24/7 emergency response services for
                                urgent lifting needs. Whether it's an equipment
                                failure or an unforeseen event, we're here to
                                provide immediate support, minimizing downtime
                                and potential losses.
                            </p>
                            <a
                                href="/contact-us"
                                className="inline-block rounded bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
                            >
                                Get Emergency Support
                            </a>
                        </div>
                        <div className="rounded-lg bg-white/10 p-8 text-center backdrop-blur-sm">
                            <p className="mb-2 text-lg text-gray-300">
                                Call us anytime
                            </p>
                            <p className="mb-4 text-5xl font-black text-white md:text-6xl">
                                063 673 7500
                            </p>
                            <p className="text-sm text-gray-400">
                                We're available 24/7 for emergency crane
                                services
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Complimentary Services */}
            <section className="bg-white py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <span className="mb-2 inline-block text-sm font-semibold tracking-wider text-red-500 uppercase">
                                Our Services
                            </span>
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                                Complimentary Services
                            </h2>
                            <p className="mb-6 text-lg text-gray-600">
                                At Target Cranes, we go beyond just crane
                                rentals. We offer a range of complementary
                                services designed to make your lifting projects
                                safer, more efficient, and cost-effective.
                            </p>
                            <ul className="mb-8 space-y-4">
                                {services.map((service) => (
                                    <li
                                        key={service}
                                        className="flex items-center rounded border border-gray-200 p-3 text-lg text-gray-700 transition hover:border-red-500 hover:shadow-md"
                                    >
                                        <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500">
                                            ✓
                                        </span>
                                        {service}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="/services"
                                className="inline-block rounded bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                            >
                                View All Services
                            </a>
                        </div>
                        <div className="relative overflow-hidden rounded-lg shadow-2xl">
                            <img
                                src={aboutImage}
                                alt="Crane services"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                            <div className="absolute right-6 bottom-6 left-6">
                                <p className="text-lg font-semibold text-white">
                                    Professional crane solutions since 1999
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Showcase */}
            <section className="bg-gray-50 py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                            Showcase
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            With extensive experience across various industries,
                            we prioritise reliability in our equipment,
                            personnel, and execution. This dedication has
                            cultivated lasting partnerships, built on our proven
                            track record and continuous focus on delivering
                            optimal results for our clients.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="relative overflow-hidden bg-gray-900 py-16 md:py-24">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-red-500" />
                    <div className="absolute right-10 bottom-10 h-48 w-48 rounded-full bg-red-500" />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 md:px-6">
                    <div className="mb-12 text-center">
                        <span className="mb-2 inline-block text-sm font-semibold tracking-wider text-red-500 uppercase">
                            Why Choose Us
                        </span>
                        <h2 className="text-3xl font-bold text-white md:text-4xl">
                            Target Cranes in Numbers
                        </h2>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-3">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="relative rounded-lg border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm"
                            >
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500">
                                        {index === 0 && (
                                            <svg
                                                className="h-10 w-10 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        )}
                                        {index === 1 && (
                                            <svg
                                                className="h-10 w-10 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        )}
                                        {index === 2 && (
                                            <svg
                                                className="h-10 w-10 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <p className="mb-2 text-5xl font-black text-white">
                                    {stat.value}
                                </p>
                                <p className="text-lg font-medium text-gray-300">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="bg-gray-100 py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <svg
                                    className="h-6 w-6 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-gray-900">
                                Address
                            </h3>
                            <p className="text-gray-600">
                                1 Van Eck Street, Bellville South, Cape Town,
                                7530
                            </p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <svg
                                    className="h-6 w-6 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 01.121-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-gray-900">
                                Phone
                            </h3>
                            <a
                                href="tel:0636737500"
                                className="text-red-500 hover:underline"
                            >
                                063 673 7500
                            </a>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <svg
                                    className="test-red-500 h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-gray-900">
                                Email
                            </h3>
                            <a
                                href="mailto:info@targetcranes.co.za"
                                className="text-red-500 hover:underline"
                            >
                                info@targetcranes.co.za
                            </a>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <svg
                                    className="test-red-500 h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-gray-900">
                                Follow Us
                            </h3>
                            <div className="flex gap-4">
                                <a
                                    href="https://www.facebook.com/Targetcranes"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-red-500"
                                >
                                    Facebook
                                </a>
                                <a
                                    href="https://za.linkedin.com/company/targetcranes"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-red-500"
                                >
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>
                    <p className="mt-8 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} Target Cranes. All rights
                        reserved.
                    </p>
                </div>
            </section>
        </FrontendLayout>
    );
}
