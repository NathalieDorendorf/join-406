const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

if (msg) {
  messageBox.innerHTML = msg;
} else {
  // display: none;
  messageBox.style.display = "none";
}


function logIn() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find(user => user.email === email.value && user.password === password.value);

  if (user) {
    console.log("User found");
    //     localStorage.setItem("user", JSON.stringify(user));
    //     window.location.href = "dashboard.html";
    // } else {
    //     messageBox.style.display = "block";
    //     messageBox.innerHTML = "Invalid email or password";
    // }
  }
}

