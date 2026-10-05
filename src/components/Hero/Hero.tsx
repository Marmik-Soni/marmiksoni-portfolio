'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Hero.module.css';

export function Hero() {
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Add base delay to allow initial layout to settle
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'power4.out' } });

      tl.to(wordsRef.current, {
        y: '0%',
        duration: 1.5,
        stagger: 0.1,
        onComplete: () => {
          wordsRef.current.forEach((el) => {
            if (el) el.style.transform = 'none';
          });
        },
      });
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
        <div className={styles.wordWrap}>
          <span ref={addToWordsRef}>Web</span>
        </div>
        <div className={styles.wordWrap}>
          <span ref={addToWordsRef}>Designer</span>
        </div>
        <div className={styles.wordWrap}>
          <span ref={addToWordsRef}>&amp; Developer</span>
        </div>
      </h1>
      <div className={styles.lede}>
        <div className={styles.wordWrap}>
          <span ref={addToWordsRef}>Shaping web experiences</span>
        </div>
        <div className={styles.wordWrap}>
          <span ref={addToWordsRef}>around users and business goals.</span>
        </div>
      </div>
    </main>
  );
}
