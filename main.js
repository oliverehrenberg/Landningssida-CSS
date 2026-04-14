document.addEventListener("DOMContentLoaded", (() => {
  // Determine base path based on current location
  const isFeaturesPage = window.location.pathname.includes('/features/');
  const basePath = isFeaturesPage ? '../' : '';
  const siteName = 'Construction Sourcing';
  const siteOrigin = 'https://constructionsourcing.eu';

  const ensureMetaTag = (selector, attributes, content) => {
    let tag = document.head.querySelector(selector);
    if (!tag) {
      tag = document.createElement('meta');
      Object.entries(attributes).forEach(([key, value]) => {
        tag.setAttribute(key, value);
      });
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
    return tag;
  };

  const normalizeCanonicalPath = (pathname = '/') => {
    let normalized = pathname.replace(/\/{2,}/g, '/');

    if (!normalized.startsWith('/')) {
      normalized = `/${normalized}`;
    }

    if (normalized.endsWith('/index.html')) {
      normalized = normalized.replace(/index\.html$/, '');
    }

    return normalized || '/';
  };

  const buildAbsoluteSiteUrl = (pathname = '/') => {
    const normalizedPath = normalizeCanonicalPath(pathname);
    return new URL(normalizedPath, `${siteOrigin}/`).toString();
  };

  const getCanonicalUrl = () => {
    const url = new URL(window.location.href);
    url.hash = '';
    url.search = '';

    if (!/^https?:$/.test(url.protocol)) {
      url.pathname = normalizeCanonicalPath(url.pathname);
      return url.toString();
    }

    return buildAbsoluteSiteUrl(url.pathname);
  };

  const deriveMetaDescription = () => {
    const descriptionCandidates = [
      document.querySelector('.hero .subtitle')?.textContent,
      document.querySelector('.pricing-hero-subtitle')?.textContent,
      document.querySelector('.feature-detail-intro')?.textContent,
      document.querySelector('.content-section p')?.textContent,
      document.querySelector('main p')?.textContent,
      document.querySelector('section p')?.textContent,
      document.querySelector('meta[name="description"]')?.getAttribute('content')
    ];

    const description = descriptionCandidates
      .map((value) => (value || '').replace(/\s+/g, ' ').trim())
      .find(Boolean);

    if (!description) {
      return `${siteName} effektiviserar byggupphandling, leverantörsval och projektsamarbete.`;
    }

    return description.length > 160 ? `${description.slice(0, 157).trim()}...` : description;
  };

  const getPageLanguage = () => document.documentElement.lang === 'en' ? 'en' : 'sv';

  const buildBreadcrumbData = (canonicalUrl) => {
    const breadcrumbList = document.querySelector('.breadcrumb ol, .breadcrumb ul');

    if (!breadcrumbList) {
      return null;
    }

    const items = Array.from(breadcrumbList.children)
      .map((item, index, allItems) => {
        const link = item.querySelector('a[href]');
        const name = (link?.textContent || item.textContent || '').replace(/\s+/g, ' ').trim();

        if (!name) {
          return null;
        }

        const itemUrl = index === allItems.length - 1 || !link
          ? canonicalUrl
          : buildAbsoluteSiteUrl(new URL(link.getAttribute('href'), canonicalUrl).pathname);

        return {
          '@type': 'ListItem',
          position: index + 1,
          name,
          item: itemUrl
        };
      })
      .filter(Boolean);

    if (items.length < 2) {
      return null;
    }

    return {
      '@type': 'BreadcrumbList',
      itemListElement: items
    };
  };

  const buildFaqData = () => {
    const questions = Array.from(document.querySelectorAll('.faq-item'))
      .map((item) => {
        const question = item.querySelector('.faq-question h3, .faq-question');
        const answer = item.querySelector('.faq-answer');
        const questionText = (question?.textContent || '').replace(/\s+/g, ' ').trim();
        const answerText = (answer?.textContent || '').replace(/\s+/g, ' ').trim();

        if (!questionText || !answerText) {
          return null;
        }

        return {
          '@type': 'Question',
          name: questionText,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answerText
          }
        };
      })
      .filter(Boolean);

    if (!questions.length) {
      return null;
    }

    return {
      '@type': 'FAQPage',
      mainEntity: questions
    };
  };

  const buildStructuredData = (title, description, canonicalUrl) => {
    const siteRootUrl = buildAbsoluteSiteUrl('/');
    const language = getPageLanguage();
    const organizationId = `${siteRootUrl}#organization`;
    const websiteId = `${siteRootUrl}#website`;
    const pageId = `${canonicalUrl}#webpage`;
    const isHomePage = normalizeCanonicalPath(window.location.pathname) === '/';
    const graph = [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: siteName,
        url: siteRootUrl,
        email: 'oe@constructionsourcing.eu',
        telephone: '+46 73 435 35 88',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Vittangigatan 10',
          postalCode: '162 61',
          addressLocality: 'Vällingby',
          addressCountry: 'SE'
        },
        sameAs: [
          'https://www.linkedin.com/company/construction-sourcing/posts/?feedView=all'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteRootUrl,
        name: siteName,
        description: `${siteName} effektiviserar byggupphandling, leverantörsval och projektsamarbete.`,
        inLanguage: ['sv', 'en'],
        publisher: {
          '@id': organizationId
        }
      },
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: language,
        isPartOf: {
          '@id': websiteId
        },
        about: {
          '@id': organizationId
        },
        publisher: {
          '@id': organizationId
        }
      }
    ];

    if (isHomePage) {
      graph.push({
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#collection`,
        url: canonicalUrl,
        name: title,
        description,
        isPartOf: {
          '@id': websiteId
        }
      });
    }

    const breadcrumbData = buildBreadcrumbData(canonicalUrl);
    if (breadcrumbData) {
      graph.push(breadcrumbData);
    }

    const faqData = buildFaqData();
    if (faqData) {
      graph.push(faqData);
    }

    return {
      '@context': 'https://schema.org',
      '@graph': graph
    };
  };

  const setupSeo = () => {
    const title = (document.title || siteName).replace(/\s+/g, ' ').trim();
    const description = deriveMetaDescription();
    const canonicalUrl = getCanonicalUrl();
    const ogImage = new URL(`${basePath}assets/logo.png`, canonicalUrl).toString();
    const ogLocale = getPageLanguage() === 'en' ? 'en_US' : 'sv_SE';

    ensureMetaTag('meta[name="description"]', { name: 'description' }, description);
    ensureMetaTag('meta[name="robots"]', { name: 'robots' }, 'index,follow,max-image-preview:large');
    ensureMetaTag('meta[name="theme-color"]', { name: 'theme-color' }, '#0f0e17');
    ensureMetaTag('meta[property="og:site_name"]', { property: 'og:site_name' }, siteName);
    ensureMetaTag('meta[property="og:locale"]', { property: 'og:locale' }, ogLocale);
    ensureMetaTag('meta[property="og:title"]', { property: 'og:title' }, title);
    ensureMetaTag('meta[property="og:description"]', { property: 'og:description' }, description);
    ensureMetaTag('meta[property="og:type"]', { property: 'og:type' }, 'website');
    ensureMetaTag('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
    ensureMetaTag('meta[property="og:image"]', { property: 'og:image' }, ogImage);
    ensureMetaTag('meta[property="og:image:alt"]', { property: 'og:image:alt' }, `${siteName} logotyp`);
    ensureMetaTag('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image');
    ensureMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    ensureMetaTag('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
    ensureMetaTag('meta[name="twitter:image"]', { name: 'twitter:image' }, ogImage);
    ensureMetaTag('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt' }, `${siteName} logotyp`);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    let structuredData = document.getElementById('structured-data');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.type = 'application/ld+json';
      structuredData.id = 'structured-data';
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(buildStructuredData(title, description, canonicalUrl));
  };

  const updateScrollProgress = () => {
    const scrollPos = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollPos / docHeight) * 100 : 0;
    const bar = document.querySelector('.scroll-progress__bar');
    if (bar) {
      bar.style.width = `${percent}%`;
      bar.setAttribute('aria-valuenow', String(Math.round(percent)));
    }
  };

  const optimizeImages = () => {
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('decoding')) {
        img.decoding = 'async';
      }
      if (!img.hasAttribute('loading') && !img.closest('.hero') && !img.closest('.header')) {
        img.loading = 'lazy';
      }
    });
  };

  const filterExistingTargets = (targets) => targets.filter(Boolean);

  function initializeResponsiveParallaxSections() {
    if (!window.matchMedia('(min-width: 768px)').matches) {
      return;
    }

    const bigCard = document.querySelector('.big-card');
    const bigCardText = bigCard?.querySelector('.text-content');
    const bigCardImage = bigCard?.querySelector('.image-side img');

    if (bigCard && bigCardText && !bigCardText.dataset.parallaxInitialized) {
      bigCardText.dataset.parallaxInitialized = 'true';
      gsap.to(bigCardText, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: bigCard,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    if (bigCard && bigCardImage && !bigCardImage.dataset.parallaxInitialized) {
      bigCardImage.dataset.parallaxInitialized = 'true';
      gsap.to(bigCardImage, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: bigCard,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
      gsap.fromTo(bigCardImage, {
        scale: 1
      }, {
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: bigCardImage,
          start: 'top 80%',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    const aboutWrapper = document.querySelector('.about-wrapper');
    if (aboutWrapper && !aboutWrapper.dataset.parallaxInitialized) {
      aboutWrapper.dataset.parallaxInitialized = 'true';
      gsap.to(aboutWrapper, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: aboutWrapper,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage && !aboutImage.dataset.parallaxInitialized) {
      aboutImage.dataset.parallaxInitialized = 'true';
      gsap.fromTo(aboutImage, {
        scale: 1
      }, {
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: aboutImage,
          start: 'top 80%',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  function initializeFooterReveal() {
    const footer = document.querySelector('footer');

    if (!footer || footer.dataset.revealInitialized) {
      return;
    }

    footer.dataset.revealInitialized = 'true';
    gsap.set(footer, {
      autoAlpha: 0,
      y: 40
    });

    ScrollTrigger.create({
      trigger: footer,
      start: 'top 90%',
      onEnter: () => {
        footer.classList.remove('section-hidden');
        gsap.to(footer, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'power1.out'
        });
      }
    });
  }

  function initializeHeroIntroAnimation() {
    if (!document.querySelector('.hero')) {
      return;
    }

    const heroTimeline = gsap.timeline({ defaults: { duration: 0.8, ease: 'power1.out' } });
    const smallTopText = document.querySelector('.small-top-text');
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.subtitle');
    const heroCtas = gsap.utils.toArray('.hero .cta-btn');

    if (smallTopText) {
      heroTimeline.from(smallTopText, { autoAlpha: 0, y: -20 });
    }
    if (heroTitle) {
      heroTimeline.from(heroTitle, { autoAlpha: 0, y: 50 }, '-=0.4');
    }
    if (heroSubtitle) {
      heroTimeline.from(heroSubtitle, { autoAlpha: 0, y: 20 }, '-=0.4');
    }
    if (heroCtas.length) {
      heroTimeline.fromTo(
        heroCtas,
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, ease: 'back.out(1.7)', duration: 0.8 },
        '-=0.4'
      );
    }
  }
  
  // Global function to update active state on all language buttons
  const updateLanguageButtons = () => {
    const currentLang = localStorage.getItem('language') || 'sv';
    const allHeaderButtons = document.querySelectorAll(".language-switcher a, .mobile-menu-lang a");
    const allFooterButtons = document.querySelectorAll(".language-switcher-footer .lang-btn");
    
    allHeaderButtons.forEach((btn) => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    allFooterButtons.forEach((btn) => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };
  
  // Set up global language change listener (only once)
  if (!window.languageChangedListenerAdded) {
    window.addEventListener('languageChanged', () => {
      updateLanguageButtons();
      setupSeo();
    });
    window.languageChangedListenerAdded = true;
  }
  
  // Initialize language switcher for existing headers (e.g. index.html)
  // This will be called after header is loaded, so we don't need to run it here
  // The initializeHeader() function will handle it
  
  // Load header, footer, features summary, about, and CTA sections
  Promise.all([
    fetch(basePath + 'header.html').then(response => response.text()),
    fetch(basePath + 'footer.html').then(response => response.text()),
    fetch(basePath + 'features-summary.html').then(response => response.text()),
    fetch(basePath + 'about.html').then(response => response.text()),
    fetch(basePath + 'cta.html').then(response => response.text())
  ]).then(([headerData, footerData, featuresSummaryData, aboutData, ctaData]) => {
    // Insert header only if container exists and is empty
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      // Check if header is already loaded (e.g., from inline script in index.html)
      if (!headerContainer.innerHTML.trim()) {
        headerContainer.innerHTML = headerData;
        // Wait a bit for DOM to update
        setTimeout(() => {
          initializeHeader();
        }, 50);
      } else {
        // Header already loaded, wait a bit and then initialize the language switcher
        setTimeout(() => {
          initializeHeader();
        }, 100);
      }
    }

    // Insert footer only if container exists and is empty
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer && !footerContainer.innerHTML.trim()) {
      footerContainer.innerHTML = footerData;
      initializeFooter();
      
      // Make footer visible
      const footer = footerContainer.querySelector('footer');
      if (footer) {
        footer.classList.remove('section-hidden');
      }
    }

    // Insert features summary
    const featuresSummaryContainer = document.getElementById('features-summary-container');
    if (featuresSummaryContainer) {
      featuresSummaryContainer.innerHTML = featuresSummaryData;
      
      // Make features summary section visible
      const featuresSummarySection = featuresSummaryContainer.querySelector('.features-summary-wrapper');
      if (featuresSummarySection) {
        featuresSummarySection.classList.remove('section-hidden');
      }
      
      // Initialize Lucide icons in the features summary section
      lucide.createIcons();
      
      // Initialize carousel functionality
      initializeCarousel();
    }

    // Insert about section
    const aboutContainer = document.getElementById('about-container');
    if (aboutContainer) {
      aboutContainer.innerHTML = aboutData;
      
      // Make about section visible
      const about = aboutContainer.querySelector('.about-wrapper');
      if (about) {
        about.classList.remove('section-hidden');
      }

      // Apply language translations specifically for about section
      const savedLanguage = localStorage.getItem('language') || 'sv';
      const aboutElements = aboutContainer.querySelectorAll('[data-translate]');
      aboutElements.forEach((el) => {
        const key = el.getAttribute('data-translate');
        if (translations[savedLanguage][key]) {
          el.innerHTML = translations[savedLanguage][key];
        }
      });
    }

    // Insert CTA section
    const ctaContainer = document.getElementById('cta-container');
    if (ctaContainer) {
      ctaContainer.innerHTML = ctaData;
      
      // Make CTA section visible
      const cta = ctaContainer.querySelector('.cta-section');
      if (cta) {
        cta.classList.remove('section-hidden');
      }
    }

    // Apply language translations
    const savedLanguage = localStorage.getItem('language') || 'sv';
    applyLanguage(savedLanguage);
    optimizeImages();
    setupSeo();
    updateScrollProgress();
    window.requestAnimationFrame(() => {
      initializeResponsiveParallaxSections();
      initializeFooterReveal();
      ScrollTrigger.refresh();
    });
  }).catch(error => {
    console.error('Error loading sections:', error);
  });

  optimizeImages();
  setupSeo();
  updateScrollProgress();

  const hero = document.querySelector(".hero");
  // Find all sections with section-hidden class (works for both main page and step-details pages)
  const sections = document.querySelectorAll(".section-hidden, .features-wrapper, .features-summary-wrapper, #pricing, #about, .cta-section, footer");
  lucide.createIcons(), gsap.registerPlugin(ScrollTrigger);
  const carouselTrack = document.querySelector(".carousel-track"), carouselPrev = document.querySelector(".carousel-prev"), carouselNext = document.querySelector(".carousel-next"), useCaseCards = document.querySelectorAll(".use-case-card");
  let currentIndex = 0;
  function updateCarousel() {
    if (!carouselTrack || !useCaseCards.length) return;
    const cardWidth = useCaseCards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 32;
    carouselTrack.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`, 
    carouselPrev.style.opacity = 0 === currentIndex ? "0.5" : "1", carouselNext.style.opacity = currentIndex === useCaseCards.length - 1 ? "0.5" : "1";
  }
  carouselPrev && carouselNext && (
    carouselPrev.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      } else {
        gsap.fromTo(carouselTrack, { x: 0 }, { x: 20, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" });
      }
    }),
    carouselNext.addEventListener("click", () => {
      if (currentIndex < useCaseCards.length - 1) {
        currentIndex++;
        updateCarousel();
      } else {
        gsap.fromTo(carouselTrack, { x: 0 }, { x: -20, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" });
      }
    }),
    updateCarousel()
  );
  window.addEventListener('resize', () => { if (typeof updateCarousel === 'function') updateCarousel(); });

  // Touch-swipe för karusellen
  if (carouselTrack) {
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentIndex < useCaseCards.length - 1) {
          currentIndex++;
          updateCarousel();
        } else if (diff < 0 && currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      }
    }, { passive: true });
  }

  ScrollTrigger.matchMedia({
    "(min-width: 768px)": function() {
      if (hero) {
        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom top",
          pin: !0,
          pinSpacing: !1,
          scrub: !0
        });

        gsap.set(hero, {
          autoAlpha: 1,
          y: 0
        });

        gsap.to(hero, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: !0
          }
        });

        const heroTextContainer = document.querySelector('.hero-text-container');
        if (heroTextContainer) {
          gsap.to(heroTextContainer, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true
            }
          });
        }
      }

      initializeResponsiveParallaxSections();
    }
  }), sections.forEach((section => {
    section.matches("footer") || (gsap.set(section, {
      autoAlpha: 0,
      y: 40
    }), ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        section.classList.remove("section-hidden"), gsap.to(section, {
          autoAlpha: 1,
          y: 0,
          duration: .8,
          ease: "power1.out",
          onComplete: () => {
            if (section.classList.contains("features-wrapper")) {
              section.querySelectorAll(".feature-card").forEach(((card, i) => {
                const elements = card.querySelectorAll(".feature-content, .feature-visual, .feature-icon, h3, p");
                gsap.fromTo(elements, {
                  opacity: 0,
                  y: 20
                }, {
                  opacity: 1,
                  y: 0,
                  duration: .8,
                  delay: 1e-4 * i,
                  ease: "expo.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top center",
                    end: "bottom center",
                    toggleActions: "play reverse play reverse"
                  }
                }), ScrollTrigger.create({
                  trigger: card,
                  start: "top center",
                  end: "bottom center",
                  onEnter: () => {
                    card.classList.add("active"), gsap.to(card, {
                      background: "linear-gradient(to bottom, rgba(28, 26, 46, 0.6) 0%, rgba(28, 26, 46, 0.6) 35%, rgba(229, 180, 71, 0.4) 100%)",
                      duration: .8,
                      ease: "expo.out"
                    });
                  },
                  onLeaveBack: () => {
                    card.classList.remove("active"), gsap.to(card, {
                      background: "transparent",
                      duration: .8,
                      ease: "expo.out"
                    });
                  }
                });
              }));
            }
          }
        });
      },
      onLeaveBack: () => {
        section.classList.add("section-hidden"), gsap.to(section, {
          autoAlpha: 0,
          y: 40,
          duration: 1,
          ease: "power1.out"
        });
      }
    }));
  })), initializeFooterReveal();
  (selector => {
    const el = document.querySelector(selector);
    if (!el) return;
    const words = el.innerHTML.trim().split(" ");
    el.innerHTML = words.map((w => `<span class="word">${w}</span>`)).join(" ");
    const wordEls = el.querySelectorAll(".word");
    gsap.set(wordEls, {
      display: "inline-block",
      autoAlpha: 0,
      y: 20
    }), gsap.to(wordEls, {
      autoAlpha: 1,
      y: 0,
      ease: "power2.out",
      duration: 1,
      stagger: .1,
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none"
      }
    });
  })(".hero h1");
  const featureCards = gsap.utils.toArray(".feature-card"), featuresIntro = document.querySelector(".features-intro");
  if (featuresIntro) {
    const introTitle = featuresIntro.querySelector("h2"), introText = featuresIntro.querySelector(".intro");
    const introTargets = filterExistingTargets([ introTitle, introText ]);
    gsap.fromTo(introTargets, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: .8,
      stagger: .2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: featuresIntro,
        start: "top center",
        toggleActions: "play none none none"
      }
    });
  }
  document.querySelectorAll(".feature-card").forEach((card => {
    card.classList.remove("section-hidden");
  })), featureCards.forEach(((card, i) => {
    const content = card.querySelector(".feature-content"), visual = card.querySelector(".feature-visual"), icon = card.querySelector(".feature-icon"), title = card.querySelector("h3"), description = card.querySelector("p");
    const cardTargets = filterExistingTargets([ content, visual, icon, title, description ]);
    if (!cardTargets.length) {
      return;
    }

    gsap.set(cardTargets, {
      opacity: 0,
      y: 20
    }), ScrollTrigger.create({
      trigger: card,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        gsap.to(cardTargets, {
          opacity: 1,
          y: 0,
          duration: .8,
          stagger: .1,
          ease: "expo.out"
        });
      },
      onLeaveBack: () => {
        gsap.to(cardTargets, {
          opacity: 0,
          y: 20,
          duration: .8,
          ease: "expo.out"
        });
      }
    }), ScrollTrigger.matchMedia({
      "(min-width: 769px)": () => {
        gsap.to(card, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: .8
          }
        });
      }
    });
  })), document.querySelectorAll(".features-grid .feature-card").forEach((card => {
    const newClone = card.cloneNode(!0);
    card.parentNode.replaceChild(newClone, card);
  }));

  // Lägg till hero intro-animation timeline
  initializeHeroIntroAnimation();

  // Lägg till dragbar inertial scroll för use-case-karusellen
  if (carouselTrack) {
    const container = carouselTrack.parentElement;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    carouselTrack.addEventListener('pointerdown', e => {
      isDragging = true;
      carouselTrack.classList.add('grabbing');
      startX = e.clientX - currentTranslate;
      carouselTrack.setPointerCapture(e.pointerId);
    });
    carouselTrack.addEventListener('pointermove', e => {
      if (!isDragging) return;
      currentTranslate = e.clientX - startX;
      const maxTranslate = 0;
      const minTranslate = container.clientWidth - carouselTrack.scrollWidth;
      currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);
      carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
    });
    ['pointerup', 'pointercancel'].forEach(evt => {
      carouselTrack.addEventListener(evt, () => {
        isDragging = false;
        carouselTrack.classList.remove('grabbing');
      });
    });
  }

  // Lägg till scroll-progress-funktionalitet
  window.addEventListener('scroll', updateScrollProgress);

  // Add header initialization function
  function initializeHeader() {
    // Sätt rätt bas-sökväg för länkar och bilder (fungerar från root och features/)
    const path = window.location.pathname || '';
    const base = path.includes('/features/') ? '../' : '';
    document.querySelectorAll('.header a[data-href]').forEach(a => {
      a.href = base + a.getAttribute('data-href');
    });
    document.querySelectorAll('.header img[data-src]').forEach(img => {
      img.src = base + img.getAttribute('data-src');
    });
    document.querySelectorAll('.header img[data-src-assets]').forEach(img => {
      img.src = base + 'assets/' + img.getAttribute('data-src-assets');
    });
    document.querySelectorAll('.mobile-menu a[data-href]').forEach(a => {
      a.href = base + a.getAttribute('data-href');
    });
    document.querySelectorAll('.mobile-menu img[data-src-assets]').forEach(img => {
      img.src = base + 'assets/' + img.getAttribute('data-src-assets');
    });

    // Mobilmeny: hamburger-knapp och overlay – enhetlig stängning så hamburger/aria alltid synkad
    const hamburger = document.querySelector('.hamburger-btn');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const mobileLangLinks = document.querySelectorAll('.mobile-menu-lang a');
    if (hamburger && overlay) {
      const closeMenu = () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Öppna meny');
        overlay.setAttribute('aria-hidden', 'true');
        hamburger.focus();
      };
      const openMenu = () => {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Stäng meny');
        overlay.setAttribute('aria-hidden', 'false');
      };
      const toggleMenu = () => {
        if (overlay.classList.contains('open')) closeMenu();
        else openMenu();
      };
      hamburger.addEventListener('click', toggleMenu);
      overlay.querySelectorAll('a:not([data-lang])').forEach(link => {
        link.addEventListener('click', () => closeMenu());
      });
      mobileLangLinks.forEach(btn => {
        if (btn.hasAttribute('data-lang-initialized')) return;
        btn.setAttribute('data-lang-initialized', 'true');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const lang = btn.dataset.lang;
          if (typeof window.switchLanguage === 'function') window.switchLanguage(lang);
          closeMenu();
        });
      });
      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeMenu(); });
    }
    // Initialize language switcher - wait for switchLanguage to be available
    const initLanguageSwitcher = () => {
      const langButtons = document.querySelectorAll(".language-switcher a");
      
      if (langButtons.length > 0 && typeof window.switchLanguage === 'function') {
        langButtons.forEach(btn => {
          // Check if button already has event listener (avoid re-initializing)
          if (btn.hasAttribute('data-lang-initialized')) {
            return;
          }
          
          // Mark as initialized
          btn.setAttribute('data-lang-initialized', 'true');
          
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const lang = btn.dataset.lang;
            if (typeof window.switchLanguage === 'function') {
              window.switchLanguage(lang);
            }
          });
        });
        
        // Set initial active state
        updateLanguageButtons();
      } else if (langButtons.length > 0) {
        // Retry after a short delay if switchLanguage is not yet available
        setTimeout(initLanguageSwitcher, 100);
      }
    };
    
    initLanguageSwitcher();

    // Initialize Lucide icons in header
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // Add footer initialization function
  function initializeFooter() {
    const path = window.location.pathname || '';
    const base = path.includes('/features/') ? '../' : '';

    document.querySelectorAll('footer a[data-href]').forEach(link => {
      link.href = base + link.getAttribute('data-href');
    });

    document.querySelectorAll('footer img[data-src]').forEach(img => {
      img.src = base + img.getAttribute('data-src');
    });

    // Initialize footer language switcher
    const footerLangButtons = document.querySelectorAll(".language-switcher-footer .lang-btn");
    
    if (footerLangButtons.length > 0 && typeof window.switchLanguage === 'function') {
      footerLangButtons.forEach(btn => {
        // Remove existing listeners to avoid duplicates
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const lang = newBtn.dataset.lang;
          if (typeof window.switchLanguage === 'function') {
            window.switchLanguage(lang);
          }
        });
      });
      
      // Set initial active state
      updateLanguageButtons();
    }

    // Initialize Font Awesome icons in footer
    if (window.FontAwesome) {
      window.FontAwesome.dom.i2svg();
    }

    optimizeImages();
    setupSeo();
  }

  // Header scroll behavior
  let lastScrollTop = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const header = document.querySelector('.header');
        if (header) {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.classList.add('hide');
          } else {
            // Scrolling up
            header.classList.remove('hide');
          }
          
          lastScrollTop = scrollTop;
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // Add carousel initialization function
  function initializeCarousel() {
    const carouselTrack = document.querySelector(".carousel-track");
    const carouselPrev = document.querySelector(".carousel-prev");
    const carouselNext = document.querySelector(".carousel-next");
    const useCaseCards = document.querySelectorAll(".use-case-card");
    let currentIndex = 0;

    function updateCarousel() {
      if (!carouselTrack || !useCaseCards.length) return;
      const cardWidth = useCaseCards[0].offsetWidth;
      carouselTrack.style.transform = `translateX(-${currentIndex * (cardWidth + 32)}px)`;
      carouselPrev.style.opacity = currentIndex === 0 ? "0.5" : "1";
      carouselNext.style.opacity = currentIndex === useCaseCards.length - 1 ? "0.5" : "1";
    }

    if (carouselPrev && carouselNext) {
      carouselPrev.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        } else {
          gsap.fromTo(carouselTrack, { x: 0 }, { x: 20, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" });
        }
      });

      carouselNext.addEventListener("click", () => {
        if (currentIndex < useCaseCards.length - 1) {
          currentIndex++;
          updateCarousel();
        } else {
          gsap.fromTo(carouselTrack, { x: 0 }, { x: -20, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" });
        }
      });

      updateCarousel();
    }
  }

  // === FEATURES SUMMARY PAGE SCRIPTS ===
  {
    // Sticky nav active - disabled
    const navLinks = document.querySelectorAll('.features-nav a');
    const sections = [
      document.getElementById('project-section'),
      document.getElementById('supplier-section'),
      document.getElementById('legal-section')
    ];
    function setActiveNav() {
      // Function disabled
      return;
    }
    // Disabled sticky nav
    // window.addEventListener('scroll', setActiveNav);
    
    // Expand/collapse feature-cards
    initFeatureCardExpand();

    // Scroll to top button (mobile)
    document.querySelectorAll('.scroll-to-top').forEach(btn => {
      btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // FAQ expand/collapse
    initFaqAccessibility();

    // Carousel accessibility & swipe (för features-summary.html)
    const carousel = document.querySelector('.use-cases-carousel');
    const track = carousel ? carousel.querySelector('.carousel-track') : null;
    const prevBtn = carousel ? carousel.querySelector('.carousel-prev') : null;
    const nextBtn = carousel ? carousel.querySelector('.carousel-next') : null;
    const cards = carousel ? carousel.querySelectorAll('.use-case-card') : [];
    let currentIndex = 0;
    function updateCarousel() {
      if (!track || !cards.length) return;
      const cardWidth = cards[0].offsetWidth;
      track.style.transform = `translateX(-${currentIndex * (cardWidth + 32)}px)`;
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex === cards.length - 1;
    }
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) { currentIndex--; updateCarousel(); }
      });
      nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) { currentIndex++; updateCarousel(); }
      });
      updateCarousel();
    }
    let startX = null;
    if (track) {
      track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
      track.addEventListener('touchmove', e => {
        if (startX === null) return;
        let dx = e.touches[0].clientX - startX;
        if (Math.abs(dx) > 50) {
          if (dx < 0 && currentIndex < cards.length - 1) { currentIndex++; updateCarousel(); }
          if (dx > 0 && currentIndex > 0) { currentIndex--; updateCarousel(); }
          startX = null;
        }
      });
      track.addEventListener('touchend', () => { startX = null; });
    }
  }

  // Hanterar klick på 'Läs mer'-knappar i feature cards
  // Öppnar detaljsidan i en ny flik/fönster
  function initFeatureCardExpand() {
    document.querySelectorAll('.expand-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const card = btn.closest('.pricing-card');
        if (card && card.id === 'project-section') {
          window.open('project-details.html', '_blank');
        } else if (card && card.id === 'supplier-section') {
          window.open('supplier-details.html', '_blank');
        } else if (card && card.id === 'legal-section') {
          window.open('legal-details.html', '_blank');
        }
      });
    });
  }

  // Hanterar tillgänglig FAQ expand/collapse
  // Lägger till klick och tangentbordsstöd för att visa/dölja svar
  function initFaqAccessibility() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', function() {
        const expanded = q.getAttribute('aria-expanded') === 'true';
        q.setAttribute('aria-expanded', !expanded);
        const ans = document.getElementById(q.getAttribute('aria-controls'));
        if (ans) ans.classList.toggle('show');
        q.parentElement.classList.toggle('active');
      });
      if (q.tagName !== 'BUTTON') q.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') q.click();
      });
    });
  }

  // Features Grid Animation
  const featuresGrid = document.querySelector('.features-grid');
  const featureItems = document.querySelectorAll('.feature-grid-item');
  
  if (featuresGrid) {
    // Skip scroll animation if data-no-animate flag is present
    if (featuresGrid.hasAttribute('data-no-animate')) {
      featuresGrid.classList.remove('section-hidden');
      featureItems.forEach((item) => {
        const icon = item.querySelector('.feature-icon');
        const title = item.querySelector('h3');
        const desc = item.querySelector('p');
        if (icon) icon.style.opacity = '1';
        if (title) title.style.opacity = '1';
        if (desc) desc.style.opacity = '1';
        if (icon) icon.style.transform = 'none';
      });
    } else {
    // Remove section-hidden class initially
    featuresGrid.classList.remove('section-hidden');
    
    // Create GSAP animation for the grid
    gsap.fromTo(featuresGrid, 
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featuresGrid,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate each feature item
    featureItems.forEach((item, index) => {
      const icon = item.querySelector('.feature-icon');
      const title = item.querySelector('h3');
      const desc = item.querySelector('p');

      if (!featuresGrid.hasAttribute('data-no-animate')) {
        gsap.set([icon, title, desc], {
          opacity: 0,
          y: 20
        });

        gsap.to([icon, title, desc], {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      }
    });
    }
  }

  // Feature card functionality
  function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-grid-item');
    
    featureCards.forEach(card => {
      card.addEventListener('click', () => {
        const featureType = card.dataset.feature;
        const details = card.querySelector('.feature-details');
        
        // Toggle details visibility
        if (details.style.opacity === '1') {
          gsap.to(details, {
            top: '100%',
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut'
          });
        } else {
          gsap.to(details, {
            top: '0',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.inOut'
          });
        }
      });
    });
  }

  // Feature comparison table functionality
  function initializeFeatureComparison() {
    const searchInput = document.querySelector('#featureSearch, .feature-search');
    const categoryButtons = document.querySelectorAll('.category-btn, .category-button');
    const tableRows = document.querySelectorAll('.feature-comparison-table tbody tr');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        tableRows.forEach(row => {
          const featureName = row.querySelector('td:first-child').textContent.toLowerCase();
          const isVisible = featureName.includes(searchTerm);
          row.style.display = isVisible ? '' : 'none';
          
          if (isVisible) {
            gsap.fromTo(row, 
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
          }
        });
      });
    }

    if (categoryButtons.length > 0) {
      categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
          const category = button.dataset.category;
          
          categoryButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          tableRows.forEach(row => {
            const rowCategory = row.dataset.category;
            const isVisible = category === 'all' || rowCategory === category;
            row.style.display = isVisible ? '' : 'none';
            
            if (isVisible) {
              gsap.fromTo(row, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
              );
            }
          });
        });
      });

      // Initialize with all features visible
      if (categoryButtons[0]) categoryButtons[0].click();
    }
  }

  // Initialize all feature-related functionality
  {
    initializeFeatureComparison();
    initializeFeatureCards();
    
    // Add smooth scroll for feature cards
    const featureLearnMoreButtons = document.querySelectorAll('.feature-learn-more');
    featureLearnMoreButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click event
        const featureType = button.closest('.feature-grid-item').dataset.feature;
        const targetSection = document.querySelector(`#${featureType}-section`);
        
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Initialize feature detail page animations
  function initFeatureDetailPage() {
    const featureHeroContent = document.querySelector('.feature-hero-content, .pricing-hero-content');
    const featureDetailCards = gsap.utils.toArray('.feature-detail-card');
    const featureDetailsSection = document.querySelector('.feature-details, .feature-detail-section, .feature-details-grid');
    const steps = gsap.utils.toArray('.step');
    const howItWorks = document.querySelector('.how-it-works');
    const benefitCards = gsap.utils.toArray('.benefit-card');
    const benefitsSection = document.querySelector('.benefits');
    const featureCta = document.querySelector('.feature-cta');

    // Animate hero section
    if (featureHeroContent) {
      gsap.from(featureHeroContent, {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
      });
    }

    // Animate feature cards
    if (featureDetailCards.length && featureDetailsSection) {
      gsap.from(featureDetailCards, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featureDetailsSection,
          start: 'top 80%'
        }
      });
    }

    // Animate steps
    if (steps.length && howItWorks) {
      gsap.from(steps, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: howItWorks,
          start: 'top 80%'
        }
      });
    }

    // Animate benefits
    if (benefitCards.length && benefitsSection) {
      gsap.from(benefitCards, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: benefitsSection,
          start: 'top 80%'
        }
      });
    }

    // Animate CTA section
    if (featureCta) {
      gsap.from(featureCta, {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featureCta,
          start: 'top 80%'
        }
      });
    }
  }

  // Initialize feature detail page if we're on a feature detail page
  if (document.querySelector('.feature-detail-section, .feature-details-grid, .how-it-works, .feature-cta')) {
    initFeatureDetailPage();
  }
}));
