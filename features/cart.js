function fetchCart() {
    fetch(`http://localhost:3000/cart?userId=${userId}`)
        .then(res => res.json())
        .then(async (carts) => {
            const container = document.getElementById('cart-container');
            if (!carts.length) {
                container.innerHTML = '<p>Your cart is empty.</p>';
                return;
            }

            const cart = carts[0];
            const products = await fetch('http://localhost:3000/products').then(res => res.json());

            let totalPrice = 0;
            container.innerHTML = '';

            cart.cartProducts.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    totalPrice += parseFloat(product.price) * item.quantity;

                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'cart-item';
                    itemDiv.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="item-info">
                          <h4>${product.name}</h4>
                          <p>Price: ${product.price} EGP</p>
                          <p>Quantity: ${item.quantity}</p>
                          <p>Subtotal: ${product.price * item.quantity} EGP</p>
                        </div>
                        <div class="item-actions">
                          <button onclick="updateQuantity('${cart.id}', '${product.id}', ${item.quantity - 1})" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                          <button onclick="updateQuantity('${cart.id}', '${product.id}', ${item.quantity + 1})">+</button>
                          <button onclick="removeProduct('${cart.id}', '${product.id}')">Remove</button>
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
            updatedCart.cartProducts = updatedCart.cartProducts.map(item =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            ).filter(item => item.quantity > 0);

            updatedCart.totalItems = updatedCart.cartProducts.reduce((sum, item) => sum + item.quantity, 0);
            updatedCart.totalPrice = updatedCart.cartProducts.reduce((sum, item) => sum + (item.quantity * parseFloat(item.price)), 0);

            return fetch(`http://localhost:3000/cart/${cartId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCart)
            });
        })
        .then(() => fetchCart())  // Reload the cart after updating
        .catch(err => console.error('Update error:', err));
}

function removeProduct(cartId, productId) {
    fetch(`http://localhost:3000/cart/${cartId}`)
        .then(res => res.json())
        .then(cart => {
            const updatedCart = {
                ...cart,
                cartProducts: cart.cartProducts.filter(item => item.productId !== productId)
            };
            updatedCart.totalItems = updatedCart.cartProducts.reduce((sum, item) => sum + item.quantity, 0);

            return fetch(`http://localhost:3000/cart/${cartId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCart)
            });
        })
        .then(() => fetchCart())  // Reload the cart after removal
        .catch(err => console.error('Remove error:', err));
}

function clearCart() {
    fetch(`http://localhost:3000/cart?userId=${userId}`)
        .then(res => res.json())
        .then(carts => {
            if (carts.length) {
                const cartId = carts[0].id;
                return fetch(`http://localhost:3000/cart/${cartId}`, { method: 'DELETE' });
            }
        })
        .then(() => fetchCart())  // Reload the cart after clearing
        .catch(err => console.error('Clear error:', err));
}

document.addEventListener('DOMContentLoaded', fetchCart);
