'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import SplitType from 'split-type';
import styles from './Services.module.css';

import designImg from '../../../public/images/service-design.jpg';
import devImg from '../../../public/images/service-dev.jpg';
import motionImg from '../../../public/images/service-motion.jpg';
import strategyImg from '../../../public/images/service-strategy.jpg';
import packageImg from '../../../public/images/service-package.jpg';

const servicesData = [
  {
    num: '01',
    title: 'Design',
    image: designImg,
    desc: 'Pixel-perfect interfaces built around your users, your brand, and your goals. Every pixel has a reason — every layout a purpose.',
  },
  {
    num: '02',
    title: 'Development',
    image: devImg,
    desc: 'Clean, performant code that brings every detail of your design to life. Fast, accessible, and built to last.',
  },
  {
    num: '03',
    title: 'Motion & Animation',
    image: motionImg,
    desc: 'Meaningful motion that brings interfaces to life. From subtle micro-interactions to scroll-driven sequences — every transition is intentional.',
  },
  {
    num: '04',
    title: 'Strategy',
    image: strategyImg,
    desc: 'Great design is only effective with the right direction. I help define user journeys, information architecture, and conversion paths that turn visitors into believers.',
  },
  {
    num: '05',
    title: 'The Full Package',
    image: packageImg,
    desc: 'End-to-end — from the first sketch to a live, polished, launch-ready website. One person who thinks in both design and code.',
  },
];

export function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const handleMouseEnter = (idx: number) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverIndex(idx);
    }, 150);
  };

  const handleClick = (idx: number) => {
    setActiveIndex((prevActive) => (prevActive === idx ? null : idx));
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoverIndex(null);
  };

  useEffect(() => {
    let split: SplitType | null = null;

    const ctx = gsap.context(() => {
      // 1. Animate Heading (Line by Line Cascade)
      if (headingRef.current) {
        split = new SplitType(headingRef.current, { types: 'lines' });

        // Wrap lines in hidden containers for mask effect
        split.lines?.forEach((line) => {
          const wrapper = document.createElement('div');
          wrapper.style.display = 'block';
          wrapper.style.overflow = 'hidden';
          wrapper.style.paddingBottom = '0.15em';
          wrapper.style.marginBottom = '-0.15em';
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });

        gsap.from(split.lines, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
          y: '150%',
          duration: 1.0,
          stagger: 0.08,
          ease: 'power3.out',
        });
      }

      // 2. Animate List Items (Staggered Fade Up)
      const listItems = sectionRef.current?.querySelectorAll(`.${styles.item}`);
      if (listItems && listItems.length > 0) {
        gsap.fromTo(
          listItems,
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      if (split) split.revert();
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.services} id="work">
      <div className={styles.content}>
        <h2 ref={headingRef} className={styles.heading}>
          I can help you with
        </h2>

        <ul className={styles.list} onMouseLeave={handleMouseLeave}>
          {servicesData.map((service, idx) => {
            const isActive = activeIndex === idx || hoverIndex === idx;
            return (
              <li
                key={service.num}
                className={`${styles.item} ${isActive ? styles.active : ''}`}
                onMouseEnter={() => handleMouseEnter(idx)}
              >
                <div className={styles.itemHeader} onClick={() => handleClick(idx)}>
                  <span className={styles.num}>[{service.num}]</span>
                  <h3 className={styles.title}>{service.title}</h3>
                </div>

                <div className={styles.accordionPreview}>
                  <div className={styles.accordionPreviewInner}>
                    <div className={styles.accordionPreviewContent}>
                      <div className={styles.previewTextWrapper}>
                        <p className={styles.previewDesc}>{service.desc}</p>
                      </div>
                      <div className={styles.previewImage}>
                        <Image
                          src={service.image}
                          alt={service.title}
                          placeholder="blur"
                          sizes="(max-width: 1024px) 100vw, 400px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
