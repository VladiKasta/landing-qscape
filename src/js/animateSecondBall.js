export default function animateSecondBall() {
  const ball = document.querySelector(".ball__decor");
  const pointOnAnimate = document.querySelector(".steps");

  if (!ball || !pointOnAnimate) {
    return;
  }

  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    return rect.top <= viewportHeight;
  }

  let animationPlayed = false;
  let animationId = null;

  document.addEventListener("scroll", () => {
    if (isElementInViewport(pointOnAnimate) && !animationPlayed) {
      animationPlayed = true;
      animationId = requestAnimationFrame(animate);
    }
  });

  // Оптимизированные параметры
  const gravity = 2000; // Уменьшенное ускорение
  const bounceFactor = 0.6; // Большее трение при отскоке
  const floorY = 0; // Пол
  const leftWall = 0; // Левая стена
  const wallX = 500; // Правая стена
  const minSpeed = 100; // Минимальная скорость для остановки

  let y = -300; // Более близкая начальная позиция
  let speedyY = 0;
  let leftPos = -300; // Более близкий старт
  let speedX = 2000; // Уменьшенная начальная скорость
  let lastTime = null;

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Гравитация
    speedyY += gravity * delta;
    y += speedyY * delta;

    // Столкновение с полом
    if (y > floorY) {
      y = floorY;
      speedyY = -speedyY * bounceFactor;
    }

    // Горизонтальное движение
    leftPos += speedX * delta;

    // Столкновение с правой стеной
    if (leftPos >= wallX) {
      leftPos = wallX;
      speedX = -speedX * bounceFactor;
    }

    // Столкновение с левой стеной
    if (leftPos <= leftWall) {
      leftPos = leftWall;
      speedX = -speedX * bounceFactor;
    }

    // Применение позиции
    ball.style.transform = `translateY(${y}px)`;
    ball.style.left = `${leftPos}px`;

    // Условие остановки (учитываем минимальную скорость)
    if (Math.abs(speedyY) > minSpeed || Math.abs(speedX) > minSpeed) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Фиксируем конечное положение
      ball.style.transform = `translateY(${floorY}px)`;
      ball.style.left = `${Math.max(leftWall, Math.min(wallX, leftPos))}px`;
      cancelAnimationFrame(animationId);
    }
  }
}
