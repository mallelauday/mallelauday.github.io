/**
 * PORTFOLIO INTERACTIVE JAVASCRIPT
 * Developer: Uday Kumar Reddy
 * Features: Dark/Light Mode, Typing Animation, Counter Observer, Smooth Navigation,
 *           Scroll Progress, Project Filtering, Toast Notifications, ARIA Accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. THEME TOGGLE (DARK / LIGHT MODE WITH LOCALSTORAGE PERSISTENCE)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Read stored preference or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersLight) {
    htmlElement.setAttribute('data-theme', 'light');
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      
      showToast(`Switched to ${newTheme.toUpperCase()} mode 🌓`);
    });
  }

  // --------------------------------------------------------------------------
  // 2. SCROLL PROGRESS INDICATOR & BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 3. MOBILE MENU TOGGLE & CLICK-OUTSIDE DISMISS
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside header
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

      if (navLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinkItems.forEach(l => l.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav);

  // --------------------------------------------------------------------------
  // 5. TYPING ANIMATION IN HERO SECTION
  // --------------------------------------------------------------------------
  const typingTextElement = document.getElementById('typing-text');
  const phrases = [
    'Full-Stack Web Apps',
    'AI/ML Powered Tools',
    'Clean RESTful APIs',
    'Scalable Software Solutions'
  ];

  if (typingTextElement) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1800; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // Pause before starting next phrase
      }

      setTimeout(typeEffect, typingSpeed);
    }

    setTimeout(typeEffect, 500);
  }

  // --------------------------------------------------------------------------
  // 6. HERO STATS COUNTER ANIMATION
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateStats() {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const decimals = parseInt(stat.getAttribute('data-decimals') || '0', 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        // Ease out quadratic calculation
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = easeOutProgress * target;

        stat.textContent = currentValue.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target.toFixed(decimals) + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateStats();
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // 7. SCROLL REVEAL OBSERVER
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 8. PROJECT CATEGORY FILTERING
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 9. COPY EMAIL TO CLIPBOARD & TOAST NOTIFICATION
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailAddress = 'mallelaudaykumarreddy@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailAddress);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = emailAddress;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showToast('Email copied to clipboard! 📋');
      } catch (err) {
        showToast(`Email: ${emailAddress}`);
      }
    });
  }

  // Resume Download Notification
  const resumeBtn = document.getElementById('resume-download-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      showToast('Resume download starting now! 📄');
    });
  }

  // Toast Function
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // --------------------------------------------------------------------------
  // 10. CONTACT FORM VALIDATION & SIMULATION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !subject || !message) {
        formStatus.textContent = 'Please complete all required fields.';
        formStatus.className = 'form-status error';
        return;
      }

      // Basic email pattern check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className = 'form-status error';
        return;
      }

      formStatus.textContent = 'Sending message...';
      formStatus.className = 'form-status';

      setTimeout(() => {
        formStatus.textContent = 'Thank you! Your message has been sent successfully. 🚀';
        formStatus.className = 'form-status success';
        contactForm.reset();
        showToast('Message sent successfully! 📬');
      }, 1200);
    });
  }

  // --------------------------------------------------------------------------
  // 11. BUTTON RIPPLE EFFECT
  // --------------------------------------------------------------------------
  const rippleButtons = document.querySelectorAll('.btn-ripple');

  rippleButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = button.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const existingRipple = button.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }

      button.appendChild(circle);
    });
  });
});
