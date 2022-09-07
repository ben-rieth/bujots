import Head from "next/head";
import { FC } from "react";
import HeaderMenu from "./header/HeaderMenu";
import Logo from "./header/Logo";

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
                <Logo />
                <HeaderMenu />
            </header>

            <main className="container flex-grow mx-auto">
                {children}
            </main>
        </>
    )
}

export default Layout;