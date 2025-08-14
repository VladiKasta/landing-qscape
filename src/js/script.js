import animations from "./animateFiistBall.js";
import animateSecondBall from "./animateSecondBall.js";
import animateTextBlock from "./animateText.js";
import headerIntersection from "./header.js";
import inputMask from "./inputMask.js";
import popupTrigger from "./popup.js";
import initSwipers from "./swipers.js";

document.addEventListener("DOMContentLoaded", function () {
  headerIntersection();
  burgerTrigger();
  popupTrigger();
  inputMask();

  dropdownTrigger();
  accordion();
  initSwipers();
  animations();
  animateTextBlock();
  animateSecondBall();

  function burgerTrigger() {
    const burgerMenuToggleBtn = document.getElementById("burger");
    const burgerMenu = document.querySelector(".burger-menu");
    const burgerMenuCloseBtn = burgerMenu.querySelector(".menu-close-btn");
    const overlay = document.getElementById("overlay");

    burgerMenuToggleBtn.addEventListener("click", () => {
      burgerMenu.style.left = "0";
      overlay.classList.toggle("active");
    });

    burgerMenuCloseBtn.addEventListener("click", () => {
      console.log("!");
      burgerMenu.style.left = "-100%";
      overlay.classList.remove("active");
    });
  }

  function dropdownTrigger() {
    const dropdownItem = document.querySelector(".dropdown");
    const dropdownMenu = dropdownItem.querySelector(".dropdown-menu");

    dropdownItem.addEventListener("mouseover", (e) => {
      dropdownMenu.style.display = "block";
      dropdownMenu.style.opacity = 1;
    });

    dropdownItem.addEventListener("mouseout", (e) => {
      if (!dropdownItem.contains(e.relatedTarget)) {
        dropdownMenu.style.opacity = 0;
        dropdownMenu.style.display = "none";
      }
    });
  }

  function accordion() {
    const accordionHeaders = document.querySelectorAll("#accordion-header");

    let isOpen = true;
    [...accordionHeaders].forEach((el) =>
      el.addEventListener("click", (event) => {
        console.log(event.currentTarget);
        const arrow = event.currentTarget.querySelector("img");
        const description = event.currentTarget.nextElementSibling;

        if (isOpen) {
          const scrollHeight = description.scrollHeight;
          description.style.height = scrollHeight + "px";
          arrow.style.transform = "rotate(180deg)";
        } else {
          description.style.height = "0";
          arrow.style.transform = "rotate(0deg)";
        }

        isOpen = !isOpen;
      }),
    );
  }
});
