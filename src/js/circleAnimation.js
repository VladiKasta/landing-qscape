import anime from "https://cdn.jsdelivr.net/npm/animejs@3.2.2/+esm";

export default function circleAnimation() {
  const circle = document.querySelector(".svg__circle");
  const path = document.querySelector(".svg__line-path");

  if (!circle || !path) return;

  const pathLength = path.getTotalLength();
  const motion = { progress: 0 };

  anime({
    targets: motion,
    progress: [0, pathLength],
    duration: 35000,
    easing: "easeInOutSine",
    loop: true,
    update: () => {
      const point = path.getPointAtLength(motion.progress);
      // теперь можно ставить cx/cy прямо у круга
      circle.setAttribute("cx", point.x);
      circle.setAttribute("cy", point.y);
    },
  });
}
