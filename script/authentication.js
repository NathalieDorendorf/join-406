/**
 * Redirects the user to a given URL, appending the login status as a query parameter.
 * If the link's target is "_blank", the URL is opened in a new tab, otherwise the browser navigates to the URL.
 * @param {Event} event - The click event triggered by the user.
 * @param {string} url - The target URL to redirect to.
 * @returns {void}
 */
function redirectWithLoginInfo(event, url) {
    event.preventDefault();

    const isLoggedIn = sessionStorage.getItem("isLoggedIn") || "false";
    const newUrl = `${url}${url.includes('?') ? '&' : '?'}isLoggedIn=${isLoggedIn}`;

    if (event.currentTarget.target === "_blank") {
        window.open(newUrl, "_blank");
    } else {
        window.location.href = newUrl;
    }
}

/**
 * Checks the URL parameters for the 'isLoggedIn' value and stores it in the sessionStorage.
 * Also calls the validateLoggin function to ensure the user is logged in.
 * @returns {void}
 */
function checkParams() {
    const params = new URLSearchParams(window.location.search);
    const isLoggedIn = params.get("isLoggedIn");

    if (isLoggedIn !== null) {
        sessionStorage.setItem("isLoggedIn", isLoggedIn);
    }
    validateLoggin();
}

/**
 * Validates the login status stored in sessionStorage and redirects the user to the login page if not logged in.
 * @returns {void}
 */
function validateLoggin() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true" && !hasAccessWithoutLogin(window.location.pathname)) {
        window.location.href = "/index.html";
    }
};

function hasAccessWithoutLogin(pathname) {
    if (pathname === '/html/privacy-policy.html' || pathname === '/html/legal-notice.html') {
        return true;
    }
    return false;
}