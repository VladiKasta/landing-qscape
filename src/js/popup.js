export default function popupTrigger() {
    const openBtns = document.querySelectorAll("[data-popup-type], .leave-msg");
    const closeBtns = document.querySelectorAll("#popup-close");
    const overlays = document.querySelectorAll(".popup-overlay");

    if (!openBtns.length || !overlays.length || !closeBtns.length) {
        console.error('Popup elements not found');
        return;
    }

    function openPopup(popupType) {
        // Скрыть все overlays
        overlays.forEach(overlay => {
            overlay.classList.remove("active");
        });

        // Показать нужный overlay
        const targetOverlay = document.getElementById(`popup-overlay-${popupType}`);
        if (targetOverlay) {
            // Сброс всех попапов внутри этого overlay
            const allPopups = targetOverlay.querySelectorAll('.popup, .popup__success');
            allPopups.forEach(popup => {
                if (popup.classList.contains('popup__success')) {
                    popup.style.display = 'none';
                } else {
                    popup.style.display = 'block';
                }
            });

            targetOverlay.classList.add("active");
            document.body.classList.add("no-scroll");
            console.log(`Opened popup: ${popupType}`);
        } else {
            console.error(`Popup overlay not found: popup-overlay-${popupType}`);
        }
    }

    function closePopup() {
        overlays.forEach(overlay => {
            overlay.classList.remove("active");
        });
        document.body.classList.remove("no-scroll");

        history.pushState("", document.title, window.location.pathname + window.location.search);
    }

    openBtns.forEach((openBtn) => {
        openBtn.addEventListener("click", function(e) {
            e.preventDefault();
            const popupType = this.dataset.popupType;
            if (popupType) {
                openPopup(popupType);
            } else {
                console.error('No data-popup-type attribute found');
            }
        });
    });

    closeBtns.forEach((closeBtn) => {
        closeBtn.addEventListener("click", closePopup);
    });

    overlays.forEach((overlay) => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closePopup();
            }
        });
    });

    function checkHash() {
        if (window.location.hash === '#calculate') {
            openPopup('calculate');
        }
    }
    window.addEventListener('load', checkHash);
    window.addEventListener('hashchange', checkHash);
}