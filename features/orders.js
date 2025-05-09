document.addEventListener("DOMContentLoaded", () => {

  const navbarLinks = document.querySelector(".nav-actions");
  userRole = localStorage.getItem("userRole");
  if (!userRole) {
    // Not logged in
    navbarLinks.innerHTML = `
        <ul id="links" class="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="../auth/Login.html">Login</a></li>
              <li><a href="../auth/signup.html">Register</a></li>
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
              <li><a href="" class="active">Orders</a></li>
              <li><a href="../admin/admin.html">Dashboard</a></li>
            </ul>
            <div class="nav-icons">
              <a href="./cart.html" class="icon-btn" title="Cart">
                <i class="fa fa-shopping-cart"></i>
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
              <li><a href="" class="active">Orders</a></li>
              <li><a href="../seller/seller.html">Dashboard</a></li>
            </ul>
            <div class="nav-icons">
              <a href="./cart.html" class="icon-btn" title="Cart">
                <i class="fa fa-shopping-cart"></i>
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
  else {
    navbarLinks.innerHTML = `
                <ul id="links" class="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="" class="active">Orders</a></li>
            </ul>
            <div class="nav-icons">
              <a href="./cart.html" class="icon-btn" title="Cart">
                <i class="fa fa-shopping-cart"></i>
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
  const ordersList = document.querySelector(".orders-list");
  const userId = localStorage.getItem("userId");

  function getStatusClass(status) {
    return {
      delivered: "delivered",
      shipped: "shipped"
    }[status] || "";
  }

  function getStatusIcon(status) {
    return {
      delivered: "fa-check-circle",
      shipped: "fa-question-circle"
    }[status] || "fa-xmark-circle";
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  fetch(`http://localhost:3000/orders?userId=${userId}`)
    .then(res => res.json())
    .then(orders => {
      if (orders.length === 0) {
        ordersList.innerHTML = "<p>No orders found.</p>";
        return;
      }

      orders.forEach(order => {
        const date = new Date(order.createdAt).toDateString();
        const statusClass = getStatusClass(order.status);
        const itemsCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

        // جلب بيانات المنتجات لكل عنصر داخل الطلب
        Promise.all(order.items.map(item =>
          fetch(`http://localhost:3000/products/${item.productId}`)
            .then(res => res.json())
            .then(product => ({
              ...item,
              name: product.name,
              image: product.image
            }))
        )).then(fullItems => {
          const orderHTML = `
              <div class="order-card">
                <div class="order-header">
                  <div class="order-info">
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-date">${date}</span>
                  </div>
                  <div class="order-status ${statusClass}">
                    <i class="fas ${getStatusIcon(order.status)}"></i> ${capitalize(order.status)}
                  </div>
                </div>
    
                <div class="order-details">
                  <div class="order-items">
                    <h3>Items (${itemsCount})</h3>
                    ${fullItems.map(item => `
                      <div class="item">
                        <div class="item-image">
                          <img src="${item.image || '/placeholder.svg?height=60&width=60'}" alt="${item.name}">
                        </div>
                        <div class="item-details">
                          <h4>${item.name}</h4>
                          <p>Quantity × ${item.quantity}</p>
                        </div>
                      </div>
                    `).join("")}
                  </div>
    
                  <div class="order-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-row"><span>Total</span><span>${order.totalPrice} EGP</span></div>
    
                    <div class="delivery-info">
                      <h4><i class="fas fa-map-marker-alt"></i> Delivery Address</h4>
                      <p>${order.address}, ${order.city}</p>
                    </div>
    
                    <div class="payment-info">
                      <h4><i class="fas fa-credit-card"></i> Payment Method</h4>
                      <p>${order.paymentMethod}</p>
                    </div>
    
                    <span class="reorder-status ${order.paid ? 'paid' : 'unpaid'}">
                        ${order.paid ? 'Paid' : 'Unpaid'}
                      </span>
                  </div>
                </div>
              </div>
            `;
          ordersList.innerHTML += orderHTML;
        });
      });
    });

});