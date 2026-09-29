'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ThemeToggle } from '../ThemeToggle';
import styles from './Navbar.module.css';

export function Navbar() {
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Very smooth, effortless full-bar fade in
      gsap.to(barRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.4, // Delays just enough so the eye is drawn to the Hero text first
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <header
      className={`grid-12 ${styles.bar}`}
      ref={barRef}
      style={{ opacity: 0, transform: 'translateY(-15px)' }}
    >
      <Link href="#top" className={styles.name}>
        Marmik Soni
      </Link>

      <nav className={styles.nav} aria-label="Primary">
        <Link href="#about">About</Link>
        <Link href="#work">Work</Link>
        <Link href="#process">Process</Link>
        <Link href="#contact">Drop me a line</Link>
      </nav>

      <ThemeToggle className={styles.theme} />
    </header>
  );
}
