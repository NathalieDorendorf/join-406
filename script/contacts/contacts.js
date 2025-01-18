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

async function initContacts() {
    await fetchContacts();
}

async function fetchContacts() {
    const contacts = await fetchResource('contacts');
    console.log('Fetched contacts:', contacts);
    console.table(contacts);

    if (!contacts || typeof contacts !== 'object') {
        console.error('Contacts data is not valid:', contacts);
        return;
    }

    // Kontakte alphabetisch sortieren
    const sortedContacts = sortContactsByName(contacts);
    console.log('Sorted contacts:', sortedContacts);

    // Kontakte gruppieren
    const groupedContacts = groupContactsByFirstLetter(sortedContacts);

    // Kontaktliste rendern
    renderContactList(groupedContacts);
}

function sortContactsByName(contacts) {
    // Konvertiere das Objekt in ein Array
    const contactsArray = Object.values(contacts);

    // Sortiere das Array alphabetisch nach dem Namen
    contactsArray.sort((a, b) => {
        const nameA = a.name.toUpperCase(); // Groß-/Kleinschreibung ignorieren
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    return contactsArray;
}

function groupContactsByFirstLetter(contacts) {
    const grouped = {};

    contacts.forEach(contact => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
        }
        grouped[firstLetter].push(contact);
    });

    return grouped;
}

function renderContactList(groupedContacts) {
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = ""; // Reset

    Object.keys(groupedContacts)
        .sort()
        .forEach(letter => {
            // Kategorie erstellen
            const category = document.createElement("div");
            category.innerHTML = `<h3 class="underline-letter">${letter}</h3>`;
            contactList.appendChild(category);

            // Kontakte hinzufügen
            groupedContacts[letter].forEach(contact => {
                const contactItem = document.createElement("li");
                contactItem.innerHTML = `
                    <div class="contact-info-container">
                        <div class="initials-circle" style="background-color: var(${contact.color});">${contact.initials}</div>
                        <div>
                            <p>${contact.name}</p>
                            <a href="mailto:${contact.mail}">${contact.mail}</a>
                        </div>
                    </div>
                `;
                contactItem.onclick = () => showContactDetails(contact);
                category.appendChild(contactItem);
            });
        });
}

function showContactDetails(contact) {
    const isMobile = window.innerWidth <= 768;
    const detailsContainer = document.getElementById("contactDetails");

    if (isMobile) {
        // Mobile Ansicht: Overlay anzeigen
        const overlay = document.querySelector(".contact-overlay");
        overlay.innerHTML = `
            <h2>${contact.name}</h2>
            <p>Email: ${contact.mail}</p>
            <p>Phone: ${contact.phone}</p>
            <button onclick="closeOverlay()">Close</button>
        `;
        overlay.classList.add("visible");
    } else {
        // Desktop Ansicht: Rechts anzeigen
        detailsContainer.innerHTML = `
            <div class="d-flex gap-24">
                <div class="initials-circle-big" style="background-color: var(${contact.color});">${contact.initials}</div>
                <div class="name-container">
                    <h2>${contact.name}</h2>
                    <div class="d-flex gap-8">
                        <button class="button-contacts" onclick="showEditContactOverlay(${contact.id})"><img src="/assets/icons/edit-blue.svg" alt="edit">Edit</button>
                        <button class="button-contacts"><img src="/assets/icons/delete-blue.svg" alt="delete">Delete</button>
                    </div>
                </div>
            </div>
            <h2>Contact Information</h2>
            <h3>Email</h3>
            <a href="mailto:${contact.mail}">${contact.mail}</a>
            <h3>Phone</h3>
            <a href="tel:${contact.phone}">${contact.phone}</a>
        `;
        detailsContainer.classList.add("slide-in");
    }
}

// Funktion zum Schließen des Overlays
function closeOverlay() {
    const overlay = document.getElementById("addContactOverlay");
    if (overlay) {
        overlay.classList.remove("visible");
        setTimeout(() => overlay.remove(), 300); // Timeout für Transition-Effekt
    }
}

// Funktion zum Speichern eines neuen Kontakts in Firebase
async function addNewContact(contact) {
    const name = document.getElementById("user").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("telephone").value;

    try {
        const randomColor = getRandomColor();
        const initials = getInitials(name);
        const response = await fetchResource('contacts','POST', {
            color: randomColor,
            initials: initials,
            mail: email,
            name: name,
            phone: phone
        });

        if (response.ok) {
            console.log("Contact successfully added!");
            closeOverlay();
        } else {
            console.error("Failed to add contact.", response.statusText);
        }
    } catch (error) {
        console.error("Error adding contact:", error);
    }
}

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * contactColors.length);
    return contactColors[randomIndex];
}

function getInitials(name) {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
}

function showEditContactOverlay(contactId) {
    fillInputFormWithContactsInfo(contact);
    renderEditContactOverlay(contactId);
}

function fillInputFormWithContactsInfo(contact) {
    if (contact) {
        document.getElementById('user').value = contact.name;
        document.getElementById('email').value = contact.mail;
        document.getElementById('telephone').value = contact.phone;
    }
}

