// Toggle menu visibility on button click
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

let allApprovedProducts = [] // لتخزين المنتجات المقبولة

// Fetch products and display them
fetch("http://localhost:3000/products")
  .then((res) => res.json())
  .then((products) => {
    const container = document.querySelector(".products")
    container.innerHTML = ""

    allApprovedProducts = products.filter(p => p.status === "approved")
    renderProducts(allApprovedProducts)
  })
  .catch((error) => console.error("Error loading products:", error))

// دالة لعرض المنتجات
function renderProducts(products) {
  const container = document.querySelector(".products")
  container.innerHTML = ""

  products.forEach((product) => {
    const card = document.createElement("div")
    card.className = "cardd"
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
    `
    container.appendChild(card)

    // زر الإضافة للسلة
    card.querySelector(".cart-btn").addEventListener("click", () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        Swal.fire({
          icon: 'warning',
          title: 'Login Required',
          text: 'Please log in to the site to continue.',
          confirmButtonText: 'OK'
        })
        
      } else {


        fetch(`http://localhost:3000/carts?userId=${userId}`)
          .then((res) => res.json())
          .then((data) => {
            let userCart = data[0]

            if (!userCart) {
              const newCart = {
                userId,
                totalPrice: parseFloat(product.price),
                totalItems: 1,
                cartProducts: [{ productId: product.id, quantity: 1 }],
              }

              fetch("http://localhost:3000/carts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCart),
              })
                .then((res) => res.json())
                .then(() => alert("Product added to cart!"))
                .catch((err) => console.error("Error creating cart:", err))
            } else {
              const existingProduct = userCart.cartProducts.find(
                (p) => p.productId === product.id
              )

              if (existingProduct) {
                existingProduct.quantity += 1
              } else {
                userCart.cartProducts.push({ productId: product.id, quantity: 1 })
              }

              userCart.totalItems += 1
              userCart.totalPrice += parseFloat(product.price)

              fetch(`http://localhost:3000/carts/${userCart.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userCart),
              })
                .then(() => alert("Product added to cart!"))
                .catch((err) => console.error("Error updating cart:", err))
            }
          })
          .catch((err) => console.error("Error fetching cart:", err))
      }
    })

    // زر عرض التفاصيل
    card.querySelector(".view").addEventListener("click", (e) => {
      const productId = e.target.closest(".view").getAttribute("data-id")
      window.location.href = `features/product.html?id=${productId}`
    })
  })
}

// بحث المنتجات
const searchInput = document.getElementById("searchInput")
if (searchInput) {
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()

    const filtered = allApprovedProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      )
    })

    renderProducts(filtered)
  })
}

// تسجيل الخروج
const logOutBtn = document.getElementById("logout")
if (logOutBtn) {
  logOutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    window.location.reload()
  })
}
