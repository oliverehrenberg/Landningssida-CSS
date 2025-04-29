document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const sections = document.querySelectorAll(
    ".features-wrapper, .features-summary-wrapper, #pricing, #about, .cta-section, footer"
  );

  lucide.createIcons();
  gsap.registerPlugin(ScrollTrigger);

  // Desktop-only scroll effects: sticky, parallax, and zoom
  ScrollTrigger.matchMedia({
    "(min-width: 768px)": function () {
      // Pin hero and features-wrapper with scrub
      ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        scrub: true,
      });

      // Parallax for hero
      if (hero) {
        gsap.set(hero, { autoAlpha: 1, y: 0 });
        gsap.to(hero, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Big-card parallax and zoom effects
      gsap.to(".big-card .text-content", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".big-card",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".big-card .image-side img", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ".big-card",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.fromTo(
        ".big-card .image-side img",
        { scale: 1 },
        {
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: ".big-card .image-side img",
            start: "top 80%",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // About-wrapper parallax and zoom effects
      gsap.to(".about-wrapper", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-wrapper",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.fromTo(
        ".about-image img",
        { scale: 1 },
        {
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-image img",
            start: "top 80%",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
  });

  // Fade in and reveal sections (except footer) using GSAP autoAlpha and y offset
  sections.forEach((section) => {
    if (!section.matches('footer')) {
      // Set initial state
      gsap.set(section, { autoAlpha: 0, y: 40 });
      
      // Create ScrollTrigger animation
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          section.classList.remove('section-hidden');
          gsap.to(section, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power1.out",
            onComplete: () => {
              // After section is visible, animate feature cards
              if (section.classList.contains('features-wrapper')) {
                const featureCards = section.querySelectorAll('.feature-card');
                featureCards.forEach((card, i) => {
                  const elements = card.querySelectorAll('.feature-content, .feature-visual, .feature-icon, h3, p');
                  
                  gsap.fromTo(elements, 
                    { opacity: 0, y: 20 },
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.8,
                      delay: i * 0.0001,
                      ease: "expo.out",
                      scrollTrigger: {
                        trigger: card,
                        start: "top center",
                        end: "bottom center",
                        toggleActions: "play reverse play reverse"
                      }
                    }
                  );

                  // Add active class when card is in view
                  ScrollTrigger.create({
                    trigger: card,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => {
                      card.classList.add('active');
                      // Add background gradient when card is active
                      gsap.to(card, {
                        background: 'linear-gradient(to bottom, rgba(28, 26, 46, 0.6) 0%, rgba(28, 26, 46, 0.6) 35%, rgba(229, 180, 71, 0.4) 100%)',
                        duration: 0.8,
                        ease: "expo.out"
                      });
                    },
                    onLeaveBack: () => {
                      card.classList.remove('active');
                      // Remove background gradient when card is not active
                      gsap.to(card, {
                        background: 'transparent',
                        duration: 0.8,
                        ease: "expo.out"
                      });
                    }
                  });
                });
              }
            }
          });
        },
        onLeaveBack: () => {
          section.classList.add('section-hidden');
          gsap.to(section, {
            autoAlpha: 0,
            y: 40,
            duration: 1,
            ease: "power1.out"
          });
        }
      });
    }
  });

  // Footer animation - stays visible once triggered
  gsap.set("footer", { autoAlpha: 0, y: 40 });
  ScrollTrigger.create({
    trigger: "footer",
    start: "top 90%",
    onEnter: () => {
      const footer = document.querySelector('footer');
      footer.classList.remove('section-hidden');
      gsap.to(footer, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power1.out"
      });
    }
  });

  // Split headings into word spans and animate each word
  const splitAndAnimate = (selector) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const words = el.innerHTML.trim().split(" ");
    el.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(" ");
    const wordEls = el.querySelectorAll(".word");
    gsap.set(wordEls, { display: "inline-block", autoAlpha: 0, y: 20 });
    gsap.to(wordEls, {
      autoAlpha: 1,
      y: 0,
      ease: "power2.out",
      duration: 1,
      stagger: 0.1,
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  };
  splitAndAnimate(".hero h1");

  window.switchLanguage = function (lang) {
    localStorage.setItem("language", lang);
    location.reload();
  };

  // Feature cards scroll animations - Refined
  const featureCards = gsap.utils.toArray('.feature-card');
  const featuresIntro = document.querySelector('.features-intro');
  
  // Intro animation
  if (featuresIntro) {
    const introTitle = featuresIntro.querySelector('h2');
    const introText = featuresIntro.querySelector('.intro');
    
    gsap.fromTo(
      [introTitle, introText],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featuresIntro,
          start: "top center",
          toggleActions: "play none none none"
        }
      }
    );
  }
  
  // Remove section-hidden class from feature cards
  document.querySelectorAll('.feature-card').forEach(card => {
    card.classList.remove('section-hidden');
  });
  
  featureCards.forEach((card, i) => {
    const content = card.querySelector('.feature-content');
    const visual = card.querySelector('.feature-visual');
    const icon = card.querySelector('.feature-icon');
    const title = card.querySelector('h3');
    const description = card.querySelector('p');

    // Set initial state
    gsap.set([content, visual, icon, title, description], { 
      opacity: 0,
      y: 20
    });

    // Create ScrollTrigger for each card
    ScrollTrigger.create({
      trigger: card,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        gsap.to([content, visual, icon, title, description], {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "expo.out"
        });
      },
      onLeaveBack: () => {
        gsap.to([content, visual, icon, title, description], {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "expo.out"
        });
      }
    });

    // Subtle parallax for the entire card
    gsap.to(card, {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8
      }
    });
  });

  // Remove previous feature card click handlers
  document.querySelectorAll('.features-grid .feature-card').forEach((card) => {
    const newClone = card.cloneNode(true);
    card.parentNode.replaceChild(newClone, card);
  });
});
