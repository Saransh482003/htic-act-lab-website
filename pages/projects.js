import React from 'react'
import styler from '@/styles/Projects.module.css'

const Projects = () => {
  return (
    <>
      <section className={styler.pageBanner}>
        <div className={styler.floatingElements}>
          <div className={styler.floatingElement}>🔬</div>
          <div className={styler.floatingElement}>💡</div>
          <div className={styler.floatingElement}>⚕️</div>
          <div className={styler.floatingElement}>🧬</div>
        </div>
        
        <div className={styler.bannerContent}>
          <h1 className={styler.bannerTitle}>Research Projects</h1>
          <p className={styler.bannerDescription}>
            Explore our innovative research projects that are transforming cardiovascular healthcare 
            through cutting-edge technology, groundbreaking discoveries, and collaborative excellence.
          </p>
          
          <div className={styler.bannerStats}>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>50+</span>
              <span className={styler.statLabel}>Active Projects</span>
            </div>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>15+</span>
              <span className={styler.statLabel}>Research Areas</span>
            </div>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>200+</span>
              <span className={styler.statLabel}>Publications</span>
            </div>
          </div>
          
          <div className={styler.bannerActions}>
            <a href="#featured-projects" className={`${styler.actionButton} ${styler.primary}`}>
              Explore Projects ↓
            </a>
            <a href="/publications" className={`${styler.actionButton} ${styler.secondary}`}>
              View Publications →
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Projects