/**
 * Handles the submission of the "Add New Contact" form.
 * Validates the form, checks for required fields, and ensures the email is valid.
 * If everything is correct, it creates a new contact and saves it to Firebase.
 * 
 * @param {Event} event - The submit event triggered by the form.
 */
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

/**
 * Retrieves the data from the contact form.
 * 
 * @returns {Object} An object containing the name, email, and phone number from the form.
 */
function getContactFormData() {
    return {
        name: document.getElementById("user").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("telephone").value.trim()
    };
}

/**
 * Checks if the provided email is invalid by validating it and checking if it already exists.
 * 
 * @param {string} email - The email address to be checked.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the email is invalid, otherwise `false`.
 */
async function isEmailInvalid(email) {
    const emailElement = document.getElementById("email");
    const isEmailValid = await checkEmail(emailElement);
    const emailExists = await checkEmailExisting(emailElement);
    return !isEmailValid || emailExists;
}

/**
 * Creates a new contact object with the provided name, email, and phone number.
 * 
 * @param {string} name - The name of the new contact.
 * @param {string} email - The email of the new contact.
 * @param {string} phone - The phone number of the new contact.
 * @returns {Object} The newly created contact object.
 */
function createNewContact(name, email, phone) {
    return {
        color: getRandomColor(),
        initials: getInitials(name),
        mail: email,
        name,
        phone
    };
}

/**
 * Generates initials from a full name (e.g., "John Doe" becomes "JD").
 * 
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials derived from the name.
 */
function getInitials(name) {
    return name.split(' ').map(part => part[0].toUpperCase()).join('');
}

/**
 * Saves a new contact to Firebase.
 * 
 * @param {Object} contact - The contact object to be saved.
 * @returns {Promise<void>} A promise that resolves when the contact is successfully saved.
 */
async function saveContactToFirebase(contact) {
    const response = await fetch(`${BASE_URL}/contacts.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });
    if (!response.ok) throw new Error('Failed to save contact');
}

/**
 * Handles the submission of the "Edit Contact" form.
 * Validates the form, checks for required fields, and updates the contact in Firebase.
 * 
 * @param {Event} event - The submit event triggered by the form.
 * @param {string} firebaseId - The Firebase ID of the contact to be updated.
 */
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

/**
 * Validates the contact form to ensure that required fields are filled.
 * 
 * @returns {boolean} `true` if the form is valid, otherwise `false`.
 */
function validateContactForm() {
    const { name, email } = getContactFormData();
    if (!name || !email) {
        alert("Please fill in all required fields");
        return false;
    }
    return true;
}

/**
 * Creates an updated contact object with the provided Firebase ID and form data.
 * 
 * @param {string} firebaseId - The Firebase ID of the contact to be updated.
 * @returns {Object|null} The updated contact object, or `null` if the contact was not found.
 */
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

/**
 * Finds a contact by its Firebase ID.
 * 
 * @param {string} firebaseId - The Firebase ID of the contact to be found.
 * @returns {Object|null} The contact object if found, otherwise `null`.
 */
function findContactById(firebaseId) {
    return contacts.find(contact => contact.firebaseId === firebaseId);
}

/**
 * Updates a contact in Firebase using the provided Firebase ID and updated contact data.
 * 
 * @param {string} firebaseId - The Firebase ID of the contact to be updated.
 * @param {Object} contact - The updated contact data.
 * @returns {Promise<void>} A promise that resolves when the contact is successfully updated.
 */
async function updateContactInFirebase(firebaseId, contact) {
    const response = await fetch(`${BASE_URL}/contacts/${firebaseId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });
    if (!response.ok) throw new Error('Failed to update contact');
}

/**
 * Deletes a contact from Firebase using the provided Firebase ID.
 * 
 * @param {string} firebaseId - The Firebase ID of the contact to be deleted.
 * @returns {Promise<void>} A promise that resolves when the contact is successfully deleted.
 */
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