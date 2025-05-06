const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const inputRegister = document.getElementById("register");
const emailError = document.getElementById("emailError");
const passError = document.getElementById("passError");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,}$/; 
const showPass = document.getElementById("showPass");

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
    passError.style.display = "block"; 
    passError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Please fill in all fields correctly`;
    setTimeout(() => {
      passError.style.display = "none"; 
    }, 2000);
    inputEmail.value != null? inputEmail.focus() : inputPassword.focus();
    return;
  }
  passError.style.display = "none";
  inputRegister.setAttribute("disabled", "true");
  inputRegister.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
  const email = inputEmail.value;
  const password = inputPassword.value;
  const response = await fetch(`http://localhost:3000/users`);
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
        localStorage.setItem("userId",user.id);
        localStorage.setItem("userRole", user.role);
        window.location.href = "/";
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
    showPass.classList.remove("fa-eye-slash");
    showPass.classList.add("fa-eye");
  }
  else {
    inputPassword.type = "password";
    showPass.classList.remove("fa-eye");
    showPass.classList.add("fa-eye-slash");
  }
})

