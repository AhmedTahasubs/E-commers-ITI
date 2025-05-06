const btm_nav = document.getElementById("menu_nav")
const list = document.getElementById("links")
btm_nav.addEventListener("click", () => {
  list.classList.toggle("active")
})
// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest("#menu_nav") && !e.target.closest("#links")) {
    list.classList.remove("active")
  }
})
// Adjust menu display on window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    list.classList.remove("active")
  }
})

// Add this function to update the subtotal in the order summary
function updateSubtotal(totalPrice) {
  document.getElementById("subtotal-price").textContent = `${totalPrice.toFixed(2)} EGP`
}

// Modify the fetchCart function to update the subtotal and connect the clear cart button
function fetchCart() {
  //const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage after login
  fetch(`http://localhost:3000/cart?userId=1`)
    .then((res) => res.json())
    .then(async (carts) => {
      const container = document.getElementById("cart-container")
      if (!carts.length) {
        container.innerHTML = "<p>Your cart is empty.</p>"
        document.getElementById("subtotal-price").textContent = "EGP 0.00"
        document.getElementById("total-price").textContent = "EGP 0.00"
        return
      }

      const cart = carts[0]
      const products = await fetch("http://localhost:3000/products").then((res) => res.json())

      let totalPrice = 0
      container.innerHTML = ""

      cart.cartProducts.forEach((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (product) {
          totalPrice += Number.parseFloat(product.price) * item.quantity

          const itemDiv = document.createElement("div")
          itemDiv.className = "cart-item"
          itemDiv.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="item-info">
                          <h4>${product.name}</h4>
                          <p>Price: ${product.price} EGP</p>
                          <p>Quantity: ${item.quantity}</p>
                          <p>Subtotal: ${product.price * item.quantity} EGP</p>
                        </div>
                        <div class="item-actions">
                          <button onclick="updateQuantity('${cart.id}', '${product.id}', ${item.quantity - 1})" ${item.quantity === 1 ? "disabled" : ""}>-</button>
                          <span>${item.quantity}</span>
                          <button onclick="updateQuantity('${cart.id}', '${product.id}', ${item.quantity + 1})">+</button>
                          <button onclick="removeProduct('${cart.id}', '${product.id}')"><i class="fa fa-trash"></i></button>
                        </div>
                    `
          container.appendChild(itemDiv)
        }
      })

      updateSubtotal(totalPrice)
      document.getElementById("total-price").textContent = `${totalPrice.toFixed(2)} EGP`
    })
    .catch((err) => console.error("Error:", err))
}

function updateQuantity(cartId, productId, newQuantity) {
  fetch(`http://localhost:3000/cart/${cartId}`)
    .then((res) => res.json())
    .then((cart) => {
      const updatedCart = { ...cart }
      updatedCart.cartProducts = updatedCart.cartProducts
        .map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item))
        .filter((item) => item.quantity > 0)

      updatedCart.totalItems = updatedCart.cartProducts.reduce((sum, item) => sum + item.quantity, 0)
      updatedCart.totalPrice = updatedCart.cartProducts.reduce(
        (sum, item) => sum + item.quantity * Number.parseFloat(item.price),
        0,
      )

      return fetch(`http://localhost:3000/cart/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCart),
      })
    })
    .then(() => fetchCart()) // Reload the cart after updating
    .catch((err) => console.error("Update error:", err))
}

function removeProduct(cartId, productId) {
  fetch(`http://localhost:3000/cart/${cartId}`)
    .then((res) => res.json())
    .then((cart) => {
      const updatedCart = {
        ...cart,
        cartProducts: cart.cartProducts.filter((item) => item.productId !== productId),
      }
      updatedCart.totalItems = updatedCart.cartProducts.reduce((sum, item) => sum + item.quantity, 0)

      return fetch(`http://localhost:3000/cart/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCart),
      })
    })
    .then(() => fetchCart()) // Reload the cart after removal
    .catch((err) => console.error("Remove error:", err))
}

function clearCart() {
  //const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage after login
  fetch(`http://localhost:3000/cart?userId=1`)
    .then((res) => res.json())
    .then((carts) => {
      if (carts.length) {
        const cartId = carts[0].id
        return fetch(`http://localhost:3000/cart/${cartId}`, { method: "DELETE" })
      }
    })
    .then(() => fetchCart()) // Reload the cart after clearing
    .catch((err) => console.error("Clear error:", err))
}

// Connect the clear cart button
document.addEventListener("DOMContentLoaded", () => {
  fetchCart()

  // Add event listener to the clear cart button
  const clearCartBtn = document.getElementById("clear-cart-btn")
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart)
  }
})

// container = ''
// container+=`
//             <div class="cart-item">
//               <div class="product-image">
//                 <img src="https://i.imgur.com/JFHjdNr.jpg" alt="Fresh Organic Apples">
//               </div>
//               <div class="product-details">
//                 <h4 class="product-title">Fresh Organic Apples</h4>
//                 <p class="product-category">Fruits & Vegetables</p>
//                 <div class="product-meta">
//                   <span class="product-unit">1kg pack</span>
//                   <span class="product-stock">In Stock</span>
//                 </div>
//               </div>
//               <div class="product-price">
//                 <span>EGP 35.99</span>
//               </div>
//               <div class="product-quantity">
//                 <div class="quantity-control">
//                   <button class="quantity-btn minus-btn">-</button>
//                   <span class="quantity-value">2</span>
//                   <button class="quantity-btn plus-btn">+</button>
//                 </div>
//               </div>
//               <div class="product-subtotal">
//                 <span>EGP 71.98</span>
//               </div>
//               <div class="product-actions">
//                 <button class="remove-btn">
//                   <i class="fa fa-trash"></i>
//                 </button>
//               </div>
//             </div>
//             `