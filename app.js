/**
 * AI POC Discovery — Workshop Board
 * Sticky spine scroll-spy (IntersectionObserver)
 */
(function () {
  const links = Array.from(document.querySelectorAll(".spine a[data-step]"));
  const stages = Array.from(document.querySelectorAll(".stage[data-step]"));
  if (!links.length || !stages.length) return;

  const linkByStep = new Map(
    links.map((a) => [a.getAttribute("data-step"), a])
  );

  function setActive(step) {
    links.forEach((a) => {
      const on = a.getAttribute("data-step") === step;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });

    // Keep active chip visible in horizontal mobile rail
    const active = linkByStep.get(step);
    if (active && window.matchMedia("(max-width: 860px)").matches) {
      active.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }

  // Default first step
  setActive("1");

  const ratios = new Map();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const step = entry.target.getAttribute("data-step");
        ratios.set(step, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      let best = null;
      let bestRatio = 0;
      ratios.forEach((ratio, step) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = step;
        }
      });

      if (best) setActive(best);
    },
    {
      root: null,
      // Bias toward content in the upper-middle viewport
      rootMargin: "-15% 0px -45% 0px",
      threshold: [0, 0.15, 0.35, 0.55, 0.75],
    }
  );

  stages.forEach((s) => observer.observe(s));

  // Smooth focus management when clicking spine links
  links.forEach((a) => {
    a.addEventListener("click", () => {
      const step = a.getAttribute("data-step");
      setActive(step);
    });
  });
})();
