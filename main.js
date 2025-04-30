
const btm_nav = document.getElementById('menu_nav');
const list = document.getElementById('links');

btm_nav.addEventListener('click', function() {
    list.classList.toggle
    if (list.style.display === 'none' || list.style.display === '') {
        list.style.display = 'flex'; 
    } else {
        list.style.display = 'none'; 
    }
});