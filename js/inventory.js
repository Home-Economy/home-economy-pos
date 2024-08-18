async function fetchInventoryData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching inventory data:", error);
  }
}

function displayInventoryItems(items) {
  const tableBody = document.querySelector(".expense-table table tbody");
  tableBody.innerHTML = "";

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", item.id);
    row.innerHTML = `
      <td data-label="Item" onclick="edit(${item.id}, 1)">${item.item}</td>
      <td data-label="Stock" onclick="edit(${item.id}, 2)">${item.stock}</td>
      <td data-label="Price" onclick="edit(${item.id}, 3)">$${parseFloat(
      item.price
    ).toFixed(2)}</td>
      <td data-label="Image URL" onclick="edit(${item.id}, 4)">${
      item.imageURL
    }</td>
    `;
    tableBody.appendChild(row);
  });
}

async function loadInventoryItems() {
  const apiUrl = "http://localhost:3000/card/transact/storeItems";
  const data = await fetchInventoryData(apiUrl);

  if (data && Array.isArray(data)) {
    displayInventoryItems(data);
  } else {
    console.error("Invalid inventory data received from API");
  }
}

async function edit(id, type) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) {
    console.error(`Row with id ${id} not found`);
    return;
  }

  if (type == 1) {
    swal
      .fire({
        title: "Edit Item Name",
        input: "text",
        showCancelButton: true,
        inputLabel: "New Item Name",
        inputAttributes: {
          autocapitalize: "off",
          autocomplete: "off",
        },
        inputValue: `${row.querySelector("td:nth-child(1)").innerText}`,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          let status = await fetch(
            `http://localhost:3000/card/transact/edit?itemID=${id}&item=${result.value}`
          );
          if (status.ok) {
            loadInventoryItems();
          } else if (status.status == 500) {
            swal.fire({
              icon: "error",
              title: "Error",
              text: status.error,
            });
          }
        }
      });
  } else if (type == 2) {
    swal
      .fire({
        title: "Edit Item Stock",
        input: "number",
        showCancelButton: true,
        inputLabel: "New Item Stock",
        inputAttributes: {
          autocapitalize: "off",
          autocomplete: "off",
        },
        inputValue: `${row.querySelector("td:nth-child(2)").innerText}`,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          let status = await fetch(
            `http://localhost:3000/card/transact/edit?itemID=${id}&stock=${result.value}`
          );
          if (status.ok) {
            loadInventoryItems();
          } else if (status.status == 500) {
            swal.fire({
              icon: "error",
              title: "Error",
              text: status.error,
            });
          }
        }
      });
  } else if (type == 3) {
    swal
      .fire({
        title: "Edit Item Price",
        input: "number",
        showCancelButton: true,
        inputLabel: "New Item Price",
        inputAttributes: {
          autocapitalize: "off",
          autocomplete: "off",
        },
        inputValue: `${row
          .querySelector("td:nth-child(3)")
          .innerText.replace("$", "")}`,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          let newPrice = parseFloat(result.value).toFixed(2);
          let status = await fetch(
            `http://localhost:3000/card/transact/edit?itemID=${id}&price=${newPrice}`
          );
          if (status.ok) {
            loadInventoryItems();
          } else if (status.status == 500) {
            swal.fire({
              icon: "error",
              title: "Error",
              text: status.error,
            });
          }
        }
      });
  } else if (type == 4) {
    swal
      .fire({
        title: "Edit Item URL",
        input: "url",
        showCancelButton: true,
        inputLabel: "New Item URL",
        inputAttributes: {
          autocapitalize: "off",
          autocomplete: "off",
        },
        inputValue: `${row.querySelector("td:nth-child(4)").innerText}`,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          let status = await fetch(
            `http://localhost:3000/card/transact/edit?itemID=${id}&imageURL=${result.value}`
          );
          if (status.ok) {
            loadInventoryItems();
          } else if (status.status == 500) {
            swal.fire({
              icon: "error",
              title: "Error",
              text: status.error,
            });
          }
        }
      });
  }
}

window.addEventListener("load", loadInventoryItems);
