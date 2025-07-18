import React, { use } from 'react'
import styler from '@/styles/Publications.module.css'
import { useEffect, useState } from 'react';
import Head from 'next/head';

const Publications = () => {
  const [allPublications, setAllPublications] = useState([]);
  const [publications, setPublications] = useState([]);
  const [displayedPublications, setDisplayedPublications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
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

  const ITEMS_PER_PAGE = 20;

  // Update displayed publications based on current filtered publications
  const updateDisplayedPublications = (filteredPubs, pageNum = 1) => {
    const startIndex = 0;
    const endIndex = pageNum * ITEMS_PER_PAGE;
    const newDisplayed = filteredPubs.slice(startIndex, endIndex);
    setDisplayedPublications(newDisplayed);
    setCurrentPage(pageNum);
  };

  // Load more publications
  const loadMorePublications = () => {
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      updateDisplayedPublications(publications, nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  // Check if there are more publications to load
  const hasMorePublications = () => {
    return displayedPublications.length < publications.length;
  };

  // Reset pagination when publications change
  const resetPagination = (newPublications) => {
    setCurrentPage(1);
    updateDisplayedPublications(newPublications, 1);
  };

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
        resetPagination(data.results);
        setIsSemanticMode(true);
        console.log(`🎯 Found ${data.results.length} similar publications for "${query}"`);
      } else {
        // No results found, show all publications
        setPublications(allPublications);
        resetPagination(allPublications);
        setSearchResults([]);
        setIsSemanticMode(false);
        console.log(`❌ No similar publications found for "${query}"`);
      }
    } catch (error) {
      console.error('❌ Error fetching similar publications:', error);
      // Fallback to showing all publications
      setPublications(allPublications);
      resetPagination(allPublications);
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
    resetPagination(allPublications);
    
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
        resetPagination(searchResults);
      } else {
        setPublications(allPublications);
        resetPagination(allPublications);
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
      resetPagination(filteredPublications);
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
      resetPagination(searchResults);
    } else {
      setPublications(allPublications);
      resetPagination(allPublications);
    }
  };

  const getTotalActiveFilters = () => {
    return Object.values(activeFilters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

  // Add this function near the top of your component, after the state declarations

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if can't parse
      }
      
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original if error occurs
    }
  };

  // Function to generate a BibTeX key from title and year
  const generateBibtexKey = (title, year, authors) => {
    // Take first author's last name
    const firstAuthor = authors && authors.length > 0 ? authors[0] : "Unknown";
    const lastName = firstAuthor.split(' ').pop().replace(/[^a-zA-Z]/g, '');
    
    // Take first significant word from title
    const titleWords = title.split(' ').filter(word => 
      word.length > 3 && !['the', 'and', 'for', 'with', 'from', 'using', 'based'].includes(word.toLowerCase())
    );
    const titleWord = titleWords[0] ? titleWords[0].replace(/[^a-zA-Z]/g, '') : 'Paper';
    
    return `${lastName}${year}${titleWord}`;
  };

  // Function to clean and format text for BibTeX
  const cleanBibtexText = (text) => {
    if (!text) return '';
    return text
      .replace(/[{}]/g, '') // Remove existing braces
      .replace(/&/g, '\\&') // Escape ampersands
      .replace(/%/g, '\\%') // Escape percent signs
      .replace(/_/g, '\\_') // Escape underscores
      .replace(/\$/g, '\\$') // Escape dollar signs
      .replace(/"/g, '') // Remove quotes
      .trim();
  };

  // Function to generate BibTeX for a single publication
  const generateBibtexForPublication = (publication) => {
    const year = publication["Publication date"] ? 
      new Date(publication["Publication date"]).getFullYear().toString() : "Unknown";
    
    const title = cleanBibtexText(publication["Title"] || "Untitled");
    const authors = publication["Authors"] || [];
    const key = generateBibtexKey(title, year, authors);
    
    // Determine publication type and format accordingly
    let bibtexType = "article"; // default
    let bibtexEntry = "";
    
    if (publication["Conference"]) {
      bibtexType = "inproceedings";
      bibtexEntry = `@${bibtexType}{${key},
  title = {${title}},
  author = {${authors.join(' and ')}},
  booktitle = {${cleanBibtexText(publication["Conference"])}},
  year = {${year}},`;
      
      if (publication["Pages"]) {
        bibtexEntry += `
  pages = {${publication["Pages"]}},`;
      }
      
      if (publication["Publisher"]) {
        bibtexEntry += `
  publisher = {${cleanBibtexText(publication["Publisher"])}},`;
      }
      
    } else if (publication["Journal"] || publication["Source"]) {
      bibtexType = "article";
      bibtexEntry = `@${bibtexType}{${key},
  title = {${title}},
  author = {${authors.join(' and ')}},
  journal = {${cleanBibtexText(publication["Journal"] || publication["Source"])}},
  year = {${year}},`;
      
      if (publication["Volume"]) {
        bibtexEntry += `
  volume = {${publication["Volume"]}},`;
      }
      
      if (publication["Issue"]) {
        bibtexEntry += `
  number = {${publication["Issue"]}},`;
      }
      
      if (publication["Pages"]) {
        bibtexEntry += `
  pages = {${publication["Pages"]}},`;
      }
      
      if (publication["Publisher"]) {
        bibtexEntry += `
  publisher = {${cleanBibtexText(publication["Publisher"])}},`;
      }
      
    } else {
      // Generic entry
      bibtexEntry = `@misc{${key},
  title = {${title}},
  author = {${authors.join(' and ')}},
  year = {${year}},`;
      
      if (publication["Publisher"]) {
        bibtexEntry += `
  publisher = {${cleanBibtexText(publication["Publisher"])}},`;
      }
    }
    
    // Add URL if available
    if (publication["Paper Link"]) {
      bibtexEntry += `
  url = {${publication["Paper Link"]}},`;
    }
    
    // Add note with citation count if available
    if (publication["Total citations"]) {
      bibtexEntry += `
  note = {Cited by ${publication["Total citations"]}},`;
    }
    
    // Close the entry
    bibtexEntry += `
}`;
    
    return bibtexEntry;
  };

  // Function to handle BibTeX generation and display
  const handleGetBibtex = (publication) => {
    try {
      const bibtexContent = generateBibtexForPublication(publication);
      
      // Create a modal or copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        // Copy to clipboard
        navigator.clipboard.writeText(bibtexContent).then(() => {
          // Show success message
          alert('BibTeX copied to clipboard!');
        }).catch(() => {
          // Fallback: show in a modal or new window
          showBibtexModal(publication, bibtexContent);
        });
      } else {
        // Fallback: show in a modal
        showBibtexModal(publication, bibtexContent);
      }
      
      console.log('✅ BibTeX generated for:', publication["Title"]);
    } catch (error) {
      console.error('❌ Error generating BibTeX:', error);
      alert('Failed to generate BibTeX. Please try again.');
    }
  };

  // Function to show BibTeX in a modal or alert
  const showBibtexModal = (publication, bibtexContent) => {
    // Create a simple modal display
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 2rem;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 2rem;
      max-width: 800px;
      max-height: 80vh;
      overflow: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;
    
    content.innerHTML = `
      <h3 style="margin: 0 0 1rem 0; color: #1e293b; font-size: 1.2rem;">
        BibTeX Citation
      </h3>
      <p style="margin: 0 0 1rem 0; color: #64748b; font-size: 0.9rem;">
        ${publication["Title"]}
      </p>
      <textarea 
        readonly 
        style="
          width: 100%; 
          height: 300px; 
          font-family: 'Courier New', monospace; 
          font-size: 0.9rem; 
          border: 1px solid #e2e8f0; 
          border-radius: 8px; 
          padding: 1rem;
          resize: vertical;
          background: #f8fafc;
        "
      >${bibtexContent}</textarea>
      <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
        <button 
          onclick="navigator.clipboard.writeText(this.parentElement.previousElementSibling.value).then(() => alert('Copied to clipboard!')).catch(() => {})"
          style="
            background: #10b981; 
            color: white; 
            border: none; 
            padding: 0.5rem 1rem; 
            border-radius: 8px; 
            cursor: pointer;
            font-weight: 600;
          "
        >
          Copy to Clipboard
        </button>
        <button 
          onclick="this.closest('[style*=\"position: fixed\"]').remove()"
          style="
            background: #6b7280; 
            color: white; 
            border: none; 
            padding: 0.5rem 1rem; 
            border-radius: 8px; 
            cursor: pointer;
            font-weight: 600;
          "
        >
          Close
        </button>
      </div>
    `;
    
    modal.appendChild(content);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // Close modal with Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    document.body.appendChild(modal);
  };


  useEffect(async () => {
    try {
      const response = await fetch('/api/publications/filterLimiter?authors=15&publishers=5&years=5');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAuthors(data.topAuthors);
      setPublishers(data.topPublishers);
      setYears(data.topYears);
    } catch (error) {
      console.error('Error fetching publications:', error);
    }
  }, []);
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
      resetPagination(data);
      setTopics(uniqueTopics);
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
            
            <div className={styler.publicationsHeader}>
              <div className={styler.publicationsCount}>
                Showing {displayedPublications.length} of {publications.length} publications
                {isSemanticMode && searchQuery && (
                  <span className={styler.searchContext}> (filtered from {allPublications.length} total)</span>
                )}
              </div>
            </div>
            
            <div className={styler.publicationsGrid}>
              {displayedPublications.map((publication, index) => (
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
                          <span className={styler.metaValue}>{formatDate(publication["Publication date"])}</span>
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
                      <button 
                        className={styler.publicationButtonSecondary}
                        onClick={() => handleGetBibtex(publication)}
                        title="Generate and copy BibTeX citation"
                      >
                        Get BibTeX
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMorePublications() && (
              <div className={styler.loadMoreContainer}>
                <button 
                  className={styler.loadMoreButton}
                  onClick={loadMorePublications}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <div className={styler.loadingSpinner}></div>
                      Loading more publications...
                    </>
                  ) : (
                    `Load More Publications (${publications.length - displayedPublications.length} remaining)`
                  )}
                </button>
                
                <div className={styler.paginationInfo}>
                  Page {currentPage} of {Math.ceil(publications.length / ITEMS_PER_PAGE)} • 
                  Showing {displayedPublications.length} of {publications.length} publications
                </div>
              </div>
            )}
            
            {/* No More Publications Message */}
            {!hasMorePublications() && publications.length > ITEMS_PER_PAGE && (
              <div className={styler.endOfResults}>
                <div className={styler.endMessage}>
                  🎉 You've reached the end! All {publications.length} publications are now displayed.
                </div>
                <button 
                  className={styler.backToTopButton}
                  onClick={() => {
                    const publicationsSection = document.getElementById('featured-publications');
                    if (publicationsSection) {
                      publicationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  ↑ Back to Top
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Publications
