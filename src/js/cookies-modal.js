/*document.addEventListener('DOMContentLoaded',  () => {
    const modal = document.getElementById('cookiesModal');
    const acceptDtn = document.getElementById('cookiesAccept');
    const closeBtn = document.getElementById('cookiesClose');

    if (localStorage.getItem('cookiesAccepted')) {
        modal.style.display = 'none';
        return;
    }

    const acceptCookies = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        modal.style.display = 'none';
    };

    acceptBtn.addEventListener('click', acceptCookies);
    closeBtn.addEventListener('click', () => modal.style.display = 'none');

    setTimeout(() => {
        if (!localStorage.getItem('cookiesAccepted')) {
            modal.style.display = 'none'
        }
    }, 10000)
})*/