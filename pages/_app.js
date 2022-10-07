import Head from 'next/head'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Curbs is a collaborative and free application for sharing and saving skate spots with whomever wants to see!!" />
        <meta name="keywords" content="Keywords" />
        <title>curbs</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/favicon.ico"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/icon-48x48.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="stylesheet" href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css"
          integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.2/dist/leaflet.js"
          integrity="sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg="
          crossOrigin="">
        </script>
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
