document.addEventListener("DOMContentLoaded", (() => {
  // Load header, footer, features summary, about, and CTA sections
  Promise.all([
    fetch('header.html').then(response => response.text()),
    fetch('footer.html').then(response => response.text()),
    fetch('features-summary.html').then(response => response.text()),
    fetch('about.html').then(response => response.text()),
    fetch('cta.html').then(response => response.text())
  ]).then(([headerData, footerData, featuresSummaryData, aboutData, ctaData]) => {
    // Insert header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      headerContainer.innerHTML = headerData;
      initializeHeader();
    }

    // Insert footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
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
  }).catch(error => {
    console.error('Error loading sections:', error);
  });

  const hero = document.querySelector(".hero"), sections = document.querySelectorAll(".features-wrapper, .features-summary-wrapper, #pricing, #about, .cta-section, footer");
  lucide.createIcons(), gsap.registerPlugin(ScrollTrigger);
  const carouselTrack = document.querySelector(".carousel-track"), carouselPrev = document.querySelector(".carousel-prev"), carouselNext = document.querySelector(".carousel-next"), useCaseCards = document.querySelectorAll(".use-case-card");
  let currentIndex = 0;
  function updateCarousel() {
    const cardWidth = useCaseCards[0].offsetWidth;
    carouselTrack.style.transform = `translateX(-${currentIndex * (cardWidth + 32)}px)`, 
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
  ), ScrollTrigger.matchMedia({
    "(min-width: 768px)": function() {
      ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        pin: !0,
        pinSpacing: !1,
        scrub: !0
      }), hero && (gsap.set(hero, {
        autoAlpha: 1,
        y: 0
      }), gsap.to(hero, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: !0
        }
      }),
      // Parallax för hero-text
      gsap.to(".hero-text-container", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })), gsap.to(".big-card .text-content", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".big-card",
          start: "top bottom",
          end: "bottom top",
          scrub: !0
        }
      }), gsap.to(".big-card .image-side img", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ".big-card",
          start: "top bottom",
          end: "bottom top",
          scrub: !0
        }
      }), gsap.fromTo(".big-card .image-side img", {
        scale: 1
      }, {
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: ".big-card .image-side img",
          start: "top 80%",
          end: "bottom top",
          scrub: !0
        }
      }), gsap.to(".about-wrapper", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-wrapper",
          start: "top bottom",
          end: "bottom top",
          scrub: !0
        }
      }), gsap.fromTo(".about-image img", {
        scale: 1
      }, {
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-image img",
          start: "top 80%",
          end: "bottom top",
          scrub: !0
        }
      });
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
  })), gsap.set("footer", {
    autoAlpha: 0,
    y: 40
  }), ScrollTrigger.create({
    trigger: "footer",
    start: "top 90%",
    onEnter: () => {
      const footer = document.querySelector("footer");
      footer.classList.remove("section-hidden"), gsap.to(footer, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power1.out"
      });
    }
  });
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
  })(".hero h1"), window.switchLanguage = function(lang) {
    localStorage.setItem("language", lang), location.reload();
  };
  const featureCards = gsap.utils.toArray(".feature-card"), featuresIntro = document.querySelector(".features-intro");
  if (featuresIntro) {
    const introTitle = featuresIntro.querySelector("h2"), introText = featuresIntro.querySelector(".intro");
    gsap.fromTo([ introTitle, introText ], {
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
    gsap.set([ content, visual, icon, title, description ], {
      opacity: 0,
      y: 20
    }), ScrollTrigger.create({
      trigger: card,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        gsap.to([ content, visual, icon, title, description ], {
          opacity: 1,
          y: 0,
          duration: .8,
          stagger: .1,
          ease: "expo.out"
        });
      },
      onLeaveBack: () => {
        gsap.to([ content, visual, icon, title, description ], {
          opacity: 0,
          y: 20,
          duration: .8,
          ease: "expo.out"
        });
      }
    }), gsap.to(card, {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: .8
      }
    });
  })), document.querySelectorAll(".features-grid .feature-card").forEach((card => {
    const newClone = card.cloneNode(!0);
    card.parentNode.replaceChild(newClone, card);
  }));
  const langButtons = document.querySelectorAll(".language-switcher .lang-btn, .language-switcher-footer .lang-btn, .language-switcher a"), currentLang = localStorage.getItem("language") || "sv";
  langButtons.forEach((btn => {
    btn.dataset.lang === currentLang ? btn.classList.add("active") : btn.classList.remove("active"), 
    btn.addEventListener("click", (e => {
      e.preventDefault();
      const lang = btn.dataset.lang;
      window.switchLanguage(lang);
    }));
  })), window.addEventListener("languageChanged", (e => {
    const newLang = e.detail.lang;
    langButtons.forEach((btn => {
      btn.dataset.lang === newLang ? btn.classList.add("active") : btn.classList.remove("active");
    }));
  }));

  // Lägg till hero intro-animation timeline
  const heroTimeline = gsap.timeline({ defaults: { duration: 0.8, ease: "power1.out" } });
  heroTimeline
    .from(".small-top-text", { autoAlpha: 0, y: -20 })
    .from(".hero h1", { autoAlpha: 0, y: 50 }, "-=0.4")
    .from(".subtitle", { autoAlpha: 0, y: 20 }, "-=0.4")
    .fromTo(
      ".hero .cta-btn",
      { autoAlpha: 0, scale: 0.9 },
      { autoAlpha: 1, scale: 1, ease: "back.out(1.7)", duration: 0.8 },
      "-=0.4"
    );

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
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (scrollPos / docHeight) * 100;
    const bar = document.querySelector('.scroll-progress__bar');
    if (bar) bar.style.width = percent + '%';
  });

  // Add header initialization function
  function initializeHeader() {
    // Initialize language switcher
    const langButtons = document.querySelectorAll(".language-switcher a");
    const currentLang = localStorage.getItem('language') || 'sv';
    
    langButtons.forEach(btn => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
      }
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.dataset.lang;
        window.switchLanguage(lang);
      });
    });

    // Initialize Lucide icons in header
    lucide.createIcons();
  }

  // Add footer initialization function
  function initializeFooter() {
    // Initialize footer language switcher
    const footerLangButtons = document.querySelectorAll(".language-switcher-footer .lang-btn");
    const currentLang = localStorage.getItem('language') || 'sv';
    
    footerLangButtons.forEach(btn => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
      }
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.dataset.lang;
        window.switchLanguage(lang);
      });
    });

    // Initialize Font Awesome icons in footer
    if (window.FontAwesome) {
      window.FontAwesome.dom.i2svg();
    }
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
  document.addEventListener('DOMContentLoaded', function() {
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

    // Carousel accessibility & swipe
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
    // Swipe for mobile
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
  });

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
      q.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') q.click();
      });
    });
  }
}));