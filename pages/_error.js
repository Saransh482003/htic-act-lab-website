import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styler from "@/styles/ErrorPage.module.css";

function Error({ statusCode, hasGetInitialProps, err }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);

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

  const getErrorMessage = (statusCode) => {
    switch (statusCode) {
      case 404:
        return {
          title: "Research Page Not Found",
          description: "The page you're looking for seems to have been moved or doesn't exist.",
          icon: "🔬"
        };
      case 500:
        return {
          title: "Lab System Error",
          description: "Our research systems are experiencing technical difficulties. Please try again later.",
          icon: "⚠️"
        };
      case 403:
        return {
          title: "Access Restricted",
          description: "This research data or page requires special permissions to access.",
          icon: "🔒"
        };
      default:
        return {
          title: "System Error",
          description: "An unexpected error occurred in our research systems.",
          icon: "❗"
        };
    }
  };

  const errorInfo = getErrorMessage(statusCode);

  return (
    <div className={styler.errorContainer}>
      <div className={styler.errorContent}>
        <div className={styler.errorAnimation}>
          <div className={styler.pulseCircle}></div>
          <div className={styler.errorIcon}>{errorInfo.icon}</div>
        </div>
        
        <div className={styler.errorText}>
          <h1 className={styler.errorCode}>{statusCode || 'Error'}</h1>
          <h2 className={styler.errorTitle}>{errorInfo.title}</h2>
          <p className={styler.errorDescription}>
            {errorInfo.description}
            {statusCode === 500 && " Our technical team has been notified and is working on a solution."}
          </p>
          
          <div className={styler.errorStats}>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>{statusCode || 'ERR'}</span>
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
            <h3 className={styler.helpTitle}>Need assistance?</h3>
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
                Contact Support
              </Link>
            </div>
          </div>
          
          {statusCode === 500 && (
            <div className={styler.errorDetails}>
              <details className={styler.technicalDetails}>
                <summary>Technical Details (for developers)</summary>
                <pre className={styler.errorStack}>
                  {err?.stack || 'No additional error information available'}
                </pre>
              </details>
            </div>
          )}
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

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
