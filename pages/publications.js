import React from 'react'
import styler from '@/styles/Publications.module.css'
import { useEffect, useState } from 'react';

const Publications = () => {
  const [allPublications, setAllPublications] = useState([]);
  const [publications, setPublications] = useState([]);
  const [years, setYears] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [topics, setTopics] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    years: [],
    authors: [],
    topics: []
  });

  const handleFilterClick = (filterType, value) => {
    let newActiveFilters = { ...activeFilters };
    
    if (newActiveFilters[filterType].includes(value)) {
      // Remove the filter if it's already selected
      newActiveFilters[filterType] = newActiveFilters[filterType].filter(filter => filter !== value);
    } else {
      // Add the filter to the selected filters
      newActiveFilters[filterType] = [...newActiveFilters[filterType], value];
    }
    
    setActiveFilters(newActiveFilters);
    
    // Check if any filters are active
    const hasActiveFilters = Object.values(newActiveFilters).some(filterArray => filterArray.length > 0);
    
    if (!hasActiveFilters) {
      // If no filters are active, show all publications
      setPublications(allPublications);
    } else {
      // Filter publications that match the selected filters
      const filteredPublications = allPublications.filter(publication => {
        const yearMatch = newActiveFilters.years.length === 0 || newActiveFilters.years.includes(publication.year.toString());
        const authorMatch = newActiveFilters.authors.length === 0 || newActiveFilters.authors.some(author => publication.authors.includes(author));
        const topicMatch = newActiveFilters.topics.length === 0 || newActiveFilters.topics.some(topic => publication.topics.includes(topic));
        
        return yearMatch && authorMatch && topicMatch;
      });
      setPublications(filteredPublications);
    }
    
    // Scroll to the featured-publications section
    const featuredPublicationsElement = document.getElementById('featured-publications');
    if (featuredPublicationsElement) {
      featuredPublicationsElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({
      years: [],
      authors: [],
      topics: []
    });
    setPublications(allPublications);
  };

  const getTotalActiveFilters = () => {
    return Object.values(activeFilters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

  useEffect(() => {
    // Placeholder data - replace with actual API call
    const samplePublications = [
      {
        id: 1,
        title: "Advanced Cardiac Imaging Techniques in AI-Driven Diagnostics",
        authors: ["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Emily Rodriguez"],
        year: 2024,
        journal: "Journal of Cardiovascular Technology",
        topics: ["AI/ML", "Cardiac Imaging", "Diagnostics"],
        abstract: "This study explores the integration of artificial intelligence in cardiac imaging for enhanced diagnostic accuracy...",
        doi: "10.1234/jct.2024.001",
        citationCount: 15
      },
      {
        id: 2,
        title: "Machine Learning Approaches for Predicting Cardiovascular Risk",
        authors: ["Dr. Michael Chen", "Dr. Lisa Wang", "Dr. Robert Kumar"],
        year: 2023,
        journal: "Nature Biomedical Engineering",
        topics: ["AI/ML", "Risk Prediction", "Clinical Studies"],
        abstract: "We present novel machine learning algorithms for cardiovascular risk assessment in clinical settings...",
        doi: "10.1038/nbe.2023.045",
        citationCount: 42
      },
      {
        id: 3,
        title: "Biomarker Discovery in Heart Failure Using Proteomics",
        authors: ["Dr. Emily Rodriguez", "Dr. Sarah Johnson", "Dr. David Park"],
        year: 2023,
        journal: "Circulation Research",
        topics: ["Biomarkers", "Heart Failure", "Proteomics"],
        abstract: "Novel protein biomarkers identified through advanced proteomics analysis for heart failure diagnosis...",
        doi: "10.1161/circres.2023.123",
        citationCount: 28
      },
      {
        id: 4,
        title: "Wearable Technology for Continuous Cardiac Monitoring",
        authors: ["Dr. Lisa Wang", "Dr. Robert Kumar", "Dr. Michael Chen"],
        year: 2022,
        journal: "IEEE Transactions on Biomedical Engineering",
        topics: ["Wearable Tech", "Monitoring", "Signal Processing"],
        abstract: "Development of next-generation wearable devices for real-time cardiac monitoring and analysis...",
        doi: "10.1109/tbme.2022.678",
        citationCount: 67
      }
    ];

    // Extract unique values for filters
    const uniqueYears = [...new Set(samplePublications.map(pub => pub.year.toString()))].sort((a, b) => b - a);
    const uniqueAuthors = [...new Set(samplePublications.flatMap(pub => pub.authors))].sort();
    const uniqueTopics = [...new Set(samplePublications.flatMap(pub => pub.topics))].sort();

    setAllPublications(samplePublications);
    setPublications(samplePublications);
    setYears(uniqueYears);
    setAuthors(uniqueAuthors);
    setTopics(uniqueTopics);
  }, []);
  return (
    <>
      <section className={styler.pageBanner}>        
        <div className={styler.bannerContent}>
          <h1 className={styler.bannerTitle}>Publications</h1>
          <p className={styler.bannerDescription}>
            Discover our cutting-edge research publications that advance cardiovascular medicine 
            through innovative studies, clinical trials, and groundbreaking scientific discoveries.
          </p>
          
          <div className={styler.bannerStats}>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>200+</span>
              <span className={styler.statLabel}>Research Papers</span>
            </div>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>50+</span>
              <span className={styler.statLabel}>Journal Articles</span>
            </div>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>25+</span>
              <span className={styler.statLabel}>Clinical Studies</span>
            </div>
          </div>
          
          <div className={styler.bannerActions}>
            <a href="#featured-publications" className={`${styler.actionButton} ${styler.primary}`}>
              Browse Publications ↓
            </a>
            <a href="/projects" className={`${styler.actionButton} ${styler.secondary}`}>
              View Projects →
            </a>
          </div>
        </div>
      </section>
      
      <section className={styler.publicationsSection} id='featured-publications'>
        <div className={styler.publicationsContainer}>
          {/* Filter Sidebar */}
          <div className={styler.filterSidebar}>
            <div className={styler.filterContainer}>
              <h2 className={styler.filterTitle}>Filter Publications</h2>
              <p className={styler.filterSubtitle}>
                {getTotalActiveFilters() > 0 
                  ? `Filtering by ${getTotalActiveFilters()} criteria` 
                  : "Select filters to narrow down publications"}
              </p>

              {/* Year Filter */}
              <div className={styler.filterGroup}>
                <h3 className={styler.filterGroupTitle}>Year of Publication</h3>
                <div className={styler.filterTags}>
                  {years.map((year, index) => (
                    <button 
                      key={index} 
                      className={`${styler.filterTag} ${activeFilters.years.includes(year) ? styler.active : ''}`} 
                      onClick={() => handleFilterClick('years', year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author Filter */}
              <div className={styler.filterGroup}>
                <h3 className={styler.filterGroupTitle}>Author</h3>
                <div className={styler.filterTags}>
                  {authors.map((author, index) => (
                    <button 
                      key={index} 
                      className={`${styler.filterTag} ${activeFilters.authors.includes(author) ? styler.active : ''}`} 
                      onClick={() => handleFilterClick('authors', author)}
                    >
                      {author}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Filter */}
              <div className={styler.filterGroup}>
                <h3 className={styler.filterGroupTitle}>Research Topics</h3>
                <div className={styler.filterTags}>
                  {topics.map((topic, index) => (
                    <button 
                      key={index} 
                      className={`${styler.filterTag} ${activeFilters.topics.includes(topic) ? styler.active : ''}`} 
                      onClick={() => handleFilterClick('topics', topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear All Filters Button */}
              {getTotalActiveFilters() > 0 && (
                <div className={styler.filterActions}>
                  <button 
                    className={styler.clearFiltersButton} 
                    onClick={clearAllFilters}
                  >
                    Clear All Filters ({getTotalActiveFilters()})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Publications Display Section */}
          <div className={styler.publicationsDisplay}>
            <div className={styler.publicationsGrid}>
              {publications.map((publication, index) => (
                <div className={styler.publicationCard} key={index}>
                  <div className={styler.publicationHeader}>
                    <div className={styler.publicationYear}>{publication.year}</div>
                    <div className={styler.publicationCitations}>{publication.citationCount} citations</div>
                  </div>
                  <div className={styler.publicationContent}>
                    <h3 className={styler.publicationTitle}>{publication.title}</h3>
                    <div className={styler.publicationAuthors}>
                      {publication.authors.join(", ")}
                    </div>
                    <div className={styler.publicationJournal}>{publication.journal}</div>
                    <p className={styler.publicationAbstract}>{publication.abstract}</p>
                    <div className={styler.publicationTopics}>
                      {publication.topics.map((topic, index) => (
                        <span key={index} className={styler.publicationTopic}>{topic}</span>
                      ))}
                    </div>
                    <div className={styler.publicationActions}>
                      <a href={`https://doi.org/${publication.doi}`} className={styler.publicationButton} target="_blank" rel="noopener noreferrer">
                        View Paper
                      </a>
                      <button className={styler.publicationButtonSecondary}>
                        Cite
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Publications