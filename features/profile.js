document.addEventListener("DOMContentLoaded", () => {
  // ----------- Navbar dynamic links ----------- //
  const navbarLinks = document.querySelector(".nav-actions");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  if (!userRole) {
    navbarLinks.innerHTML = `
      <ul id="links" class="nav-links">
        <li><a href="../index.html" class="active">Home</a></li>
        <li><a href="../auth/Login.html">Login</a></li>
        <li><a href="../auth/signup.html">Register</a></li>
      </ul>
      <div class="nav-icons"></div>
      <button id="menu_nav" class="menu-toggle" aria-label="Toggle menu">
        <i class="fa fa-bars"></i>
      </button>
    `;
  } else if (userRole === "admin") {
    navbarLinks.innerHTML = `
      <ul id="links" class="nav-links">
        <li><a href="../index.html" >Home</a></li>
        <li><a href="./orders.html">Orders</a></li>
        <li><a href="../admin/admin.html">Dashboard</a></li>
      </ul>
      <div class="nav-icons">
        <a href="./cart.html" class="icon-btn" title="Cart">
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
    `;
  } else if (userRole === "seller") {
    navbarLinks.innerHTML = `
      <ul id="links" class="nav-links">
        <li><a href="../index.html" >Home</a></li>
        <li><a href="./orders.html">Orders</a></li>
        <li><a href="../seller/seller.html">Dashboard</a></li>
      </ul>
      <div class="nav-icons">
        <a href="./cart.html" class="icon-btn" title="Cart">
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
    `;
  } else {
    navbarLinks.innerHTML = `
      <ul id="links" class="nav-links">
        <li><a href="../index.html" >Home</a></li>
        <li><a href="./orders.html">Orders</a></li>
      </ul>
      <div class="nav-icons">
        <a href="./cart.html" class="icon-btn" title="Cart">
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
    `;
  }

  // Menu toggle
  const list = document.getElementById("links");
  const btm_nav = document.getElementById("menu_nav");
  if (btm_nav && list) {
    btm_nav.addEventListener("click", () => {
      list.classList.toggle("active");
      if (list.classList.contains("active") && window.innerWidth < 768) {
        list.style.marginTop = "-15px";
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#menu_nav") && !e.target.closest("#links")) {
        list.classList.remove("active");
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        list.classList.remove("active");
      }
    });

    const logOutBtn = document.getElementById("logout");
    if (logOutBtn) {
      logOutBtn.addEventListener("click", () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        window.location.reload();
      });
    }
  }

  // ----------- Profile Section ----------- //
  if (userId) {
    fetch(`http://localhost:3000/users/${userId}`)
      .then(res => res.json())
      .then(user => {
        const formHTML = `
          <section class="profile-container">
            <h2>My Profile</h2>
            <form id="profileForm">
              <label>
                Name:
                <input type="text" id="name" value="${user.name}" required />
              </label>
              <label>
                Email:
                <input type="email" id="email" value="${user.email}" required />
              </label>
              <label>
                Phone:
                <input type="tel" id="phone" value="${user.phone}" required />
              </label>
              <label>
                password:
                <input type="password" id="password" placeholder="Leave blank to keep current" />
              </label>
              <button type="submit">Save Changes</button>
            </form>
            <p id="updateStatus" style="color: green; margin-top: 10px;"></p>
          </section>
        `;
        document.querySelector(".navbar").insertAdjacentHTML("afterend", formHTML);


        const form = document.getElementById("profileForm");
        const status = document.getElementById("updateStatus");

        form.addEventListener("submit", (e) => {
          e.preventDefault();

          const updatedUser = {
            ...user,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
          };

          const newPassword = document.getElementById("password").value.trim();
          if (newPassword) {
            updatedUser.password = newPassword;
          }

          fetch(`http://localhost:3000/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser)
          })
            .then(res => res.json())
            .then(() => {
              status.style.color = "green";
              status.textContent = "Profile updated successfully!";
              form.reset(); // يمسح الباسورد
            })
            .catch(err => {
              status.style.color = "red";
              status.textContent = "Failed to update profile.";
              console.error(err);
            });
        });

      });
  }
});
