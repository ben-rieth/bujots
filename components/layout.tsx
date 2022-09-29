import Head from "next/head";
import { FC } from "react";
import HeaderMenu from "./header/HeaderMenu";
import Logo from "./header/Logo";
import { useSession } from 'next-auth/react';
import BottomNav from "./nav/BottomNav";

type LayoutProps = {
    children: JSX.Element
}

const Layout : FC<LayoutProps> = ({ children }) => {

    const { data: session, status} = useSession();
    const user = session?.user;

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
                <Logo />
                <HeaderMenu user={user}/>
            </header>

            <main className="container flex-grow mx-auto">
                {children}
            </main>

            {user && 
                <footer className="fixed bottom-0 h-14 w-full shadow-md-top flex items-center justify-center bg-white">
                    <BottomNav />
                </footer>
            }
        </>
    )
}

export default Layout;