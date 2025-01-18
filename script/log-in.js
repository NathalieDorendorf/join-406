/**
 * Shows logo-animation, when page is loaded
 */
(showLogoAnimation = document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) { // media-breakpoint, where logo is display: none
        const overlay = document.createElement('div');
        overlay.classList.add('animation-overlay');
        document.body.appendChild(overlay);
        document.body.style.visibility = 'visible';
        const logo = document.querySelector('.logo-little');
        logo.classList.add('animate');
        overlay.classList.add('close-overlay');
    }
}));

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
 * Validates whether a matching user was found.
 * Redirects the user to the summary page if a match is found.
 * Displays an error message if no match is found.
 * @param {Object|null} matchingUser - The user object if a match is found, or null if no match is found.
 */

function validateMatch(matchingUser, isGuest = false) {
    if (matchingUser || isGuest) {
        // Wenn es ein regulärer Benutzer ist und eine Übereinstimmung gefunden wurde, oder es ein Gast-Login ist
        addToSessionStorage(true);  // Speichern im Session Storage, dass der Benutzer eingeloggt ist
        window.location.href = "/html/summary.html?msg=you have logged in successfully&isLoggedIn=true";  // Weiterleitung zur gleichen Seite für alle User
    } else {
        // Wenn keine Übereinstimmung gefunden wurde
        let email = document.getElementById('email');
        let password = document.getElementById('password');
        checkLogin(email, password);  // Fehlermeldung für falsche Login-Daten
        clearLoginData(password);  // Zurücksetzen der Eingabefelder
    }
}



// function validateMatch(matchingUser) {
//   if (matchingUser) {
//     addToSessionStorage(true);
//     window.location.href = "summary.html?msg=you have logged in successfully&isLoggedIn=true";
//   } else {
//     let email = document.getElementById('email');
//     let password = document.getElementById('password');
//     checkLogin(email, password);
//     clearLoginData(password);
//   }
// }

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
