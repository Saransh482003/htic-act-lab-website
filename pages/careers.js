import React from 'react'
import styler from '@/styles/Careers.module.css'
import Image from 'next/image'
import Head from 'next/head'

const Careers = () => {
  return (
    <>
      <Head>
        <title>Careers | Advanced Cardiovascular Technology Laboratory</title>
        <meta name="description" content="Join our team at ACT Lab and contribute to groundbreaking cardiovascular research and technology development." />
      </Head>
      
      {/* Banner Section */}
      <section className={styler.pageBanner}>
        <div className={styler.bannerContent}>
          <h1 className={styler.bannerTitle}>Join Our Team</h1>
          <p className={styler.bannerDescription}>
            Be part of pioneering research and innovation in cardiovascular technology. 
            We're looking for passionate individuals who want to make a meaningful impact 
            on healthcare through cutting-edge research and development.
          </p>
          <div className={styler.bannerActions}>
            <a href="#opportunities" className={`${styler.actionButton} ${styler.primary}`}>
              Explore Opportunities ↓
            </a>
            <a href="#internships" className={`${styler.actionButton} ${styler.secondary}`}>
              Internship Programs ↓
            </a>
          </div>
        </div>
      </section>

      {/* Research & Job Opportunities Section */}
      <section className={styler.careersSection} id="opportunities">
        <div className={styler.sectionHeader}>
          <h2 className={styler.sectionTitle}>Research & Job Opportunities</h2>
          <p className={styler.sectionSubtitle}>
            Discover exciting opportunities for researchers, engineers, and healthcare professionals 
            to contribute to our mission of advancing cardiovascular technology.
          </p>
        </div>

        <div className={styler.opportunitiesGrid}>
          {/* Research Position Card */}
          <div className={styler.opportunityCard}>
            <div className={styler.cardHeader}>
              <h3 className={styler.cardTitle}>Research Scientist</h3>
              <div className={styler.cardDepartment}>Biomedical Engineering</div>
            </div>
            <div className={styler.cardBody}>
              <p className={styler.cardDescription}>
                We're seeking a Research Scientist with expertise in biomedical signal processing 
                and machine learning to join our cardiovascular diagnostics team. The ideal candidate 
                will have experience in ECG/PPG signal analysis and algorithm development for medical applications.
              </p>
            </div>
            <div className={styler.cardFooter}>
              <div className={styler.cardMetadata}>Full-time • Chennai</div>
              <a href="#application-form" className={styler.applyButton}>Apply Now</a>
            </div>
          </div>

          {/* PhD Position Card */}
          <div className={styler.opportunityCard}>
            <div className={styler.cardHeader}>
              <h3 className={styler.cardTitle}>PhD Position</h3>
              <div className={styler.cardDepartment}>Cardiovascular Imaging</div>
            </div>
            <div className={styler.cardBody}>
              <p className={styler.cardDescription}>
                Join our research team as a PhD candidate focused on advanced imaging techniques 
                for cardiovascular disease assessment. This position involves developing novel 
                imaging methodologies and algorithms for early detection of vascular abnormalities.
              </p>
            </div>
            <div className={styler.cardFooter}>
              <div className={styler.cardMetadata}>Full-time • Stipend</div>
              <a href="#application-form" className={styler.applyButton}>Apply Now</a>
            </div>
          </div>

          {/* Biomedical Engineer Card */}
          <div className={styler.opportunityCard}>
            <div className={styler.cardHeader}>
              <h3 className={styler.cardTitle}>Biomedical Engineer</h3>
              <div className={styler.cardDepartment}>Product Development</div>
            </div>
            <div className={styler.cardBody}>
              <p className={styler.cardDescription}>
                We are looking for a talented Biomedical Engineer to join our product development team. 
                You will be responsible for designing and testing cardiovascular monitoring devices, 
                from concept to prototype. Experience with medical device regulations is a plus.
              </p>
            </div>
            <div className={styler.cardFooter}>
              <div className={styler.cardMetadata}>Full-time • Chennai</div>
              <a href="#application-form" className={styler.applyButton}>Apply Now</a>
            </div>
          </div>
          
          {/* Clinical Research Coordinator */}
          <div className={styler.opportunityCard}>
            <div className={styler.cardHeader}>
              <h3 className={styler.cardTitle}>Clinical Research Coordinator</h3>
              <div className={styler.cardDepartment}>Clinical Studies</div>
            </div>
            <div className={styler.cardBody}>
              <p className={styler.cardDescription}>
                Join our clinical research team to coordinate and manage clinical trials for our 
                cardiovascular technology innovations. The ideal candidate will have experience in 
                clinical study protocols, patient recruitment, and regulatory compliance.
              </p>
            </div>
            <div className={styler.cardFooter}>
              <div className={styler.cardMetadata}>Full-time • Chennai</div>
              <a href="#application-form" className={styler.applyButton}>Apply Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* Internships Section */}
      <section className={styler.careersSection} id="internships">
        <div className={styler.sectionHeader}>
          <h2 className={styler.sectionTitle}>Internship Programs</h2>
          <p className={styler.sectionSubtitle}>
            Gain valuable experience and contribute to groundbreaking research through our 
            internship programs designed for undergraduate and graduate students.
          </p>
        </div>

        <div className={styler.opportunitiesGrid}>
          {/* Summer Research Internship */}
          <div className={styler.opportunityCard}>
            <div className={styler.cardHeader}>
              <h3 className={styler.cardTitle}>Summer Research Internship</h3>
              <div className={styler.cardDepartment}>Multiple Departments</div>
            </div>
            <div className={styler.cardBody}>
              <p className={styler.cardDescription}>
                Our 10-week summer research program offers undergraduate students the opportunity 
                to work alongside leading researchers on cardiovascular technology projects. Interns 
                will gain hands-on research experience and contribute to ongoing studies.
              </p>
            </div>
            <div className={styler.cardFooter}>
              <div className={styler.cardMetadata}>10 weeks • May-July</div>
              <a href="#application-form" className={styler.applyButton}>Apply Now</a>
            </div>
          </div>

          {/* Software Development Internship */}
          <div className={styler.opportunityCard}>
            <div className={styler.cardHeader}>
              <h3 className={styler.cardTitle}>Software Development Internship</h3>
              <div className={styler.cardDepartment}>Medical Software</div>
            </div>
            <div className={styler.cardBody}>
              <p className={styler.cardDescription}>
                Work on developing software solutions for cardiovascular diagnostics and monitoring. 
                Interns will participate in the full software development lifecycle, from design to 
                testing. Experience with Python, MATLAB, or C++ is preferred.
              </p>
            </div>
            <div className={styler.cardFooter}>
              <div className={styler.cardMetadata}>3-6 months • Flexible</div>
              <a href="#application-form" className={styler.applyButton}>Apply Now</a>
            </div>
          </div>

          {/* Clinical Research Internship */}
          <div className={styler.opportunityCard}>
            <div className={styler.cardHeader}>
              <h3 className={styler.cardTitle}>Clinical Research Internship</h3>
              <div className={styler.cardDepartment}>Clinical Studies</div>
            </div>
            <div className={styler.cardBody}>
              <p className={styler.cardDescription}>
                Gain experience in clinical research by assisting with our ongoing clinical studies. 
                Interns will support data collection, analysis, and documentation. This internship is 
                ideal for students pursuing careers in medicine or clinical research.
              </p>
            </div>
            <div className={styler.cardFooter}>
              <div className={styler.cardMetadata}>3-6 months • Flexible</div>
              <a href="#application-form" className={styler.applyButton}>Apply Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className={styler.formSection} id="application-form">
        <div className={styler.formContainer}>
          <h2 className={styler.formTitle}>Application Form</h2>
          <p className={styler.formDescription}>
            Interested in joining our team? Please fill out the application form below, 
            and our HR team will get back to you shortly.
          </p>
          
          {/* Placeholder for Google Form - to be added by user later */}
          <div className={styler.formPlaceholder} style={{ height: "100vh" }}>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfcbP7PHua2SzhKwVSB9WYXfideva_9UZCE2MDgvGsr5K3JiA/viewform?embedded=true"
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="Google Form"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </section>
    </>
  )
}

export default Careers