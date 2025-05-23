document.addEventListener("DOMContentLoaded", () => {
  const navbarLinks = document.querySelector(".nav-actions");
  userRole = localStorage.getItem("userRole");
  if (!userRole) {
    // Not logged in
    navbarLinks.innerHTML = `
      <ul id="links" class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="./auth/Login.html">Login</a></li>
            <li><a href="./auth/signup.html">Register</a></li>
          </ul>
          <div class="nav-icons">
          </div>
          <button id="menu_nav" class="menu-toggle" aria-label="Toggle menu">
            <i class="fa fa-bars"></i>
          </button>
    `
  }
  else if (userRole === "admin") {
    navbarLinks.innerHTML = `
    <ul id="links" class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="./orders.html">Orders</a></li>
            <li><a href="../admin/admin.html">Dashboard</a></li>
          </ul>
          <div class="nav-icons">
            <a href="" class="icon-btn" title="Cart">
              <i class="fa fa-shopping-cart"></i>
            </a>
            <a href="./profile.html" class="icon-btn" title="Profile">
              <i class="fa-solid fa-circle-user"></i>
            </a>
            <a href="../auth/Login.html" id="logout" class="icon-btn" title="Logout">
              <i class="fa fa-sign-out-alt"></i>
            </a>
          </div>
          <button id="menu_nav" class="menu-toggle" aria-label="Toggle menu">
            <i class="fa fa-bars"></i>
          </button>
    `
  }
  else if (userRole === "seller") {
    navbarLinks.innerHTML = `
    <ul id="links" class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="./orders.html">Orders</a></li>
            <li><a href="../seller/seller.html">Dashboard</a></li>
          </ul>
          <div class="nav-icons">
            <a href="" class="icon-btn" title="Cart">
              <i class="fa fa-shopping-cart"></i>
            </a>
            <a href="./profile.html" class="icon-btn" title="Profile">
              <i class="fa-solid fa-circle-user"></i>
            </a>
            <a href="../auth/Login.html" id="logout" class="icon-btn" title="Logout">
              <i class="fa fa-sign-out-alt"></i>
            </a>
          </div>
          <button id="menu_nav" class="menu-toggle" aria-label="Toggle menu">
            <i class="fa fa-bars"></i>
          </button>
    `
  }
  else{
    navbarLinks.innerHTML = `
              <ul id="links" class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="./orders.html">Orders</a></li>
          </ul>
          <div class="nav-icons">
            <a href="" class="icon-btn" title="Cart">
              <i class="fa fa-shopping-cart"></i>
            </a>
            <a href="./profile.html" class="icon-btn" title="Profile">
              <i class="fa-solid fa-circle-user"></i>
            </a>
            <a href="../auth/Login.html" id="logout" class="icon-btn" title="Logout">
              <i class="fa fa-sign-out-alt"></i>
            </a>
          </div>
          <button id="menu_nav" class="menu-toggle" aria-label="Toggle menu">
            <i class="fa fa-bars"></i>
          </button>
    `
  }
  // Re-select dynamic #links and #menu_nav
  const list = document.getElementById("links");
  const btm_nav = document.getElementById("menu_nav");
  if (btm_nav && list) {
    // Toggle menu
    btm_nav.addEventListener("click", () => {
      list.classList.toggle("active");
      if (list.classList.contains("active") && window.innerWidth < 768) {
        list.style.marginTop = "-15px"
      }
    });
    // Click outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#menu_nav") && !e.target.closest("#links")) {
        list.classList.remove("active");
      }
    });
    // Responsive on resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        list.classList.remove("active");
      }
    });
    const logOutBtn = document.getElementById("logout")
  if (logOutBtn) {
    logOutBtn.addEventListener("click", () => {
      localStorage.removeItem("userId")
      localStorage.removeItem("userRole")
      window.location.reload()
    })
  }
  }
});
// منع الوصول للصفحة بدون تسجيل دخول
if (!localStorage.getItem("userId")) {
  // عرض رسالة باستخدام SweetAlert2
  Swal.fire({
    icon: 'warning',
    title: 'Access Denied',
    text: 'You must log in to access this page.',
    confirmButtonText: 'Ok'
  }).then(() => {
    // تحويل المستخدم لصفحة تسجيل الدخول
    window.location.href = '/';
  });
}

let currentCartId = null;
// Add this function to update the subtotal in the order summary
function updateSubtotal(totalPrice) {

  document.getElementById("subtotal-price").textContent = `${totalPrice.toFixed(2)} EGP`
  document.getElementById("total-price").textContent = `${totalPrice.toFixed(2)} EGP`
}

// Modify the fetchCart function to update the subtotal and connect the clear cart button

function fetchCart() {
  const userId = localStorage.getItem('userId');
  fetch(`http://localhost:3000/carts?userId=${userId}`)
    .then((res) => res.json())
    .then(async (carts) => {
      const container = document.getElementById("cart-container");

      if (!carts.length || !carts[0].cartProducts.length) {
        container.innerHTML = "<p>Your cart is empty.</p>";
      }

      const cart = carts[0];
      currentCartId = cart.id ? cart.id : null;
      const products = await fetch("http://localhost:3000/products").then((res) => res.json());

      let totalPrice = 0;
      container.innerHTML = "";
      // document.getElementById("order-summary").style.display = "block";

      cart.cartProducts.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return;

        const itemSubtotal = parseFloat(product.price) * item.quantity;
        totalPrice += itemSubtotal;

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
          
            <div class="product-image">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details">
              <h4 class="product-title">${product.name}</h4>
              <p class="product-category">${product.category || "No category"}</p>
            </div>
          </div>
          <div class="product-price">
            <span>${product.price} EGP</span>
          </div>
          <div class="product-quantity">
            <div class="quantity-control">
              <button class="quantity-btn minus-btn" onclick="updateQuantity('${product.id}', ${item.quantity - 1})" ${item.quantity === 1 ? "disabled" : ""}>-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn plus-btn" onclick="updateQuantity('${product.id}', ${item.quantity + 1})">+</button>
            </div>
          </div>
          <div class="product-subtotal">
            <span>${itemSubtotal.toFixed(2)} EGP</span>
          </div>
          <div class="product-actions">
            <button  class="remove-btn" onclick="removeProduct('${product.id}')">
              <i class="fa fa-trash"></i>
            </button>
        
        `;
        container.appendChild(itemDiv);
      });

      updateSubtotal(totalPrice);
      if(currentCartId){
        document.getElementById("checkout-btn").addEventListener("click", () => {
          localStorage.setItem("cartId", currentCartId);
          window.location.href = `../auth/checkout.html`;
        } );
      }
    })
    .catch((err) => console.error("Error fetching cart:", err));
}
function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1 || !currentCartId) return;

  fetch(`http://localhost:3000/carts/${currentCartId}`)
    .then((res) => res.json())
    .then((cart) => {
      const updatedCart = { ...cart };
      updatedCart.cartProducts = updatedCart.cartProducts.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );

      return fetch(`http://localhost:3000/carts/${currentCartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCart),
      });
    })
    .then(() => fetchCart())
    .catch((err) => console.error("Error updating quantity:", err));
}

function removeProduct(productId) {
  if (!currentCartId) return;

  fetch(`http://localhost:3000/carts/${currentCartId}`)
    .then((res) => res.json())
    .then((cart) => {
      const updatedCart = {
        ...cart,
        cartProducts: cart.cartProducts.filter((item) => item.productId !== productId),
      };

      return fetch(`http://localhost:3000/carts/${currentCartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCart),
      });
    })
    .then(() => fetchCart())
    .catch((err) => console.error("Error removing product:", err));
}
function clearCart() {
  if (!currentCartId) return;

  fetch(`http://localhost:3000/carts/${currentCartId}`, {
    method: "DELETE",
  })
    .then(() => fetchCart())
    .catch((err) => console.error("Error clearing cart:", err));
}
document.addEventListener("DOMContentLoaded", () => {
  fetchCart();

  const clearCartBtn = document.getElementById("clear-cart-btn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }
})