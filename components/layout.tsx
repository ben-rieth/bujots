import Head from "next/head";
import { FC, Fragment } from "react";
import { IoJournal } from "react-icons/io5";
import { Menu, Transition } from '@headlessui/react';
import { Burger } from '@mantine/core';

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

            <header className="flex items-center justify-between w-full h-12 px-2 shadow-md">
                <div className="flex items-center">
                    <IoJournal className="w-7 h-7 fill-sky-500"/>
                    <h1 className="text-3xl italic font-bold text-sky-500">
                        BuJots
                    </h1>
                </div>

                <Menu as="div" className="relative">
                    {({ open }) => (
                        <>
                            <Menu.Button>
                                <Burger opened={open}/>
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 origin-top-right bg-white divide-y rounded-md shadow-lg w-44 divide-slate-300">
                                    <Menu.Item as="div" className="px-2">
                                        {({ active }) => (
                                            <p>Log in</p>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </>
                    )}
                </Menu>
            </header>

            <main className="container flex-grow mx-auto">
                {children}
            </main>
        </>
    )
}

export default Layout;