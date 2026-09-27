'use client';

import { useEffect, useRef } from 'react';
import styles from './Editorial.module.css';

export function Editorial() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        if (!imgRef.current) return;
        const rect = imgRef.current.parentElement?.getBoundingClientRect();
        if (!rect) return;
        
        // Calculate progress from 0 (entered bottom) to 1 (left top)
        let progress = 1 - (rect.bottom / (window.innerHeight + rect.height));
        progress = Math.max(0, Math.min(1, progress));
        const yVal = -20 * progress;
        
        imgRef.current.style.transform = `translate3d(0, ${yVal}%, 0)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Trigger once on mount to set initial position
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className={styles.editorial} id="about">
      <div className={styles.imageWrapper}>
        <img 
          ref={imgRef}
          src="/images/portrait.jpg" 
          alt="Editorial Portrait" 
          className={styles.image} 
        />
      </div>
      <div className={styles.textWrapper}>
        <span className={styles.label}>About me</span>
        <p className={styles.lead}>
          Passionate about web technologies. I love working at the intersection of creativity and user friendly interfaces. I create memorable web experiences.
        </p>
        <p className={styles.sub}>
          When I'm not building or exploring new web experiences, I'm probably playing games or watching football.
        </p>
        <div className={styles.divider}></div>
        <a href="#contact" className={styles.link}>
          Get in touch
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      </div>
    </section>
  );
}
