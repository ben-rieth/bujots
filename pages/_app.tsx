import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import Layout from 'components/layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function MyApp({ Component, pageProps}: AppProps) {

  const client = new QueryClient();

  return (
    <>
      <QueryClientProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
      <Toaster position="bottom-center"/>
    </>
  )
}

export default MyApp
