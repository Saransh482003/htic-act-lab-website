
import React from 'react'
import styler from '@/styles/Projects.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react';

const Projects = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeFilter, setActiveFilter] = useState('');

  const handleFilterClick = (tag) => {
    if (activeFilter === tag) {
      // If clicking the already active filter, deactivate it and show all projects
      setActiveFilter('');
      setProjects(allProjects);
    } else {
      // Activate the new filter
      setActiveFilter(tag);
      const filteredProjects = allProjects.filter(project => 
        project.tags.includes(tag) || project.category === tag
      );
      setProjects(filteredProjects);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllProjects(data.projects);
        setProjects(data.projects);
        setTags(data.tags);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);
  return (
    <>
      <section className={styler.pageBanner}>        
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
      <section className={styler.projectSection}>
        <div className={styler.projectContainer}>
          {/* Filter Sidebar */}
          <div className={styler.filterSidebar}>
            <div className={styler.filterContainer}>
              <h2 className={styler.filterTitle}>Filter by Category</h2>
              <div className={styler.filterTags}>
                {
                  tags.map((tag, index) => (
                    <button key={index} className={`${styler.filterTag} ${activeFilter === tag ? styler.active : ''}`} onClick={() => handleFilterClick(tag)}>
                      {tag}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Project Display Section */}
          <div className={styler.projectDisplay}>
            <div className={styler.projectGrid}>
              {
                projects.map((project, index) => (
                  <div className={styler.projectCard} key={index}>
                    <div className={styler.projectImage}>
                      <div className={styler.projectImagePlaceholder}>
                        <Image src={project.image} alt={project.title} layout="fill" objectFit="cover" />
                      </div>
                    </div>
                    <div className={styler.projectContent}>
                      <div className={styler.projectCategory}>{project.category}</div>
                      <h3 className={styler.projectTitle}>{project.title}</h3>
                      <p className={styler.projectDescription}>{project.description}</p>
                      <div className={styler.projectTags}>
                        {project.tags.map((tag, index) => (
                          <span key={index} className={styler.projectTag}>{tag}</span>
                        ))}
                      </div>
                      <div className={styler.projectActions}>
                        <a href={project.internalLink} className={styler.projectButtonSecondary}>Read More</a>
                        <a href={project.externalLink} className={`${styler.projectButton} ${project.externalLink ? '' : 'hidden'}`}>Go to Website</a>
                      </div>
                    </div>
                  </div>
                ))
              }
              
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Projects