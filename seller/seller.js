const sidebarToggle = document.getElementById("sidebar-toggle")
const sidebar = document.querySelector(".sidebar")
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("expanded")
})
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove("expanded")
  }
})
const inputName = document.getElementById("name")
const inputPrice = document.getElementById("price")
const inputCategory = document.getElementById("category")
const inputDesc = document.getElementById("description")
const inputImage = document.getElementById("image")
const nameError = document.getElementById("nameError")
const priceError = document.getElementById("priceError")
const descError = document.getElementById("descError")
const cateError = document.getElementById("cateError")
const imageError = document.getElementById("imageError")
const inputAdd = document.getElementById("add")
const inputEdit = document.getElementById("edit")
const nameRegex = /^[a-zA-Z\s]{5,}$/
const descRegex = /^[a-zA-Z0-9\s]{10,}$/
const imageRegex = /^(http|https):\/\/[^ "]+$/

inputName.addEventListener("keyup", (e) => {
  const name = e.target.value
  if (name.length < 5) {
    nameError.style.display = "block"
    nameError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Name must be at least 5 characters long`
  } else {
    nameError.style.display = "none"
  }
})
inputPrice.addEventListener("keyup", (e) => {
  const price = e.target.value
  if (isNaN(price) || price <= 0) {
    priceError.style.display = "block"
    priceError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Price must be a positive number`
  } else {
    priceError.style.display = "none"
  }
})
inputDesc.addEventListener("keyup", (e) => {
  const desc = e.target.value
  if (desc.length < 10) {
    descError.style.display = "block"
    descError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Description must be at least 10 characters long`
  } else {
    descError.style.display = "none"
  }
})
inputImage.addEventListener("keyup", (e) => {
  const image = e.target.value
  if (!imageRegex.test(image)) {
    imageError.style.display = "block"
    imageError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Image URL is required`
  } else {
    imageError.style.display = "none"
  }
})
inputCategory.addEventListener("change", (e) => {
  const category = e.target.value
  if (category.length < 4) {
    cateError.style.display = "block"
    cateError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Category is required`
  } else {
    cateError.style.display = "none"
  }
})
const checkInputs = (input, regex) => {
  const value = input.value.trim()
  if (value === "") {
    return false
  }
  if (!regex.test(value)) {
    return false
  }
  return true
}
const resetInputs = () => {
  inputName.value = ""
  inputPrice.value = ""
  inputCategory.value = ""
  inputDesc.value = ""
  inputImage.value = ""
  nameError.style.display = "none"
  priceError.style.display = "none"
  descError.style.display = "none"
  cateError.style.display = "none"
  imageError.style.display = "none"
}
inputAdd.addEventListener("click", async (e) => {
  e.preventDefault()
  const userId = localStorage.getItem("userId")
  const name = checkInputs(inputName, nameRegex)
  const price = checkInputs(inputPrice, /^[0-9]+(\.[0-9]{1,2})?$/)
  const category = checkInputs(inputCategory, /^[a-zA-Z\s]+$/)
  const desc = checkInputs(inputDesc, descRegex)
  const image = checkInputs(inputImage, imageRegex)
  if (!name || !price || !category || !desc || !image) {
    alert("Please fill in all fields correctly")
    return
  }
  inputAdd.setAttribute("disabled", "true")
  inputAdd.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`
  const product = {
    userId: userId, //deg el id bta3 el user elly 3ayz y3ml add
    name: inputName.value,
    price: inputPrice.value,
    category: inputCategory.value,
    description: inputDesc.value,
    image: inputImage.value,
    createdAt: new Date().toJSON().slice(0, 10).replace(/-/g, "/"),
    rating: 0,
    status:"bending",
  }
  const req = await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
  const res = await req.json()
  inputAdd.removeAttribute("disabled")
  inputAdd.innerHTML = `Add Product`
  if (res) {
    alert("Product added successful!")
    resetInputs()
    fetchProducts()
  } else {
    alert("Error adding product")
  }
})
inputEdit.addEventListener("click", async (e) => {
  e.preventDefault()
  const id = inputEdit.getAttribute("data-id")
  const name = checkInputs(inputName, nameRegex)
  const price = checkInputs(inputPrice, /^[0-9]+(\.[0-9]{1,2})?$/)
  const category = checkInputs(inputCategory, /^[a-zA-Z\s]+$/)
  const desc = checkInputs(inputDesc, descRegex)
  const image = checkInputs(inputImage, imageRegex)
  if (!name || !price || !category || !desc || !image) {
    alert("Please fill in all fields correctly")
    return
  }
  inputEdit.setAttribute("disabled", "true")
  inputEdit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`
  const product = {
    name: inputName.value,
    price: inputPrice.value,
    category: inputCategory.value,
    description: inputDesc.value,
    image: inputImage.value,
  }
  const req = await fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
  const res = await req.json()
  inputEdit.removeAttribute("disabled")
  inputEdit.innerHTML = `Edit Product`
  if (res) {
    alert("Product updated successful!")
    resetInputs()
    inputEdit.style.display = "none"
    inputAdd.style.display = "block"
    fetchProducts()
  } else {
    alert("Error updating product")
  }
})
const fetchProducts = async () => {
  const userId = localStorage.getItem("userId")
  if (!userId) {
    alert("Please login to view your products")
    window.location.href = "/auth/login.html"
    return
  }
  const res = await fetch(`http://localhost:3000/products?userId=${userId}`)
  const products = await res.json()
  renderProducts(products)
}
fetchProducts()
const renderProducts = (products) => {
  const productList = document.getElementById("productList")
  productList.innerHTML = ""

  if (products.length === 0) {
    productList.innerHTML = `<p style="text-align: center; padding: 20px;">No products found</p>`
    return
  }
  products.forEach((product) => {
    const container = `
      <div class="product-card">
        <div class="img-container">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-details">
          <h5>${product.name}</h5>
          <span>$${product.price}</span>
          <span>${product.category}</span>
          <span>${product.description.split(" ").slice(0, 5).join(" ")}...</span>
          <span class="status ${product.status == "bending"?" " : "approved"}">${product.status.charAt(0).toUpperCase() + product.status.trim().slice(1)}</span>
          <div>
            <button data-id="${product.id}" id="editProduct" class="btn">Edit</button>
            <button data-id="${product.id}" id="deleteProduct" class="btn">Delete</button>
          </div>
        </div>
      </div>
    `
    productList.innerHTML += container
  })

  const deleteButton = document.querySelectorAll("#deleteProduct")
  const editButton = document.querySelectorAll("#editProduct")

  deleteButton.forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault()
      if (!confirm("Are you sure you want to delete this product?")) {
        return
      }
      const id = e.target.dataset.id
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        alert("Product deleted successfully!")
        fetchProducts()
      } else {
        alert("Error deleting product")
      }
    })
  })
  editButton.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id
      const response = await fetch(`http://localhost:3000/products/${id}`)
      const data = await response.json()
      inputName.value = data.name
      inputPrice.value = data.price
      inputCategory.value = data.category
      inputDesc.value = data.description
      inputImage.value = data.image
      inputAdd.style.display = "none"
      inputEdit.style.display = "block"
      inputEdit.setAttribute("data-id", id)
      document.querySelector(".card").scrollIntoView({ behavior: "smooth" })
    })
  })
}
const lists = document.querySelectorAll(".sidebar-nav ul li")
lists.forEach((list) => {
  list.addEventListener("click", (e) => {
    lists.forEach((item) => item.classList.remove("active"))
    e.currentTarget.classList.add("active") 
  })
})
const logOutBtn = document.getElementById("logout")
logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("userId")
  localStorage.removeItem("userRole")
  window.location.href = "/"
})