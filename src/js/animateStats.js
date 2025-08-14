export default function animateStats() {
  const statItems = document.querySelectorAll(".stat-item");

  function animateNumber(element, start, end, duration, showPercent, showPlus) {
    let startTime = null;

    const animationStep = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = Math.floor(progress * (end - start) + start);

      let result = currentValue.toString();
      if (showPercent) {
        result += "%";
      }

      if (showPlus) {
        result = "+" + result;
      }

      element.textContent = result;

      if (progress < 1) {
        requestAnimationFrame(animationStep);
      }
    };

    requestAnimationFrame(animationStep);
  }

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top <= window.innerHeight && rect.bottom >= 0;
  }

  function checkAndAnimate() {
    statItems.forEach((stat, index) => {
      if (stat.dataset.animated) return;

      if (isInViewport(stat)) {
        stat.dataset.animated = "true";
        const numberElement = stat.querySelector("span");
        const targetValue = parseInt(
          numberElement.textContent.replace("%", ""),
        );

        const showPercent = index === 2;
        const showPlus = index === 1;
        animateNumber(
          numberElement,
          0,
          targetValue,
          2000,
          showPercent,
          showPlus,
        );
      }
    });
  }

  window.addEventListener("load", checkAndAnimate);
  window.addEventListener("scroll", checkAndAnimate);
}
