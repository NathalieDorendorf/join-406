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

async function initContacts() {
    await loadContacts();
    renderContacts();
}

async function loadContacts() {
    try {
        const data = await fetchContactsFromFirebase();
        contacts = mapFirebaseContacts(data);
        contacts = sortContactsByName(contacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

async function fetchContactsFromFirebase() {
    const response = await fetch(`${BASE_URL}/contacts.json`);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return await response.json();
}

function mapFirebaseContacts(data) {
    return Object.keys(data || {}).map(firebaseId => ({
        firebaseId,
        ...data[firebaseId]
    }));
}

function sortContactsByName(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function renderContacts() {
    const groupedContacts = groupContactsByFirstLetter(contacts);
    renderContactList(groupedContacts);
}

function groupContactsByFirstLetter(contacts) {
    return contacts.reduce((grouped, contact) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) grouped[firstLetter] = [];
        grouped[firstLetter].push(contact);
        return grouped;
    }, {});
}

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

function createCategoryElement(letter) {
    const category = document.createElement("div");
    category.innerHTML = `<h3 class="underline-letter">${letter}</h3>`;
    return category;
}

function createContactElement(contact) {
    const contactItem = document.createElement("li");
    contactItem.innerHTML = generateContactsHTML(contact);
    contactItem.onclick = () => handleContactClick(contact);
    return contactItem;
}

function handleContactClick(contact) {
    if (window.innerWidth < 1025) {
        showContactDetailsOverlay(contact);
    } else {
        showContactDetails(contact);
    }
}

function showContactDetails(contact) {
    const detailsContainer = document.getElementById("contactDetails");

    // Wenn derselbe Kontakt erneut geklickt wird
    if (activeContactId === contact.firebaseId) {
        // Hintergrundfarbe und Stile entfernen
        const activeElement = document.getElementById(activeContactId);
        if (activeElement) {
            activeElement.style.backgroundColor = "";
            activeElement.style.color = ""; // Schriftfarbe zurücksetzen
            const initialsCircle = activeElement.querySelector(".initials-circle");
            if (initialsCircle) initialsCircle.style.border = "";
        }

        // Detailansicht ausblenden
        if (detailsContainer) {
            detailsContainer.classList.remove("slide-in");
            detailsContainer.classList.add("slide-out");
            detailsContainer.classList.remove("slide-out");
            detailsContainer.style.display = "none";
        }

        activeContactId = null; // Aktiver Kontakt zurücksetzen
        return;
    }

    // Entfernt die Hintergrundfarbe und Stile vom vorherigen Kontakt
    if (activeContactId) {
        const previousActive = document.getElementById(activeContactId);
        if (previousActive) {
            previousActive.style.backgroundColor = "";
            previousActive.style.color = ""; // Schriftfarbe zurücksetzen
            const previousInitialsCircle = previousActive.querySelector(".initials-circle");
            if (previousInitialsCircle) previousInitialsCircle.style.border = "";
        }
    }

    // Setzt die Hintergrundfarbe, Schriftfarbe und Rand für den neuen Kontakt
    const contactElement = document.getElementById(contact.firebaseId);
    if (contactElement) {
        contactElement.style.backgroundColor = "var(--primary-blue)";
        contactElement.style.color = "white"; // Schriftfarbe auf Weiß setzen
        const initialsCircle = contactElement.querySelector(".initials-circle");
        if (initialsCircle) initialsCircle.style.border = "2px solid var(--bg-white)";
    }
    activeContactId = contact.firebaseId;

    // Details in das Detail-Div einfügen und einblenden
    if (detailsContainer) {
        detailsContainer.innerHTML = generateContactsDetailsDesktopHTML(contact, contact.phone || "");
        detailsContainer.style.display = "block"; // Sicherstellen, dass es sichtbar ist
        detailsContainer.classList.remove("slide-out");
        detailsContainer.classList.add("slide-in");
    }
}

function showContactDetailsOverlay(contact) {
    const contactsList = document.getElementById('contactsContainer');
    const overlayContainer = document.getElementById("contactDetailsOverlay");

    if (!overlayContainer) return;

    // Details in das Overlay einfügen
    overlayContainer.innerHTML = generateContactsDetailsMobileHTML(contact, contact.phone || "");

    // Overlay anzeigen und Animation starten
    contactsList.classList.add("d-none");
    overlayContainer.style.display = "flex";
    overlayContainer.classList.remove("slide-out-bottom");
    overlayContainer.classList.add("slide-in-bottom");
}

function closeContactDetailsOverlay() {
    const contactsList = document.getElementById('contactsContainer');
    const overlayContainer = document.getElementById("contactDetailsOverlay");
    if (!overlayContainer) return;
    overlayContainer.classList.remove("slide-in-bottom");
    overlayContainer.classList.add("slide-out-bottom");
    contactsList.classList.remove("d-none");
    overlayContainer.style.display = "none";
    overlayContainer.classList.remove("slide-out-bottom");
}

async function addNewContact(event) {
    event.preventDefault();
    const { name, email, phone } = getContactFormData();
    if (!name || !email) return alert("Please fill in all required fields");
    if (await isEmailInvalid(email)) return;

    const contact = createNewContact(name, email, phone);
    await saveContactToFirebase(contact);
    await initContacts();
    showToastMessage({ message: "Contact successfully created" });
}

function getContactFormData() {
    return {
        name: document.getElementById("user").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("telephone").value.trim()
    };
}

async function isEmailInvalid(email) {
    const emailElement = document.getElementById("email");
    const isEmailValid = await checkEmail(emailElement);
    const emailExists = await checkEmailExisting(emailElement);
    return !isEmailValid || emailExists;
}

function createNewContact(name, email, phone) {
    return {
        color: getRandomColor(),
        initials: getInitials(name),
        mail: email,
        name,
        phone
    };
}

function getRandomColor() {
    return contactColors[Math.floor(Math.random() * contactColors.length)];
}

function getInitials(name) {
    return name.split(' ').map(part => part[0].toUpperCase()).join('');
}

async function saveContactToFirebase(contact) {
    const response = await fetch(`${BASE_URL}/contacts.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });
    if (!response.ok) throw new Error('Failed to save contact');
}

async function saveContact(event, firebaseId) {
    event.preventDefault();
    if (!validateContactForm()) return;

    const updatedContact = createUpdatedContact(firebaseId);
    if (!updatedContact) return;

    await updateContactInFirebase(firebaseId, updatedContact);
    await initContacts();
}

function validateContactForm() {
    const { name, email } = getContactFormData();
    if (!name || !email) {
        alert("Please fill in all required fields");
        return false;
    }
    return true;
}

function createUpdatedContact(firebaseId) {
    const contact = findContactById(firebaseId);
    if (!contact) {
        console.error('Contact not found:', firebaseId);
        return null;
    }

    const { name, email, phone } = getContactFormData();
    return {
        ...contact,
        name,
        mail: email,
        phone,
        initials: getInitials(name)
    };
}

function findContactById(firebaseId) {
    return contacts.find(contact => contact.firebaseId === firebaseId);
}

async function updateContactInFirebase(firebaseId, contact) {
    const response = await fetch(`${BASE_URL}/contacts/${firebaseId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });
    if (!response.ok) throw new Error('Failed to update contact');
}

async function deleteContact(firebaseId) {
    const response = await fetch(`${BASE_URL}/contacts/${firebaseId}.json`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete contact');
    await initContacts();
}
