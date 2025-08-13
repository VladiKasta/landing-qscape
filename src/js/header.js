export default function headerIntersection() {
  const header = document.querySelector(".header__wrapper");
  const sections = document.querySelectorAll("[data-theme]");
  const burger = document.getElementById("burger");

  function getVisibleSection() {
    let visibleSection = null;
    let headerRect = header.getBoundingClientRect();
    let headerBottom = headerRect.bottom;

    for (let i = 0; i < sections.length; i++) {
      let section = sections[i];
      let sectionRect = section.getBoundingClientRect();
      if (
        sectionRect.top <= headerBottom &&
        sectionRect.bottom >= headerBottom
      ) {
        visibleSection = section;
        break;
      }
    }
    return visibleSection;
  }

  function changeHeaderColor() {
    let visibleSection = getVisibleSection();

    if (visibleSection) {
      if (visibleSection.dataset.theme === "dark") {
        header.classList.remove("light-header");
        header.style.borderBottom = "#031422";

        header.querySelector(".number").style.color = "white";
        header.querySelector(".navigation").style.color = "white";

        burger.style.border = "1px solid white";
        burger
          .querySelectorAll("span")
          .forEach((span) => (span.style.background = "white"));
      } else {
        header.classList.add("light-header");
        header.style.borderBottom = "1px solid #d0d0d0";

        header.querySelector(".number").style.color = "#031422";
        header.querySelector(".navigation").style.color = "#031422";
        burger.style.border = "1px solid #031422";
        burger
          .querySelectorAll("span")
          .forEach((span) => (span.style.background = "#031422"));
      }
    }
  }

  window.addEventListener("scroll", changeHeaderColor);
}
