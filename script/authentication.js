function validateLoggin() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        console.log("User ist eingelogged");
    } else if (isLoggedIn === "false" || isLoggedIn === null) {
        console.log("User ist nicht eingelogged");
        window.location.href = "./log-in.html";
    }
}
  validateLoggin();