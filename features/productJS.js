document.addEventListener("DOMContentLoaded", function () {
  // Toggle the menu visibility
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
  
  // Handle the Add to Cart button click
  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            Swal.fire({
                icon: 'warning',
                title: 'Please log in first!',
                confirmButtonText: 'Login'
            }).then(() => {
                window.location.href = '/';
            });
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

  // Load product details based on the URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  fetch(`http://localhost:3000/products/${productId}`)
    .then(res => res.json())
    .then(product => {
        // Check if the product is approved before displaying
        if (product.status === "approved") {
            // Display product details
            document.getElementById('mainImg').src = product.image;
            document.querySelector('.info h2').textContent = product.name;
            document.querySelector('.info .price').textContent = `${product.price} EGP`;
            document.querySelector('.info .rating').textContent = `★★★★☆ ${product.rating || 4.8}`;
            document.querySelector('.details').innerHTML = `
                <p><strong>Category:</strong> ${product.category || 'General'}</p>
                <p><strong>Quantity:</strong> ${product.quantity || 0}</p>
                <p><strong>Material:</strong> ${product.material || 'Unknown'}</p>
                <p><strong>Colour:</strong> ${product.color || 'Multicolour'}</p>
                <p><strong>Department:</strong> ${product.department || 'N/A'}</p>
            `;
        } else {
            // If product is not approved
            document.querySelector('.product-container').innerHTML = '<h2>This product is not approved for display</h2>';
        }
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
                            text: 'Please log in to the site to continue.',
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
                                    .then(() => alert("Product added to cart!"))
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
