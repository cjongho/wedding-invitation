document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll("section");

  elements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(20px)";
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = "all 0.6s ease-out";
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
});
