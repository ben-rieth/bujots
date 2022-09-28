import Link from "next/link";
import { FC } from "react";

import { IoToday, IoCalendar, IoArrowRedo } from 'react-icons/io5'

type NavLinkProps = {
    href: string;
    title: string;
    icon: JSX.Element;
}

const NavLink:FC<NavLinkProps> = ({ href, title, icon}) => {
    return (
        <Link href={href}>
            <div className="flex flex-col items-center">
                {icon}
                <a className="text-xs uppercase font-semibold text-sky-500" data-testid="link">
                    {title}
                </a>
            </div>
        </Link>
    )
}

const BottomNav = () => {

    const links = [
        { href: '/jots', title: 'Today', icon: <IoToday className="w-6 h-6 fill-sky-500"/>},
        { href: '/cal', title: 'Calendar', icon: <IoCalendar className="w-6 h-6 fill-sky-500"/>},
        { href: '/later', title: 'Later', icon: <IoArrowRedo className="w-6 h-6 fill-sky-500"/>},
    ]

    return (
        <nav className="w-full flex justify-between px-4">
            {links.map((link) => {
                return (
                    <NavLink 
                        key={link.title}
                        href={link.href} 
                        title={link.title}
                        icon={link.icon}
                    />
                )
            })}
        </nav>
    )
}

export default BottomNav;