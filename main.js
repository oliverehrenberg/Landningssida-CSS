document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const sections = document.querySelectorAll(
    ".features-wrapper, .cta-section, footer, .pricing-wrapper, .logo-cloud, #about"
  );
  const featureCards = document.querySelectorAll(".feature-card");

  const observerOptions = { threshold: 0.2 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    section.classList.add("section-hidden");
    observer.observe(section);
  });

  featureCards.forEach((card, index) => {
    card.classList.add("section-hidden");
    card.style.transitionDelay = `${index * 200}ms`;
    observer.observe(card);
  });

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.2}px)`;
      hero.style.opacity = 1 - scrolled / 500;
    }
  });

  window.switchLanguage = function (lang) {
    localStorage.setItem("language", lang);
    location.reload();
  };
});
