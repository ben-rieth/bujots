import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import Layout from 'components/layout'
import {SessionProvider as AuthProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {

  return (
    <>
      <AuthProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
      <Toaster position="bottom-center"/>
    </>
  )
}

export default MyApp
