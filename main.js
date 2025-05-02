
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

fetch('http://localhost:3000/products')
    .then(res => res.json())
    .then(products => {
        const container = document.querySelector('.products')
        container.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div')
            card.className = 'card'
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="actions">
                <i class="fas fa-shopping-cart"></i>
                <i class="fas fa-eye" data-id="${product.id}"></i> 
                </div>
                <div class="category">${product.category}</div>
                <div class="title">${product.name}</div>
                 <div class="price">${product.price} EGP</div> 
                <div class="rating">
                 <i class="fas fa-star"></i>
                  4.8         
                  </div> 
                  `;
                  container.appendChild(card) 
            }) ;
            document.querySelectorAll('.fa-eye').forEach(icon => {
                icon.addEventListener('click', (e) => {
                  const productId = e.target.getAttribute('data-id');
                  window.location.href = `features/product.html?id=${productId}`;
                });
              });

    }).catch(error=> console.error('Error loading products: ', error));

