import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import Layout from 'components/layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

interface CustomPageProps {
  session: Session;
}

function MyApp({ Component, pageProps: {session, ...pageProps}}: AppProps<CustomPageProps>) {

  const client = new QueryClient();

  return (
    <>
      <SessionProvider session={session}>
        <QueryClientProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </SessionProvider>
      <Toaster position="bottom-center"/>
    </>
  )
}

export default MyApp
