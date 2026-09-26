'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ThemeToggle } from '../ThemeToggle';
import styles from './Navbar.module.css';

export function Navbar() {
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initial state to avoid flicker, then drop in
    gsap.set(barRef.current, { opacity: 0, y: -20 });
    gsap.to(barRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: 0.1 });
  }, []);

  return (
    <header className={`grid-12 ${styles.bar}`} ref={barRef}>
      <Link href="#top" className={styles.name}>Marmik Soni</Link>
      
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
