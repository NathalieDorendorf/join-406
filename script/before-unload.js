// window.addEventListener("beforeunload", () => {
//     localStorage.removeItem("isLoggedIn");
// });

// Flag setzen, wenn die Seite geladen wird
if (!sessionStorage.getItem("pageReloaded")) {
    sessionStorage.setItem("pageReloaded", "true");
}

// EventListener für beforeunload
window.addEventListener("beforeunload", () => {
    // Überprüfen, ob die Seite nicht neu geladen wurde
    if (sessionStorage.getItem("pageReloaded")) {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("pageReloaded"); // Flag zurücksetzen
    }
});

// Dies wird beim Neuladen der Seite gelöscht, aber nicht beim Schließen
window.addEventListener("unload", () => {
    sessionStorage.removeItem("pageReloaded"); //beim Neuladen zurücksetzen
});
