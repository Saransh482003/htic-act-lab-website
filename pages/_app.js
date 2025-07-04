import "@/styles/globals.css";
import Head from "next/head";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const showNavbar = router.pathname !== "/";

  return <>
    <Head>
      <title>ACT Lab</title>
      <meta name="description" content="ACT Lab - Advanced Computing and Technology Lab" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    {showNavbar && <Navbar />}
    <Component {...pageProps} />
    <Footer />
  </>
}
