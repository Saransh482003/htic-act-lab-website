import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styler from '@/styles/ScientificResearch.module.css'

const ScientificResearch = () => {
  const [allResearch, setAllResearch] = useState([]);
  const [research, setResearch] = useState([]);
  const [areas, setAreas] = useState([]);
  const [researchers, setResearchers] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    areas: [],
    researchers: [],
    tags: []
  });

  // Sample research data
  const sampleResearch = [
    {
      id: 1,
      title: "AI-Powered Cardiovascular Risk Assessment",
      image: "/projects/ERA.png",
      area: "Artificial Intelligence",
      researchers: ["Dr. Jayaraj Joseph", "Dr. Mohanasankar Sivaprakasam", "Dr. Keerthi Ram"],
      description: "Developing advanced machine learning algorithms for early detection and risk assessment of cardiovascular diseases using multi-modal data including ECG, PPG, and clinical parameters. This research aims to create predictive models that can identify high-risk patients before symptoms appear.",
      tags: ["Machine Learning", "Cardiovascular", "Risk Assessment", "Early Detection", "AI"]
    },
    {
      id: 2,
      title: "Non-invasive Arterial Stiffness Monitoring",
      image: "/projects/ARTSENS.png",
      area: "Biomedical Engineering",
      researchers: ["Dr. Boby George", "Dr. Nabeel P M", "Dr. Raj Kumar"],
      description: "Research focused on developing innovative non-invasive techniques for measuring arterial stiffness using ultrasound technology. The ARTSENS device provides real-time assessment of vascular health without the need for invasive procedures.",
      tags: ["Ultrasound", "Arterial Stiffness", "Non-invasive", "Vascular Health", "ARTSENS"]
    },
    {
      id: 3,
      title: "Wearable Health Monitoring Systems",
      image: "/projects/ERA.png",
      area: "Wearable Technology",
      researchers: ["Dr. Amit Kumar Gupta", "Dr. Saransh Saini", "Dr. Mathew Cigi"],
      description: "Developing next-generation wearable devices for continuous health monitoring including heart rate, blood pressure, respiratory rate, and stress levels. Focus on creating comfortable, accurate, and long-lasting wearable solutions.",
      tags: ["Wearables", "Continuous Monitoring", "Heart Rate", "Blood Pressure", "IoT"]
    },
    {
      id: 4,
      title: "Deep Learning for Medical Image Analysis",
      image: "/projects/ERA.png",
      area: "Medical Imaging",
      researchers: ["Dr. Ishwarya S", "Dr. Jaganathan G", "Dr. Navya Rose George"],
      description: "Advancing medical image analysis through deep learning techniques for automated diagnosis and treatment planning. Research includes segmentation, classification, and detection algorithms for various medical imaging modalities.",
      tags: ["Deep Learning", "Medical Imaging", "Segmentation", "Classification", "Computer Vision"]
    },
    {
      id: 5,
      title: "Telemedicine and Remote Patient Monitoring",
      image: "/projects/ERA.png",
      area: "Digital Health",
      researchers: ["Dr. Nimmi Sudarshan", "Dr. Ponkalaivani S", "Dr. Rahul Manoj"],
      description: "Creating comprehensive telemedicine platforms and remote monitoring solutions to improve healthcare accessibility in rural and underserved areas. Focus on low-cost, reliable, and user-friendly solutions.",
      tags: ["Telemedicine", "Remote Monitoring", "Digital Health", "Healthcare Access", "Rural Health"]
    },
    {
      id: 6,
      title: "Point-of-Care Diagnostic Devices",
      image: "/projects/CARDIOSENS.jpg",
      area: "Diagnostic Technology",
      researchers: ["Dr. Smit Sanjay Shah", "Dr. V V Girish", "Dr. Arjun R K"],
      description: "Developing portable, affordable diagnostic devices for point-of-care testing. Research includes biosensor development, microfluidics, and rapid diagnostic techniques for various biomarkers and diseases.",
      tags: ["Point-of-Care", "Diagnostics", "Biosensors", "Microfluidics", "Rapid Testing"]
    }
  ];

  const handleFilterClick = (filterType, value) => {
    let newActiveFilters = { ...activeFilters };
    
    if (newActiveFilters[filterType].includes(value)) {
      newActiveFilters[filterType] = newActiveFilters[filterType].filter(filter => filter !== value);
    } else {
      newActiveFilters[filterType] = [...newActiveFilters[filterType], value];
    }
    
    setActiveFilters(newActiveFilters);
    
    const hasActiveFilters = Object.values(newActiveFilters).some(filterArray => filterArray.length > 0);
    
    if (!hasActiveFilters) {
      setResearch(allResearch);
    } else {
      const filteredResearch = allResearch.filter(research => {
        const areaMatch = newActiveFilters.areas.length === 0 || newActiveFilters.areas.includes(research.area);
        const researcherMatch = newActiveFilters.researchers.length === 0 || newActiveFilters.researchers.some(researcher => research.researchers.includes(researcher));
        const tagMatch = newActiveFilters.tags.length === 0 || newActiveFilters.tags.some(tag => research.tags.includes(tag));
        
        return areaMatch && researcherMatch && tagMatch;
      });
      setResearch(filteredResearch);
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({
      areas: [],
      researchers: [],
      tags: []
    });
    setResearch(allResearch);
  };

  const getTotalActiveFilters = () => {
    return Object.values(activeFilters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

  useEffect(() => {
    // Extract unique values for filters
    const uniqueAreas = [...new Set(sampleResearch.map(research => research.area))].sort();
    const uniqueResearchers = [...new Set(sampleResearch.flatMap(research => research.researchers))].sort();
    const uniqueTags = [...new Set(sampleResearch.flatMap(research => research.tags))].sort();
    
    setAllResearch(sampleResearch);
    setResearch(sampleResearch);
    setAreas(uniqueAreas);
    setResearchers(uniqueResearchers);
    setTags(uniqueTags);
  }, []);

  return (
    <>
      <Head>
        <title>Scientific Research | Advanced Cardiovascular Technology Laboratory</title>
        <meta name="description" content="Explore our cutting-edge scientific research in cardiovascular technology, AI-driven healthcare solutions, and innovative biomedical engineering projects." />
      </Head>
      
      {/* Banner Section */}
      <section className={styler.pageBanner}>        
        <div className={styler.bannerContent}>
          <h1 className={styler.bannerTitle}>Scientific Research</h1>
          <p className={styler.bannerDescription}>
            Pioneering breakthrough research in cardiovascular technology, artificial intelligence, 
            and biomedical engineering to revolutionize healthcare and improve patient outcomes worldwide.
          </p>
          
          <div className={styler.bannerStats}>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>15+</span>
              <span className={styler.statLabel}>Active Research Areas</span>
            </div>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>50+</span>
              <span className={styler.statLabel}>Research Projects</span>
            </div>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>200+</span>
              <span className={styler.statLabel}>Research Publications</span>
            </div>
          </div>
          
          <div className={styler.bannerActions}>
            <a href="#research-areas" className={`${styler.actionButton} ${styler.primary}`}>
              Explore Research ↓
            </a>
            <a href="/publications" className={`${styler.actionButton} ${styler.secondary}`}>
              View Publications →
            </a>
          </div>
        </div>
      </section>
      
      {/* Research Section */}
      <section className={styler.researchSection} id='research-areas'>
        <div className={styler.researchContainer}>
          
          {/* Filter Sidebar */}
          <div className={styler.filterSidebar}>
            <div className={styler.filterContainer}>
              <h2 className={styler.filterTitle}>Filter Research</h2>
              <p className={styler.filterSubtitle}>
                {getTotalActiveFilters() > 0 
                  ? `Filtering by ${getTotalActiveFilters()} criteria` 
                  : "Select filters to narrow down research areas"}
              </p>

              {/* Area Filter */}
              <div className={styler.filterGroup}>
                <h3 className={styler.filterGroupTitle}>Research Areas</h3>
                <div className={styler.filterTags}>
                  {areas.map((area, index) => (
                    <button 
                      key={index} 
                      className={`${styler.filterTag} ${activeFilters.areas.includes(area) ? styler.active : ''}`} 
                      onClick={() => handleFilterClick('areas', area)}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Researcher Filter */}
              <div className={styler.filterGroup}>
                <h3 className={styler.filterGroupTitle}>Principal Researchers</h3>
                <div className={styler.filterTags}>
                  {researchers.map((researcher, index) => (
                    <button 
                      key={index} 
                      className={`${styler.filterTag} ${activeFilters.researchers.includes(researcher) ? styler.active : ''}`} 
                      onClick={() => handleFilterClick('researchers', researcher)}
                    >
                      {researcher}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div className={styler.filterGroup}>
                <h3 className={styler.filterGroupTitle}>Research Tags</h3>
                <div className={styler.filterTags}>
                  {tags.map((tag, index) => (
                    <button 
                      key={index} 
                      className={`${styler.filterTag} ${activeFilters.tags.includes(tag) ? styler.active : ''}`} 
                      onClick={() => handleFilterClick('tags', tag)}
                    >
                      {tag}
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

          {/* Research Display Section */}
          <div className={styler.researchDisplay}>
            <div className={styler.researchGrid}>
              {research.map((researchItem) => (
                <div className={styler.researchCard} key={researchItem.id}>
                  <div className={styler.researchImage}>
                    <img 
                      src={researchItem.image} 
                      alt={researchItem.title}
                      onError={(e) => {
                        e.target.src = '/home/banner.jpg'; // Fallback image
                      }}
                    />
                    <div className={styler.researchOverlay}>
                      <span className={styler.researchArea}>{researchItem.area}</span>
                    </div>
                  </div>
                  
                  <div className={styler.researchContent}>
                    <h3 className={styler.researchTitle}>
                      {researchItem.title}
                    </h3>
                    
                    <div className={styler.researchResearchers}>
                      <h4 className={styler.researchersLabel}>Principal Researchers:</h4>
                      <div className={styler.researchersList}>
                        {researchItem.researchers.map((researcher, idx) => (
                          <span key={idx} className={styler.researcherName}>
                            {researcher}
                            {idx < researchItem.researchers.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className={styler.researchDescription}>
                      <p>{researchItem.description}</p>
                    </div>
                    
                    {researchItem.tags && researchItem.tags.length > 0 && (
                      <div className={styler.researchTags}>
                        {researchItem.tags.map((tag, index) => (
                          <span key={index} className={styler.researchTag}>{tag}</span>
                        ))}
                      </div>
                    )}
                    
                    <div className={styler.researchActions}>
                      <button className={styler.researchButton}>
                        Learn More
                      </button>
                      <button className={styler.researchButtonSecondary}>
                        View Publications
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

export default ScientificResearch