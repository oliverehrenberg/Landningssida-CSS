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
      gsap.fromTo(
        section,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "power1.out",
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }
  });

  // Footer animation - stays visible once triggered
  gsap.fromTo(
    "footer",
    { autoAlpha: 0, y: 40 },
    {
      autoAlpha: 1,
      y: 0,
      ease: "power1.out",
      duration: 1,
      scrollTrigger: {
        trigger: "footer",
        start: "top 90%",
        toggleActions: "play none none none",
      },
    }
  );

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
  splitAndAnimate(".about-title");

  window.switchLanguage = function (lang) {
    localStorage.setItem("language", lang);
    location.reload();
  };
});
