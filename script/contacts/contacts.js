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

async function initContacts() {
    await fetchContacts();
}

async function fetchContacts() {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Kontakte');
        }

        const data = await response.json();
        contacts = Object.keys(data).map(firebaseId => ({
            firebaseId,
            ...data[firebaseId]
        }));

        // Kontakte alphabetisch sortieren
        const sortedContacts = sortContactsByName(contacts);
        console.log('Sorted contacts:', sortedContacts);

        // Kontakte gruppieren
        const groupedContacts = groupContactsByFirstLetter(sortedContacts);

        renderContactList(groupedContacts); // Funktion, die die Kontakte im Frontend darstellt
    } catch (error) {
        console.error('Fehler beim Abrufen der Kontakte:', error);
    }
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
        const contactsContainer = document.querySelector('.contacts-container'); // Zugriff auf das erste Element mit der Klasse
        if (contactsContainer) {
            contactsContainer.classList.remove('contacts-container'); // Entferne die bestehende Klasse
            contactsContainer.classList.add('d-none');    // Füge eine neue Klasse hinzu
        }

        const overlay = document.querySelector(".contact-details-overlay");
        overlay.innerHTML = `
            <header class="section-header">
                <div class="d-flex-sb-c">
                    <h1>Contacts</h1>
                    <button onclick="closeContactDetailsOverlay()"><img src="/assets/icons/arrow-left.svg" alt="back"></button>
                <div class="sideline-blue"></div>
                <h4>Better with a team</h4>
            </header>
            <div class="d-flex gap-24">
                <div class="initials-circle-big" style="background-color: var(${contact.color});">${contact.initials}</div>
                <div class="name-container">
                    <h2>${contact.name}</h2>
                    <div class="d-flex gap-8">
                        <button class="button-contacts" onclick="showEditContactOverlay('${contact.firebaseId}')"><img src="/assets/icons/edit-blue.svg" alt="edit">Edit</button>
                        <button class="button-contacts"><img src="/assets/icons/delete-blue.svg" alt="delete">Delete</button>
                    </div>
                </div>
            </div>
            <h2>Contact Information</h2>
            <h3>Email</h3>
            <a href="mailto:${contact.mail}">${contact.mail}</a>
            <h3>Phone</h3>
            <a href="tel:${contact.phone}">${contact.phone}</a>
            <button onclick="closeContactDetailsOverlay()">Close</button>
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
                        <button class="button-contacts" onclick="showEditContactOverlay('${contact.firebaseId}')"><img src="/assets/icons/edit-blue.svg" alt="edit">Edit</button>
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

function closeEditOverlay() {
    const overlay = document.getElementById("editContactOverlay");
    if (overlay) {
        overlay.classList.remove("visible");
        setTimeout(() => overlay.remove(), 300); // Timeout für Transition-Effekt
    }
}

function closeContactDetailsOverlay() {
    const contactsContainer = document.querySelector('.d-none'); // Zugriff auf das erste Element mit der Klasse
    if (contactsContainer) {
        contactsContainer.classList.remove('d-none'); // Entferne die bestehende Klasse
        contactsContainer.classList.add('contacts-container');    // Füge eine neue Klasse hinzu
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

function showEditContactOverlay(firebaseId) {
    // Suche den Kontakt anhand der Firebase-ID
    const contact = findContactById(firebaseId);

    if (!contact) {
        console.error('Kontakt nicht gefunden:', firebaseId);
        return;
    }

    // Render das Overlay mit den Kontaktinformationen
    renderEditContactOverlay(contact);
}

// Funktion zum Abrufen eines Kontakts anhand der ID
function findContactById(firebaseId) {
    // Kontakte durchgehen und den passenden Kontakt finden
    return contacts.find(contact => contact.firebaseId === firebaseId);
}

function fillInputFormWithContactsInfo(contact) {
    if (contact) {
        document.getElementById('user').value = contact.name || '';
        document.getElementById('email').value = contact.mail || '';
        document.getElementById('telephone').value = contact.phone || '';
    }
}

async function saveContact(event, firebaseId) {
    event.preventDefault();
    let editName = document.getElementById('user').value.trim();
    let editEmail = document.getElementById('email').value.trim();
    let editPhone = document.getElementById('telephone').value.trim();

    if (!editName || !editEmail) {
        alert("Bitte füllen Sie alle Felder aus!");
        return;
    }

    let updateSingleData = {
        name: editName,
        mail: editEmail,
        phone: editPhone
    };
    await putContactsDataToFirebase(firebaseId, updateSingleData);
    closeEditOverlay();
    await fetchContacts();
}

async function putContactsDataToFirebase(firebaseId, contact) {
    try {
        const response = await fetch(`${BASE_URL}/contacts/${firebaseId}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            throw new Error('Failed to edit contact');
        }

        const data = await response.json();
        console.log('Contact edited successfully:', data);
    } catch (error) {
        console.error('Error editing contact:', error);
    }
}

async function deleteContact(path = '/contacts') {
    await fetchResource(BASE_URL + path + '.json', {
        method: 'DELETE'
    });
    closeOverlay();
    await fetchContacts();
}