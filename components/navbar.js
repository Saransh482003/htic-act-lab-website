import React from 'react'
import Image from 'next/image'
import styler from '@/styles/Navbar.module.css'

const Navbar = () => {
  return (
    <section>
        <nav className={styler.navbar}>
            <div className={styler.logo} onClick={() => window.location.href = "/"}>
                <Image
                    src="/actlabs_logo.png"
                    alt="ACT Lab Logo"
                    width={40}
                    height={40}
                    className={styler.logoImage}
                />
                <span>ADVANCED CARDIOVASCULAR TECHNOLOGY LABORATORY</span>
            </div>
            <ul className={styler.navList}>
            <li><a href="/" className={styler.navLink}>Home</a></li>
            <li><a href="/projects" className={styler.navLink}>Projects</a></li>
            <li><a href="/scientific-research" className={styler.navLink}>Scientific Research</a></li>
            <li><a href="/clinical-studies" className={styler.navLink}>Clinical Studies</a></li>
            <li><a href="/publications" className={styler.navLink}>Publications</a></li>
            <li><a href="/contact" className={styler.navLink}>Contact</a></li>
          </ul>
        </nav>
    </section>
        
  )
}

export default Navbar