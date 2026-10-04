'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Image from 'next/image';
import styles from './Services.module.css';

import designImg from '../../../public/images/service-design.jpg';
import devImg from '../../../public/images/service-dev.jpg';
import strategyImg from '../../../public/images/service-strategy.jpg';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    num: '01.',
    title: 'Design',
    image: designImg,
    desc: 'Good design is a business decision. I create interfaces and visual systems built around how people actually experience the web, so every page feels distinctive, intuitive and aligned with your goals.',
  },
  {
    num: '02.',
    title: 'Creative Development',
    image: devImg,
    desc: 'Performance is part of the brief. I build fast, secure websites and web applications with purposeful interaction that improves usability, tested across devices and engineered to grow with your business.',
  },
  {
    num: '03.',
    title: 'Search & AI Visibility',
    image: strategyImg,
    desc: 'Your next client is searching, and increasingly asking AI. I make sure the answer they find is you, through SEO, AEO/GEO, sharp copywriting and analytics that turn attention into enquiries.',
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      // 1. Animate header
      const header = sectionRef.current?.querySelector(`.${styles.header}`);
      if (header) {
        gsap.from(header, {
          scrollTrigger: { trigger: header, start: 'top 85%' },
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      }

      // 2. Animate each item individually
      const items = sectionRef.current?.querySelectorAll(`.${styles.item}`);
      items?.forEach((item) => {
        const image = item.querySelector(`.${styles.image}`);
        const num = item.querySelector(`.${styles.num}`);
        const title = item.querySelector(`.${styles.title}`);
        const desc = item.querySelector(`.${styles.desc}`);

        // Setup text splitting
        const splitTitle = new SplitType(title as HTMLElement, { types: 'lines' });
        const splitDesc = new SplitType(desc as HTMLElement, { types: 'lines' });
        splits.push(splitTitle, splitDesc);

        // Wrap lines for masked reveal
        [splitTitle, splitDesc].forEach((split) => {
          split.lines?.forEach((line) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.paddingBottom = '0.15em';
            wrapper.style.marginBottom = '-0.15em';
            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          },
        });

        // Unidirectional reveal: Image slides UP inside its mask, exactly matching the text's direction
        const imgElement = image?.querySelector('img');
        if (image && imgElement) {
          // Start completely pushed down inside the overflow:hidden container
          gsap.set(imgElement, { y: '100%' });

          tl.to(
            imgElement,
            { y: '0%', duration: 1.2, ease: 'power3.out' },
            0 // Triggers at exactly the same time as the text slide-up
          );
        }

        // Fade in number
        if (num) {
          tl.from(num, { opacity: 0, x: -10, duration: 0.8, ease: 'power2.out' }, 0.2);
        }

        // Slide up text lines
        const lines = [...(splitTitle.lines || []), ...(splitDesc.lines || [])];
        if (lines.length > 0) {
          tl.from(
            lines,
            {
              y: '150%',
              duration: 1.0,
              stagger: 0.05,
              ease: 'power3.out',
            },
            0.2
          );

          // Clear GSAP inline styles on complete to prevent font rendering bugs (AGENTS.md rule)
          tl.call(() => {
            lines.forEach((line) => {
              (line as HTMLElement).style.transform = 'none';
            });
          });
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.services} id="work">
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 ref={headingRef} className={styles.heading}>
            Design, build and visibility,
            <br />
            handled end to end.
          </h2>
        </div>

        <ul className={styles.list}>
          {servicesData.map((service) => (
            <li key={service.num} className={styles.item}>
              <div className={styles.image}>
                <Image
                  src={service.image}
                  alt={service.title}
                  placeholder="blur"
                  sizes="(max-width: 1024px) 100px, 160px"
                />
              </div>
              <span className={styles.num}>{service.num}</span>
              <div className={styles.textBlock}>
                <h3 className={styles.title}>{service.title}</h3>
                <p className={styles.desc}>{service.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
