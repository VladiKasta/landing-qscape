const modal = document.getElementById('cookiesModal');
const acceptBtn = document.getElementById('cookiesAccept');
const closeBtn = document.getElementById('cookiesClose');

function checkCookies() {
    // Получаем значение cookie
    const cookies = document.cookie.split(';');
    let cookiesAccepted = null;

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('cookiesAccepted=')) {
            cookiesAccepted = cookie.substring('cookiesAccepted='.length);
            break;
        }
    }

    // Показываем модальное окно только если cookie нет или значение false
    if (cookiesAccepted === 'true') {
        modal.classList.remove('show');
    } else {
        modal.classList.add('show');
    }
}

acceptBtn.addEventListener('click', function() {
    document.cookie = "cookiesAccepted=true; max-age=2592000; path=/";
    modal.classList.remove('show');
});

closeBtn.addEventListener('click', function() {
    // Устанавливаем значение false или удаляем cookie
    document.cookie = "cookiesAccepted=false; max-age=0; path=/"; // Удаляем cookie
    // Или альтернативно: document.cookie = "cookiesAccepted=false; path=/";
    modal.classList.remove('show');
});

checkCookies();