/**
 * Shows logo-animation, when page is loaded.
 * Only show once.
 */
document.addEventListener('DOMContentLoaded', () => {
    setShowAnimationState();
    const logoNotAnimatedBefore = JSON.parse(localStorage.getItem('showAnimation'));
    let logo = null;
    const overlay = document.createElement('div');
    if (logoNotAnimatedBefore) {
        if (window.innerWidth <= 768) {
            logo = document.querySelector('.logo-little-responsive');
            overlay.classList.add('animation-overlay-dark');
            showAnimation('animate-mobile');
        } else {
            logo = document.querySelector('.logo-little');
            showAnimation('animate');
        }
    }

    /**
     * Show animation only once.
     * @returns {void}
     */
    function setShowAnimationState() {
        if (!(localStorage.getItem('showAnimation'))) {
            localStorage.setItem('showAnimation', true);
        } else {
            localStorage.setItem('showAnimation', false);
        }
    }

    /**
     * Shows the logo-animation.
     * @param {string} animationClass - The class name of the logo animation.
     */
    async function showAnimation(animationClass) {
        await sleep(100);
        overlay.classList.add('animation-overlay');
        document.body.appendChild(overlay);
        logo.classList.add(animationClass);
        overlay.classList.add('close-overlay');
        overlay.addEventListener('animationend', () => overlay.classList.add('dni'));
    }
});

/**
 * Extracts the message parameter from the URL and displays it in the message box.
 * If no message is present, hides the message box.
 */
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

/**
 * Retrieves the email and password values from the input fields and attempts to log in the user.
 */
function getInputData(guest) {
    if (!guest) {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        logIn('/users', email, password);
    } else {
        let email = 'guest@maxmusterman.de';
        let password = '1234567890';
        logIn('/guest', email, password, true);
    }
}

/**
 * Logs in the user by checking the provided email and password against the users in the database.
 * @param {string} path - The path to the users database.
 * @param {string} enteredEmail - The email entered by the user.
 * @param {string} enteredPassword - The password entered by the user.
 * @param {boolean} guest - A boolean value indicating if the login is for a guest. 
 * `true` for guest login, `false` for regular user login.
 */

async function logIn(path, enteredEmail, enteredPassword, isGuest) {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        if (isGuest) {
            const guestUser = { email: enteredEmail, password: enteredPassword };
            validateMatch(guestUser, true);
        } else {
            const matchingUser = Object.values(responseToJson).find(user =>
                user.email === enteredEmail && user.password === enteredPassword
            );
            validateMatch(matchingUser);
        }
    } catch (error) {
        console.error("Login error:", error);
    }
}

/**
 * Validates a user match or guest login and handles the subsequent actions.
 *
 * @param {boolean} matchingUser - Indicates if the user matches the login criteria.
 * @param {boolean} [isGuest=false] - Optional parameter to specify if the user is logging in as a guest.
 *
 * If the user matches (`matchingUser` is true) or is a guest (`isGuest` is true), the function:
 * - Adds a login status to the session storage.
 * - Redirects the user to the summary page with a success message.
 *
 * If neither condition is true, the function:
 * - Retrieves the email and password input fields.
 * - Validates the login credentials by calling `checkLogin`.
 * - Clears the password field using `clearLoginData`.
 */
function validateMatch(matchingUser, isGuest = false) {
    if (matchingUser || isGuest) {
        addToSessionStorage(true);
        localStorage.setItem("mail", matchingUser.email);
        clearLoginData();
        window.location.href = "/html/summary.html?msg=you have logged in successfully&isLoggedIn=true";
    } else {
        let email = document.getElementById('email');
        let password = document.getElementById('password');
        checkLogin(email, password);
        clearLoginData(password);
    }
}

/**
 * Displays an error message if the email or password does not match.
 * @param {HTMLElement} email - The email input element.
 * @param {HTMLElement} password - The password input element.
 */
function checkLogin(email, password) {
    if (email || password) {
        document.getElementById('errorMessageLogin').innerHTML = `
      <div class="errorText">Check your email and password. Please try again</div>
    `;
        document.getElementById('email').style.border = "1px solid red";
        document.getElementById('password').style.border = "1px solid red";
    }
}

/**
 * Clears the password input field.
 * @param {HTMLElement} password - The password input element.
 */
function clearLoginData(password) {
    password.value = "";
}

/**
 * Adds the login status to session storage.
 * @param {boolean} login - The login status (true if logged in, false if not).
 */
function addToSessionStorage(login) {
    sessionStorage.setItem("isLoggedIn", JSON.stringify(login));
}

/**
 * Clears all user data from the form.
 */
function clearLoginData() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

/**
 * Waits for a specified amount of time.
 * @param {number} ms - The time in milliseconds to wait.
 * @returns {Promise} A promise that resolves after the specified time has passed.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}