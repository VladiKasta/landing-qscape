export default function popupTrigger() {
  const openBtns = document.querySelectorAll("#open-popup,.leave-msg");
  const closeBtns = document.querySelectorAll("#popup-close");
  const overlay = document.getElementById("popup-overlay");

  if (!openBtns || !overlay || !closeBtns) {
    return;
  }

  openBtns.forEach((openBtn) => {
    openBtn.addEventListener("click", () => {
      overlay.classList.add("active");
      document.body.classList.add("no-scroll");
    });
  });

  closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("active");
      document.body.classList.remove("no-scroll");
    });
  });

  // Закрытие по клику на фон
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  });
}
