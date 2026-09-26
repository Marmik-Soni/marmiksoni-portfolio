'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Hero.module.css';

export function Hero() {
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const ledeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Small delay to allow initial layout to settle
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(wordsRef.current, {
        y: '0%',
        duration: 1.0,
        stagger: 0.08
      });

      tl.to(ledeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power2.out'
      }, '-=0.6');
    });

    return () => ctx.revert();
  }, []);

  const addToWordsRef = (el: HTMLSpanElement | null) => {
    if (el && !wordsRef.current.includes(el)) {
      wordsRef.current.push(el);
    }
  };

  return (
    <main className={`grid-12 ${styles.hero}`} id="top">
      <h1 className={styles.title}>
        <div className={styles.wordWrap}><span ref={addToWordsRef}>Web</span></div>
        <div className={styles.wordWrap}><span ref={addToWordsRef}>Designer</span></div>
        <div className={styles.wordWrap}><span ref={addToWordsRef}>&amp; Developer</span></div>
      </h1>
      <p className={styles.lede} ref={ledeRef}>
        Web Designer &amp; Developer designing digital products end-to-end, helping build experiences that work for both users and business goals.
      </p>
    </main>
  );
}
