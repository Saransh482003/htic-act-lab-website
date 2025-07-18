import React from 'react'
import styler from '@/styles/Footer.module.css'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className={styler.footer}>
        <div className={styler.footerContent}>
          <div className={styler.footerTop}>
            <div className={styler.footerSection}>
              <div className={styler.footerLogo}>
                <Image
                  src="/actlabs_logo_home.png"
                  alt="ACT Lab Logo"
                  width={50}
                  height={50}
                  className={styler.footerLogoImage}
                />
                <div className={styler.footerLogoText}>
                  ADVANCED CARDIOVASCULAR<br />TECHNOLOGY LABORATORY
                </div>
              </div>
              <p className={styler.footerDescription}>
                Pioneering cardiovascular healthcare through innovative technology and scientific research at IIT Madras. 
                Dedicated to improving patient outcomes and advancing medical device innovation.
              </p>
              <div className={styler.socialMedia}>
                <a href="https://linkedin.com/company/act-lab-iitm" className={styler.socialLink} target="_blank" rel="noopener noreferrer">
                  <Image src="/footer/linkedin.png" alt="LinkedIn" width={24} height={24} className={styler.socialIcon} />
                </a>
                <a href="https://x.com/actlab_iitm" className={styler.socialLink} target="_blank" rel="noopener noreferrer">
                  <Image src="/footer/x.png" alt="X" width={24} height={24} className={styler.socialIcon} />
                </a>
                <a href="https://youtube.com/@actlab-iitm" className={styler.socialLink} target="_blank" rel="noopener noreferrer">
                  <Image src="/footer/youtube.png" alt="YouTube" width={24} height={24} className={styler.socialIcon} />
                </a>
                <a href="https://github.com/act-lab-iitm" className={styler.socialLink} target="_blank" rel="noopener noreferrer">
                  <Image src="/footer/github.png" alt="GitHub" width={24} height={24} className={styler.socialIcon} />
                </a>
              </div>
            </div>

            <div className={styler.footerSection}>
              <h3 className={styler.footerSectionTitle}>Quick Links</h3>
              <ul className={styler.footerList}>
                <li><a href="/projects" className={styler.footerLink}>Research Projects</a></li>
                <li><a href="/publications" className={styler.footerLink}>Publications</a></li>
                <li><a href="/scientific-research" className={styler.footerLink}>Scientific Research</a></li>
                <li><a href="/clinical-studies" className={styler.footerLink}>Clinical Studies</a></li>
                <li><a href="/careers" className={styler.footerLink}>Careers</a></li>
                <li><a href="/contact" className={styler.footerLink}>Our Team</a></li>
                {/* <li><a href="/#work&news" className={styler.footerLink}>Our Work</a></li> */}
                <li><a href="/#work&news" className={styler.footerLink}>News & Events</a></li>
              </ul>
            </div>

            <div className={styler.footerSection}>
              <h3 className={styler.footerSectionTitle}>Research Areas</h3>
              <div className={styler.researchAreas}>
                <span className={styler.researchTag}>Cardiac Imaging</span>
                <span className={styler.researchTag}>AI in Healthcare</span>
                <span className={styler.researchTag}>Wearable Tech</span>
                <span className={styler.researchTag}>Digital Health</span>
                <span className={styler.researchTag}>Point-of-Care</span>
                <span className={styler.researchTag}>Medical Devices</span>
                <span className={styler.researchTag}>Diagnostics</span>
              </div>
            </div>

            <div className={styler.footerSection}>
              <h3 className={styler.footerSectionTitle}>Contact Info</h3>
              <div className={styler.contactInfo}>
                <div className={styler.contactItem}>
                  <span className={styler.contactIcon}>📍</span>
                  <div>
                    <strong>Address:</strong><br />
                    Room 307, Third Floor, Electrical Sciences Block, Indian Institute Of Technology, Chennai, Tamil Nadu 600036
                  </div>
                </div>
                <div className={styler.contactItem}>
                  <span className={styler.contactIcon}>📞</span>
                  <div>
                    <strong>Phone:</strong><br />
                    +91-44-2257-4052
                  </div>
                </div>
                <div className={styler.contactItem}>
                  <span className={styler.contactIcon}>✉️</span>
                  <div>
                    <strong>Email:</strong><br />
                    actlab@iitm.ac.in
                  </div>
                </div>
              </div>
            </div>

            <div className={styler.footerSection}>
              <h3 className={styler.footerSectionTitle}>Find Us</h3>
              <div className={styler.mapContainer}>
                {/* Add your iframe map embed here */}
                <div className={styler.mapPlaceholder}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31100.30321907878!2d80.23298325862712!3d13.001380935317222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d006ac17d1f%3A0x5049fff30fe66c41!2sAdvanced%20Cardiovascular%20Technology%20Laboratory%20(ACT%20Lab)!5e0!3m2!1sen!2sin!4v1752831654351!5m2!1sen!2sin" width="600" height="450" style={{border:0, width:'100%'}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            </div>

            <div className={styler.footerSection}>
              <h3 className={styler.footerSectionTitle}>Careers</h3>
              <div className={styler.careersContainer}>
                <div className={styler.careersBox}>
                  <p className={styler.careersDescription}>
                    Join our innovative team in cardiovascular research
                  </p>
                  <div className={styler.careerOpportunities}>
                    <div className={styler.careerItem}>
                      <span className={styler.careerIcon}>🎓</span>
                      <strong>PhD</strong>
                    </div>
                    <div className={styler.careerItem}>
                      <span className={styler.careerIcon}>🔬</span>
                      <strong>Research</strong>
                    </div>
                    <div className={styler.careerItem}>
                      <span className={styler.careerIcon}>👨‍💻</span>
                      <strong>Technical</strong>
                    </div>
                  </div>
                  <div className={styler.careerActions}>
                    <a href="/careers" className={styler.careerButton}>
                      View Openings
                    </a>
                    <a href="/careers" className={styler.careerButton}>
                      Internships
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styler.footerBottom}>
            <div className={styler.footerCopyright}>
              © 2025 <span>ACT Lab, IIT Madras</span>. All rights reserved.
            </div>
            <div className={styler.footerLegal}>
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-of-service">Terms of Service</a>
              <a href="/accessibility">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer