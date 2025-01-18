// Funktion zum Anzeigen des Overlays
function renderAddContactOverlay() {
    const overlayHTML = `
        <div id="addContactOverlay" class="add-new-contact-overlay">
            <div class="overlay-content">
                <div class="overlay-left">
                    <img class="logo-mini" src="/assets/icons/join-logo-white.svg" alt="join">
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
                        <div class="fc gap-8">
                            <input class="input-name input-width" type="text" id="user" placeholder="Name" minlength="2" maxlength="30">
                            <span id="errorMessageName" class="error-message"></span>
                            <input class="input-email input-width"  type="email" id="email" placeholder="Email">
                            <span id="errorMessageEmail" class="error-message"></span>
                            <input class="input-phone input-width"  type="number" id="telephone" placeholder="Phone">
                            <span id="errorMessagePassword" class="error-message"></span>
                        </div>
                        <div class="fr gap-16 wrap ato-footer-buttons">
                            <button id="cancel-add-task-btn" class="button-2 fr jcac gap-8" onclick="closeOverlay()">
                                <span>Cancel</span>
                                <img src="/assets/icons/close.svg" alt="Cancel create task button">
                            </button>
                            <button type="submit" name="submit" class="button fr jcac gap-8" onclick="addNewContact()">
                                <span>Create contact</span>
                                <img src="/assets/icons/check.svg" alt="Create task button">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', overlayHTML);
    setTimeout(() => {
        document.getElementById("addContactOverlay").classList.add("visible");
    }, 10); // Timeout für Transition-Effekt
}


// Funktion zum Anzeigen des Overlays
function renderEditContactOverlay(contactId) {
    const overlayHTML = `
        <div id="addContactOverlay" class="add-new-contact-overlay">
            <div class="overlay-content">
                <div class="overlay-left">
                    <img class="logo-mini" src="/assets/icons/join-logo-white.svg" alt="join">
                    <header class="header-contact">
                        <h1 class="ft-47">Edit contact</h1>
                        <div class="sideline-blue-horizontal"></div>
                    </header>
                </div>
                <div class="overlay-right d-flex">
                    <div class="initials-circle-big" style="background-color: var(${contact.color});">${contact.initials}</div>
                    <button class="button-contacts" onclick="closeOverlay()"><img src="/assets/icons/close.svg" alt="Close"></button>
                    <form id="addContactForm" onsubmit="addNewContact(event); return false;">
                        <div class="fc gap-8">
                            <input class="input-name input-width" type="text" id="user" placeholder="Name" minlength="2" maxlength="30">
                            <span id="errorMessageName" class="error-message"></span>
                            <input class="input-email input-width"  type="email" id="email" placeholder="Email">
                            <span id="errorMessageEmail" class="error-message"></span>
                            <input class="input-phone input-width"  type="number" id="telephone" placeholder="Phone">
                            <span id="errorMessagePassword" class="error-message"></span>
                        </div>
                        <div class="fr gap-16 wrap ato-footer-buttons">
                            <button id="cancel-add-task-btn" class="button-2 fr jcac gap-8" onclick="closeOverlay()">
                                <span>Delete</span>
                            </button>
                            <button type="submit" name="submit" class="button fr jcac gap-8" onclick="saveNewContact()">
                                <span>Save</span>
                                <img src="/assets/icons/check.svg" alt="Create task button">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', overlayHTML);
    setTimeout(() => {
        document.getElementById("addContactOverlay").classList.add("visible");
    }, 10); // Timeout für Transition-Effekt
}
