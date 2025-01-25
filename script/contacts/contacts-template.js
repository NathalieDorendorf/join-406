/**
 * Generates HTML for a contact entry to be displayed in the contact list.
 * 
 * @param {Object} contact - The contact object containing details of the contact.
 * @param {string} contact.firebaseId - The Firebase ID of the contact.
 * @param {string} contact.color - The background color for the contact's initials circle.
 * @param {string} contact.initials - The initials of the contact.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.mail - The email address of the contact.
 * @returns {string} The HTML string for the contact entry.
 */
function generateContactsHTML(contact) {
    return `
        <div class="contact-info-container" id="${contact.firebaseId}">
            <div class="initials-circle" style="background-color: var(${contact.color});">
                ${contact.initials}
            </div>
            <div>
                <p>${contact.name}</p>
                <span>${contact.mail}</span>
            </div>
        </div>
    `;
}

/**
 * Renders the header for the contacts page on larger screens.
 * This function sets the header content for the main contact list page.
 */
function renderHeader() {
    let header = document.getElementById('header');
    header.innerHTML = '';
    header.innerHTML = `
        <h1>Contacts</h1>
        <div class="sideline-blue"></div>
        <h4>Better with a team</h4>
    `;
}

/**
 * Renders a responsive header for the contacts page on smaller screens.
 * This function sets the header content for mobile or smaller devices.
 */
function renderHeaderResponsive() {
    let header = document.getElementById('header');
    header.innerHTML = '';
    header.innerHTML = `
        <div class="fc sb gap-8">
            <h1 class="h1-responsive">Contacts</h1>
            <h4 class="h4-responsive">Better with a team</h4>
            <div class="sideline-blue"></div>
        </div>
        <button class="button-contacts-back" onclick="navigateBackToContactList()"><img src="/assets/icons/arrow-left.svg" alt="back"></button>
        <button class="button btn-mobile-little-menu" onclick="openOverlay(showLittleMenu(),'fly-in-from-right', 'fly-out-to-right')"><img src="/assets/icons/three-dots.svg" alt="menu"></button>
    `;
}

/**
 * Generates HTML for the detailed view of a contact, including contact information and action buttons.
 * 
 * @param {Object} contact - The contact object containing details of the contact.
 * @param {string} contact.firebaseId - The Firebase ID of the contact.
 * @param {string} contact.color - The background color for the contact's initials circle.
 * @param {string} contact.initials - The initials of the contact.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.mail - The email address of the contact.
 * @param {string} phoneNumber - The phone number of the contact (optional).
 * @returns {string} The HTML string for the contact's detailed view.
 */
function generateContactsDetailsHTML(contact, phoneNumber) {
    return `
        <div class="initials-name-container">
            <div class="initials-circle-big" style="background-color: var(${contact.color});">
                ${contact.initials}
            </div>
            <div class="name-container">
                <h2>${contact.name}</h2>
                <div class="d-flex gap-8 name-container-ui">
                    <button class="button-contacts" onclick="openOverlay(renderEditContactOverlay('${contact.firebaseId}'),'fly-in-from-right', 'fly-out-to-right')"><img src="/assets/icons/edit-blue.svg" alt="edit">Edit</button>
                    <button class="button-contacts" onclick="deleteContact('${contact.firebaseId}')"><img src="/assets/icons/delete-blue.svg" alt="delete">Delete</button>
                </div>                
            </div>
        </div>
        <h2>Contact Information</h2>
        <h3>Email</h3>
        <a href="mailto:${contact.mail}">${contact.mail}</a>
        <h3>Phone</h3>
        ${phoneNumber ? `<a href="tel:${phoneNumber}">${phoneNumber}</a>` : ""}
    `;
}

/**
 * Displays a small menu with "Edit" and "Delete" buttons for a contact.
 * The menu is shown when the user clicks on a menu button, and it allows
 * the user to edit or delete the contact.
 * 
 * @param {string} firebaseId - The Firebase ID of the contact for which the menu is being shown.
 * @returns {string} The HTML string representing the small menu with "Edit" and "Delete" buttons.
 */
function showLittleMenu() {
    return `
        <div class="little-menu">
            <button class="button-contacts" onclick="removeOverlay(); openOverlay(renderEditContactOverlay('${activeContactId}'),'fly-in-from-right', 'fly-out-to-right')"><img src="/assets/icons/edit-blue.svg" alt="edit">Edit</button>
            <button class="button-contacts" onclick="removeOverlay(); deleteContact('${activeContactId}')"><img src="/assets/icons/delete-blue.svg" alt="delete">Delete</button>
        </div>                
    `;
}
