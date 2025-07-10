import Image from "next/image";
import styler from "@/styles/HomePage.module.css";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";


// Counter component for animated numbers
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <h4 ref={counterRef} className={styler.statisticValue}>
      {count}{suffix}
    </h4>
  );
}

export default function Home() {
  const [activePlugIndex, setActivePlugIndex] = useState(0);
  const [ourWork, setOurWork] = useState([]);
  const [news, setNews] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [aboutStatistics, setAboutStatistics] = useState({});



  useEffect(() => {
    const fetchAboutStatistics = async () => {
      try {
        const response = await fetch("/api/home/about_statistics");
        if (!response.ok) {
          throw new Error("Failed to fetch about statistics");
        }
        const data = await response.json();
        setAboutStatistics(data);
      } catch (error) {
        console.error("Error fetching about statistics:", error);
      }
    };
    fetchAboutStatistics();
  }, []);
  useEffect(() => {
    const fetchOurWork = async () => {
      try {
        const response = await fetch("/api/home/our_work");
        if (!response.ok) {
          throw new Error("Failed to fetch our work data");
        }
      } catch (error) {
        console.error("Error fetching our work data:", error);
      }
    };
    fetchOurWork();
  }, []);
  useEffect(() => {
    const fetchOurWork = async () => {
      try {
        const response = await fetch("/api/home/our_work");
        if (!response.ok) {
          throw new Error("Failed to fetch our work data");
        }
        const data = await response.json();
        setOurWork(data);
      } catch (error) {
        console.error("Error fetching our work data:", error);
      }
    };
    fetchOurWork();
  }, []);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoadingNews(true);
        setNewsError(null);
        const response = await fetch("/api/home/news");
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news data:", error);
        setNewsError(error.message);
      } finally {
        setIsLoadingNews(false);
      }
    };
    
    fetchNews();
  }, []);

  return (
    <>
      <Head>
        <title>Advanced Cardiovascular Technology Laboratory | IIT Madras</title>
        <meta name="description" content="The Advanced Cardiovascular Technology Laboratory (ACT Lab) is a pioneering research initiative at IIT Madras, dedicated to advancing cardiovascular healthcare through innovative technology." />
      </Head>
      <section>
        <nav className={styler.navbar}>
          <div className={styler.logo} onClick={() => window.location.href = "/"}>
            <Image
              src="/actlabs_logo_home.png"
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
          <p className={styler.bannerTitle}>TRANSFORMING <br /> <span>HEART</span> HEALTH <br /> WITH INNOVATION</p>
          <p className={styler.bannerSubtitle}>AN INITIATIVE BY IIT MADRAS & DEP. OF BIOTECHNOLOGY, GOV. OF INDIA</p>
        </div>
        <div className={styler.bannerActions}>
          <a href="/publications" className={styler.publicationButton}>
            <div className={styler.arrowBtn}>
              <span className={styler.arrow}>→</span>
            </div>
            <div className={styler.publicationText}>
              <span className={styler.publicationTitle}>Read Recent Publication</span>
              <span className={styler.publicationSubtitle}>Signal enhancement using the europium nanoparticle...</span>
            </div>
          </a>
        </div>
      </section>
      <section className={styler.quickLinkSection}>
        {aboutStatistics.quickSnippets && aboutStatistics.quickSnippets.map((snippet, index) => (
          <div className={styler.quickCardOuter} key={index} onClick={() => window.location.href = snippet.link}>
            <div className={styler.quickCardInner}>
              <h3 className={styler.quickCardTitle}>{snippet.title}</h3>
              <p className={styler.quickCardContent}>{snippet.description}</p>
            </div>
          </div>
        ))}
      </section>
      <section className={styler.statisticsSection}>
        {aboutStatistics.statistics && aboutStatistics.statistics.map((statistic, index) => (
          <div className={styler.statisticCard} key={index}>
            <AnimatedCounter end={statistic.value} suffix={statistic.suffix} />
            <p className={styler.statisticLabel}>{statistic.label}</p>
          </div>
        ))}
      </section>
      <section className={styler.labDescription}>
        <div className={styler.labDescriptionContent}>
          <h2 className={styler.labDescriptionTitle}>ABOUT US</h2>
          <p className={styler.labDescriptionText}>
            The Advanced Cardiovascular Technology Laboratory (ACT Lab) is a pioneering research initiative at the Indian Institute of Technology Madras, dedicated to advancing cardiovascular healthcare through innovative technology and scientific research. Our mission is to develop cutting-edge solutions that enhance the diagnosis, treatment, and management of cardiovascular diseases, ultimately improving patient outcomes and quality of life.
          </p>
        </div>
      </section>
      <section className={styler.exploreNewsSection}>
        <div className={styler.exploreUsSection} onMouseLeave={() => setActivePlugIndex(-1)}>
          <h2 className={styler.exploreSectionTitle}>EXPLORE OUR WORK</h2>
          <p className={styler.exploreSectionSubtitle}>Explore the latest advancements in cardiovascular technology</p>
          <div className={styler.exploreGrid}>
            {ourWork.map((plug, index) => (
              <div
                key={plug.id}
                className={`${styler.exploreCard} ${activePlugIndex === index ? styler.active : ''}`}
                onMouseEnter={() => setActivePlugIndex(index)}
              >
                <div className={styler.exploreIcon}>
                  <Image
                    src={plug.image}
                    alt={plug.title}
                    width={40}
                    height={40}
                    className={styler.exploreImg}
                  />
                </div>
                <h3 className={styler.exploreTitle}>{plug.title}</h3>
                <p className={styler.exploreDescription}>{plug.description}</p>
                <a href={plug.link} className={styler.exploreButton}>
                  {plug.linkText} <span className={styler.exploreArrow}>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className={styler.newsSection}>
          <div className={styler.newsSectionHeader}>
            <h2 className={styler.newsSectionTitle}>LATEST NEWS & UPDATES</h2>
            <p className={styler.newsSectionSubtitle}>Stay updated with our latest research breakthroughs</p>
          </div>
          
          {isLoadingNews ? (
            <div className={styler.newsContainer}>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className={`${styler.newsCard} ${styler.newsCardLoading}`}>
                  <div className={styler.newsImageContainer}>
                    <div className={styler.newsImageSkeleton}></div>
                    <div className={styler.newsDate}>
                      <span className={styler.newsDateMonth}>---</span>
                      <span className={styler.newsDateDay}>--</span>
                    </div>
                  </div>
                  <div className={styler.newsContent}>
                    <div className={styler.newsCategorySkeleton}></div>
                    <div className={styler.newsTitleSkeleton}></div>
                    <div className={styler.newsDescriptionSkeleton}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : newsError ? (
            <div className={styler.newsError}>
              <p>Unable to load latest news. Please try again later.</p>
              <button 
                onClick={() => window.location.reload()} 
                className={styler.newsRetryButton}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className={styler.newsContainer}>
              {news.map((newsItem, index) => (
                <div className={styler.newsCard} key={newsItem.id}>
                  {newsItem.featured && (
                    <div className={styler.newsFeaturedBadge}>Featured</div>
                  )}
                  <div className={styler.newsImageContainer}>
                    <Image
                      src={newsItem.image}
                      alt={newsItem.title}
                      width={300}
                      height={200}
                      className={styler.newsImage}
                      onError={(e) => {
                        // Set a placeholder background instead of changing src
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add(styler.newsImageError);
                      }}
                    />
                    <div className={styler.newsDate}>
                      <span className={styler.newsDateMonth}>{newsItem.date.month}</span>
                      <span className={styler.newsDateDay}>{newsItem.date.day}</span>
                    </div>
                  </div>
                  <div className={styler.newsContent}>
                    <div className={styler.newsCategory} style={{
                      backgroundColor: newsItem.category === 'Research' ? '#3b82f6' :
                                     newsItem.category === 'Achievement' ? '#10b981' :
                                     newsItem.category === 'Clinical Study' ? '#8b5cf6' :
                                     newsItem.category === 'AI Research' ? '#f59e0b' :
                                     newsItem.category === 'Collaboration' ? '#ef4444' :
                                     newsItem.category === 'Academic' ? '#06b6d4' :
                                     newsItem.category === 'Healthcare Access' ? '#84cc16' : '#6b7280'
                    }}>
                      {newsItem.category}
                    </div>
                    <h3 className={styler.newsTitle}>{newsItem.title}</h3>
                    <p className={styler.newsDescription}>
                      {newsItem.description.length > 120 
                        ? `${newsItem.description.substring(0, 120)}...` 
                        : newsItem.description}
                    </p>
                    <div className={styler.newsMetadata}>
                      <span className={styler.newsAuthor}>By {newsItem.author}</span>
                      <span className={styler.newsReadTime}>{newsItem.readTime}</span>
                    </div>
                    <a href={newsItem.link} className={styler.newsReadMore}>
                      Read More <span className={styler.newsArrow}>→</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className={styler.newsViewAllContainer}>
            <a href="/news" className={styler.newsViewAllButton}>
              View All News
            </a>
          </div>
        </div>
      </section>
      <section className={styler.searchResearch}>
        <div className={styler.searchResearchContent}>
          <h2 className={styler.searchResearchTitle}>EXPLORE OUR PUBLICATIONS</h2>
          <p className={styler.searchResearchSubtitle}>Find specific research papers, projects, or clinical studies.</p>
          <form className={styler.searchForm}>
            <input
              type="text"
              placeholder="Search by keyword, author, or topic..."
              className={styler.searchInput}
            />
            <button type="submit" className={styler.searchButton}>Search</button>
          </form>
        </div>
      </section>


    </>
  );
}
