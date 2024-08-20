function newitem() {
  let newItemName = document.querySelector("#itemname");
  let newItemStock = document.querySelector("#itemquantity");
  let newItemPrice = document.querySelector("#itemprice");
  let newItemImage = document.querySelector("#itemURL");

  let formattedPrice = parseFloat(newItemPrice.value).toFixed(2);
  if (
    !newItemName.value ||
    !newItemStock.value ||
    !newItemPrice.value ||
    !newItemImage.value
  ) {
    swal.fire({
      icon: "error",
      title: "Error",
      text: "You need to fill out all the boxes!",
    });
    return;
  }
  let url = `https://api.local.rednotsus.rocks/card/transact/add?item=${newItemName.value}&stock=${newItemStock.value}&price=${formattedPrice}&imageURL=${newItemImage.value}`;
  fetch(url).then((response) => {
    if (response.ok) {
      swal.fire({
        icon: "success",
        title: "Success",
        text: "Item added successfully!",
      });
      newItemName.value = "";
      newItemStock.value = "";
      newItemPrice.value = "";
      newItemImage.value = "";
    } else if (response.status == 500) {
      swal.fire({
        icon: "error",
        title: "Error",
        text: response.error,
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  let newItemName = document.querySelector("#itemname");
  let newItemImage = document.querySelector("#itemURL");

  function updateNewItemName() {
    let previewname = document.querySelector("#previewname");
    previewname.innerText = newItemName.value;
  }

  function updateNewItemImage() {
    let previewimage = document.querySelector("#previewimg");
    previewimage.src = newItemImage.value;
  }

  if (newItemName) {
    newItemName.addEventListener("keyup", updateNewItemName);
  }

  if (newItemImage) {
    newItemImage.addEventListener("keyup", updateNewItemImage);
  }
});
