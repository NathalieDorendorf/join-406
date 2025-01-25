/**
 * Renders the "Add Contact" overlay HTML.
 * This overlay allows the user to add a new contact by providing a name, email, and phone number.
 * 
 * @returns {string} The HTML string for the "Add Contact" overlay.
 */
function renderAddContactOverlay() {
    return overlayHTML = `
            <div class="overlay-content">
                <div class="overlay-left">
                    <img class="logo-mini" src="/assets/icons/join-logo-white.svg" alt="join">
                    <button class="button-contacts-white" onclick="closeOverlay()"><img src="/assets/icons/close-white.svg" alt="Close"></button>
                    <header class="header-contact">
                        <h1 class="ft-47">Add contact</h1>
                        <h4 class="ft-20">Tasks are better with a team!</h4>
                        <div class="sideline-blue-horizontal"></div>
                    </header>
                </div>
                <div class="overlay-right d-flex">
                    <div class="initials-circle-big-person">
                    </div>
                    <button class="button-contacts" onclick="closeOverlay()"><img src="/assets/icons/close.svg" alt="Close"></button>
                    <form id="addContactForm" onsubmit="addNewContact(event); return false;">
                        <div class="fc gap-8 w-100">
                            <input class="input-name input-width" type="text" id="user" placeholder="Name" minlength="2" maxlength="30" required>
                            <input class="input-email input-width"  type="email" id="email" placeholder="Email" required>
                            <span id="errorMessageEmail" class="error-message"></span>
                            <input class="input-phone input-width"  type="tel" pattern="^\\+?[0-9]+(\\s[0-9]+)*$" id="telephone" placeholder="+49 123456789">
                        </div>
                        <div class="fr gap-16 wrap ato-footer-buttons">
                            <button type="button" id="cancel-add-task-btn" class="button-2 fr jcac gap-8 cancel-btn" onclick="closeOverlay()">
                                <span>Cancel</span>
                                <img src="/assets/icons/close.svg" alt="Cancel create task button">
                            </button>
                            <button type="submit" name="submit" class="button fr jcac gap-8">
                                <span>Create contact</span>
                                <img src="/assets/icons/check.svg" alt="Create task button">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    `;
}

/**
 * Renders the "Edit Contact" overlay HTML.
 * This overlay allows the user to edit an existing contact's details, such as name, email, and phone number.
 * 
 * @param {string} firebaseId - The unique identifier of the contact to be edited.
 * @returns {string} The HTML string for the "Edit Contact" overlay.
 */
function renderEditContactOverlay(firebaseId) {
    const contact = findContactById(firebaseId);
    return overlayHTML = `
            <div class="overlay-content">
                <div class="overlay-left">
                    <img class="logo-mini" src="/assets/icons/join-logo-white.svg" alt="join">
                    <button class="button-contacts-white" onclick="closeOverlay()"><img src="/assets/icons/close-white.svg" alt="Close"></button>
                    <header class="header-contact">
                        <h1 class="ft-47">Edit contact</h1>
                        <div class="sideline-blue-horizontal"></div>
                    </header>
                </div>
                <div class="overlay-right d-flex">
                    <div class="initials-circle-big position-initials-circle" style="background-color: var(${contact.color});">${contact.initials}</div>
                    <button class="button-contacts" onclick="closeOverlay()"><img src="/assets/icons/close.svg" alt="Close"></button>
                    <form id="editContactForm" onsubmit="saveContact(event, '${contact.firebaseId}'); return false;">
                        <div class="fc gap-8">
                            <input class="input-name input-width" type="text" id="user" placeholder="Name" value="${contact.name}" minlength="2" maxlength="30" required>
                            <input class="input-email input-width" type="email" id="email" placeholder="Email" value="${contact.mail}" required>
                            <span id="errorMessageEmailExists" class="error-message"></span>
                            <input class="input-phone input-width" type="tel" pattern="^\\+?[0-9]+(\\s[0-9]+)*$" id="telephone" placeholder="+49 123456789" value="${contact.phone}">
                        </div>
                        <div class="fr gap-16 wrap ato-footer-buttons">
                            <button type="button" id="cancel-edit-task-btn" class="button-2 fr jcac gap-8" onclick="closeOverlay()">
                                <span>Cancel</span>
                                <img src="/assets/icons/close.svg" alt="Cancel edit contact button">
                            </button>
                            <button type="submit" name="submit" class="button fr jcac gap-8">
                                <span>Save</span>
                                <img src="/assets/icons/check.svg" alt="Save contact button">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    `;
}