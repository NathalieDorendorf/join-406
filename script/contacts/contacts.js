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
                            <span>${contact.mail}</span>
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
    const phoneNumber = contact.phone ? contact.phone : "";

    if (isMobile) {
        // Mobile Ansicht: Overlay anzeigen
        const contactsContainer = document.querySelector('.contacts-container'); // Zugriff auf das erste Element mit der Klasse
        if (contactsContainer) {
            contactsContainer.classList.remove('contacts-container'); // Entferne die bestehende Klasse
            contactsContainer.classList.add('d-none');    // Füge eine neue Klasse hinzu
        }

        const overlay = document.querySelector(".contact-details-overlay");
        overlay.innerHTML = generateContactsDetailsMobileHTML(contact, phoneNumber);
        overlay.classList.add("visible");
    } else {
        // Desktop Ansicht: Rechts anzeigen
        detailsContainer.innerHTML = generateContactsDetailsDesktopHTML(contact, phoneNumber);
        detailsContainer.classList.add("slide-in");
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
    let emailElement = document.getElementById("email");
    let email = emailElement.value;
    let phone = document.getElementById("telephone").value.trim();

    checkEmailExisting(email);

    const isEmailValid = await checkEmail(emailElement);
    const mailAlreadyExists = await checkEmailExisting(emailElement);

    if (!isEmailValid || mailAlreadyExists) {
        return;
    }

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
    showToastMessage({ message: "Contact successfully created" });
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
    let editInitials = getInitials(editName);

    if (!editName || !editEmail) {
        alert("Bitte füllen Sie alle Felder aus!");
        return;
    }

    // Finde den bestehenden Kontakt anhand der Firebase-ID
    const existingContact = findContactById(firebaseId);

    if (!existingContact) {
        console.error('Kontakt nicht gefunden:', firebaseId);
        return;
    }

    let updateSingleData = {
        color: existingContact.color,
        initials: editInitials,
        mail: editEmail,
        name: editName,
        phone: editPhone
    };
    await putContactsDataToFirebase(firebaseId, updateSingleData);
    closeOverlay();
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

async function deleteContact(firebaseId, contact) {
    try {
        const response = await fetch(`${BASE_URL}/contacts/${firebaseId}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            throw new Error('Failed to delete contact');
        }

        const data = await response.json();
        console.log('Contact deleted successfully:', data);
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
    await fetchContacts();
}