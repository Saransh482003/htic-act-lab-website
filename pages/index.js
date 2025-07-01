import Image from "next/image";
import styler from "@/styles/HomePage.module.css";

export default function Home() {
  return (
    <>
      <section>
        <nav className={styler.navbar}>
            <div className={styler.logo}>
                <Image
                    src="/logo.png"
                    alt="ACT Lab Logo"
                    width={50}
                    height={50}
                />
                <span className={styler.logoText}>ADVANCED CARDIOVASCULAR TECHNOLOGY LABORATORY</span>
            </div>
            <ul className={styler.navList}>
                <li><a href="/" className={styler.navLink}>Home</a></li>
                <li><a href="/projects" className={styler.navLink}>Projects</a></li>
                <li><a href="/scientific-research" className={styler.navLink}>Scientific Research</a></li>
                <li><a href="/clinical-studies" className={styler.navLink}>Clinical Studies</a></li>
                <li><a href="/publications" className={styler.navLink}>Publications</a></li>
                <li><a href="/contact" className={styler.navLink}>Contact</a></li>
            </ul>
        </nav>
      </section>
      <section className={styler.banner}>
        <div className={styler.bannerHead}>
          <p className={styler.bannerTitle}>TRANSFORMING <br/> <span>HEART</span> HEALTH <br/> WITH INNOVATION</p>
          <p className={styler.bannerSubtitle}>AN INITIATIVE BY IIT MADRAS & DEP. OF BIOTECHNOLOGY,GOV. OF INDIA</p>
        </div>
        <div className={styler.bannerActions}>
          <a href="/publications" className={styler.publicationButton}>
            <span className={styler.arrow}>→</span>
            <div className={styler.publicationText}>
              <span className={styler.publicationTitle}>Read Recent Publication</span>
              <span className={styler.publicationSubtitle}>Signal enhancement using the europium nanoparticle...</span>
            </div>
          </a>
        </div>
      </section>
    </>
  );
}
