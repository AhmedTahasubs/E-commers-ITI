document.addEventListener("DOMContentLoaded", function () {
    const btm_nav = document.getElementById('menu_nav');
    const list = document.getElementById('links');

    btm_nav.addEventListener('click', function () {
        list.classList.toggle
        if (list.style.display === 'none' || list.style.display === '') {
            list.style.display = 'flex';
        } else {
            list.style.display = 'none';
        }
    });
    const thumbnails = document.querySelectorAll(".thumbnails img");
    const mainImage = document.getElementById("mainImg");

    thumbnails.forEach((thumb) => {
        thumb.addEventListener("click", function () {
            const newSrc = this.src;
            mainImage.src = newSrc;

            thumbnails.forEach((img) => img.style.border = "2px solid transparent");
            this.style.border = "2px solid var(--main-green-color)";
        });
    });
});