"use strict";

//Insert products to html from json file

function insertProducts() {
  const getId = document.querySelectorAll(".data_insert");
  const myData = JSON.parse(products);
  for (let i = 0; i < getId.length; i++) {
    if (i + 1 == myData[i].id) {
      if (i >= 7 && i <= 10) {
        getId[i].innerHTML = `<img src="${myData[i].Image}"
        alt="" class="new_sneaker_img" />
        <div class="new_sneaker_overlay">
          <button class="button ">Add to Cart</button>
        </div>`;
      } else {
        getId[i].innerHTML = `<div class="sneaker_sale">Sale</div>
        <img src='${myData[i].Image}' alt="" class="sneaker_img" />
        <span class="sneaker_name">${myData[i].Name}</span>
        <span class="sneaker_price">£${myData[i].Price}</span>
        <button class="button_light add_to_cart_btn">
          Add to Cart
        </button>`;
      }
    }
  }
}
insertProducts();

//Cart

///Add items to local storage
function addToCart() {
  const addToCartBtn = document.getElementsByClassName("add_to_cart_btn");
  let items = [];
  const myData = JSON.parse(products);
  for (let i = 0; i < addToCartBtn.length; i++) {
    addToCartBtn[i].addEventListener("click", function () {
      if (typeof Storage !== "undefined") {
        let item = {
          id: myData[i].id,
          name: myData[i].Name,
          price: myData[i].Price,
          image: myData[i].Image,
          no: 1,
        };
        if (JSON.parse(localStorage.getItem("items")) === null) {
          items.push(item);
          localStorage.setItem("items", JSON.stringify(items));
          window.location.reload();
        } else {
          const localItems = JSON.parse(localStorage.getItem("items"));
          localItems.map((data) => {
            if (item.id == data.id || item.name == data.name) {
              alert("This product is already in cart.");
            } else {
              items.push(data);
            }
          });
          items.push(item);
          localStorage.setItem("items", JSON.stringify(items));
          window.location.reload();
        }
      } else {
        alert("Local storage is not working on your browser");
      }
    });
  }
  const cardBox = document.querySelector(".cart_content");
  let tableData = "";
  if (JSON.parse(localStorage.getItem("items")) !== null) {
    JSON.parse(localStorage.getItem("items")).map((data) => {
      tableData += `<div class='cart_row cart_grid'>
          <span class='cart_id'>${data.id}</span>
          <img class="cart_row_img" src=${data.image} alt=""/>
          <span>${data.name}</span>
          <span class='cart_row_price'>${data.price}</span>
          <input class="cart_input" type="number" value=${data.no}>
          <button class='cart_btn_remove'>Remove</button>
          </div>
          `;
    });
    cardBox.innerHTML = tableData;
  }
}
addToCart();
updateCartTotal();

///Open & close cart
function openCloseCart() {
  const iconShopping = document.querySelector(".icon_shopping");
  const iconShoppingP = document.querySelector(".icon_shopping p");
  const cartCloseBtn = document.querySelector(".bx-x");
  const cartBox = document.querySelector(".cart_box");

  iconShopping.addEventListener("click", function () {
    cartBox.classList.add("active_cart");
    if (iconShoppingP.innerText == 0) {
      emptyCartMsg();
    }
  });

  cartCloseBtn.addEventListener("click", function () {
    cartBox.classList.remove("active_cart");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && cartBox.classList.contains("active_cart")) {
      cartBox.classList.remove("active_cart");
    }
  });
}
openCloseCart();

// Add data to shopping cart notification-local storage
function iconShopping() {
  const iconShoppingP = document.querySelector(".icon_shopping p");
  let no = 0;
  if (JSON.parse(localStorage.getItem("items")) !== null) {
    JSON.parse(localStorage.getItem("items")).map((data) => {
      no = no + data.no;
    });
    iconShoppingP.innerHTML = no;
  } else iconShoppingP.innerHTML = 0;
}

//Remove button
function removeCart() {
  const removeBtns = document.querySelectorAll(".cart_btn_remove");
  const localItems = JSON.parse(localStorage.getItem("items"));
  for (let i = 0; i < removeBtns.length; i++) {
    removeBtns[i].addEventListener("click", function (event) {
      event.target.parentElement.remove();
      if (localItems[i] !== undefined) {
        if (
          event.target.parentElement.children[0].innerText == localItems[i].id
        ) {
          localItems.splice(i, 1);
          localStorage.setItem("items", JSON.stringify(localItems));
        }
      }
      updateCartTotal();
    });
  }
}
removeCart();

//Modifify quantities
function quantities() {
  const quantityInputs = document.getElementsByClassName("cart_input");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
}
quantities();

function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }

  updateCartTotal();
}

//Cart total update and notification and empty cart message
function updateCartTotal() {
  const cartMain = document.querySelector(".cart_container");
  const cartRows = document.getElementsByClassName("cart_row");
  let total = 0;
  let totalQuantities = 0;

  for (let i = 0; i < cartRows.length; i++) {
    let cartRow = cartRows[i];
    let priceElement = cartRow.getElementsByClassName("cart_row_price")[0];
    let quantityElement = cartRow.getElementsByClassName("cart_input")[0];
    let price = parseFloat(priceElement.innerText.replace("£", ""));
    let quantity = parseInt(quantityElement.value);
    total = total + price * quantity;
    totalQuantities += quantity;
    const localItems = JSON.parse(localStorage.getItem("items"));
    if (
      quantityElement.parentElement.children[0].innerText == localItems[i].id
    ) {
      localItems[i].no = quantity;
      localStorage.setItem("items", JSON.stringify(localItems));
    }
  }
  if (totalQuantities === 0) {
    while (cartMain.firstChild) {
      cartMain.firstChild.remove();
    }
    emptyCartMsg();
    localStorage.clear();
  }

  if (document.getElementsByClassName("cart_total")[0] !== undefined) {
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("cart_total")[0].innerText =
      "Total: £" + total;
  }
  iconShopping();
}

function emptyCartMsg() {
  const cartMain = document.querySelector(".cart_container");
  const emptyMessage = document.createElement("div");
  while (cartMain.firstChild) {
    cartMain.firstChild.remove();
  }
  emptyMessage.classList.add("cart_empty_message");
  emptyMessage.innerText = "Cart is empty.";
  cartMain.appendChild(emptyMessage);
}

function purchase() {
  const cartMain = document.querySelector(".cart_container");
  const purchaseBtn = document.querySelector(".cart_btn_purchase");
  const iconShoppingP = document.querySelector(".icon_shopping p");
  if (purchaseBtn !== null) {
    purchaseBtn.addEventListener("click", function () {
      localStorage.clear();
      iconShoppingP.innerText = 0;
      while (cartMain.firstChild) {
        cartMain.firstChild.remove();
      }
      let purchaseMessage = document.createElement("div");
      purchaseMessage.classList.add("cart_purchase_message");
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      if (day < 10) day = "0" + day;
      if (month < 10) month = "0" + month;
      purchaseMessage.innerText = `Thank you for your order! \n The order was registered in: \n ${day} / ${month} / ${year}`;
      cartMain.appendChild(purchaseMessage);
    });
  }
}

purchase();

//Shop
function showPageShop() {
  const shopPageBtns = document.querySelectorAll(".sneaker_pag");
  const shopPages = document.querySelectorAll(".shop_container");
  for (let i = 0; i < shopPageBtns.length; i++) {
    shopPageBtns[i].addEventListener("click", function () {
      for (let j = 0; j < shopPages.length; j++) {
        shopPages[j].classList.add("shop_container_hide");
        shopPageBtns[j].classList.remove("sneaker_pag_active");
        if (j === i) {
          shopPages[j].classList.remove("shop_container_hide");
          shopPageBtns[j].classList.add("sneaker_pag_active");
        }
      }
    });
  }
}
showPageShop();

//Menu show
function showMenu(toggleId, navId) {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
}

showMenu("nav-toogle", "nav-menu");

//Remove menu
function removeMenu() {
  const navLink = document.querySelectorAll(".nav_link");
  const navMenu = document.getElementById("nav-menu");

  function linkAction() {
    navMenu.classList.remove("show");
  }
  navLink.forEach((n) => n.addEventListener("click", linkAction));
}
removeMenu();

//Scroll sections active link
function scrollActive() {
  const sections = document.querySelectorAll("section[id]");
  const scrollY = window.pageYOffset;
  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    const sectionId = current.getAttribute("id");
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav_menu a[href*=" + sectionId + "]")
        .classList.add("active");
      document.querySelector(
        ".nav_menu a[href*=" + sectionId + "]"
      ).style.color = "#1877F2";
    } else {
      document
        .querySelector(".nav_menu a[href*=" + sectionId + "]")
        .classList.remove("active");
      document.querySelector(
        ".nav_menu a[href*=" + sectionId + "]"
      ).style.color = "#1C1C1C";
    }
  });
}
window.addEventListener("scroll", scrollActive);

//Active menu by clicking
function activeMenuClick() {
  document.querySelector(".nav_list").addEventListener("click", function (e) {
    e.preventDefault();

    if (e.target.classList.contains("nav_link")) {
      const id = e.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
      if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
      } else {
        e.target.classList.add("active");
      }

      const scrollY = window.pageYOffset;
      const sectionHeight = e.target.offsetHeight;
      const sectionTop = e.target.offsetTop - 50;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        e.target.classList.add("active");
      } else {
        e.target.classList.remove("active");
      }
    }
  });
}
activeMenuClick();

//Change header color
function changeHeaderColor() {
  const nav = document.getElementById("header");
  window.onscroll = function (e) {
    if (scrollY >= 200) {
      nav.classList.add("scroll_header");
    } else nav.classList.remove("scroll_header");
  };
}
changeHeaderColor();

//Menu fade animation
function fadeAnimation() {
  const nav = document.querySelector(".nav");
  const handleHover = function (e) {
    if (e.target.classList.contains("nav_link")) {
      const link = e.target;
      const siblings = link.closest(".nav").querySelectorAll(".nav_link");
      const logo = link.closest(".nav").querySelector(".nav_logo");

      siblings.forEach((el) => {
        if (el !== link) el.style.opacity = this;
      });
      logo.style.opacity = this;
    }
  };
  //Passing 'argument' into handler
  nav.addEventListener("mouseover", handleHover.bind(0.5));
  nav.addEventListener("mouseout", handleHover.bind(1));
}
fadeAnimation();

//Offer countdown
function countdown() {
  let endDate = new Date().getTime() + 15 * 60 * 60 * 1000;
  let timer = setInterval(function () {
    let now = new Date().getTime();
    let t = endDate - now;
    if (t >= 0) {
      let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      let secs = Math.floor((t % (1000 * 60)) / 1000);
      document.getElementById("timer-hours").innerHTML =
        ("0" + hours).slice(-2) + "<span class='label'> :</span>";
      document.getElementById("timer-mins").innerHTML =
        ("0" + mins).slice(-2) + "<span class='label'> : </span>";
      document.getElementById("timer-secs").innerHTML = ("0" + secs).slice(-2);
    } else {
      document.getElementById("timer").innerHTML = "The offer is over!";
    }
  }, 1000);
}
countdown();
