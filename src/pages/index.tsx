import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Homepage from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 平滑滚动到下一个部分
  const handleScrollToContent = () => {
    const headerHeight = window.innerHeight;
    window.scrollTo({
      top: headerHeight,
      behavior: "smooth",
    });
  };

  return (
    <header className={clsx("hero", styles.heroBanner)}>
      {/* Animated background gradient */}
      <div
        className={styles.backgroundGradient}
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(66, 165, 245, 0.3) 0%, 
            rgba(129, 199, 132, 0.2) 35%, 
            rgba(171, 71, 188, 0.2) 70%, 
            transparent 100%)`,
        }}
      />

      {/* Floating particles */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="container">
        <div
          className={clsx(styles.heroContent, { [styles.visible]: isVisible })}
        >
          {/* Main title with typing animation */}
          <Heading
            as="h1"
            className={clsx("hero__title", styles.animatedTitle)}
          >
            <span className={styles.titleText}>{siteConfig.title}</span>
            <span className={styles.cursor}>|</span>
          </Heading>

          {/* Subtitle with fade-up animation */}
          <p className={clsx("hero__subtitle", styles.animatedSubtitle)}>
            {siteConfig.tagline}
          </p>

          {/* Enhanced button with hover effects */}
          <div className={styles.buttons}>
            <button
              className={clsx("button button--lg", styles.primaryButton)}
              onClick={handleScrollToContent}
            >
              <span className={styles.buttonText}>开始探索</span>
              <span className={styles.buttonIcon}>→</span>
              <div className={styles.buttonRipple}></div>
            </button>

            <a
              className={clsx(
                "button button--outline button--lg",
                styles.secondaryButton
              )}
              href="https://blog.haoyuehx.dpdns.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.buttonText}>查看博客</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <Homepage />
      </main>
    </Layout>
  );
}
