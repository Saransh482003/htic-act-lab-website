import React from 'react'
import styler from '@/styles/Publications.module.css'
import { useEffect, useState } from 'react';
import Head from 'next/head';

const Publications = () => {
  const [allPublications, setAllPublications] = useState([]);
  const [publications, setPublications] = useState([]);
  const [years, setYears] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [topics, setTopics] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSemanticMode, setIsSemanticMode] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    years: [],
    authors: [],
    topics: [],
    publishers: []
  });

  // Fetch similar publications using semantic search API
  const fetchSimilar = async (query) => {
    if (!query || query.trim().length === 0) {
      setPublications(allPublications);
      setSearchResults([]);
      setIsSemanticMode(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch('/api/publications/paperDetails?action=similar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
        setPublications(data.results);
        setIsSemanticMode(true);
        console.log(`🎯 Found ${data.results.length} similar publications for "${query}"`);
      } else {
        // No results found, show all publications
        setPublications(allPublications);
        setSearchResults([]);
        setIsSemanticMode(false);
        console.log(`❌ No similar publications found for "${query}"`);
      }
    } catch (error) {
      console.error('❌ Error fetching similar publications:', error);
      // Fallback to showing all publications
      setPublications(allPublications);
      setSearchResults([]);
      setIsSemanticMode(false);
    }

    setIsSearching(false);
  };

  // Handle search input changes with debouncing
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear existing timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Set new timeout for debounced search
    window.searchTimeout = setTimeout(() => {
      fetchSimilar(query);
    }, 500); // 500ms delay
  };

  // Clear search and reset to all publications
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSemanticMode(false);
    setPublications(allPublications);
    
    // Clear any pending timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
  };

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
      // If no filters are active, show search results or all publications
      if (isSemanticMode && searchResults.length > 0) {
        setPublications(searchResults);
      } else {
        setPublications(allPublications);
      }
    } else {
      // Filter publications that match the selected filters
      const basePublications = isSemanticMode ? searchResults : allPublications;
      const filteredPublications = basePublications.filter(publication => {
        const publicationYear = new Date(publication["Publication date"]).getFullYear().toString();
        const yearMatch = newActiveFilters.years.length === 0 || newActiveFilters.years.includes(publicationYear);
        const authorMatch = newActiveFilters.authors.length === 0 || newActiveFilters.authors.some(author => 
          (publication["Authors"] || []).includes(author));
        const topicMatch = newActiveFilters.topics.length === 0 || newActiveFilters.topics.some(topic => 
          publication["Tags"] && publication["Tags"].includes(topic));
        const publisherMatch = newActiveFilters.publishers.length === 0 || newActiveFilters.publishers.includes(
          publication["Publisher"]);
        
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
    
    // Restore search results or all publications
    if (isSemanticMode && searchResults.length > 0) {
      setPublications(searchResults);
    } else {
      setPublications(allPublications);
    }
  };

  const getTotalActiveFilters = () => {
    return Object.values(activeFilters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

  useEffect(async () => {
    
    try {
      const response = await fetch('/api/publications/paperDetails');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const uniqueYears = [...new Set(data.map(pub => new Date(pub['Publication date']).getFullYear().toString()))].sort((a, b) => b - a);
      const uniqueAuthors = [...new Set(data.flatMap(pub => pub["Authors"]))].sort();
      const uniqueTopics = [...new Set(data.flatMap(pub => pub.tags || []))].sort();
      const uniquePublishers = [...new Set(data.map(pub => pub["Publisher"]))].sort();
      
      setAllPublications(data);
      setPublications(data);
      setYears(uniqueYears);
      setAuthors(uniqueAuthors);
      setTopics(uniqueTopics);
      setPublishers(uniquePublishers);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);
  return (
    <>
      <Head>
        <title>Publications | Advanced Cardiovascular Technology Laboratory</title>
        <meta name="description" content="Browse our extensive collection of research papers, journal articles, and academic publications on cardiovascular technology and biomedical engineering." />
      </Head>
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
            <div className={styler.publicationSearch}>
              <div className={styler.searchInputWrapper}>
                <input 
                  type="text" 
                  placeholder="Search publications using AI semantic search (e.g., 'cardiovascular monitoring', 'machine learning ECG')..." 
                  className={styler.searchInput}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button 
                    className={styler.clearSearchButton}
                    onClick={clearSearch}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
                {isSearching && (
                  <div className={styler.searchLoader}>
                    <div className={styler.spinner}></div>
                  </div>
                )}
              </div>
              
              <div className={styler.searchInfo}>
                {isSearching ? (
                  <span className={styler.searchStatus}>🔄 Searching for similar publications...</span>
                ) : searchQuery ? (
                  isSemanticMode && searchResults.length > 0 ? (
                    <span className={styler.searchResults}>
                      🎯 Found {publications.length} semantically similar papers for "{searchQuery}"
                    </span>
                  ) : searchQuery && !isSemanticMode ? (
                    <span className={styler.searchNoResults}>
                      ❌ No similar papers found for "{searchQuery}" - showing all publications
                    </span>
                  ) : null
                ) : (
                  <span className={styler.searchHint}>
                    💡 Try searching for research topics like "pulse wave velocity", "ECG analysis", "medical imaging"
                  </span>
                )}
              </div>
            </div>
            <div className={styler.publicationsGrid}>
              {publications.map((publication, index) => (
                <div className={styler.publicationCard} key={index}>
                  <div className={styler.publicationHeader}>
                    <div className={styler.publicationYear}>{new Date(publication["Publication date"]).getFullYear()}</div>
                    <div className={styler.publicationCitations}>
                      <span className={styler.citationCount}>{publication["Total citations"]}</span> citations
                    </div>
                    {isSemanticMode && publication.similarityScore && (
                      <div className={styler.relevanceScore}>
                        #{publication.relevanceRank} • {publication.similarityScore}% match
                      </div>
                    )}
                  </div>
                  
                  <div className={styler.publicationContent}>
                    <h3 className={styler.publicationTitle}>
                      {publication["Title"]}                    
                    </h3>
                    
                    <div className={styler.publicationAuthors}>
                      {(publication["Authors"] || publication["Inventors"].split(", ")).map((author, idx) => (
                        <span key={idx} className={styler.authorName}>
                          {author}
                          {idx < (publication["Authors"] || publication["Inventors"].split(", ")).length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                    
                    <div className={styler.publicationVenue}>
                      <span className={styler.publicationJournal}>{publication["Conference"] || publication["Journal"] || publication["Source"]}</span>
                    </div>
                    
                    <div className={styler.publicationMeta}>
                      {publication["Pages"] && (
                        <div className={styler.metaItem}>
                          <span className={styler.metaLabel}>Pages:</span>
                          <span className={styler.metaValue}>{publication["Pages"]}</span>
                        </div>
                      )}
                      
                      {publication["Publisher"] && (
                        <div className={styler.metaItem}>
                          <span className={styler.metaLabel}>Publisher:</span>
                          <span className={styler.metaValue}>{publication["Publisher"]}</span>
                        </div>
                      )}
                      
                      {publication["Publication date"] && (
                        <div className={styler.metaItem}>
                          <span className={styler.metaLabel}>Published:</span>
                          <span className={styler.metaValue}>{publication["Publication date"]}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={styler.abstractSection}>
                      <div className={styler.abstractHeader}>Abstract</div>
                      <p className={styler.publicationAbstract}>
                        {publication["Description"] || "No abstract available."}
                      </p>
                    </div>
                    
                    {publication["Tags"] && publication["Tags"].length > 0 && (
                      <div className={styler.publicationTopics}>
                        {publication["Tags"].map((tag, index) => (
                          <span key={index} className={styler.publicationTopic}>{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className={styler.publicationActions}>
                      <button 
                        className={styler.publicationButton} 
                        onClick={() => (publication["Paper Link"]||"link") && window.open(publication["Paper Link"], '_blank')}
                      >
                        View Paper
                      </button>
                      <button className={styler.publicationButtonSecondary}>
                        Cite
                      </button>
                      <button className={styler.publicationButtonSecondary}>
                        Get BibTeX
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
