// Функция для изменения внешнего вида header в зависимости от секции
export default function headerIntersection() {
  // Получаем элементы DOM
  const header = document.querySelector(".header__wrapper");
  const sections = document.querySelectorAll("[data-theme]"); // Все секции с атрибутом data-theme
  const burger = document.getElementById("burger"); // Кнопка бургер-меню

  // Проверяем, находимся ли мы не на главной странице
  if (
    window.location.pathname !== "/" &&
    window.location.pathname !== "/index.html"
  ) {
    // Для всех страниц кроме главной устанавливаем светлую тему header
    header.style.borderBottom = "1px solid #d0d0d0";

    // Меняем цвет элементов header на темный
    header.querySelector(".number").style.color = "#031422";
      header.querySelector(".email").style.color = "#031422";
    header.querySelector(".navigation").style.color = "#031422";
    burger.style.border = "1px solid #031422";
    burger
      .querySelectorAll("span")
      .forEach((span) => (span.style.background = "#031422"));
  }

  // Функция для определения видимой секции относительно header
  function getVisibleSection() {
    let visibleSection = null;
    let headerRect = header.getBoundingClientRect();
    let headerBottom = headerRect.bottom; // Нижняя граница header

    // Перебираем все секции для определения пересечения с header
    for (let i = 0; i < sections.length; i++) {
      let section = sections[i];
      let sectionRect = section.getBoundingClientRect();

      // Проверяем пересекается ли секция с нижней границей header
      if (
        sectionRect.top <= headerBottom &&
        sectionRect.bottom >= headerBottom
      ) {
        visibleSection = section;
        break; // Прерываем цикл при нахождении первой пересекающейся секции
      }
    }
    return visibleSection;
  }

  // Основная функция изменения цвета header
  function changeHeaderColor() {
    let visibleSection = getVisibleSection();

    const isAtTop = window.scrollY === 0 || window.pageYOffset === 0;

    if(isAtTop) {
      header.classList.remove('dark-header');
      header.classList.remove('light-header');

      return;
    }

    if (visibleSection) {
      // Если текущая секция имеет темную тему
      if (visibleSection.dataset.theme === "dark") {
        header.classList.remove("light-header");
        header.classList.add("dark-header");
        header.style.borderBottom = "#031422"; // Убираем границу или устанавливаем прозрачную

        // Меняем цвет текста и элементов на белый
        header.querySelector(".number").style.color = "white";
        header.querySelector(".email").style.color = "white";
        header.querySelector(".navigation").style.color = "white";

        burger.style.border = "1px solid white";
        burger
          .querySelectorAll("span")
          .forEach((span) => (span.style.background = "white"));
      }
      // Закомментированный код для прозрачной темы (запасной вариант)
      else if (visibleSection.dataset.theme === "transparent") {
        header.classList.remove("dark-header");
        header.classList.remove("light-header");
        header.querySelector(".number").style.color = "white";
        header.querySelector(".email").style.color = "white";
        header.querySelector(".navigation").style.color = "white";
        header.style.borderBottom = "none";

        burger.style.border = "1px solid white";
        burger
          .querySelectorAll("span")
          .forEach((span) => (span.style.background = "white"));
      }
      // Для всех остальных случаев (светлая тема)
      else {
        header.classList.remove("dark-header");
        header.classList.add("light-header");
        header.style.borderBottom = "1px solid #d0d0d0"; // Серая граница

        // Меняем цвет текста и элементов на темный
        header.querySelector(".number").style.color = "#031422";
        header.querySelector(".email").style.color = "#031422";
        header.querySelector(".navigation").style.color = "#031422";
        burger.style.border = "1px solid #031422";
        burger
          .querySelectorAll("span")
          .forEach((span) => (span.style.background = "#031422"));
      }
    }
  }

  // Добавляем обработчик события scroll для отслеживания прокрутки
  window.addEventListener("scroll", changeHeaderColor);
}
