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

const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputPhone = document.getElementById("phone");
const inputDelivery = document.getElementById("delivery");
const inputOnline = document.getElementById("online");
const addressError = document.getElementById("addressError");
const cityError = document.getElementById("cityError");
const phoneError = document.getElementById("phoneError");
const cityRegex = /^[a-zA-Z\s]{3,}$/;
const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
const addressRegex = /^[a-zA-Z0-9\s,.'-]{8,}$/;
const showPass = document.getElementById("showPass");
inputAddress.addEventListener("keyup", (e) => {
  const address = e.target.value;
  if (address.length < 8) {
    addressError.style.display = "block";
    addressError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Address must be at least 8 characters long`;
  } else {
    addressError.style.display = "none";
  }
});
inputCity.addEventListener("keyup", (e) => {
  const city = e.target.value;
  if (city.length < 3) {
    cityError.style.display = "block";
    cityError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> City must be at least 3 characters long`;
  } else {
    cityError.style.display = "none";
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
    inputAddress.value = "";
    inputCity.value = "";
    inputPhone.value = "";
    addressError.style.display = "none";
    cityError.style.display = "none";
    phoneError.style.display = "none";
};
inputDelivery.addEventListener("click", async(e) => {
  e.preventDefault();
  if (
  !checkInputs(inputAddress, addressRegex) ||
  !checkInputs(inputCity, cityRegex) ||
  !checkInputs(inputPhone, phoneRegex)
  ) {
    alert("Please fill in all fields correctly");
    return;
  }
  const address = inputAddress.value;
  const city = inputCity.value;
  const phone = inputPhone.value;
  const userId = localStorage.getItem("userId");
  const cartId = localStorage.getItem("cartId");
  const res = await fetch(`http://localhost:3000/carts/${cartId}`)
  const data = await res.json();
  const totalPrice = data.totalPrice;
  const order = {
    userId: userId,
    address: address,
    city: city,
    phone: phone,
    totalPrice: totalPrice,
    status:"pending",
    createdAt: new Date().toISOString(),
    items:data.cartProducts,
    paymentMethod: "cash",
    paid: false,
  };
  const response = await fetch(`http://localhost:3000/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  if (response.ok) {
    alert("Order placed successfully!");
    resetInputs();
    const deleteCart = await fetch(`http://localhost:3000/carts/${cartId}`, {
      method: "DELETE",
    });
    localStorage.removeItem("cartId");
    window.location.href = "../features/orders.html";
  }
  else {
    alert("Error placing order. Please try again.");
  }
});
inputOnline.addEventListener("click", async(e) => {
  e.preventDefault();
  if (
  !checkInputs(inputAddress, addressRegex) ||
  !checkInputs(inputCity, cityRegex) ||
  !checkInputs(inputPhone, phoneRegex)
  ) {
    alert("Please fill in all fields correctly");
    return;
  }
  const address = inputAddress.value;
  const city = inputCity.value;
  const phone = inputPhone.value;
  const userId = localStorage.getItem("userId");
  const cartId = localStorage.getItem("cartId");
  const res = await fetch(`http://localhost:3000/carts/${cartId}`)
  const data = await res.json();
  const totalPrice = data.totalPrice;
  const order = {
    userId: userId,
    address: address,
    city: city,
    phone: phone,
    totalPrice: totalPrice,
    status:"pending",
    createdAt: new Date().toISOString(),
    items:data.cartProducts,
    paymentMethod: "online",
    paid: true,
  };
  const response = await fetch(`http://localhost:3000/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  if (response.ok) {
    alert("Order placed successfully!");
    resetInputs();
    const deleteCart = await fetch(`http://localhost:3000/carts/${cartId}`, {
      method: "DELETE",
    });
    localStorage.removeItem("cartId");
    window.location.href = "../features/orders.html";
  }
  else {
    alert("Error placing order. Please try again.");
  }
});
