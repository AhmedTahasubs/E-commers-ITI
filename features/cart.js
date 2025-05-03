const btm_nav = document.getElementById('menu_nav');
const list = document.getElementById('links');

btm_nav.addEventListener('click', function () {
    if (list.style.display === 'none' || list.style.display === '') {
        list.style.display = 'flex';
    } else {
        list.style.display = 'none';
    }
});

const userId = 1; 

function fetchCart() {
    fetch(`http://localhost:3000/cart?userId=${userId}`)
        .then(res => res.json())
        .then(async (carts) => {
            if (!carts.length) {
                document.getElementById('cart-container').innerHTML = '<p>Your cart is empty.</p>';
                return;
            }

            const cart = carts[0];
            const productsResponse = await fetch('http://localhost:3000/products');
            const products = await productsResponse.json();

            let totalPrice = 0;
            const container = document.getElementById('cart-container');
            container.innerHTML = '';

            cart.cartProducts.forEach(item => {
                const product = products.find(p => Number(p.id) === Number(item.productId));
                if (product) {
                    totalPrice += product.price * item.quantity;

                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'cart-item';
                    itemDiv.innerHTML = `
            <img src="${product.image[0]}" alt="${product.name}">
            <div class="item-info">
              <h4>${product.name}</h4>
              <p>Price: ${product.price} EGP</p>
              <p>Quantity: ${item.quantity}</p>
              <p>Subtotal: ${product.price * item.quantity} EGP</p>
            </div>
            <div class="item-actions">
              <button onclick="updateQuantity('${cart.id}', ${product.id}, ${item.quantity - 1})" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
              <button onclick="updateQuantity('${cart.id}', ${product.id}, ${item.quantity + 1})">+</button>
              <button onclick="removeProduct('${cart.id}', ${product.id})">Remove</button>
            </div>
          `;
                    container.appendChild(itemDiv);
                }
            });

           
            const clearCartButton = document.createElement('button');
            clearCartButton.textContent = 'Clear Cart';
            clearCartButton.onclick = clearCart;
            container.appendChild(clearCartButton);

            document.getElementById('total-price').textContent = `${totalPrice.toFixed(2)} EGP`;
        })
        .catch(err => console.error('Error:', err));
}

function updateQuantity(cartId, productId, newQuantity) {
    fetch(`http://localhost:3000/cart/${cartId}`)
        .then(res => res.json())
        .then(cart => {
            const updatedCart = { ...cart };
            updatedCart.cartProducts = updatedCart.cartProducts.map(item => {
                if (item.productId === productId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0);

            updatedCart.totalItems = updatedCart.cartProducts.reduce((sum, item) => sum + item.quantity, 0);

            return fetch(`http://localhost:3000/cart/${cartId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCart)
            });
        })
        .then(() => fetchCart())
        .catch(err => console.error('Update error:', err));
}


function removeProduct(cartId, productId) {
    fetch(`http://localhost:3000/cart/${cartId}`)
        .then(res => res.json())
        .then(cart => {
            const updatedCart = { ...cart };
            updatedCart.cartProducts = updatedCart.cartProducts.filter(item => item.productId !== productId);

            updatedCart.totalItems = updatedCart.cartProducts.reduce((sum, item) => sum + item.quantity, 0);

            return fetch(`http://localhost:3000/cart/${cartId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCart)
            });
        })
        .then(() => fetchCart())
        .catch(err => console.error('Remove error:', err));
}


function clearCart() {
    fetch(`http://localhost:3000/cart?userId=${userId}`)
        .then(res => res.json())
        .then(carts => {
            if (carts.length) {
                const cartId = carts[0].id; 
                return fetch(`http://localhost:3000/cart/${cartId}`, {
                    method: 'DELETE' 
                });
            }
        })
        .then(() => fetchCart()) 
        .catch(err => console.error('Clear error:', err));
}

document.addEventListener('DOMContentLoaded', fetchCart);
