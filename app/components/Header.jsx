import Link from 'next/link';
import React from 'react';

const Header = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between md:items-center items-start p-2">
            <Link href="/" className="flex items-center mb-4 md:mb-0">
                <span className="text-2xl md:text-3xl font-bold mr-4">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 12H5M12 19l-7-7 7-7"
                        />
                    </svg>
                </span>
                <h1 className="text-2xl md:text-4xl  heading py-2 border-b-2 border-black tracking-tighter font-serif">Rules Creation</h1>
            </Link>

            <button className="bg-Maingreen text-white py-2 px-4 rounded-md bg-green-600 border border-Maingreen transition-all">Publish Feed</button>
        </div>
    );
};

export default Header;