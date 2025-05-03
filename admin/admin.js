const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputPhone = document.getElementById("phone");
const inputPassword = document.getElementById("password");
const inputRegister = document.getElementById("register");
const inputEdit = document.getElementById("edit");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const passError = document.getElementById("passError");
const selectedRole = document.getElementById("userRole");
const nameRegex = /^[a-zA-Z\s]{3,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,}$/;
inputName.addEventListener("keyup", (e) => {
  const name = e.target.value;
  if (name.length < 3) {
    nameError.style.display = "block";
    nameError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Name must be at least 3 characters long`;
  } else {
    nameError.style.display = "none";
  }
});
inputEmail.addEventListener("keyup", (e) => {
  const email = e.target.value;
  if (!emailRegex.test(email)) {
    emailError.style.display = "block";
    emailError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Invalid email format`;
  } else {
    emailError.style.display = "none";
  }
});
inputPhone.addEventListener("keyup", (e) => {
  const phone = e.target.value;
  if (!phoneRegex.test(phone)) {
    phoneError.style.display = "block";
    phoneError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Invalid phone number format`;
  } else {
    phoneError.style.display = "none";
  }
});
inputPassword.addEventListener("keyup", (e) => {
  const password = e.target.value;
  if (!passwordRegex.test(password)) {
    passError.style.display = "block";
    passError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number`;
  } else {
    passError.style.display = "none";
  }
});
const getUsers = async () => {
  //deef loader ya 3l2a
  const response = await fetch(`http://localhost:3000/user`);
  const data = await response.json();
  printUserData(data);   
}
const printUserData = async (arr) => {
  const userTable = document.getElementById("userTableBody");
  userTable.innerHTML = "";
  arr.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td class="role">${user.role}</td>
      <td class="action">
      <span class=""><i data-id="${user.id}" id="editUser" class="fa-solid fa-user-pen"></i></span>
      <span class=""><i data-id="${user.id}" id="deleteUser" class="fa-solid fa-trash-can"></i></span> 
      </td>
    `;
    userTable.appendChild(row);
  });
  const deleteButton = document.querySelectorAll("#deleteUser");
  const editButton = document.querySelectorAll("#editUser");
  deleteButton.forEach((button) => {
    button.addEventListener("click", async (e) => {
      if (!confirm("Are you sure you want to delete this user?")) {
        return;
      }
      const id = e.target.dataset.id;
      await fetch(`http://localhost:3000/user/${id}`, {
        method: "DELETE",
      });
      const data = getUsers();
      printUserData(data);
    });
  });
  editButton.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const response = await fetch(`http://localhost:3000/user/${id}`);
      const data = await response.json();
      inputName.value = data.name;
      inputEmail.value = data.email;
      inputPhone.value = data.phone;
      inputPassword.value = data.password;
      selectedRole.value = data.role;
      inputRegister.style.display = "none";
      inputEdit.style.display = "block";
      inputEdit.setAttribute("data-id", id);
    });
  });
}
const checkInputs = (input, regex) => {
  const value = input.value.trim();
  if (value === "") {
    return false;
  }
  if (!regex.test(value)) {
    return false;
  }
  return true;
};
inputRegister.addEventListener("click", async (e) => {
  e.preventDefault();
  if (
    !checkInputs(inputName, nameRegex) ||
    !checkInputs(inputEmail, emailRegex) ||
    !checkInputs(inputPhone, phoneRegex) ||
    !checkInputs(inputPassword, passwordRegex)
    || selectedRole.value  == ""
  ) {
    alert("Please fill in all fields correctly");
    return;
  }
  inputRegister.setAttribute("disabled", "true");
  inputRegister.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
  const name = inputName.value.charAt(0).toUpperCase() + inputName.value.trim().slice(1);
  const email = inputEmail.value;
  const phone = inputPhone.value;
  const password = inputPassword.value;
  let response = await fetch(`http://localhost:3000/user`);
  const data = await response.json();
  const user = data.find((user) => user.email === email);
  if (user) {
    alert("Email already exists");
    inputRegister.removeAttribute("disabled");
    inputRegister.innerHTML = `Register`;
    return;
  }
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
  });
  if (response.ok) {
    inputRegister.removeAttribute("disabled");
    inputRegister.innerHTML = `Register`;
    alert("User Added successful!");
    window.location.href = "./Login.html";
  }
});
inputEdit.addEventListener("click", async (e) => { 
    e.preventDefault();
    if (
      !checkInputs(inputName, nameRegex) ||
      !checkInputs(inputEmail, emailRegex) ||
      !checkInputs(inputPhone, phoneRegex) ||
      !checkInputs(inputPassword, passwordRegex)
      || selectedRole.value  == ""
    ) {
      alert("Please fill in all fields correctly");
      return;
    }
    inputEdit.setAttribute("disabled", "true");
    inputEdit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
    const id = inputEdit.getAttribute("data-id");
    const name = inputName.value.charAt(0).toUpperCase() + inputName.value.trim().slice(1);
    const email = inputEmail.value;
    const phone = inputPhone.value;
    const password = inputPassword.value;
    let response = await fetch(`http://localhost:3000/user`);
    const data = await response.json();
    const user = data.find((user) => user.email === email && user.id != id);
    if (user) {
      alert("Email already exists");
      inputEdit.removeAttribute("disabled");
      inputEdit.innerHTML = `Edit`;
      return;
    }
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
    });
    if (response.ok) {
      inputEdit.removeAttribute("disabled");
      inputEdit.innerHTML = `Edit`;
      alert("User Updated successful!");
      window.location.href = "./Login.html";
    }
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    inputRegister.click();
  }
});
window.addEventListener("load", async () => {
  getUsers();
});
