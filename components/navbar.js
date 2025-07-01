import React from 'react'

const Navbar = () => {
  return (
    <section>
        <nav className="flex items-center justify-between p-10 bg-blue-500 text-black">
            <div className="text-lg font-bold">ACT Lab</div>
            <ul className="flex space-x-8">
                <li><a href="/" className="hover:text-secondary-color">Home</a></li>
                <li><a href="/about" className="hover:text-secondary-color">About</a></li>
                <li><a href="/projects" className="hover:text-secondary-color">Projects</a></li>
                <li><a href="/contact" className="hover:text-secondary-color">Contact</a></li>
            </ul>
        </nav>
    </section>
        
  )
}

export default Navbar