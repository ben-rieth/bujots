import Head from "next/head";
import { FC } from "react";

type LayoutProps = {
    children: JSX.Element
}

const Layout : FC<LayoutProps> = ({ children }) => {
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

            <main className="container flex-grow mx-auto">
                {children}
            </main>
        </>
    )
}

export default Layout;