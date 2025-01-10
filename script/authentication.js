function redirectWithLoginInfo(event, url) {
    event.preventDefault();

    const isLoggedIn = sessionStorage.getItem("isLoggedIn") || "false"; // ist isLoggedIn nicht da, dann automatisch false

    //Parameter an die URL heften
    const newUrl = `${url}${url.includes('?') ? '&' : '?'}isLoggedIn=${isLoggedIn}`; //Parameter mit ? oder & anhängen

    if (event.currentTarget.target === "_blank") {
        window.open(newUrl, "_blank");
    } else {
        window.location.href = newUrl;
    }
}

function checkParams() {
    const params = new URLSearchParams(window.location.search);
    const isLoggedIn = params.get("isLoggedIn");

    if (isLoggedIn !== null) {
        sessionStorage.setItem("isLoggedIn", isLoggedIn);
    }
    validateLoggin();
}

function validateLoggin() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
        window.location.href = "./log-in.html"
    };
};


// document.addEventListener('DOMContentLoaded', function() {
//     guestsLimitation();
// });
function guestsLimitation() {

    var status = localStorage.getItem('logInStatus');
    if (status === "guest") {
        document.getElementById('sidebar-main').classList.remove('links-container');
        document.getElementById('sidebar-main').classList.add('d-none');
    }
}