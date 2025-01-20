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

    // Firebase-ID jedem Kontakt hinzufügen
    const contactsWithIds = addFirebaseIdsToContacts(contacts);

    // Kontakte alphabetisch sortieren
    const sortedContacts = sortContactsByName(contactsWithIds);
    console.log('Sorted contacts:', sortedContacts);

    // Kontakte gruppieren
    const groupedContacts = groupContactsByFirstLetter(sortedContacts);

    // Kontaktliste rendern
    renderContactList(groupedContacts);
}

function addFirebaseIdsToContacts(contacts) {
    // Konvertiere das Objekt in ein Array mit IDs
    return Object.entries(contacts).map(([id, contact]) => {
        return {
            ...contact, // Bestehende Kontakt-Daten
            firebaseId: id // Firebase-ID hinzufügen
        };
    });
}

function sortContactsByName(contactsWithIds) {
    // Sortiere das Array alphabetisch nach dem Namen
    return contactsWithIds.sort((a, b) => {
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
                    <div class="contact-info-container" id="${contact.firebaseId}">
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
                        <button class="button-contacts" onclick="showEditContactOverlay(${contact.firebaseId})"><img src="/assets/icons/edit-blue.svg" alt="edit">Edit</button>
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
async function addNewContact(event) {
    event.preventDefault();

    let name = document.getElementById("user").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("telephone").value.trim();

    if (!name || !email) {
        alert("Bitte füllen Sie alle Felder aus!");
        return;
    }

    let color = getRandomColor();
    let initials = getInitials(name);

    let singleContactData = {
        color: color,
        initials: initials,
        mail: email,
        name: name,
        phone: phone
    };

    console.log({name, email, phone, color, initials});

    await addContactsToFirebase(singleContactData);
    clearDataContacts(name, email, phone);
    closeOverlay();
    await fetchContacts();
}

async function addContactsToFirebase(contact) {
    try {
        const response = await fetch(BASE_URL + "/contacts" + ".json", {
            method: 'POST', // 'POST' für das Hinzufügen neuer Daten
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            throw new Error('Failed to add contact');
        }

        const data = await response.json();
        console.log('Contact added successfully:', data);
    } catch (error) {
        console.error('Error adding contact:', error);
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

function clearDataContacts(name, email, phone) {
    name.value = "";
    email.value = "";
    phone.value = "";
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

