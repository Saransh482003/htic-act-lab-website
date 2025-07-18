import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styler from '@/styles/ClinicalStudies.module.css'

const ClinicalStudies = () => {
  const [allStudies, setAllStudies] = useState([]);
  const [studies, setStudies] = useState([]);
  const [phases, setPhases] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    phases: [],
    conditions: [],
    statuses: []
  });

  // Sample clinical studies data
  const sampleStudies = [
    {
      id: 1,
      title: "Efficacy of ARTSENS for Cardiovascular Risk Assessment",
      image: "/projects/ARTSENS.png",
      phase: "Phase III",
      condition: "Cardiovascular Disease",
      status: "Active - Recruiting",
      startDate: "January 2024",
      estimatedCompletion: "December 2025",
      participantCount: 500,
      primaryInvestigator: "Dr. Jayaraj Joseph",
      location: "IIT Madras Clinical Research Center",
      description: "A multi-center randomized controlled trial evaluating the efficacy and safety of the ARTSENS device for non-invasive cardiovascular risk assessment in patients with suspected coronary artery disease. The study aims to validate the device's accuracy compared to traditional diagnostic methods.",
      objectives: [
        "Primary: Assess diagnostic accuracy of ARTSENS vs. traditional methods",
        "Secondary: Evaluate patient comfort and procedure time",
        "Secondary: Analyze cost-effectiveness of the technology"
      ],
      eligibility: "Adults 18-75 years with suspected CAD",
      tags: ["ARTSENS", "Non-invasive", "Cardiovascular", "Diagnostic", "RCT"]
    },
    {
      id: 2,
      title: "AI-Powered ECG Analysis for Arrhythmia Detection",
      image: "/projects/CARDIOSENS.jpg",
      phase: "Phase II",
      condition: "Cardiac Arrhythmias",
      status: "Active - Recruiting",
      startDate: "March 2024",
      estimatedCompletion: "October 2025",
      participantCount: 300,
      primaryInvestigator: "Dr. Mohanasankar Sivaprakasam",
      location: "Multiple Centers - Chennai",
      description: "A prospective clinical study to validate an AI-powered ECG analysis system for early detection and classification of various cardiac arrhythmias. The study compares AI diagnosis accuracy with expert cardiologist interpretations.",
      objectives: [
        "Primary: Validate AI algorithm sensitivity and specificity",
        "Secondary: Assess time-to-diagnosis improvement",
        "Secondary: Evaluate clinical workflow integration"
      ],
      eligibility: "Patients with known or suspected arrhythmias",
      tags: ["AI", "ECG", "Arrhythmia", "Machine Learning", "Cardiology"]
    },
    {
      id: 3,
      title: "Wearable Blood Pressure Monitoring in Hypertensive Patients",
      image: "/projects/Automated_Auscultation_BP_Monitoring.png",
      phase: "Phase II",
      condition: "Hypertension",
      status: "Completed",
      startDate: "June 2023",
      estimatedCompletion: "May 2024",
      participantCount: 150,
      primaryInvestigator: "Dr. Boby George",
      location: "IIT Madras Medical Center",
      description: "A clinical validation study of a novel wearable blood pressure monitoring device for continuous ambulatory monitoring in hypertensive patients. The study evaluated accuracy, comfort, and clinical utility over 30-day monitoring periods.",
      objectives: [
        "Primary: Validate accuracy against gold standard methods",
        "Secondary: Assess patient compliance and comfort",
        "Secondary: Evaluate impact on medication adherence"
      ],
      eligibility: "Diagnosed hypertensive patients 25-70 years",
      tags: ["Wearable", "Blood Pressure", "Hypertension", "Monitoring", "Ambulatory"]
    },
    {
      id: 4,
      title: "Telemedicine Platform for Rural Cardiac Care",
      image: "/projects/ERA.jpg",
      phase: "Phase III",
      condition: "General Cardiology",
      status: "Active - Not Recruiting",
      startDate: "September 2023",
      estimatedCompletion: "March 2026",
      participantCount: 1000,
      primaryInvestigator: "Dr. Keerthi Ram",
      location: "Rural Healthcare Centers - Tamil Nadu",
      description: "A large-scale implementation study of a comprehensive telemedicine platform for delivering cardiac care to rural populations. The study evaluates clinical outcomes, cost-effectiveness, and patient satisfaction with remote cardiac consultations.",
      objectives: [
        "Primary: Assess clinical outcomes vs. standard care",
        "Secondary: Evaluate cost-effectiveness and accessibility",
        "Secondary: Measure patient and provider satisfaction"
      ],
      eligibility: "Rural patients requiring cardiac consultation",
      tags: ["Telemedicine", "Rural Health", "Digital Health", "Access", "Cardiac Care"]
    },
    {
      id: 5,
      title: "Point-of-Care Troponin Testing for Acute MI Diagnosis",
      image: "/projects/CARDIOSENS.jpg",
      phase: "Phase II",
      condition: "Myocardial Infarction",
      status: "Recruiting",
      startDate: "November 2024",
      estimatedCompletion: "September 2025",
      participantCount: 200,
      primaryInvestigator: "Dr. Nabeel P M",
      location: "Emergency Departments - Chennai",
      description: "A prospective study evaluating a novel point-of-care troponin testing device for rapid diagnosis of acute myocardial infarction in emergency department settings. The study focuses on reducing time-to-diagnosis and improving patient outcomes.",
      objectives: [
        "Primary: Compare diagnostic accuracy with lab-based tests",
        "Secondary: Assess time-to-diagnosis reduction",
        "Secondary: Evaluate impact on patient flow and outcomes"
      ],
      eligibility: "Adult patients with chest pain in ED",
      tags: ["Point-of-Care", "Troponin", "Emergency", "Rapid Diagnosis", "Biomarkers"]
    },
    {
      id: 6,
      title: "Digital Therapeutics for Heart Failure Management",
      image: "/projects/Self_Monitoring_of_Vascular_Health.jpg",
      phase: "Phase I",
      condition: "Heart Failure",
      status: "Recruiting",
      startDate: "February 2024",
      estimatedCompletion: "December 2024",
      participantCount: 80,
      primaryInvestigator: "Dr. Amit Kumar Gupta",
      location: "Cardiology Clinic - IIT Madras",
      description: "A pilot study investigating the safety and feasibility of a digital therapeutics platform for heart failure patients. The platform includes medication reminders, symptom tracking, and AI-powered risk assessment.",
      objectives: [
        "Primary: Assess safety and feasibility",
        "Secondary: Evaluate patient engagement and adherence",
        "Secondary: Preliminary efficacy on clinical outcomes"
      ],
      eligibility: "Heart failure patients NYHA Class II-III",
      tags: ["Digital Therapeutics", "Heart Failure", "Mobile Health", "Patient Engagement", "AI"]
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
      setStudies(allStudies);
    } else {
      const filteredStudies = allStudies.filter(study => {
        const phaseMatch = newActiveFilters.phases.length === 0 || newActiveFilters.phases.includes(study.phase);
        const conditionMatch = newActiveFilters.conditions.length === 0 || newActiveFilters.conditions.includes(study.condition);
        const statusMatch = newActiveFilters.statuses.length === 0 || newActiveFilters.statuses.includes(study.status);
        
        return phaseMatch && conditionMatch && statusMatch;
      });
      setStudies(filteredStudies);
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({
      phases: [],
      conditions: [],
      statuses: []
    });
    setStudies(allStudies);
  };

  const getTotalActiveFilters = () => {
    return Object.values(activeFilters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active - Recruiting':
      case 'Recruiting':
        return '#10b981'; // Green
      case 'Active - Not Recruiting':
        return '#f59e0b'; // Orange
      case 'Completed':
        return '#3b82f6'; // Blue
      case 'Suspended':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  useEffect(() => {
    // Extract unique values for filters
    const uniquePhases = [...new Set(sampleStudies.map(study => study.phase))].sort();
    const uniqueConditions = [...new Set(sampleStudies.map(study => study.condition))].sort();
    const uniqueStatuses = [...new Set(sampleStudies.map(study => study.status))].sort();
    
    setAllStudies(sampleStudies);
    setStudies(sampleStudies);
    setPhases(uniquePhases);
    setConditions(uniqueConditions);
    setStatuses(uniqueStatuses);
  }, []);

  return (
    <>
      <Head>
        <title>Clinical Studies | Advanced Cardiovascular Technology Laboratory</title>
        <meta name="description" content="Explore our ongoing and completed clinical studies in cardiovascular medicine, featuring innovative medical devices and digital health solutions." />
      </Head>
      
      {/* Banner Section */}
      <section className={styler.pageBanner}>        
        <div className={styler.bannerContent}>
          <h1 className={styler.bannerTitle}>Clinical Studies</h1>
          <p className={styler.bannerDescription}>
            Advancing cardiovascular care through rigorous clinical research and evidence-based 
            validation of innovative medical devices and digital health solutions.
          </p>
          
          <div className={styler.bannerStats}>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>25+</span>
              <span className={styler.statLabel}>Clinical Trials</span>
            </div>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>2,000+</span>
              <span className={styler.statLabel}>Participants Enrolled</span>
            </div>
            <div className={styler.statItem}>
              <span className={styler.statNumber}>15+</span>
              <span className={styler.statLabel}>Healthcare Partners</span>
            </div>
          </div>
          
          <div className={styler.bannerActions}>
            <a href="#clinical-studies" className={`${styler.actionButton} ${styler.primary}`}>
              View Studies ↓
            </a>
            <a href="/contact" className={`${styler.actionButton} ${styler.secondary}`}>
              Join a Study →
            </a>
          </div>
        </div>
      </section>
      
      {/* Studies Section */}
      <section className={styler.studiesSection} id='clinical-studies'>
        <div className={styler.studiesContainer}>
          
          {/* Filter Sidebar */}
          <div className={styler.filterSidebar}>
            <div className={styler.filterContainer}>
              <h2 className={styler.filterTitle}>Filter Studies</h2>
              <p className={styler.filterSubtitle}>
                {getTotalActiveFilters() > 0 
                  ? `Filtering by ${getTotalActiveFilters()} criteria` 
                  : "Select filters to narrow down clinical studies"}
              </p>

              {/* Phase Filter */}
              <div className={styler.filterGroup}>
                <h3 className={styler.filterGroupTitle}>Study Phase</h3>
                <div className={styler.filterTags}>
                  {phases.map((phase, index) => (
                    <button 
                      key={index} 
                      className={`${styler.filterTag} ${activeFilters.phases.includes(phase) ? styler.active : ''}`} 
                      onClick={() => handleFilterClick('phases', phase)}
                    >
                      {phase}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div className={styler.filterGroup}>
                <h3 className={styler.filterGroupTitle}>Medical Condition</h3>
                <div className={styler.filterTags}>
                  {conditions.map((condition, index) => (
                    <button 
                      key={index} 
                      className={`${styler.filterTag} ${activeFilters.conditions.includes(condition) ? styler.active : ''}`} 
                      onClick={() => handleFilterClick('conditions', condition)}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className={styler.filterGroup}>
                <h3 className={styler.filterGroupTitle}>Study Status</h3>
                <div className={styler.filterTags}>
                  {statuses.map((status, index) => (
                    <button 
                      key={index} 
                      className={`${styler.filterTag} ${activeFilters.statuses.includes(status) ? styler.active : ''}`} 
                      onClick={() => handleFilterClick('statuses', status)}
                    >
                      {status}
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

          {/* Studies Display Section */}
          <div className={styler.studiesDisplay}>
            <div className={styler.studiesGrid}>
              {studies.map((study) => (
                <div className={styler.studyCard} key={study.id}>
                  <div className={styler.studyImage}>
                    <img 
                      src={study.image} 
                      alt={study.title}
                      onError={(e) => {
                        e.target.src = '/home/clinical.png'; // Fallback image
                      }}
                    />
                    <div className={styler.studyOverlay}>
                      <span className={styler.studyPhase}>{study.phase}</span>
                    </div>
                    <div className={styler.statusBadge} style={{ backgroundColor: getStatusColor(study.status) }}>
                      {study.status}
                    </div>
                  </div>
                  
                  <div className={styler.studyContent}>
                    <h3 className={styler.studyTitle}>
                      {study.title}
                    </h3>
                    
                    <div className={styler.studyDetails}>
                      <div className={styler.detailRow}>
                        <span className={styler.detailLabel}>Condition:</span>
                        <span className={styler.detailValue}>{study.condition}</span>
                      </div>
                      <div className={styler.detailRow}>
                        <span className={styler.detailLabel}>PI:</span>
                        <span className={styler.detailValue}>{study.primaryInvestigator}</span>
                      </div>
                      <div className={styler.detailRow}>
                        <span className={styler.detailLabel}>Participants:</span>
                        <span className={styler.detailValue}>{study.participantCount}</span>
                      </div>
                      <div className={styler.detailRow}>
                        <span className={styler.detailLabel}>Location:</span>
                        <span className={styler.detailValue}>{study.location}</span>
                      </div>
                    </div>
                    
                    <div className={styler.studyDescription}>
                      <p>{study.description}</p>
                    </div>
                    
                    <div className={styler.studyObjectives}>
                      <h4 className={styler.objectivesLabel}>Study Objectives:</h4>
                      <ul className={styler.objectivesList}>
                        {study.objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {study.tags && study.tags.length > 0 && (
                      <div className={styler.studyTags}>
                        {study.tags.map((tag, index) => (
                          <span key={index} className={styler.studyTag}>{tag}</span>
                        ))}
                      </div>
                    )}
                    
                    <div className={styler.studyActions}>
                      <button className={styler.studyButton}>
                        View Details
                      </button>
                      <button className={styler.studyButtonSecondary}>
                        Contact PI
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

export default ClinicalStudies