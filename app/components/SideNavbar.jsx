import Image from 'next/image';
import React from 'react';
import logo from "../assets/logo.png"
import img from "../assets/img.svg"
import meta from "../assets/meta.svg"
import shopify from "../assets/shopify.svg"
import setting from "../assets/setting.svg"
const SideNav = () => {
    return (
        <div className="sticky top-0 min-h-screen bg-black text-white px-3 py-10 sm:px-5">
            <div className="flex flex-col items-center justify-between h-full">
                <div className="flex flex-col gap-8 items-center">
                    <Image src={logo} alt="Logo" width={30} height={30} className="cursor-pointer" />
                    <Image src={img} alt="img" width={25} height={25} className="cursor-pointer" />
                    <Image src={meta} alt="meta" width={25} height={25} className="cursor-pointer" />
                    <Image src={shopify} alt="shopify" width={25} height={25} className="cursor-pointer" />
                </div>
                <Image src={setting} alt="settings" width={15} height={15} className="cursor-pointer" />
            </div>
        </div>
    );
}

export default SideNav;
