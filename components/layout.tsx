import Head from "next/head";
import { FC, Fragment } from "react";
import { IoJournal } from "react-icons/io5";
import { Menu, Transition } from '@headlessui/react';

type LayoutProps = {
    children: JSX.Element
}

const Layout : FC<LayoutProps> = ({ children }) => {

    const user = false;

    return (
        <>
            <Head>
                <title>BuJots</title>
                <meta 
                    name="title"
                    content="Mark down tasks, notes, and due dates quickly and have them organized automatically"
                />
                <link rel="icon" href="/favicon.io" />
            </Head>

            <header className="flex items-center justify-center w-full h-12 px-2 shadow-md">
                <div className="flex items-center justify-center">
                    <IoJournal className="w-7 h-7 fill-sky-500"/>
                    <h1 className="text-3xl italic font-bold text-sky-500">
                        BuJots
                    </h1>
                </div>
            </header>

            <main className="container flex-grow mx-auto">
                {children}
            </main>
        </>
    )
}

export default Layout;