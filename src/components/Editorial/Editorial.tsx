'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import styles from './Editorial.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Editorial() {
  const sectionRef = useRef<HTMLElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      if (textWrapperRef.current) {
        const leadElement = textWrapperRef.current.querySelector(`.${styles.lead}`);
        const subElements = textWrapperRef.current.querySelectorAll(`.${styles.sub}`);

        if (leadElement) splits.push(new SplitType(leadElement as HTMLElement, { types: 'lines' }));
        subElements.forEach((el) =>
          splits.push(new SplitType(el as HTMLElement, { types: 'lines' }))
        );

        // Wrap lines in hidden overflow containers for the sliding mask effect
        splits.forEach((split) => {
          split.lines?.forEach((line) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.paddingBottom = '0.15em'; // prevents cutoff on descenders
            wrapper.style.marginBottom = '-0.15em';
            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });
        });

        // Animate label
        const label = textWrapperRef.current.querySelector(`.${styles.label}`);
        if (label) {
          gsap.from(label, {
            scrollTrigger: {
              trigger: textWrapperRef.current,
              start: 'top 75%',
            },
            opacity: 0,
            y: 20,
            duration: 1.0,
            ease: 'power3.out',
          });
        }

        // Collect all lines
        const allLines = splits.flatMap((s) => s.lines);

        if (allLines.length > 0) {
          gsap.from(allLines, {
            scrollTrigger: {
              trigger: textWrapperRef.current,
              start: 'top 75%',
            },
            y: '150%',
            duration: 1.0,
            stagger: 0.08,
            ease: 'power3.out',
          });
        }

        // Animate image wrapper (Curtain Reveal)
        const imageWrapper = sectionRef.current?.querySelector(`.${styles.imageWrapper}`);
        if (imageWrapper && imgRef.current) {
          gsap.fromTo(
            imageWrapper,
            { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
            {
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              scrollTrigger: {
                trigger: imageWrapper,
                start: 'top 75%',
              },
              duration: 1.8,
              ease: 'power4.out',
            }
          );
        }
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.editorial} id="about">
      <div
        className={styles.imageWrapper}
        style={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
      >
        <img
          ref={imgRef}
          src="/images/portrait.jpg"
          alt="Editorial Portrait"
          className={styles.image}
        />
      </div>
      <div ref={textWrapperRef} className={styles.textWrapper}>
        <span className={styles.label}>About me</span>
        <p className={styles.lead}>
          Passionate about web technologies. I love working at the intersection of creativity and
          user friendly interfaces. I create memorable web experiences.
        </p>
        <p className={styles.sub}>
          When I&apos;m not building or exploring new web experiences, I&apos;m probably playing
          games or watching football.
        </p>
      </div>
    </section>
  );
}
