
// Toggle menu visibility on button click
const btm_nav = document.getElementById('menu_nav');
const list = document.getElementById('links');

btm_nav.addEventListener('click', function () {
    if (list.style.display === 'none' || list.style.display === '') {
        list.style.display = 'flex';
    } else {
        list.style.display = 'none';
    }
});

// Fetch products and display them
fetch('http://localhost:3000/products')
    .then(res => res.json())
    .then(products => {
        const container = document.querySelector('.products');
        container.innerHTML = '';

        products.forEach(product => {
            if (product.status !== 'approved') return;

            const card = document.createElement('div');
            card.className = 'cardd';
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="actions">
                    <i class="fas fa-shopping-cart"></i>
                    <i class="fas fa-eye" data-id="${product.id}"></i>
                </div>
                <div class="category">${product.category}</div>
                <div class="title">${product.name}</div>
                <div class="price">${product.price} EGP</div>
                <div class="rating"><i class="fas fa-star"></i> 4.8</div>
            `;
            container.appendChild(card);

            // Add to cart functionality
            card.querySelector('.fa-shopping-cart').addEventListener('click', () => {
                const userId = 1;
                fetch(`http://localhost:3000/cart?userId=${userId}`)
                    .then(res => res.json())
                    .then(data => {
                        let userCart = data[0];
                        if (!userCart) {
                            userCart = {
                                userId,
                                id: Date.now(),
                                totalPrice: parseFloat(product.price),
                                totalItems: 1,
                                cartProducts: [{ productId: product.id, quantity: 1 }]
                            };
                            fetch('http://localhost:3000/cart', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(userCart)
                            });
                        } else {
                            const existingProduct = userCart.cartProducts.find(p => p.productId === product.id);
                            if (existingProduct) {
                                existingProduct.quantity += 1;
                            } else {
                                userCart.cartProducts.push({ productId: product.id, quantity: 1 });
                            }
                            userCart.totalItems += 1;
                            userCart.totalPrice += parseFloat(product.price);

                            fetch(`http://localhost:3000/cart/${userCart.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(userCart)
                            });
                        }
                        alert('Product added to cart!');
                    });
            });

            // View product details functionality
            card.querySelector('.fa-eye').addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                window.location.href = `features/product.html?id=${productId}`;
            });
        });
    })
    .catch(error => console.error('Error loading products:', error));