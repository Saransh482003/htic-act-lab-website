import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styler from "@/styles/ErrorPage.module.css";

export default function Custom404() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styler.errorContainer}>
      <div className={styler.errorContent}>
        <div className={styler.errorAnimation}>
          <div className={styler.pulseCircle}></div>
          <div className={styler.errorIcon}>🔬</div>
        </div>
        
        <div className={styler.errorText}>
          <h1 className={styler.errorCode}>404</h1>
          <h2 className={styler.errorTitle}>Research Page Not Found</h2>
          <p className={styler.errorDescription}>
            The page you're looking for seems to have been moved or doesn't exist. 
            Our research team is constantly updating the website structure.
          </p>
          
          <div className={styler.errorStats}>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>404</span>
              <span className={styler.statLabel}>Error Code</span>
            </div>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>{countdown}</span>
              <span className={styler.statLabel}>Auto Redirect</span>
            </div>
          </div>
          
          <div className={styler.errorActions}>
            <button onClick={handleGoHome} className={styler.primaryButton}>
              🏠 Return to Lab Home
            </button>
            <button onClick={handleGoBack} className={styler.secondaryButton}>
              ← Go Back
            </button>
          </div>
          
          <div className={styler.helpSection}>
            <h3 className={styler.helpTitle}>Looking for something specific?</h3>
            <div className={styler.quickLinks}>
              <Link href="/projects" className={styler.quickLink}>
                <span className={styler.linkIcon}>🔬</span>
                Research Projects
              </Link>
              <Link href="/publications" className={styler.quickLink}>
                <span className={styler.linkIcon}>📚</span>
                Publications
              </Link>
              <Link href="/clinical-studies" className={styler.quickLink}>
                <span className={styler.linkIcon}>🏥</span>
                Clinical Studies
              </Link>
              <Link href="/contact" className={styler.quickLink}>
                <span className={styler.linkIcon}>📧</span>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        
        <div className={styler.labBranding}>
          <Image
            src="/logo.png"
            alt="ACT Lab Logo"
            width={60}
            height={60}
            className={styler.labLogo}
          />
          <div className={styler.labInfo}>
            <h4 className={styler.labName}>ACT Laboratory</h4>
            <p className={styler.labTagline}>Advanced Cardiovascular Technology</p>
          </div>
        </div>
      </div>
      
      <div className={styler.backgroundElements}>
        <div className={styler.floatingElement}></div>
        <div className={styler.floatingElement}></div>
        <div className={styler.floatingElement}></div>
      </div>
    </div>
  );
}
