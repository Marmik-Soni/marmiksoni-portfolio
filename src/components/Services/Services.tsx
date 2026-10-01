'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import styles from './Services.module.css';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    num: '01',
    title: 'Design',
    image: '/images/service-design.jpg',
    desc: 'Pixel-perfect interfaces built around your users, your brand, and your goals. Every pixel has a reason — every layout a purpose.',
  },
  {
    num: '02',
    title: 'Development',
    image: '/images/service-dev.jpg',
    desc: 'Clean, performant code that brings every detail of your design to life. Fast, accessible, and built to last.',
  },
  {
    num: '03',
    title: 'Motion & Animation',
    image: '/images/service-motion.jpg',
    desc: 'Meaningful motion that brings interfaces to life. From subtle micro-interactions to scroll-driven sequences — every transition is intentional.',
  },
  {
    num: '04',
    title: 'Strategy',
    image: '/images/service-strategy.jpg',
    desc: 'Great design is only effective with the right direction. I help define user journeys, information architecture, and conversion paths that turn visitors into believers.',
  },
  {
    num: '05',
    title: 'The Full Package',
    image: '/images/service-package.jpg',
    desc: 'End-to-end — from the first sketch to a live, polished, launch-ready website. One person who thinks in both design and code.',
  },
];

export function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const handleMouseEnter = (idx: number) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverIndex((prevHover) => {
        // Calculate direction based on what is currently open
        const currentOpen = prevHover ?? activeIndex ?? -1;
        if (currentOpen !== -1 && currentOpen !== idx) {
          setDirection(idx > currentOpen ? 'down' : 'up');
        }
        return idx;
      });
    }, 150);
  };

  const handleClick = (idx: number) => {
    setActiveIndex((prevActive) => {
      if (prevActive === idx) return null;
      if (prevActive !== null) {
        setDirection(idx > prevActive ? 'down' : 'up');
      }
      return idx;
    });
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

        <ul
          className={`${styles.list} ${styles[`dir-${direction}`]}`}
          onMouseLeave={handleMouseLeave}
        >
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
                        <img src={service.image} alt={service.title} />
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
