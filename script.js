/**
 * @typedef {Object} AllData
 * @property {Object<string, User>} users - A map of user IDs to User objects.
 * @property {Object<string, Task>} tasks - A map of task IDs to Task objects.
 * @property {Object<string, Contact>} contacts - A map of contact IDs to Contact objects.
 */

/**
 * @typedef {Object} User
 * @property {string} mail - The email address of the user.
 * @property {string} password - The password of the user.
 */

/**
 * @typedef {Object} Task
 * @property {string} state - The state of the task: ('to-do', 'in-progress', 'await-feedback', 'done')
 * @property {string} category - The category of the task: ('User Story', 'Technical Task')
 * @property {string} title - The title of the task.
 * @property {string} description - The description of the task.
 * @property {string} dueDate - The due date of the task.
 * @property {string} priority - The priority level of the task ('low', 'medium', 'urgent')
 * @property {Array<string>} assignedTo - IDs of contacts assigned to the task.
 * @property {Array<Object>} subtasks - List of subtasks for the task {title, done}
 */

/**
 * @typedef {Object} Subtask
 * @property {string} title - The title of the subtask.
 * @property {boolean} done - The completion status of the subtask.
 */

/**
 * @typedef {Object} Contact
 * @property {string} name - The name of the contact.
 * @property {string} mail - The email address of the contact.
 * @property {number} phone - The phone number of the contact.
 * @property {string} initials - The initials of the contact's name.
 * @property {string} color - The color associated with the contact.
 */

let allData = {};

/**
 * Include HTML templates on startup and show where user is on page by highlighting active-page-link
 */
document.addEventListener("DOMContentLoaded", async () => {
    if (window.history.length === 1) window.history.replaceState({ previousURL: document.referrer }, "");
    await includeHTML();
    document.body.style.visibility = 'visible';
    outsideLogIn()
    setInitialsSpan();
    paintActiveLink();
});

/**
 * Set the initials of the user in the top right of page.
 */
async function setInitialsSpan() {
    if (localStorage.getItem('mail') !== "guest@maxmusterman.de") {
        const queryContactWhereMailMatch = `?orderBy=%22mail%22&equalTo=%22${encodeURIComponent(localStorage.getItem('mail'))}%22`;
        const contactOfLoggedInUser = await fetchResource('contacts', 'GET', undefined, queryContactWhereMailMatch);
        document.getElementById('user-initials').textContent = Object.values(contactOfLoggedInUser)[0].initials;
    }
}

/**
 * Hide content, when legal pages are accessed without login
 */
function outsideLogIn() {
    let info = sessionStorage.getItem('isLoggedIn');

    if (info !== 'true') {
        const sidebar = document.getElementById('sidebar-main');
        const account = document.getElementById('account-menue');

        if (sidebar) {
            sidebar.classList.replace('links-container', 'dni');
        }
        if (account) {
            account.classList.add('dni');
        }
    }
}

/**
 * Includes HTML from separate files into header and navbar with the attribute `w3-include-html`.
 * @returns {Promise<void>}
 */
async function includeHTML() {
    const elements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const file = el.getAttribute("w3-include-html");
        if (file) {
            try {
                const response = await fetch(file);
                let content;
                if (response.ok) {
                    content = await response.text();
                } else {
                    throw new Error("File not found");
                }
                el.innerHTML = content;
                el.removeAttribute("w3-include-html");
            } catch (error) {
                console.error(error);
            }
        }
    }
}

/**
 * Highlights the active link based on the current URL.
 */
function paintActiveLink() {
    const currentUrl = window.location.pathname;
    const links = document.querySelectorAll('.links-container a');
    links.forEach(link => {
        if (link.getAttribute('href') === currentUrl) {
            link.classList.add('current');
        }
    });
}

/**
 * Navigates back to the previous page in the browser history.
 */
function goBackToPreviousPage() {
    if (window.history.back() === undefined) {
        window.location.href = window.history.state.previousURL;
    } else {
        window.history.back();
    }
}

/**
 * Open/Close the user menu.
 */
function toggleUserMenu() {
    let userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('visible');
    userMenu.classList.toggle('hidden');
}