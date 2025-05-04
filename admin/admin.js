// DOM Elements
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

// Regex Patterns
const nameRegex = /^[a-zA-Z\s]{3,}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,}$/

// Sidebar Toggle
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("expanded")
})

// Handle window resize for sidebar
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove("expanded")
  }
})

// Form Validation
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

// Fetch and Display Users
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
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td class="role">${user.role}</td>
      <td class="action">
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

        // Scroll to form
        document.querySelector(".card").scrollIntoView({ behavior: "smooth" })
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    })
  })
}

// Form Input Validation
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

// Add User
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

// Edit User
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

// Enter key to submit form
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault()
    if (inputEdit.style.display === "block") {
      inputEdit.click()
    } else {
      inputRegister.click()
    }
  }
})

// Initialize
window.addEventListener("load", () => {
  getUsers()
})
