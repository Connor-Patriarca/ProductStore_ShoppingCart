console.clear();

let cart = [];

let storedItems = localStorage.getItem("connors-cart");

if (storedItems !== null) {
  let storedData = JSON.parse(storedItems);
  cart = [...storedData];
  renderCart();
}

let buttons = document.querySelectorAll("button");

buttons.forEach(function (btn) {
  btn.addEventListener("click", addToCart);
});

function addToCart(event) {
  let itemName = event.target.dataset.name;
  let itemPrice = Number(event.target.dataset.price);

  if (cart.length <= 0) {
    cart.push({ name: itemName, price: itemPrice, quantity: 1 });
  } else {
    let itemFound = false;
    cart.forEach(function (product) {
      if (product.name === itemName) {
        itemFound = true;
        product.quantity++;
      }
    });
    if (itemFound === false) {
      cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    }
  }

  saveLocalStorage();
  renderCart();
}
function saveLocalStorage() {
  localStorage.setItem("connors-cart", JSON.stringify(cart));
}

// Render cart and Summary
function renderCart() {
  // console.log(cart);
  let itemCount = 0;
  let priceTotal = 0;
  let html_template = ``;
  cart.forEach(function (product) {
    let subtotal = product.price * product.quantity;
    itemCount += +product.quantity;
    priceTotal += +subtotal;
    // Inject this into the html for each item
    html_template += `
    <tr>
      <td>
        <button class="remove-item">
        remove
        </button>
      </td>
      <td> ${product.name} </td>
      <td> $${product.price} </td>
      <td> 
        <input type="number" value="${product.quantity}" min="0" data-name="${product.name}" data-price="${product.price}" />
      </td>
      <td> $${subtotal} </td>
    </tr>
    `;
  });

  document.querySelector("tbody.cart").innerHTML = html_template;

  // Inject into html for summary
  let summary_template = `
  <p> There are ${itemCount} items in your cart. </p>
  <p> Total: $${priceTotal} </p>
  `;

  document.querySelector("section.summary").innerHTML = summary_template;

  // remove button
  const removeButtons = document.querySelectorAll(".remove-item");

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const row = button.parentNode.parentNode;
      const quantityInput = row.querySelector('input[type="number"]');
      quantityInput.value = 0;
      updateCart({ target: quantityInput });
    });
  });

  // wrapping up
  let inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function (input) {
    input.addEventListener("change", updateCart);
  });
}

function updateCart(event) {
  let itemName = event.target.dataset.name;
  let newQuantity = Number(event.target.value);

  cart.forEach(function (product, index) {
    if (product.name === itemName) {
      product.quantity = newQuantity;
      if (newQuantity === 0) {
        cart.splice(index, 1);
      }
    }
  });

  saveLocalStorage();
  renderCart();
}
