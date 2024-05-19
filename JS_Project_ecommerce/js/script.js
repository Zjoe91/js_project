let products = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/inventory.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      displayProducts(products);
    })
    .catch((error) => console.error("Error loading inventory:", error));

  updateCartUI();
});

function displayProducts(products) {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.className = "product";
    productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h5>${product.name}</h5>
            <p>$${product.price.toFixed(2)}</p>
        `;

    const addButton = document.createElement("button");
    addButton.textContent = "Add to Cart";
    addButton.onclick = () => addToCart(product.id);
    productElement.appendChild(addButton);

    productsContainer.appendChild(productElement);
  });
}

function removeFromCart(productId) {
  const productIndex = cart.findIndex((item) => item.id === productId);
  if (productIndex !== -1) {
    cart[productIndex].quantity -= 1;
    if (cart[productIndex].quantity <= 0) {
      cart.splice(productIndex, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  }
}

function addToCart(productId) {
  const product = cart.find((item) => item.id === productId);
  if (product) {
    product.quantity += 1;
  } else {
    const productToAdd = products.find((p) => p.id === productId);
    if (!productToAdd) return;
    cart.push({ ...productToAdd, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div>
            <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `
    )
    .join("");

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  document.getElementById("cart-total").textContent = total.toFixed(2);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = itemCount;
}

function filterProducts(category) {
  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.category === category);
  displayProducts(filteredProducts);
}

function searchProducts() {
  const searchText = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText)
  );
  displayProducts(filteredProducts);
}

function populateOrderSummary() {
  const cartItemsContainer = document.getElementById("cart-items-container");
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
      <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
    `;
    cartItemsContainer.appendChild(itemElement);

    total += item.price * item.quantity;
  });

  const totalElement = document.createElement("div");
  totalElement.className = "cart-total";
  totalElement.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  cartItemsContainer.appendChild(totalElement);
}

document.addEventListener("DOMContentLoaded", populateOrderSummary);

document.getElementById("category-filter").addEventListener("change", (e) => {
  filterProducts(e.target.value);
});

document.getElementById("search-button").addEventListener("click", () => {
  searchProducts();
});

document.getElementById("search-input").addEventListener("input", () => {
  const searchText = document.getElementById("search-input").value.trim();
  if (searchText === "") {
    displayProducts(products);
  }
});

document.querySelector(".checkout-button").addEventListener("click", () => {
  window.location.href = "checkout.html";
});
