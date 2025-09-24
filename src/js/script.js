import animateFirstBall from "./animateFirstBall.js";
import animateSecondBall from "./animateSecondBall.js";
import animateStats from "./animateStats.js";
import animateTextBlock from "./animateText.js";
import circleAnimation from "./circleAnimation.js";
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
  animateStats();
  animateFirstBall();
  animateTextBlock();
  circleAnimation();
  animateSecondBall();
  initCompareAccordion();
  backLink();

  function backLink() {
    if (!document.querySelectorAll('a[data-action="back"]')) return;
    document.querySelectorAll('a[data-action="back"]').forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault(); // Отменяем стандартное поведение
        window.history.back(); // Возврат назад
      });
    });
  }

  function burgerTrigger() {
    const burgerMenuToggleBtn = document.getElementById("burger");
    const burgerMenu = document.querySelector(".burger-menu");
    const burgerMenuCloseBtn = burgerMenu.querySelector(".menu-close-btn");
    const overlay = document.getElementById("overlay");
    const body = document.querySelector("body");

    burgerMenuToggleBtn.addEventListener("click", () => {
      burgerMenu.style.left = "0";
      overlay.classList.toggle("active");
      body.classList.add("noscroll");
    });

    burgerMenuCloseBtn.addEventListener("click", () => {
      burgerMenu.style.left = "-100%";
      overlay.classList.remove("active");
      body.classList.remove("noscroll");
    });

    overlay.addEventListener("click", (e) => {
      if (!e.target.classList.contains("burger-menu")) {
        burgerMenu.style.left = "-100%";
        overlay.classList.remove("active");
        body.classList.remove("noscroll");
      }
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

  /*function accordionDetail() {
    const accordHeader = document.getElementById("accordion-header-detail");

    if (accordHeader == null) {
      return;
    }
    const img = accordHeader.querySelector("img");
    const table = document.querySelector(".compare__table");
    let isOpen = false;

    const offsetHeight = table.scrollHeight;
    console.log(table);

    accordHeader.addEventListener("click", () => {
      if (isOpen) {
        table.style.maxHeight = 0 + "px";
        img.style.transform = "rotate(180deg)";
      } else {
        table.style.maxHeight = offsetHeight + "px";
        img.style.transform = "rotate(0deg)";
      }

      isOpen = !isOpen;
    });
  }*/

    function initCompareAccordion() {
        const container = document.querySelector('.hidden-blocks-container');
        const button = document.querySelector('.accordion-header-detail');
        const buttonText = button.querySelector('p');

        if (!container || !button) {
            console.error('Элементы аккордеона не найдены');
            return;
        }

        let isExpanded = false;

        function toggleAccordion() {
            if (!isExpanded) {
                // Разворачиваем контейнер
                const hiddenBlocks = container.querySelectorAll('.compare__headers-detail');
                const blockHeight = hiddenBlocks[0]?.offsetHeight + 40; // высота блока + margin
                const totalHeight = hiddenBlocks.length * blockHeight;

                container.style.maxHeight = `${totalHeight}px`;
                container.classList.add('expanded');
                button.classList.add('expanded');
                buttonText.textContent = 'Скрыть детали';
                isExpanded = true;
            } else {
                const startHeight = container.scrollHeight;
                const scrollOffset = startHeight; // Вычисляем высоту для компенсации

                container.style.maxHeight = '0';
                container.classList.remove('expanded');
                button.classList.remove('expanded');
                buttonText.textContent = 'Показать больше деталей';

                window.scrollBy({ top: -scrollOffset, behavior: 'smooth' });
                isExpanded = false;
            }
        }

        button.addEventListener('click', toggleAccordion);
    }

});
