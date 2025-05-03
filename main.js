
const btm_nav = document.getElementById('menu_nav');
const list = document.getElementById('links');

btm_nav.addEventListener('click', function () {
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

             // زر إضافة للعربة
        card.querySelector('.fa-shopping-cart').addEventListener('click', () => {
            const userId = 1; // المستخدم الحالي
            fetch(`http://localhost:3000/cart?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    let userCart = data[0];
                    if (!userCart) {
                        // لو المستخدم معندوش كارت، نعمله كارت جديد
                        userCart = {
                            userId,
                            cartId: Date.now(),
                            totalPrice: product.price,
                            totalItems: 1,
                            cartProducts: [{ productId: product.id, quantity: 1 }]
                        };
                        fetch('http://localhost:3000/cart', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(userCart)
                        });
                    } else {
                        // لو عنده كارت، نشوف إذا المنتج موجود ولا نضيفه
                        const existingProduct = userCart.cartProducts.find(p => p.productId === product.id);
                        if (existingProduct) {
                            existingProduct.quantity += 1;
                        } else {
                            userCart.cartProducts.push({ productId: product.id, quantity: 1 });
                        }
                        // تحديث العدد والسعر
                        userCart.totalItems += 1;
                        userCart.totalPrice += product.price;

                        fetch(`http://localhost:3000/cart/${userCart.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(userCart)
                        });
                    }
                    alert('Product added to cart!');
                });
        });

        });

        document.querySelectorAll('.fa-eye').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                window.location.href = `features/product.html?id=${productId}`;
            });
        });

    }).catch(error => console.error('Error loading products: ', error));

