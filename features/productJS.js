document.addEventListener("DOMContentLoaded", function () {
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
            <li><a href="./orders.html">Orders</a></li>
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
            <li><a href="./orders.html">Orders</a></li>
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
            <li><a href="./orders.html">Orders</a></li>
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
 // Handle the Add to Cart button click
 const addToCartBtn = document.getElementById('add-to-cart');
 if (addToCartBtn) {
   addToCartBtn.addEventListener('click', () => {
       const userId = localStorage.getItem('userId');
       if (!userId) {
           Swal.fire({
               icon: 'warning',
               title: 'Please log in first!',
               confirmButtonText: 'Ok'
           }).then();
           return;
       }

       // Get the productId from the URL
       const urlParams = new URLSearchParams(window.location.search);
       const productId = urlParams.get('id');

       fetch(`http://localhost:3000/carts?userId=${userId}`)
           .then(res => res.json())
           .then(carts => {
               // Now, fetch the product after getting the carts
               return fetch(`http://localhost:3000/products/${productId}`).then(res => res.json())
                   .then(product => {
                       let cart;
                       if (!carts.length) {
                           // If no cart exists, create one
                           cart = {
                               userId,
                               cartProducts: [{ productId: product.id, quantity: 1 }]
                           };
                           return fetch('http://localhost:3000/carts', {
                               method: 'POST',
                               headers: { 'Content-Type': 'application/json' },
                               body: JSON.stringify(cart)
                           });
                       } else {
                           // If cart exists, update it
                           cart = carts[0];
                           const existingProduct = cart.cartProducts.find(p => p.productId === product.id);
                           if (existingProduct) {
                               existingProduct.quantity += 1;
                           } else {
                               cart.cartProducts.push({ productId: product.id, quantity: 1 });
                           }

                           return fetch(`http://localhost:3000/carts/${cart.id}`, {
                               method: 'PUT',
                               headers: { 'Content-Type': 'application/json' },
                               body: JSON.stringify(cart)
                           });
                       }
                   });
           })
           .then(() => {
               Swal.fire({
                   icon: 'success',
                   title: 'Added to cart!',
                   showConfirmButton: false,
                   timer: 1500
               });
           })
           .catch(err => {
               console.error('Error adding to cart:', err);
               Swal.fire('Error', 'Something went wrong.', 'error');
           });
   });
 }

 // Get productId from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// عناصر الصفحة
const productTitle = document.getElementById('product-title');
const productRating = document.querySelector('.product-rating span');
const productPrice = document.querySelector('.current-price');
const productMainImage = document.getElementById('mainImg');
const productDescription = document.querySelector('.product-description p');
const productCategory = document.querySelector('.detail-row:nth-child(1) .detail-value');


fetch(`http://localhost:3000/products/${productId}`)
 .then(res => {
   if (!res.ok) throw new Error('Product not found');
   return res.json();
 })
 .then(product => {
   if (product.status !== "approved") {
     document.querySelector('.product-container').innerHTML = '<h2>This product is not approved for display</h2>';
     return;
   }

   // تحديث بيانات المنتج
   productMainImage.src = product.image;
   productTitle.textContent = product.name;
   productRating.textContent = `${product.rating || 4.5} (${product.reviews || 100} reviews)`;
   productPrice.textContent = `${product.price} EGP`;
   productDescription.textContent = product.description || 'No description provided';

   productCategory.textContent = product.category || 'General';

   // يمكنك تحديث تفاصيل إضافية لو احتجت، مثل الأبعاد أو الوزن...

 })
 .catch(error => {
   console.error('Error loading product:', error);
   document.querySelector('.product-container').innerHTML = '<h2>Product not found</h2>';
 });


 // Load related products
 fetch('http://localhost:3000/products')
   .then(res => res.json())
   .then(products => {
       const container = document.querySelector('div.products');        
       container.innerHTML = ''; // Clear the container before appending new items

       products.forEach(product => {
           // Only display approved products
           if (product.status === "approved") {
               const card = document.createElement('div');
               card.className = 'cardd';
               card.innerHTML = `
                   <div class="card-image-wrapper">
                           <img src="${product.image}" alt="${product.name}">
                       </div>
                       <div class="card-content">
                           <div class="category">${product.category}</div>
                           <div class="title">${product.name}</div>
                           <div class="price">${product.price} EGP</div>
                           <div class="rating"><i class="fas fa-star"></i> 4.8</div>
                           <div class="actions">
                           <button class="action-btn cart-btn"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                           <button class="action-btn view" data-id="${product.id}"><i class="fas fa-eye"></i> View</button>
                           </div>
                       </div>
               `;
               container.appendChild(card);

               //   لزر إضافة السلة
               card.querySelector(".cart-btn").addEventListener("click", () => {
                   const userId = localStorage.getItem('userId');
                   if (!userId) {
                       Swal.fire({
                           icon: 'warning',
                           title: 'Login Required',
                           text: 'Please log in first!',
                           confirmButtonText: 'OK'
                       });
                   } else {
                       fetch(`http://localhost:3000/carts?userId=${userId}`)
                           .then((res) => res.json())
                           .then((data) => {
                               let userCart = data[0];

                               if (!userCart) {
                                   const newCart = {
                                       userId,
                                       totalPrice: parseFloat(product.price),
                                       totalItems: 1,
                                       cartProducts: [{ productId: product.id, quantity: 1 }],
                                   };

                                   fetch("http://localhost:3000/carts", {
                                       method: "POST",
                                       headers: { "Content-Type": "application/json" },
                                       body: JSON.stringify(newCart),
                                   })
                                   .then((res) => res.json())
                                   .then(() => alert("Product added to cart!"))
                                   .catch((err) => console.error("Error creating cart:", err));
                               } else {
                                   const existingProduct = userCart.cartProducts.find(
                                       (p) => p.productId === product.id
                                   );

                                   if (existingProduct) {
                                       existingProduct.quantity += 1;
                                   } else {
                                       userCart.cartProducts.push({ productId: product.id, quantity: 1 });
                                   }

                                   userCart.totalItems += 1;
                                   userCart.totalPrice += parseFloat(product.price);

                                   fetch(`http://localhost:3000/carts/${userCart.id}`, {
                                       method: "PUT",
                                       headers: { "Content-Type": "application/json" },
                                       body: JSON.stringify(userCart),
                                   })
                                   .then(() => Swal.fire({
                                    title: 'Added to Cart!',
                                    text: 'The product has been successfully added to your cart.',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 10000,
                                    timerProgressBar: true,
                                    toast: true,
                                    position: 'top-end'
                                  }))
                                   .catch((err) => console.error("Error updating cart:", err));
                               }
                           })
                           .catch((err) => console.error("Error fetching cart:", err));
                   }
               });
           }
       });

       // Add event listener to the "eye" icon for product details
       document.querySelectorAll('.view').forEach(icon => {
           icon.addEventListener('click', (e) => {
               const productId = e.currentTarget.getAttribute('data-id');
               window.location.href = `product.html?id=${productId}`;
           });
       });
   })
   .catch(error => console.error('Error loading products: ', error));
});