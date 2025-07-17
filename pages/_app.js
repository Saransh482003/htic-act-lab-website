import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/router";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const showNavbar = router.pathname !== "/";

  return <>
    <Head>
      <title>ACT Laboratory</title>
    </Head>
    {showNavbar && <Navbar />}
    <Component {...pageProps} />
    <Footer />
  </>
}
