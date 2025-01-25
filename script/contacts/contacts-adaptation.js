async function addNewContact(event) {
    event.preventDefault();
    if (document.querySelector('form').checkValidity()) {
        const { name, email, phone } = getContactFormData();

        if (!name || !email) return alert("Please fill in all required fields");
        if (await isEmailInvalid(email)) return;

        const contact = createNewContact(name, email, phone);
        await saveContactToFirebase(contact);
        await initContacts();
        closeOverlay();
        showToastMessage({ message: "Contact successfully created" });
    }
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
    if (document.querySelector('form').checkValidity()) {
        const { name, email, phone } = getContactFormData();

        if (!validateContactForm()) return;

        const updatedContact = createUpdatedContact(firebaseId);
        if (!updatedContact) return;

        await updateContactInFirebase(firebaseId, updatedContact);
        closeOverlay();
        await initContacts();
        const contact = findContactById(firebaseId);
        const detailsContainer = document.getElementById("contactDetails");
        detailsContainer.innerHTML = generateContactsDetailsDesktopHTML(contact, contact.phone || "");
    }
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

    const tasksToUpdate = [];
    Object.keys(allData.tasks).forEach(taskId => {
        const task = allData.tasks[taskId];
        if (task.assignedTo.includes(firebaseId)) {
            task.assignedTo = task.assignedTo.filter(contactId => contactId !== firebaseId);
            tasksToUpdate.push(taskId);
        }
    });
    for (const taskId of tasksToUpdate) {
        await updateTaskInDatabase(taskId);
    }
    const detailsContainer = document.getElementById("contactDetails");
    detailsContainer.innerHTML = "";
    closeContactDetailsOverlay();
}