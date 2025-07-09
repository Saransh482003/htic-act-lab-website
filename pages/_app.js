import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const showNavbar = router.pathname !== "/";

  return <>
    {showNavbar && <Navbar />}
    <Component {...pageProps} />
    <Footer />
  </>
}
