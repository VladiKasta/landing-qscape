export default function animateTextBlock() {
  const elements = document.querySelectorAll(
    ".services-list, .our__service > h2, .our__service-list-item, .our__service-bottom__section > h2, .item__bottom,.team__description-text,.team__image-wrapper,.bottom-images,.steps > h1,.stats-accordion,.result-text,.products,.price__title,.prices__wrapper,.price__bottom-tiles,.order-info,.order-form,.trust-info,.slide__task-desription,.slide__task-image",
  );

  /*   if (window.location.pathname !== "/") {
    console.log(window.location.pathname);
    return;
  } */

  elements.forEach((element, index) => {
    index % 2 === 0
      ? initAnimation(element, { direction: "right" })
      : initAnimation(element, { direction: "left" });
  });

  function initAnimation(textBlock, direction) {
    const duration = 2000;
    let lastTime = null;

    function textAnimation(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const progress = timestamp - lastTime;

      const percentage = Math.min(progress / duration, 1);

      if (direction.direction == "right") {
        textBlock.style.transform = `translateX(${1 / percentage - 1}%)`;
      }

      if (direction.direction == "left") {
        textBlock.style.transform = `translateX(-${1 / percentage - 1}%)`;
      }

      textBlock.style.opacity = percentage;
      if (percentage < 1) {
        requestAnimationFrame(textAnimation);
      }
    }

    const pointOnAnimate = textBlock;

    function isElementInViewport(element) {
      /* const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      return rect.bottom <= viewportHeight; */

      const rect = element.getBoundingClientRect();
      const elementMidPoint = rect.top + element.offsetHeight / 2;
      return elementMidPoint <= window.innerHeight;
    }

    document.addEventListener("scroll", () => {
      const element = pointOnAnimate;
      if (isElementInViewport(element)) {
        requestAnimationFrame(textAnimation); // запускаем анимацию когда блок достиг нижней границы блока
      }
    });
  }
}
