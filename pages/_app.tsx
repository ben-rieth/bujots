import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import Layout from 'components/layout'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster position="bottom-center"/>
    </>
  )
}

export default MyApp
