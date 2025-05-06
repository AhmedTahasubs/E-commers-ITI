
//#region user management
const inputName = document.getElementById("name")
const inputEmail = document.getElementById("email")
const inputPhone = document.getElementById("phone")
const inputPassword = document.getElementById("password")
const inputRegister = document.getElementById("register")
const inputEdit = document.getElementById("edit")
const nameError = document.getElementById("nameError")
const emailError = document.getElementById("emailError")
const phoneError = document.getElementById("phoneError")
const passError = document.getElementById("passError")
const selectedRole = document.getElementById("userRole")
const sidebarToggle = document.getElementById("sidebar-toggle")
const sidebar = document.querySelector(".sidebar")
const nameRegex = /^[a-zA-Z\s]{3,}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,}$/
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("expanded")
})
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove("expanded")
  }
})
inputName.addEventListener("keyup", (e) => {
  const name = e.target.value
  if (name.length < 3) {
    nameError.style.display = "block"
    nameError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Name must be at least 3 characters long`
  } else {
    nameError.style.display = "none"
  }
})
inputEmail.addEventListener("keyup", (e) => {
  const email = e.target.value
  if (!emailRegex.test(email)) {
    emailError.style.display = "block"
    emailError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Invalid email format`
  } else {
    emailError.style.display = "none"
  }
})
inputPhone.addEventListener("keyup", (e) => {
  const phone = e.target.value
  if (!phoneRegex.test(phone)) {
    phoneError.style.display = "block"
    phoneError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Invalid phone number format`
  } else {
    phoneError.style.display = "none"
  }
})
inputPassword.addEventListener("keyup", (e) => {
  const password = e.target.value
  if (!passwordRegex.test(password)) {
    passError.style.display = "block"
    passError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number`
  } else {
    passError.style.display = "none"
  }
})
const getUsers = async () => {
  try {
    const response = await fetch(`http://localhost:3000/user`)
    const data = await response.json()
    printUserData(data)
  } catch (error) {
    console.error("Error fetching users:", error)
  }
}
const printUserData = async (arr) => {
  const userTable = document.getElementById("userTableBody")
  userTable.innerHTML = ""
  if (arr.length === 0) {
    userTable.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 20px;">No users found</td>
      </tr>
    `
    return
  }
  arr.forEach((user) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td data-label="Name">${user.name}</td>
      <td data-label="Email">${user.email}</td>
      <td data-label="Phone">${user.phone}</td>
      <td data-label="Role"  class="role">${user.role}</td>
      <td data-label="Actions" class="action">
        <span><i data-id="${user.id}" id="editUser" class="fa-solid fa-user-pen"></i></span>
        <span><i data-id="${user.id}" id="deleteUser" class="fa-solid fa-trash-can"></i></span> 
      </td>
    `
    userTable.appendChild(row)
  })
  // Add event listeners to action buttons
  setupActionButtons()
}
const setupActionButtons = () => {
  const deleteButtons = document.querySelectorAll("#deleteUser")
  const editButtons = document.querySelectorAll("#editUser")
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      if (!confirm("Are you sure you want to delete this user?")) {
        return
      }
      const id = e.target.dataset.id
      try {
        await fetch(`http://localhost:3000/user/${id}`, {
          method: "DELETE",
        })
        getUsers()
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    })
  })
  editButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id
      try {
        const response = await fetch(`http://localhost:3000/user/${id}`)
        const data = await response.json()
        inputName.value = data.name
        inputEmail.value = data.email
        inputPhone.value = data.phone
        inputPassword.value = data.password
        selectedRole.value = data.role
        inputRegister.style.display = "none"
        inputEdit.style.display = "block"
        inputEdit.setAttribute("data-id", id)
        document.querySelector(".card").scrollIntoView({ behavior: "smooth" })
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    })
  })
}
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
inputRegister.addEventListener("click", async (e) => {
  e.preventDefault()

  if (
    !checkInputs(inputName, nameRegex) ||
    !checkInputs(inputEmail, emailRegex) ||
    !checkInputs(inputPhone, phoneRegex) ||
    !checkInputs(inputPassword, passwordRegex) ||
    selectedRole.value == ""
  ) {
    alert("Please fill in all fields correctly")
    return
  }

  inputRegister.setAttribute("disabled", "true")
  inputRegister.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`

  const name = inputName.value.charAt(0).toUpperCase() + inputName.value.trim().slice(1)
  const email = inputEmail.value
  const phone = inputPhone.value
  const password = inputPassword.value

  try {
    // Check if email exists
    let response = await fetch(`http://localhost:3000/user`)
    const data = await response.json()
    const user = data.find((user) => user.email === email)

    if (user) {
      alert("Email already exists")
      inputRegister.removeAttribute("disabled")
      inputRegister.innerHTML = `Add User`
      return
    }

    // Create user
    response = await fetch("http://localhost:3000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        role: selectedRole.value,
      }),
    })

    if (response.ok) {
      inputRegister.removeAttribute("disabled")
      inputRegister.innerHTML = `Add User`
      alert("User Added successfully!")

      // Clear form
      inputName.value = ""
      inputEmail.value = ""
      inputPhone.value = ""
      inputPassword.value = ""
      selectedRole.value = ""

      // Refresh user list
      getUsers()
    }
  } catch (error) {
    console.error("Error adding user:", error)
    alert("An error occurred. Please try again.")
    inputRegister.removeAttribute("disabled")
    inputRegister.innerHTML = `Add User`
  }
})
inputEdit.addEventListener("click", async (e) => {
  e.preventDefault()

  if (
    !checkInputs(inputName, nameRegex) ||
    !checkInputs(inputEmail, emailRegex) ||
    !checkInputs(inputPhone, phoneRegex) ||
    !checkInputs(inputPassword, passwordRegex) ||
    selectedRole.value == ""
  ) {
    alert("Please fill in all fields correctly")
    return
  }

  inputEdit.setAttribute("disabled", "true")
  inputEdit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`

  const id = inputEdit.getAttribute("data-id")
  const name = inputName.value.charAt(0).toUpperCase() + inputName.value.trim().slice(1)
  const email = inputEmail.value
  const phone = inputPhone.value
  const password = inputPassword.value

  try {
    // Check if email exists for another user
    let response = await fetch(`http://localhost:3000/user`)
    const data = await response.json()
    const user = data.find((user) => user.email === email && user.id != id)

    if (user) {
      alert("Email already exists")
      inputEdit.removeAttribute("disabled")
      inputEdit.innerHTML = `Edit User`
      return
    }

    // Update user
    response = await fetch(`http://localhost:3000/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        role: selectedRole.value,
      }),
    })

    if (response.ok) {
      inputEdit.removeAttribute("disabled")
      inputEdit.innerHTML = `Edit User`
      alert("User Updated successfully!")

      // Reset form
      inputName.value = ""
      inputEmail.value = ""
      inputPhone.value = ""
      inputPassword.value = ""
      selectedRole.value = ""

      // Show register button, hide edit button
      inputRegister.style.display = "block"
      inputEdit.style.display = "none"

      // Refresh user list
      getUsers()
    }
  } catch (error) {
    console.error("Error updating user:", error)
    alert("An error occurred. Please try again.")
    inputEdit.removeAttribute("disabled")
    inputEdit.innerHTML = `Edit User`
  }
})
//#endregion


//#region product management
const inputProductName = document.getElementById("productName")
const inputPrice = document.getElementById("price")
const inputCategory = document.getElementById("category")
const inputDesc = document.getElementById("description")
const inputImage = document.getElementById("image")
const productNameError = document.getElementById("productNameError")
const priceError = document.getElementById("priceError")
const descError = document.getElementById("descError")
const cateError = document.getElementById("cateError")
const imageError = document.getElementById("imageError")
const inputProductEdit = document.getElementById("productEdit")
const descRegex = /^[a-zA-Z0-9\s]{10,}$/
const imageRegex = /^(http|https):\/\/[^ "]+$/
inputProductName.addEventListener("keyup", (e) => {
  const name = e.target.value
  if (name.length < 5) {
    productNameError.style.display = "block"
    productNameError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Name must be at least 5 characters long`
  } else {
    productNameError.style.display = "none"
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
const resetInputs = () => {
  inputProductName.value = ""
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
inputProductEdit.addEventListener("click", async (e) => {
  e.preventDefault()
  const id = inputEdit.getAttribute("data-id")
  const name = checkInputs(inputProductName, nameRegex)
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
    name: inputProductName.value,
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
      alert("Product updated successful!")
      resetInputs()
      inputEdit.style.display = "none"
      inputAdd.style.display = "block"
      fetchProducts()
})
const fetchProducts = async () => {
  const res = await fetch(`http://localhost:3000/products`)
  const products = await res.json()
  renderProducts(products)
}
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
            ${product.status == "bending" ? `<button data-id="${product.id}" id="approveProduct" class="btn">Approve</button>` : ""}
            <button data-id="${product.id}" id="deleteProduct" class="btn">${product.status == "bending"?"Reject":"Delete"}</button>
          </div>
        </div>
      </div>
    `
    productList.innerHTML += container
  })

  const deleteButton = document.querySelectorAll("#deleteProduct")
  const editButton = document.querySelectorAll("#editProduct")
  const approveButton = document.querySelectorAll("#approveProduct")
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
      inputProductName.value = data.name
      inputPrice.value = data.price
      inputCategory.value = data.category
      inputDesc.value = data.description
      inputImage.value = data.image
      inputEdit.setAttribute("data-id", id)
      document.querySelectorAll(".card")[2].scrollIntoView({ behavior: "smooth" })
    })
  })
  approveButton.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id
      if (!confirm("Are you sure you want to approve this product?")) {
        return
      }
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      })
      if (response.ok) {
        alert("Product approved successfully!")
        fetchProducts()
      } else {
        alert("Error approving product")
      }
    })
  })
}
//#endregion

window.addEventListener("load", () => {
  getUsers()
  fetchProducts()
})

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
