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
              <li><a href="/" class="active">Orders</a></li>
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
    else{
      navbarLinks.innerHTML = `
                <ul id="links" class="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="">Orders</a></li>
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
  });