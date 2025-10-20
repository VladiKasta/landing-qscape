export default function popupTrigger() {
    const openBtns = document.querySelectorAll("#open-popup,.leave-msg");
    const closeBtns = document.querySelectorAll("#popup-close");
    const overlay = document.getElementById("popup-overlay");

    if (!openBtns || !overlay || !closeBtns) {
        return;
    }

    function openPopup() {
        // Сброс всех попапов в исходное состояние
        const allPopups = document.querySelectorAll('.popup, .popup__success');
        allPopups.forEach(popup => {
            if (popup.classList.contains('popup__success')) {
                popup.style.display = 'none';
            } else {
                popup.style.display = 'block';
            }
        });

        overlay.classList.add("active");
        document.body.classList.add("no-scroll");
    }

    function closePopup() {
        overlay.classList.remove("active");
        document.body.classList.remove("no-scroll");

        // Сбрасываем состояние попапов при закрытии
        const successPopup = document.querySelector('.popup__success');
        const mainPopup = document.querySelector('.popup');
        if (successPopup) successPopup.style.display = 'none';
        if (mainPopup) mainPopup.style.display = 'block';

        history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    openBtns.forEach((openBtn) => {
        openBtn.addEventListener("click", openPopup);
    });

    closeBtns.forEach((closeBtn) => {
        closeBtn.addEventListener("click", closePopup);
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });

    function checkHash() {
        if (window.location.hash === '#calculate') {
            openPopup();
        }
    }
    window.addEventListener('load', checkHash);

    window.addEventListener('hashchange', checkHash);
}
