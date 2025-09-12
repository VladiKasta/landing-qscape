const modal = document.getElementById('cookiesModal');
const acceptDtn = document.getElementById('cookiesAccept');
const closeBtn = document.getElementById('cookiesClose');

function checkCookies() {
    if (document.cookie.includes('cookiesAccepted=')) {
        modal.classList.remove('show');
    } else {
        modal.classList.add('show');
    }
}

acceptDtn.addEventListener('click', function() {
    document.cookie = "cookiesAccepted=true; max-age=2592000; path=/";
    modal.classList.remove('show');
});

closeBtn.addEventListener('click', function() {
    document.cookie = "cookiesAccepted=false; max-age=2592000; path=/";
    modal.classList.remove('show');
});

checkCookies();