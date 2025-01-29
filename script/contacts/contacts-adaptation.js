/**
 * Handles the submission of the "Add New Contact" form.
 * @param {Event} event - The submit event triggered by the form.
 */
async function addNewContact(event) {
    event.preventDefault();
    if (!isFormValid()) return;
    const { name, email, phone } = getContactFormData();
    if (await isEmailInvalid(email)) return;
    const firebaseId = await saveNewContact(name, email, phone);
    await finalizeNewContact(firebaseId);
}

/**
 * Saves a new contact and returns its Firebase ID.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone of the contact.
 * @returns {Promise<string>} The Firebase ID of the saved contact.
 */
async function saveNewContact(name, email, phone) {
    const contact = createNewContact(name, email, phone);
    const response = await saveContactToFirebase(contact);
    return response.name;
}

/**
 * Finalizes the process of adding a new contact.
 * @param {string} firebaseId - The Firebase ID of the new contact.
 */
async function finalizeNewContact(firebaseId) {
    await initContacts();
    closeOverlay();
    const newContact = findContactById(firebaseId);
    if (newContact) {
        activeContactId = firebaseId;
        showContactDetails(newContact);
        if (window.innerWidth < 1025) showResponsiveView();
    }
    showToastMessage({ message: "Contact successfully created" });
}

/**
 * Validates the form and checks for required fields.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function isFormValid() {
    if (!document.querySelector('form').checkValidity()) return false;
    const { name, email } = getContactFormData();
    if (!name || !email) {
        alert("Please fill in all required fields");
        return false;
    }
    return true;
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
 * @returns {Promise<Object>} A promise that resolves with the response from Firebase.
 */
async function saveContactToFirebase(contact) {
    const response = await fetch(`${BASE_URL}/contacts.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });
    if (!response.ok) throw new Error('Failed to save contact');
    return await response.json();
}

/**
 * Handles the submission of the "Edit Contact" form.
 * @param {Event} event - The submit event triggered by the form.
 * @param {string} firebaseId - The Firebase ID of the contact to be updated.
 */
async function saveContact(event, firebaseId) {
    event.preventDefault();
    if (!isFormValid()) return;
    const updatedContact = await prepareUpdatedContact(firebaseId);
    if (!updatedContact) return;
    await finalizeUpdatedContact(firebaseId, updatedContact);
}

/**
 * Prepares the updated contact object.
 * @param {string} firebaseId - The Firebase ID of the contact.
 * @returns {Object|null} The updated contact object, or null if not found.
 */
async function prepareUpdatedContact(firebaseId) {
    const { name, email, phone } = getContactFormData();
    if (!validateContactForm()) return null;
    return createUpdatedContact(firebaseId, name, email, phone);
}

/**
 * Finalizes the update process for a contact.
 * @param {string} firebaseId - The Firebase ID of the contact.
 * @param {Object} updatedContact - The updated contact data.
 */
async function finalizeUpdatedContact(firebaseId, updatedContact) {
    await updateContactInFirebase(firebaseId, updatedContact);
    closeOverlay();
    await initContacts();
    const contact = findContactById(firebaseId);
    if (contact) {
        activeContactId = firebaseId;
        showContactDetails(contact);
        if (window.innerWidth < 1025) showResponsiveView();
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
 * Deletes a contact from Firebase using the provided Firebase ID.
 * 
 * @param {string} firebaseId - The Firebase ID of the contact to be deleted.
 * @returns {Promise<void>} A promise that resolves when the contact is successfully deleted.
 */
async function deleteContact(firebaseId) {
    const contact = findContactById(firebaseId);
    if (!contact) return;
    try {
        const users = await fetchResource('users');
        const userToDelete = Object.entries(users).find(([_, user]) => user.email === contact.mail)?.[0];
        if (userToDelete) await fetchResource(`users/${userToDelete}`, 'DELETE');
        await fetchResource(`contacts/${firebaseId}`, 'DELETE');
        await updateTasksAfterContactDeletion();
        await initContacts();
        document.getElementById("contactDetails").innerHTML = "";
        activeContactId = null;
        showToastMessage({ message: "Contact successfully deleted" });
    } catch (error) {
        showToastMessage({ message: "Error deleting contact" });
    }
}

/**
 * Updates a contact in Firebase using the provided Firebase ID and updated contact data.
 * 
 * @param {string} firebaseId - The Firebase ID of the contact to be updated.
 * @param {Object} contact - The updated contact data.
 * @returns {Promise<void>} A promise that resolves when the contact is successfully updated.
 */
async function updateContactInFirebase(firebaseId, contact) {
    try {
        const oldContact = findContactById(firebaseId);
        if (oldContact?.mail !== contact.mail) {
            const users = await fetchResource('users');
            const [userId, userData] = Object.entries(users).find(([_, u]) => u.email === oldContact.mail) || [];
            if (userId) await fetchResource(`users/${userId}`, 'PUT', { ...userData, email: contact.mail });
        }
        await fetchResource(`contacts/${firebaseId}`, 'PUT', contact);
        await initContacts();
        showToastMessage({ message: "Contact successfully edited" });
    } catch (error) {
        showToastMessage({ message: "Error updating contact" });
    }
}

/**
 * Updates all tasks that have the deleted contact assigned to them.
 * @returns {Promise<void>} A promise that resolves when all tasks have been updated after contact deletion.
 */
async function updateTasksAfterContactDeletion() {
    const tasksToUpdate = [];
    Object.keys(allData.tasks).forEach(taskId => {
        const task = allData.tasks[taskId];
        if (Array.isArray(task.assignedTo) && task.assignedTo.includes(activeContactId)) {
            task.assignedTo = task.assignedTo.filter(contactId => contactId !== activeContactId);
            tasksToUpdate.push(taskId);
        }
    });
    for (const taskId of tasksToUpdate) {
        await updateTaskInDatabase(taskId);
    }
}