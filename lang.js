const translations = {
    en: {
      features: "Features",
      pricing: "Pricing",
      about: "About Us",
      contact: "Contact Us",
      heroTitle: "<span class='highlight-bransch'>Construction</span> industry's future is here",
      heroSubtitle: "The future of the construction industry is being shaped by two driven founders with a strong vision. Olivier Ehrenberg is a tech entrepreneur focused on digital solutions, business development, and growth. He has experience in building efficient platforms and leading technical projects. Anders Niclazon is a civil engineer with deep industry knowledge in the construction sector and project management. He is passionate about streamlining the construction industry through digitalization and sustainable solutions. Together, they are creating a platform that unites technology with the real needs of the construction industry..",
      heroCTA: "Sign Up Now",
      newsletterHeading: "Be the first to try the future of construction!",
      newsletterSub: "Subscribe to our newsletter for exclusive updates, launch dates, and early platform access.",
      featureTitle: "Features that drive your success",
      featureIntro: "Discover powerful tools that simplify your construction process – from finding the right suppliers to legal advice and AI-driven support.",
      feature1Title: "Find New Suppliers & Contractors",
      feature1Desc: "Connect with reliable suppliers and contractors directly on the platform. Access a wide network of qualified partners for your next project.",
      feature2Title: "Effective Conflict Resolution",
      feature2Desc: "Quickly and smoothly resolve disputes with our built-in conflict resolution feature. We help keep your projects on track.",
      feature3Title: "Communication Directly in the Platform",
      feature3Desc: "Chat and collaborate in real-time with your team and partners. Avoid email chaos and keep everyone updated in one place.",
      feature4Title: "E-signatures and Document Management",
      feature4Desc: "Sign contracts and manage documents digitally – quickly, securely, and legally binding, directly on the platform.",
      feature5Title: "Track Deliveries in Real Time",
      feature5Desc: "Keep track of material deliveries and get real-time updates. Avoid delays and ensure smooth logistics.",
      feature6Title: "AI Chat",
      feature6Desc: "Get quick answers and insights with our AI-powered assistant. From legal questions to project planning – the AI is here to help you.",
      feature7Title: "Built-in Project Tool",
      feature7Desc: "Plan, manage, and monitor your construction projects all in one place. Streamline workflows and gain full visibility.",
      feature8Title: "Legal Advice",
      feature8Desc: "Get expert support on contracts, laws, and regulations directly on the platform. Protect your business and avoid legal pitfalls.",
      footerContact: "Contact",
      footerAddress: "Address",
      footerSocial: "Social",
      footerEmail: "oe@constructionsourcing.se",
      footerPhone: "+46 73 435 35 88",
      footerCompany: "© 2024 Construction Sourcing Sweden AB",
      footerStreet: "Vittangigatan 10, 162 61",
      footerCity: "Vällingby Sweden",
      footerFacebook: "Facebook",
      footerInstagram: "Instagram",
      footerTiktok: "Tik Tok"
    },
    sv: {
      features: "Funktioner",
      pricing: "Prissättning",
      about: "Om oss",
      contact: "Kontakta oss",
      heroTitle: "<span class='highlight-bransch'>Byggbranschens</span> framtid är här",
      heroSubtitle: "Byggbranschens framtid formas av två drivna grundare med stark vision. Olivier Ehrenberg är en tech-entreprenör med fokus på digitala lösningar, affärsutveckling och tillväxt. Han har erfarenhet av att bygga effektiva plattformar och leda tekniska projekt. Anders Niclazon är civilingenjör med djup branschkunskap inom byggsektorn och projektledning. Han brinner för att effektivisera byggindustrin genom digitalisering och hållbara lösningar. Tillsammans skapar de en plattform som förenar teknik och byggbranschens verkliga behov.",
      heroCTA: "Anmäl Dig Nu",
      newsletterHeading: "Bli först med att testa framtidens byggplattform!",
      newsletterSub: "Registrera dig för vårt nyhetsbrev och få exklusiv tillgång till uppdateringar, lanseringsdatum och tidig åtkomst till plattformen.",
      featureTitle: "Funktioner som driver din framgång",
      featureIntro: "Upptäck kraftfulla verktyg som förenklar din byggprocess – från att hitta rätt leverantörer till juridisk rådgivning och AI‑driven support.",
      feature1Title: "Hitta nya Leverantörer & Entreprenörer",
      feature1Desc: "Anslut med pålitliga leverantörer och entreprenörer direkt på plattformen. Få tillgång till ett brett nätverk av kvalificerade partners för ditt nästa projekt.",
      feature2Title: "Effektiv Konfliktlösning",
      feature2Desc: "Lös tvister snabbt och smidigt med vår inbyggda konfliktlösningsfunktion. Vi hjälper till att hålla dina projekt på rätt spår.",
      feature3Title: "Kommunikation Direkt i Plattformen",
      feature3Desc: "Chatta och samarbeta i realtid med ditt team och partners. Slipp e‑postkaoset och håll alla uppdaterade på ett ställe.",
      feature4Title: "E-signatur och dokumenthantering",
      feature4Desc: "Signera avtal och hantera dokument digitalt – snabbt, säkert och juridiskt bindande, direkt på plattformen.",
      feature5Title: "Följ Leveranser i Realtid",
      feature5Desc: "Håll koll på materialleveranser och få uppdateringar i realtid. Undvik förseningar och säkerställ smidig logistik.",
      feature6Title: "AI Chat",
      feature6Desc: "Få snabba svar och insikter med vår AI-drivna assistent. Från juridiska frågor till projektplanering – AI:n är här för att hjälpa dig.",
      feature7Title: "Inbyggt Projektverktyg",
      feature7Desc: "Planera, hantera och övervaka dina byggprojekt på ett och samma ställe. Effektivisera arbetsflöden och få full överblick.",
      feature8Title: "Juridisk Rådgivning",
      feature8Desc: "Få expertstöd om kontrakt, lagar och regler direkt i plattformen. Skydda ditt företag och undvik juridiska fallgropar.",
      footerContact: "Kontakt",
      footerAddress: "Adress",
      footerSocial: "Social",
      footerEmail: "oe@constructionsourcing.se",
      footerPhone: "+46 73 435 35 88",
      footerCompany: "© 2024 Construction Sourcing Sweden AB",
      footerStreet: "Vittangigatan 10, 162 61",
      footerCity: "Vällingby Sweden",
      footerFacebook: "Facebook",
      footerInstagram: "Instagram",
      footerTiktok: "Tik Tok"
    }
  };
  
  function switchLanguage(lang) {
    localStorage.setItem('language', lang);
    applyLanguage(lang);
  }
  
  function applyLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-translate');
      if (translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
  
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero .subtitle');
    const heroCTA = document.querySelector('.hero .cta-btn');
    if (heroTitle) heroTitle.innerHTML = translations[lang].heroTitle;
    if (heroSubtitle) heroSubtitle.innerHTML = translations[lang].heroSubtitle;
    if (heroCTA) heroCTA.innerHTML = translations[lang].heroCTA;
  
    const newsletterTitle = document.querySelector('.cta-section h2');
    const newsletterSub = document.querySelector('.cta-section p');
    if (newsletterTitle) newsletterTitle.innerHTML = translations[lang].newsletterHeading;
    if (newsletterSub) newsletterSub.innerHTML = translations[lang].newsletterSub;
  
    const featureHeading = document.querySelector('.features-wrapper h2');
    const featureIntro = document.querySelector('.features-wrapper .intro');
    if (featureHeading) featureHeading.innerHTML = translations[lang].featureTitle;
    if (featureIntro) featureIntro.innerHTML = translations[lang].featureIntro;
  
    document.querySelectorAll('.feature-card').forEach((card, index) => {
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');
      if (title) title.innerHTML = translations[lang][`feature${index + 1}Title`];
      if (desc) desc.innerHTML = translations[lang][`feature${index + 1}Desc`];
    });
  
    const footer = {
      contact: document.querySelector('h4[data-translate="footerContact"]'),
      address: document.querySelector('h4[data-translate="footerAddress"]'),
      social: document.querySelector('h4[data-translate="footerSocial"]'),
      email: document.querySelector('p[data-translate="footerEmail"]'),
      phone: document.querySelector('p[data-translate="footerPhone"]'),
      company: document.querySelector('p[data-translate="footerCompany"]'),
      street: document.querySelector('p[data-translate="footerStreet"]'),
      city: document.querySelector('p[data-translate="footerCity"]'),
      facebook: document.querySelector('a[data-translate="footerFacebook"]'),
      instagram: document.querySelector('a[data-translate="footerInstagram"]'),
      tiktok: document.querySelector('a[data-translate="footerTiktok"]')
    };
  
    Object.entries(footer).forEach(([key, el]) => {
      if (el && translations[lang][`footer${key.charAt(0).toUpperCase() + key.slice(1)}`]) {
        el.innerHTML = translations[lang][`footer${key.charAt(0).toUpperCase() + key.slice(1)}`];
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'sv';
    applyLanguage(savedLang);
  });