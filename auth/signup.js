const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputPhone = document.getElementById("phone");
const inputPassword = document.getElementById("password");
const rePassword = document.getElementById("rePassword");
const inputRegister = document.getElementById("register");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const passError = document.getElementById("passError");
const rePassError = document.getElementById("rePassError");
const nameRegex = /^[a-zA-Z\s]{3,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,}$/; // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
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
  inputRegister.setAttribute("disabled", "true");
  inputRegister.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
  const name = inputName.value;
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
      role: "user",
    }),
  });
  if (response.ok) {
    inputRegister.removeAttribute("disabled");
    inputRegister.innerHTML = `Register`;
    alert("Registration successful!");
    window.location.href = "./Login.html";
  }
});
