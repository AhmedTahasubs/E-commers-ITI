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
}
const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputPhone = document.getElementById("phone");
const inputPassword = document.getElementById("password");
const rePassword = document.getElementById("rePassword");
const inputRegister = document.getElementById("register");
const typeInput = document.querySelectorAll('input[name="type"]');
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const passError = document.getElementById("passError");
const rePassError = document.getElementById("rePassError");
const nameRegex = /^[a-zA-Z\s]{3,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,}$/;
const showPass = document.getElementById("showPass");
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
    showPass.style.top= "26%";
    passError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number`;
  } else {
    passError.style.display = "none";
    showPass.style.top= "50%";
  }
});
rePassword.addEventListener("keyup", (e) => {
  const rePasswordValue = e.target.value;
  if (rePasswordValue === "") {
    rePassError.style.display = "block";
    rePassError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Passwords do not match`;
  }
  if (rePasswordValue !== inputPassword.value) {
    rePassError.style.display = "block";
    rePassError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Passwords do not match`;
  } else {
    rePassError.style.display = "none";
  }
});
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
const resetInputs = () => {
  inputName.value = "";
  inputEmail.value = "";
  inputPhone.value = "";
  inputPassword.value = "";
  rePassword.value = "";
  nameError.style.display = "none";
  emailError.style.display = "none";
  phoneError.style.display = "none";
  passError.style.display = "none";
  rePassError.style.display = "none";
};
inputRegister.addEventListener("click", async (e) => {

  if (
    !checkInputs(inputName, nameRegex) ||
    !checkInputs(inputEmail, emailRegex) ||
    !checkInputs(inputPhone, phoneRegex) ||
    !checkInputs(inputPassword, passwordRegex) ||
    !checkInputs(rePassword, passwordRegex)
  ) {
    alert("Please fill in all fields correctly");
    return;
  }
  let selectedRole = null;
  typeInput.forEach((input) => {
    if (input.checked) {
      selectedRole = input.value;
    }
  });
  if (!selectedRole) {
    alert("Please select a role (selling or shopping)");
    return;
  }
  inputRegister.setAttribute("disabled", "true");
  inputRegister.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
  const name = inputName.value.charAt(0).toUpperCase() + inputName.value.trim().slice(1);
  const email = inputEmail.value;
  const phone = inputPhone.value;
  const password = inputPassword.value;
  let response = await fetch(`http://localhost:3000/users`);
  const data = await response.json();
  const user = data.find((user) => user.email === email);
  if (user) {
    alert("Email already exists");
    inputRegister.removeAttribute("disabled");
    inputRegister.innerHTML = `Register`;
    return;
  }
  response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      password,
      role: selectedRole,
    }),
  });
  
  if (response.ok) {
    inputRegister.removeAttribute("disabled");
    inputRegister.innerHTML = `Register`;
    alert("Registration successful!");
    resetInputs();
    window.location.href = "./Login.html";

  }
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    inputRegister.click();
  }
});
showPass.addEventListener("click", () => {
  if (inputPassword.type === "password") {
    inputPassword.type = "text";
    rePassword.type = "text";
    showPass.classList.remove("fa-eye-slash");
    showPass.classList.add("fa-eye");
  } else {
    rePassword.type = "password";
    inputPassword.type = "password";
    showPass.classList.remove("fa-eye");
    showPass.classList.add("fa-eye-slash");
  }
});