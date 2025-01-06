window.addEventListener("beforeunload", () => {
    sessionStorage.removeItem("isLoggedIn");
});