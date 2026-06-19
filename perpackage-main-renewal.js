(function () {
  const root = document.querySelector(".peerl-home-renewal");
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll("[data-peerl-home-tab]"));
  if (!tabs.length) return;

  const targets = tabs
    .map((tab) => {
      const hash = tab.getAttribute("href");
      const target = hash && hash.startsWith("#") ? document.querySelector(hash) : null;
      return target ? { tab, target } : null;
    })
    .filter(Boolean);

  function setActive(tab) {
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      const hash = tab.getAttribute("href");
      const target = hash && hash.startsWith("#") ? document.querySelector(hash) : null;
      if (!target) return;

      event.preventDefault();
      setActive(tab);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  if (!("IntersectionObserver" in window) || !targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const match = targets.find((item) => item.target === visible.target);
      if (match) setActive(match.tab);
    },
    {
      root: null,
      rootMargin: "-34% 0px -52% 0px",
      threshold: [0.08, 0.24, 0.48],
    }
  );

  targets.forEach((item) => observer.observe(item.target));
})();
