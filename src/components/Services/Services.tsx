'use client';

import { useState } from 'react';
import styles from './Services.module.css';

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
  const [hoverIndex, setHoverIndex] = useState<number | null>(0); // Default first item hovered on desktop

  return (
    <section className={styles.services} id="work">
      <div className={styles.content}>
        <h2 className={styles.heading}>Here's what I bring to the table.</h2>

        <ul 
          className={styles.list}
          onMouseLeave={() => setHoverIndex(0)}
        >
          {servicesData.map((service, idx) => {
            const isMobileActive = activeIndex === idx;
            return (
              <li 
                key={service.num}
                className={`${styles.item} ${isMobileActive ? styles.active : ''}`}
                onMouseEnter={() => setHoverIndex(idx)}
              >
                <div 
                  className={styles.itemHeader}
                  onClick={() => setActiveIndex(isMobileActive ? null : idx)}
                >
                  <span className={styles.num}>{service.num}</span>
                  <h3 className={styles.title}>{service.title}</h3>
                </div>
                
                <div className={styles.mobilePreview}>
                  <div className={styles.mobilePreviewInner}>
                    <div className={styles.mobilePreviewInnerContent}>
                      <div className={styles.previewImage}>
                        <img src={service.image} alt={service.title} />
                      </div>
                      <p className={styles.previewDesc}>{service.desc}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.previewArea}>
        {servicesData.map((service, idx) => {
          const isPreviewActive = hoverIndex === idx;
          return (
            <div 
              key={service.num} 
              className={`${styles.previewItem} ${isPreviewActive ? styles.active : ''}`}
            >
              <div className={styles.previewImage}>
                <img src={service.image} alt={service.title} />
              </div>
              <p className={styles.previewDesc}>{service.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
