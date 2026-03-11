import cranes from '@/../images/cranes.png'
import FrontendLayout from '@/layouts/frontend-layout';


export default function Home() {
    return (
        <FrontendLayout>
            <div className={`px-4 pb-4`}>
                <div className={`rounded bg-white`}>
                    <div className="lg:px-8 grid-cols-2 mx-auto grid max-w-7xl gap-6 px-4 md:px-6">
                        <div className={`grid place-content-center text-black`}>
                            <div>
                                <h1
                                    className={`mb-3 text-7xl font-black tracking-tight text-balance`}
                                >
                                    Your Heavy{' '}
                                    <span className={`text-red-500`}>
                                        Lifting
                                    </span>{' '}
                                    Solution
                                </h1>
                                <p className={`text-xl text-balance`}>
                                    Your Heavy Lifting Solution Whether you’re
                                    lifting heavy machinery, constructing
                                    high-rise buildings, or handling complex
                                    industrial projects, our skilled team and
                                    modern fleet of cranes are here to support
                                    your needs.
                                </p>
                            </div>
                        </div>
                        <div>
                            <img src={cranes} alt="cranes" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:px-8  mx-auto  max-w-7xl px-4 md:px-6">
            <main>Hello world</main>
            </div>
        </FrontendLayout>
    );
}
