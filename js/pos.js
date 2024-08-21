const productsContainer = document.getElementById("products");
const cartItemsContainer = document.getElementById("cart-items");
const totalItemsElement = document.getElementById("total-items");
const totalPriceElement = document.getElementById("total-price");
const orderTaxElement = document.getElementById("order-tax");
const totalPayableElement = document.getElementById("total-payable");

let cart = [];

function loadProducts(products) {
  products.forEach((product) => {
    product.price = parseFloat(product.price);
    const productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.innerHTML = `
      <img src="${product.imageURL}" alt="${product.item}">
      <p>${product.item}</p>
    `;
    productElement.onclick = () => addToCart(product);
    productsContainer.appendChild(productElement);
  });
}

function addToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function renderCart() {
  cartItemsContainer.innerHTML = "";
  let subPrice = 0;
  let tax = 0;
  cart.forEach((item) => {
    subPrice += item.price * item.quantity;
    tax += subPrice * 0.0625;

    const cartItemElement = document.createElement("tr");
    cartItemElement.innerHTML = `
                <td>${item.item}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td><button class="delete" onclick="removeFromCart(${
                  item.id
                })">🗑️</button></td>
            `;
    cartItemsContainer.appendChild(cartItemElement);
  });

  totalPriceElement.textContent = `$${subPrice.toFixed(2)}`;
  orderTaxElement.textContent = `$${tax.toFixed(2)}`;
  totalPayableElement.textContent = `$${(subPrice + tax).toFixed(2)}`;
  console.log(cart);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function cancelOrder() {
  if (cart.length === 0) {
    return Swal.fire({
      text: "Cart is empty!",
    });
  } else {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        cart = [];
        renderCart();
      }
    });
  }
}

function payment() {
  if (cart.length === 0) {
    return Swal.fire({
      text: "Cart is empty!",
    });
  } else {
    Swal.fire({
      title: "Check Out",
      input: "number",
      html: `
        Subtotal: <b>${totalPriceElement.textContent}</b><br>
        Tax: <b>${orderTaxElement.textContent}</b><br>
        Total Price: <b>${totalPayableElement.textContent}</b><br>
        

    `,
      inputAttributes: {
        maxlength: "16",
        autocapitalize: "off",
        autocorrect: "off",
      },
      inputLabel: "Card Number",
      inputValue: "",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    }).then(async (result) => {
      const cardNumber = result.value;
      if (result.isConfirmed) {
        try {
          let balanceCheck = await fetch(
            `https://api.local.rednotsus.rocks/card/info/balance?number=${cardNumber}`
          );
          let balanceData = await balanceCheck.json();

          if (!balanceCheck.ok) {
            throw new Error(balanceData.error || "Failed to check balance");
          }

          if (
            parseFloat(balanceData.balance) <
            parseFloat(totalPayableElement.textContent.slice(1))
          ) {
            throw new Error("Insufficient balance");
          }
          let success = false;
          for (const item of cart) {
            let response = await fetch(
              `https://api.local.rednotsus.rocks/card/transact/buy?from=${cardNumber}&itemID=${item.id}&amount=${item.quantity}`
            );
            let transactionResponse = await response.json();

            if (!response.ok) {
              throw new Error(
                transactionResponse.error || "Transaction failed"
              );
            }

            if (transactionResponse.message === "Transaction Successful") {
              success = true;
            }
          }
          if (success) {
            await Swal.fire({
              title: "Transaction Successful!",
              text: "Thank you for shopping with us!",
              html: `
                <b>Items Bought:</b> ${cart.length}<br>
                <b>Subtotal:</b> ${totalPriceElement.textContent}<br>
                <b>Tax:</b> ${orderTaxElement.textContent}<br>
                <b>Total Paid:</b> ${totalPayableElement.textContent}<br>
              `,
              icon: "success",
            });
            cart = [];
            renderCart();
          }
        } catch (error) {
          success = false;
          await Swal.fire({
            title: "Transaction failed!",
            text: `Error: ${error.message}`,
            icon: "error",
          });
        }
      }
    });
  }
}
window.onload = fetch(
  "https://api.local.rednotsus.rocks/card/transact/storeItems"
)
  .then((response) => response.json())
  .then((products) => {
    loadProducts(products);
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });
