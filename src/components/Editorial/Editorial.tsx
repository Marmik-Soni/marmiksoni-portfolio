'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';
import Image from 'next/image';
import portraitImg from '../../../public/images/portrait.jpg';
import styles from './Editorial.module.css';

export function Editorial() {
  const sectionRef = useRef<HTMLElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      if (textWrapperRef.current) {
        const leadElements = textWrapperRef.current.querySelectorAll(`.${styles.lead}`);
        const subElements = textWrapperRef.current.querySelectorAll(`.${styles.sub}`);

        leadElements.forEach((el) =>
          splits.push(new SplitType(el as HTMLElement, { types: 'lines' }))
        );
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
        if (imageWrapper) {
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
        <Image
          src={portraitImg}
          alt="Editorial Portrait"
          className={styles.image}
          placeholder="blur"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div ref={textWrapperRef} className={styles.textWrapper}>
        <p className={styles.lead}>Hi, I&apos;m Marmik.</p>
        <p className={styles.lead}>
          Passionate about web development. I thrive at the intersection of creative design and
          intuitive interfaces. I craft memorable digital experiences for users and businesses.
        </p>
        <p className={styles.sub}>
          When I&apos;m not building or exploring new tech, I read books, write poetry, or just look
          for inspiration.
        </p>
      </div>
    </section>
  );
}
