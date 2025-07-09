import React from 'react'
import styler from '@/styles/Publications.module.css'
import { useEffect, useState } from 'react';

const Publications = () => {
  const [allPublications, setAllPublications] = useState([]);
  const [publications, setPublications] = useState([]);
  const [years, setYears] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [topics, setTopics] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    years: [],
    authors: [],
    topics: [],
    publishers: []
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
        const publicationYear = new Date(publication.publicationDate).getFullYear().toString();
        const yearMatch = newActiveFilters.years.length === 0 || newActiveFilters.years.includes(publicationYear);
        const authorMatch = newActiveFilters.authors.length === 0 || newActiveFilters.authors.some(author => publication.authors.includes(author));
        const topicMatch = newActiveFilters.topics.length === 0 || newActiveFilters.topics.some(topic => publication.tags && publication.tags.includes(topic));
        const publisherMatch = newActiveFilters.publishers.length === 0 || newActiveFilters.publishers.includes(publication.publisher);
        
        return yearMatch && authorMatch && topicMatch && publisherMatch;
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
      topics: [],
      publishers: []
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
        title: "Psi-Net: Shape and boundary aware joint multi-task deep network for medical image segmentation",
        authors: [
          "Balamurali Murugesan",
          "Kaushik Sarveswaran",
          "Sharath M Shankaranarayana",
          "Keerthi Ram",
          "Jayaraj Joseph",
          "Mohanasankar Sivaprakasam"
        ],
        publicationDate: "23 July 2019",
        conference: "2019 41st Annual international conference of the IEEE engineering in medicine and biology society (EMBC)",
        pages: "7223-7226",
        publisher: "IEEE",
        tags: ["Medical Imaging", "Deep Learning", "Image Segmentation", "Neural Networks", "Computer Vision"],
        description: "Image segmentation is a primary task in many medical applications. Recently, many deep networks derived from U-Net has been extensively used in various medical image segmentation tasks. However, in most of the cases, networks similar to U-net produce coarse and non-smooth segmentations with lots of discontinuities. To improve and refine the performance of U-Net like networks, we propose the use of parallel decoders which along with performing the mask predictions also perform contour prediction and distance map estimation...",
        citations: 210,
        paperLink: "https://ieeexplore.ieee.org/document/8857490"
      },
      {
        title: "Advanced Cardiac Imaging Techniques in AI-Driven Diagnostics",
        authors: [
          "Dr. Sarah Johnson",
          "Dr. Michael Chen",
          "Dr. Emily Rodriguez"
        ],
        publicationDate: "15 March 2024",
        conference: "Journal of Cardiovascular Technology",
        pages: "45-62",
        publisher: "Elsevier",
        tags: ["AI/ML", "Cardiac Imaging", "Diagnostics", "Deep Learning", "Medical AI"],
        description: "This study explores the integration of artificial intelligence in cardiac imaging for enhanced diagnostic accuracy using deep learning models and computer vision techniques. The research demonstrates significant improvements in diagnostic precision through automated analysis of cardiac imaging data...",
        citations: 15
      },
      {
        title: "Machine Learning Approaches for Predicting Cardiovascular Risk",
        authors: [
          "Dr. Michael Chen",
          "Dr. Lisa Wang",
          "Dr. Robert Kumar"
        ],
        publicationDate: "8 September 2023",
        conference: "Nature Biomedical Engineering",
        pages: "123-138",
        publisher: "Nature Publishing Group",
        tags: ["AI/ML", "Risk Prediction", "Clinical Studies", "Cardiovascular", "Biomarkers"],
        description: "We present novel machine learning algorithms for cardiovascular risk assessment in clinical settings. Our approach combines multiple biomarkers and clinical data to provide accurate risk stratification for cardiovascular events...",
        citations: 42
      },
      {
        title: "Biomarker Discovery in Heart Failure Using Proteomics",
        authors: [
          "Dr. Emily Rodriguez",
          "Dr. Sarah Johnson",
          "Dr. David Park"
        ],
        publicationDate: "12 November 2023",
        conference: "Circulation Research",
        pages: "89-105",
        publisher: "American Heart Association",
        tags: ["Biomarkers", "Heart Failure", "Proteomics", "Clinical Research", "Cardiovascular"],
        description: "Novel protein biomarkers identified through advanced proteomics analysis for heart failure diagnosis. This research presents a comprehensive proteomics approach to identify novel biomarkers that could improve early detection and monitoring of heart failure...",
        citations: 28
      },
      {
        title: "Wearable Technology for Continuous Cardiac Monitoring",
        authors: [
          "Dr. Lisa Wang",
          "Dr. Robert Kumar",
          "Dr. Michael Chen"
        ],
        publicationDate: "5 June 2022",
        conference: "IEEE Transactions on Biomedical Engineering",
        pages: "1456-1469",
        publisher: "IEEE",
        tags: ["Wearable Tech", "Monitoring", "Signal Processing", "Cardiovascular", "IoT"],
        description: "Development of next-generation wearable devices for real-time cardiac monitoring and analysis. Our research focuses on creating lightweight, non-invasive monitoring systems that can provide continuous cardiac health assessment...",
        citations: 67
      }
    ];

    // Extract unique values for filters
    const uniqueYears = [...new Set(samplePublications.map(pub => new Date(pub.publicationDate).getFullYear().toString()))].sort((a, b) => b - a);
    const uniqueAuthors = [...new Set(samplePublications.flatMap(pub => pub.authors))].sort();
    const uniqueTopics = [...new Set(samplePublications.flatMap(pub => pub.tags || []))].sort();
    const uniquePublishers = [...new Set(samplePublications.map(pub => pub.publisher))].sort();

    setAllPublications(samplePublications);
    setPublications(samplePublications);
    setYears(uniqueYears);
    setAuthors(uniqueAuthors);
    setTopics(uniqueTopics);
    setPublishers(uniquePublishers);
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

              {/* Publisher Filter */}
              <div className={styler.filterGroup}>
                <h3 className={styler.filterGroupTitle}>Publisher</h3>
                <div className={styler.filterTags}>
                  {publishers.map((publisher, index) => (
                    <button 
                      key={index} 
                      className={`${styler.filterTag} ${activeFilters.publishers.includes(publisher) ? styler.active : ''}`} 
                      onClick={() => handleFilterClick('publishers', publisher)}
                    >
                      {publisher}
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
                    <div className={styler.publicationYear}>{new Date(publication.publicationDate).getFullYear()}</div>
                    <div className={styler.publicationCitations}>{publication.citations} citations</div>
                  </div>
                  <div className={styler.publicationContent}>
                    <h3 className={styler.publicationTitle}>{publication.title}</h3>
                    <div className={styler.publicationAuthors}>
                      {publication.authors.map((author, idx) => (
                        <span key={idx} className={styler.authorName}>
                          {author}
                          {idx < publication.authors.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                    <div className={styler.publicationJournal}>{publication.conference}</div>
                    <div className={styler.publicationMeta}>
                      <span className={styler.publicationPages}>Pages: {publication.pages}</span>
                      <span className={styler.publicationPublisher}>{publication.publisher}</span>
                      <span className={styler.publicationDate}>
                        {publication.publicationDate}
                      </span>
                    </div>
                    <p className={styler.publicationAbstract}>{publication.description}</p>
                    {publication.tags && publication.tags.length > 0 && (
                      <div className={styler.publicationTopics}>
                        {publication.tags.map((tag, index) => (
                          <span key={index} className={styler.publicationTopic}>{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className={styler.publicationActions}>
                      <button 
                        className={styler.publicationButton} 
                        onClick={() => publication.paperLink && window.open(publication.paperLink, '_blank')}
                      >
                        View Paper
                      </button>
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
