document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".text-card");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  cards.forEach(card => observer.observe(card));
});
