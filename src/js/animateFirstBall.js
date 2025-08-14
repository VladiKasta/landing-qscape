export default function animateFirstBall() {
  const ballFirst = document.getElementById("animated-ball-first");
  const pointOnAnimate = document.querySelector(".title__section");

  if (!ballFirst || !pointOnAnimate) {
    return;
  }

  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    return rect.bottom <= viewportHeight;
  }

  document.addEventListener("scroll", () => {
    const element = pointOnAnimate;
    if (isElementInViewport(element)) {
      requestAnimationFrame(animate); // запускаем анимацию когда блок достиг верхней границы блока .services-list
    }
  });

  const gravity = 3000; // ускорение падения px/сек²
  const bounceFactor = 0.6; // коэффициент упругости

  const floorY = -20;

  let y = -250;
  let speedyY = 0;
  let lastTime = null;

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = (timestamp - lastTime) / 1000; // в секундах
    lastTime = timestamp;

    // Применяем гравитацию
    speedyY += gravity * delta;
    y += speedyY * delta;

    // Проверка столкновения с полом
    if (y > floorY) {
      y = floorY;
      speedyY = -speedyY * bounceFactor; // меняем направление и теряем скорость
    }

    // Применяем позицию
    ballFirst.style.transform = `translateY(${y}px)`;

    // Если скорость и позиция почти ноль — стоп
    if (Math.abs(speedyY) > 1 || y < floorY) {
      requestAnimationFrame(animate);
    }
  }
}
