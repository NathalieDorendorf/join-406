/**
 * @typedef {Object} Contact
 * @property {string} firebaseId
 * @property {string} name
 * @property {string} [phone]
 */

/**
 * @typedef {Object.<string, Contact[]>} GroupedContacts
 */

const contactColors = [
    "--contact-color-orange",
    "--contact-color-pink",
    "--contact-color-lavender",
    "--contact-color-violet",
    "--contact-color-aqua",
    "--contact-color-tropical",
    "--contact-color-coral",
    "--contact-color-peach",
    "--contact-color-magenta",
    "--contact-color-gold",
    "--contact-color-blue",
    "--contact-color-lime",
    "--contact-color-purple",
    "--contact-color-crimson",
    "--contact-color-honey"
];

let contacts = [];

let activeContactId = null;

/**
 * Initializes the contacts by fetching data and rendering them.
 * @returns {Promise<void>}
 */
async function initContacts() {
    allData = await getAllData();
    await loadContacts();
    renderContacts();
    handleResponsiveView();
}

/**
 * Loads the contacts from Firebase and maps them into an array.
 * @returns {Promise<void>}
 */
async function loadContacts() {
    try {
        const data = await fetchContactsFromFirebase();
        contacts = mapFirebaseContacts(data);
        contacts = sortContactsByName(contacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

/**
 * Fetches contacts data from Firebase.
 * @returns {Promise<Object>} The contacts data.
 */
async function fetchContactsFromFirebase() {
    const response = await fetch(`${BASE_URL}/contacts.json`);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return await response.json();
}

/**
 * Maps Firebase contacts data into a structured array.
 * @param {Object} data - Firebase contacts data.
 * @returns {Contact[]} Array of mapped contacts.
 */
function mapFirebaseContacts(data) {
    return Object.keys(data || {}).map(firebaseId => ({
        firebaseId,
        ...data[firebaseId]
    }));
}

/**
 * Sorts contacts alphabetically by their name.
 * @param {Contact[]} contacts - The contacts to sort.
 * @returns {Contact[]} Sorted contacts.
 */
function sortContactsByName(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Renders the contacts grouped by their first letter.
 * @returns {void}
 */
function renderContacts() {
    const groupedContacts = groupContactsByFirstLetter(contacts);
    renderContactList(groupedContacts);
}

/**
 * Groups contacts by the first letter of their name.
 * @param {Contact[]} contacts - The contacts to group.
 * @returns {GroupedContacts} Contacts grouped by their first letter.
 */
function groupContactsByFirstLetter(contacts) {
    return contacts.reduce((grouped, contact) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) grouped[firstLetter] = [];
        grouped[firstLetter].push(contact);
        return grouped;
    }, {});
}

/**
 * Renders the contact list using grouped contacts.
 * @param {GroupedContacts} groupedContacts - Contacts grouped by first letter.
 * @returns {void}
 */
function renderContactList(groupedContacts) {
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = "";
    Object.keys(groupedContacts).sort().forEach(letter => {
        const category = createCategoryElement(letter);
        groupedContacts[letter].forEach(contact => {
            const contactItem = createContactElement(contact);
            category.appendChild(contactItem);
        });
        contactList.appendChild(category);
    });
}

/**
 * Creates a category element for a specific letter.
 * @param {string} letter - The letter to display as the category.
 * @returns {HTMLElement} The category element.
 */
function createCategoryElement(letter) {
    const category = document.createElement("div");
    category.innerHTML = `<h3 class="underline-letter">${letter}</h3>`;
    return category;
}

/**
 * Creates a contact element for a specific contact.
 * @param {Contact} contact - The contact to create the element for.
 * @returns {HTMLElement} The contact list item element.
 */
function createContactElement(contact) {
    const contactItem = document.createElement("li");
    contactItem.innerHTML = generateContactsHTML(contact);
    contactItem.onclick = () => {
        handleContactClick(contact);
        activeContactId = contact.firebaseId;
    }
    return contactItem;
}

/**
 * Handles a contact click by showing contact details on smaller screens.
 * @param {Contact} contact - The clicked contact.
 * @returns {void}
 */
function handleContactClick(contact) {
    if (window.innerWidth < 1025) {
        showResponsiveView();
    }
    showContactDetails(contact);
}

/**
 * Displays contact details.
 * @param {Contact} contact - The contact to display details for.
 * @returns {void}
 */
function showContactDetails(contact) {
    resetPreviousContact();
    highlightActiveContact(contact);
    displayContactDetails(contact);
}

/**
 * Resets the active contact highlight.
 * @returns {void}
 */
function resetActiveContact() {
    if (!activeContactId) return;
    const activeElement = document.getElementById(activeContactId);
    if (activeElement) {
        resetStyles(activeElement);
    }
    activeContactId = null;
}

/**
 * Hides the contact details view.
 * @returns {void}
 */
function hideDetailsView() {
    const detailsContainer = document.getElementById("contactDetails");
    if (detailsContainer) {
        detailsContainer.classList.remove("slide-in");
        detailsContainer.classList.add("slide-out");
        detailsContainer.style.display = "none";
    }
}

/**
 * Resets the previous active contact highlight.
 * @returns {void}
 */
function resetPreviousContact() {
    if (!activeContactId) return;
    const previousActive = document.getElementById(activeContactId);
    if (previousActive) {
        resetStyles(previousActive);
    }
}

/**
 * Resets the styles for an element.
 * @param {HTMLElement} element - The element to reset styles for.
 * @returns {void}
 */
function resetStyles(element) {
    element.style.backgroundColor = "";
    element.style.color = "";
    const initialsCircle = element.querySelector(".initials-circle");
    if (initialsCircle) initialsCircle.style.border = "";
}

/**
 * Highlights the active contact in the contact list.
 * @param {Contact} contact - The contact to highlight.
 * @returns {void}
 */
function highlightActiveContact(contact) {
    const contactElement = document.getElementById(contact.firebaseId);
    if (contactElement) {
        contactElement.style.backgroundColor = "var(--primary-blue)";
        contactElement.style.color = "white";
        const initialsCircle = contactElement.querySelector(".initials-circle");
        if (initialsCircle) initialsCircle.style.border = "2px solid var(--bg-white)";
    }
    activeContactId = contact.firebaseId;
}

/**
 * Displays the contact details in a details container.
 * @param {Contact} contact - The contact whose details to display.
 * @returns {void}
 */
function displayContactDetails(contact) {
    const detailsContainer = document.getElementById("contactDetails");
    if (detailsContainer) {
        detailsContainer.innerHTML = generateContactsDetailsHTML(contact, contact.phone || "");
        detailsContainer.style.display = "flex";
        detailsContainer.classList.remove("slide-out");
        detailsContainer.classList.add("slide-in");
    }
}

/**
 * Handles the responsive view changes.
 * @returns {void}
 */
function handleResponsiveView() {
    if (window.innerWidth < 1025) {
        if (activeContactId) {
            showResponsiveView();
        } else {
            showContactListOnly();
        }
    } else {
        showDesktopView();
    }
}

/**
 * Responds to window resizing.
 * @param {Event} event - The resize event.
 * @returns {void}
 */
window.addEventListener("resize", handleResponsiveView);

/**
 * Shows the responsive view with the contact details.
 * @returns {void}
 */
function showResponsiveView() {
    renderHeaderResponsive();
    document.querySelector(".contacts-container").style.display = "none";
    const contactDetailsContainer = document.querySelector(".contacts-details-container");
    if (contactDetailsContainer) {
        contactDetailsContainer.style.width = "100%";
        contactDetailsContainer.style.display = "flex";
    }
}

/**
 * Shows only the contact list in responsive view.
 * @returns {void}
 */
function showContactListOnly() {
    document.querySelector(".contacts-container").style.display = "flex";
    const contactDetailsContainer = document.querySelector(".contacts-details-container");
    if (contactDetailsContainer) {
        contactDetailsContainer.style.display = "none";
    }
}

/**
 * Shows the desktop view with both contacts and contact details.
 * @returns {void}
 */
function showDesktopView() {
    renderHeader();
    document.querySelector(".contacts-container").style.display = "flex";
    const contactDetailsContainer = document.querySelector(".contacts-details-container");
    if (contactDetailsContainer) {
        contactDetailsContainer.style.width = "";
        contactDetailsContainer.style.display = "flex";
    }
}

/**
 * Navigates back to the contact list from the details view.
 * @returns {void}
 */
function navigateBackToContactList() {
    hideDetailsView();
    resetActiveContact();
    if (window.innerWidth < 1025) {
        const contactDetailsContainer = document.getElementById("contacts-details-container")
        if (contactDetailsContainer) {
            contactDetailsContainer.style.display = "none";
        }
        const contactsContainer = document.querySelector(".contacts-container");
        if (contactsContainer) {
            contactsContainer.style.display = "flex";
        }
    }
}

/**
 * Generates a random color from the contactColors array.
 * @returns {string} A random contact color.
 */
function getRandomColor() {
    return contactColors[Math.floor(Math.random() * contactColors.length)];
}
