const contactColors = [
    "#FF7A00",  // contact-color-orange
    "#FF5EB3",  // contact-color-pink
    "#6E52FF",  // contact-color-lavender
    "#9327FF",  // contact-color-violet
    "#00BEE8",  // contact-color-aqua
    "#1FD7C1",  // contact-color-tropical
    "#FF745E",  // contact-color-coral
    "#FFA35E",  // contact-color-peach
    "#FC71FF",  // contact-color-magenta
    "#FFC701",  // contact-color-gold
    "#0038FF",  // contact-color-blue
    "#C3FF2B",  // contact-color-lime
    "#462f8a",  // contact-color-purple
    "#FF4646",  // contact-color-crimson
    "#FFBB2B"   // contact-jcolor-honey
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
                        <button class="button-contacts" onclick="showContactEditForm(${contact.id})"><img src="/assets/icons/edit-blue.svg" alt="edit">Edit</button>
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

function closeOverlay() {
    const overlay = document.querySelector(".contact-overlay");
    overlay.classList.remove("visible");
}
