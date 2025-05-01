document.addEventListener("DOMContentLoaded", (() => {
  const hero = document.querySelector(".hero"), sections = document.querySelectorAll(".features-wrapper, .features-summary-wrapper, #pricing, #about, .cta-section, footer");
  lucide.createIcons(), gsap.registerPlugin(ScrollTrigger);
  const carouselTrack = document.querySelector(".carousel-track"), carouselPrev = document.querySelector(".carousel-prev"), carouselNext = document.querySelector(".carousel-next"), useCaseCards = document.querySelectorAll(".use-case-card");
  let currentIndex = 0;
  function updateCarousel() {
    const cardWidth = useCaseCards[0].offsetWidth;
    carouselTrack.style.transform = `translateX(-${currentIndex * (cardWidth + 32)}px)`, 
    carouselPrev.style.opacity = 0 === currentIndex ? "0.5" : "1", carouselNext.style.opacity = currentIndex === useCaseCards.length - 1 ? "0.5" : "1";
  }
  carouselPrev && carouselNext && (carouselPrev.addEventListener("click", (() => {
    currentIndex > 0 && (currentIndex--, updateCarousel());
  })), carouselNext.addEventListener("click", (() => {
    currentIndex < useCaseCards.length - 1 && (currentIndex++, updateCarousel());
  })), updateCarousel()), ScrollTrigger.matchMedia({
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
}));