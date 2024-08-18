let username;
let password;

document.addEventListener("DOMContentLoaded", function () {
  username = document.getElementById("user");
  password = document.getElementById("pass");
});

async function login() {
  if (!username.value || !password.value) {
    swal.fire({
      title: "Error",
      text: "Please enter both username and password",
      icon: "error",
    });
    return;
  }
  try {
    let response = await fetch(
      "http://localhost:3000/card/admin/adminLogin?username=" +
        username.value +
        "&password=" +
        password.value
    );
    let data = await response.json();
    if (data.message == "Success") {
      window.location.href = "index.html";
      localStorage.setItem("authenticated", true);
    } else {
      swal.fire({
        title: "Error",
        text: "Invalid username or password",
        icon: "error",
      });
    }
  } catch (error) {
    swal.fire({
      title: "Error",
      text: "An error occurred while logging in",
      icon: "error",
    });
  }
}
