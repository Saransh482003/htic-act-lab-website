import React from 'react'
import styler from '@/styles/Contact.module.css'
import { useEffect, useState } from 'react';
import Image from 'next/image';

const Contact = () => {
    const [teamData, setTeamData] = useState([]);
    const [profsScientists, setProfsScientists] = useState([]);
    const [phdMs, setPhdMs] = useState([]);
    const [empInterns, setEmpInterns] = useState([]);

    useEffect(() => {
        const fetchTeamData = async () => {
            const response = await fetch('/api/contact/meetTheTeam');
            const data = await response.json();
            setTeamData(data);
            setProfsScientists(data.professors_scientists);
            setPhdMs(data.phd_ms);
            setEmpInterns(data.employees_interns);
        };
        fetchTeamData();
    }, []);

    return (
        <>
            <section className={styler.pageBanner}>
                <div className={styler.bannerContent}>
                    <h1 className={styler.bannerTitle}>Contact Us</h1>
                    <p className={styler.bannerDescription}>
                        Get in touch with our research team to explore collaboration opportunities,
                        discuss potential partnerships, or learn more about our cutting-edge cardiovascular research.
                    </p>

                    <div className={styler.bannerStats}>
                        <div className={styler.statItem}>
                            <span className={styler.statNumber}>5</span>
                            <span className={styler.statLabel}>Professors & Scientists</span>
                        </div>
                        <div className={styler.statItem}>
                            <span className={styler.statNumber}>12+</span>
                            <span className={styler.statLabel}>PhD & MS Researchers</span>
                        </div>
                        <div className={styler.statItem}>
                            <span className={styler.statNumber}>100+</span>
                            <span className={styler.statLabel}>Employees & Interns</span>
                        </div>
                    </div>

                    <div className={styler.bannerActions}>
                        <a href="#contact-form" className={`${styler.actionButton} ${styler.primary}`}>
                            Meet the Team ↓
                        </a>
                        <a href="/publications" className={`${styler.actionButton} ${styler.secondary}`}>
                            View Research →
                        </a>
                    </div>
                </div>
            </section>

            <section className={styler.contactSection} id='contact-form'>
                <div className={styler.contactContainer}>
                    <div className={styler.sectionHeader}>
                        <h2>Meet the Team</h2>
                    </div>

                    <div className={styler.teamSections}>
                        {/* Professors & Scientists Section */}
                        <div className={styler.teamSection}>
                            <h3 className={styler.teamSectionTitle}>Professors & Scientists</h3>
                            <div className={styler.teamGrid}>
                                {profsScientists.map((member, index) => (
                                    <div className={styler.teamMember}>
                                        <div className={styler.memberCard}>
                                            <div className={styler.memberImage}>
                                                <Image src={member.image} alt={member.name} width={300} height={300} />
                                            </div>
                                            <div className={styler.memberInfo}>
                                                <h4 className={styler.memberName}>{member.name}</h4>
                                                <p className={styler.memberDesignation}>{member.designation}</p>
                                                <a className={styler.memberEmail} href={`mailto:${member.email}`}>{member.email}</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PhD & MS Researchers Section */}
                        <div className={styler.teamSection}>
                            <h3 className={styler.teamSectionTitle}>PhD & MS Researchers</h3>
                            <div className={styler.teamGrid}>
                                {phdMs.map((member, index) => (
                                    <div className={styler.teamMember}>
                                        <div className={styler.memberCard}>
                                            <div className={styler.memberImage}>
                                                <Image src={member.image} alt={member.name} width={300} height={300} />
                                            </div>
                                            <div className={styler.memberInfo}>
                                                <h4 className={styler.memberName}>{member.name}</h4>
                                                <p className={styler.memberDesignation}>{member.designation}</p>
                                                <a className={styler.memberEmail} href={`mailto:${member.email}`}>{member.email}</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Employees & Interns Section */}
                        <div className={styler.teamSection}>
                            <h3 className={styler.teamSectionTitle}>Employees & Interns</h3>
                            <div className={styler.teamGrid}>
                                {empInterns.map((member, index) => (
                                    <div className={styler.teamMember}>
                                        <div className={styler.memberCard}>
                                            <div className={styler.memberImage}>
                                                <Image src={member.image} alt={member.name} width={300} height={300} />
                                            </div>
                                            <div className={styler.memberInfo}>
                                                <h4 className={styler.memberName}>{member.name}</h4>
                                                <p className={styler.memberDesignation}>{member.designation}</p>
                                                <a className={styler.memberEmail} href={`mailto:${member.email}`}>{member.email}</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Contact