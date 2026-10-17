document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => setTimeout(() => preloader?.classList.add("done"), 350));

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const typed = document.getElementById("typedText");
  if (typed) {
    const phrases = ["Web Developer", "Software Builder", "UI Enthusiast", "Problem Solver", "Software House Officer of Jahan University"];
    let phrase = 0, char = 0, deleting = false;
    const tick = () => {
      const current = phrases[phrase];
      typed.textContent = deleting ? current.slice(0, --char) : current.slice(0, ++char);
      let delay = deleting ? 42 : 82;
      if (!deleting && char === current.length) { delay = 1400; deleting = true; }
      else if (deleting && char === 0) { deleting = false; phrase = (phrase + 1) % phrases.length; delay = 350; }
      setTimeout(tick, delay);
    };
    tick();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal-up,.reveal-scale").forEach(el => observer.observe(el));

  const progress = document.querySelector(".scroll-progress");
  const backTop = document.getElementById("backToTop");
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    backTop?.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  backTop?.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

  const glow = document.querySelector(".cursor-glow");
  window.addEventListener("pointermove", e => {
    if (!glow || window.innerWidth < 768) return;
    glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`;
  });

  document.querySelectorAll(".magnetic").forEach(btn => {
    btn.addEventListener("pointermove", e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.08}px, ${(e.clientY-r.top-r.height/2)*.12}px)`;
    });
    btn.addEventListener("pointerleave", () => btn.style.transform = "");
  });

  // Highlight active page after Bootstrap navigation settles.
  const page = document.body.dataset.page;
  const navLinks = document.querySelectorAll(".navbar .nav-link");

  const updateActiveLink = () => {
    if (page !== "home") return;
    let fromTop = window.scrollY + 100;

    navLinks.forEach(link => {
      let section = document.querySelector(link.getAttribute("href"));
      if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveLink);

  navLinks.forEach(link => {
    if (page === "home" && link.getAttribute("href") === "index.html") link.classList.add("active");
    if (page === "about" && link.getAttribute("href") === "about.html") link.classList.add("active");
  });

  // Theme Toggle Logic
  const themeToggle = document.getElementById("themeToggle");
  const icon = themeToggle?.querySelector("i");

  const setTheme = (isLight) => {
    document.body.classList.toggle("light-mode", isLight);
    if (icon) {
      icon.classList.replace(isLight ? "fa-moon" : "fa-sun", isLight ? "fa-sun" : "fa-moon");
    }
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  };

  themeToggle?.addEventListener("click", () => {
    setTheme(!document.body.classList.contains("light-mode"));
  });

  // Check saved preference
  if (localStorage.getItem("portfolio-theme") === "light") {
    setTheme(true);
  }

  // Copy to Clipboard logic
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add("copied");
        setTimeout(() => btn.classList.remove("copied"), 2000);
      });
    });
  });
});
