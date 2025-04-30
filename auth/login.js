const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const inputRegister = document.getElementById("register");
const emailError = document.getElementById("emailError");
const passError = document.getElementById("passError");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,}$/; // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
inputEmail.addEventListener("keyup", (e) => {
  const email = e.target.value;
  if (!emailRegex.test(email)) {
    emailError.style.display = "block";
    emailError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Invalid email format`;
  } else {
    emailError.style.display = "none";
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
    !checkInputs(inputEmail, emailRegex) ||
    !checkInputs(inputPassword, passwordRegex)
  ) {
    alert("Please fill in all fields correctly");
    return;
  }
  inputRegister.setAttribute("disabled", "true");
  inputRegister.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
  const email = inputEmail.value;
  const password = inputPassword.value;
  const response = await fetch(`http://localhost:3000/user`);
  const data = await response.json();
    const user = data.find((user) => user.email === email && user.password === password);
    if (!user) {
        alert("Invalid email or password");
        inputRegister.removeAttribute("disabled");
        inputRegister.innerHTML = `Login`;
        }
    else {
        alert("Login successful!");
        inputRegister.removeAttribute("disabled");
        inputRegister.innerHTML = `Login`;
        window.location.href = "../index.html";
    }
});
