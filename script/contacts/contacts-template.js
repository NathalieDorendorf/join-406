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

function generateContactsDetailsDesktopHTML(contact, phoneNumber) {
    return `
        <div class="d-flex gap-24">
            <div class="initials-circle-big" style="background-color: var(${contact.color});">
                ${contact.initials}
            </div>
            <div class="name-container">
                <h2>${contact.name}</h2>
                <div class="d-flex gap-8">
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

function generateContactsDetailsMobileHTML(contact, phoneNumber) {
    return `
        <header class="">
            <div class="fc sb gap-8">
                <h1 class="h1-responsive">Contacts</h1>
                <h4 class="h4-responsive">Better with a team</h4>
                <div class="sideline-blue"></div>
            </div>
            <button class="button-contacts" onclick="closeContactDetailsOverlay()"><img src="/assets/icons/arrow-left.svg" alt="back"></button>
        </header>
        <div class="initials-name-container">
            <div class="initials-circle-big" style="background-color: var(${contact.color});">
                ${contact.initials}
            </div>
            <div class="name-container">
                <h2>${contact.name}</h2>
                <div class="d-flex gap-8">
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
        <button class="button btn-mobile-little-menu" onclick="showLittleMenu()"><img src="/assets/icons/three-dots.svg" alt="menu"</button>
    `;
}

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
                            <input class="input-phone input-width"  type="tel" id="telephone" placeholder="Phone">
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
                            <input class="input-phone input-width" type="tel" id="telephone" placeholder="Phone" value="${contact.phone}">
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
