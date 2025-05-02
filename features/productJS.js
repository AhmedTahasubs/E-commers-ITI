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
    
});
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

fetch(`http://localhost:3000/products/${productId}`)
  .then(res => res.json())
  .then(product => {
    document.getElementById('mainImg').src = product.image;
    document.querySelector('.info h2').textContent = product.name;
    document.querySelector('.info .price').textContent = `${product.price} EGP`;
    document.querySelector('.info .rating').textContent = `★★★★☆ ${product.rating || 4.8}`;
    // document.querySelector('.details').innerHTML = `
    //   <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
    //   <p><strong>Category:</strong> ${product.category || 'General'}</p>
    //   <p><strong>Quantity:</strong> ${product.quantity || 0}</p>
    //   <p><strong>Material:</strong> ${product.material || 'Unknown'}</p>
    //   <p><strong>Colour:</strong> ${product.color || 'Multicolour'}</p>
    //   <p><strong>Department:</strong> ${product.department || 'N/A'}</p>
    // `;
  })
  .catch(error => {
    console.error('Error loading product:', error);
    document.querySelector('.product-container').innerHTML = '<h2>Product not found</h2>';
  });

  fetch('http://localhost:3000/products')
    .then(res => res.json())
    .then(products => {
        const container = document.querySelector('.products')
        container.innerHTML='';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className='card'
            card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="actions">
            <i class="fas fa-shopping-cart"></i>
            <i class="fas fa-eye" data-id="${product.id}"></i> 
            </div>
            <div class="category">General</div>
            <div class="title">${product.name}</div>
             <div class="price">${product.price} EGP</div> 
            <div class="rating">
             <i class="fas fa-star"></i>
              4.8         
              </div> 
              `;
              container.appendChild(card) 
            
        });
        document.querySelectorAll('.fa-eye').forEach(icon => {
            icon.addEventListener('click', (e) => {
              const productId = e.target.getAttribute('data-id');
              window.location.href = `product.html?id=${productId}`;
            });
          });


    }).catch(error=> console.error('Error loading products: ', error));
