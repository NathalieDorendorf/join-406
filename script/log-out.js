/**
 * Logs out the user by clearing the login status from the sessionStorage.
 * It also calls the checkGuestLogOut function to handle guest logout.
 * @function
 */
function logOut() {
    let logstatus = sessionStorage.getItem('isLoggedIn');
    logstatus = false;
    sessionStorage.setItem('isLoggedIn', logstatus);
    checkGuestLogOut();
    localStorage.clear();
};

/**
 * Checks if the user is logged in as a guest by checking the 'logInStatus' in the localStorage.
 * If found, it removes the 'logInStatus' from the localStorage.
 * @function
 */
function checkGuestLogOut() {
    let status = localStorage.getItem('logInStatus');
    if (status) {
        localStorage.removeItem('logInStatus');
    }
};
