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

  document.addEventListener("scroll", () => {
    if (isElementInViewport(pointOnAnimate)) {
      console.log("here");
      requestAnimationFrame(animate); // Запускаем анимацию
    }
  });

  const gravity = 3000; // Ускорение падения
  const bounceFactor = 0.6; // Упругость
  const floorY = 0; // Пол
  const leftWall = 0; // Левая стена
  const wallX = 500; // Правая стена

  let y = -1000;
  let speedyY = 0;
  let leftPos = -1000;
  let speedX = 7000;
  let lastTime = null;

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = (timestamp - lastTime) / 1000; // В секундах
    lastTime = timestamp;

    // Применяем гравитацию
    speedyY += gravity * delta;
    y += speedyY * delta;

    // Проверка столкновения с полом
    if (y > floorY) {
      y = floorY;
      speedyY = -speedyY * bounceFactor;
      // Меняем направление и теряем скорость
    }

    // Движение по горизонтали
    leftPos += speedX * delta;

    // Проверка столкновения с правой стеной
    if (leftPos >= wallX) {
      leftPos = wallX;
      speedX = -speedX * 1; // Отскок влево
    }

    // Проверка столкновения с левой стеной
    if (leftPos <= leftWall) {
      leftPos = leftWall;
      speedX = -speedX * bounceFactor;
      // Отскок вправо
    }

    // Применяем позицию
    ball.style.transform = `translateY(${y}px)`;
    ball.style.left = `${leftPos}px`;

    // Условие остановки анимации
    if (Math.abs(speedyY) > 1 || y < floorY || Math.abs(speedX) > 1) {
      requestAnimationFrame(animate);
    }
  }
}
