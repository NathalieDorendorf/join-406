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
    allData = await getAllData();
    await loadContacts();
    renderContacts();
    handleResponsiveView();
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
        renderHeaderResponsive();
    }
    showContactDetails(contact);
}

function showContactDetails(contact) {
    if (isSameContactClicked(contact)) {
        resetActiveContact();
        hideDetailsView();
        return;
    }

    resetPreviousContact();
    highlightActiveContact(contact);
    displayContactDetails(contact);
}

function isSameContactClicked(contact) {
    return activeContactId === contact.firebaseId;
}

function resetActiveContact() {
    const activeElement = document.getElementById(activeContactId);
    if (activeElement) {
        resetStyles(activeElement);
    }
    activeContactId = null;
}

function hideDetailsView() {
    const detailsContainer = document.getElementById("contactDetails");
    if (detailsContainer) {
        detailsContainer.classList.remove("slide-in");
        detailsContainer.classList.add("slide-out");
        detailsContainer.style.display = "none";
    }
}

function resetPreviousContact() {
    if (!activeContactId) return;
    const previousActive = document.getElementById(activeContactId);
    if (previousActive) {
        resetStyles(previousActive);
    }
}

function resetStyles(element) {
    element.style.backgroundColor = "";
    element.style.color = "";
    const initialsCircle = element.querySelector(".initials-circle");
    if (initialsCircle) initialsCircle.style.border = "";
}

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

function displayContactDetails(contact) {
    const detailsContainer = document.getElementById("contactDetails");
    if (detailsContainer) {
        detailsContainer.innerHTML = generateContactsDetailsHTML(contact, contact.phone || "");
        detailsContainer.style.display = "flex";
        detailsContainer.classList.remove("slide-out");
        detailsContainer.classList.add("slide-in");
    }
}

function handleResponsiveView() {
    if (window.innerWidth < 1025) {
        if (activeContactId) showResponsiveView();
    } else {
        showDesktopView();
    }
}

window.addEventListener("resize", handleResponsiveView);

function showResponsiveView() {
    renderHeaderResponsive();
    console.log("Switching to responsive view");
    document.querySelector(".contacts-container").style.display = "none";
    const contactDetailsContainer = document.querySelector(".contact-details-container");
    if (contactDetailsContainer) {
        contactDetailsContainer.style.width = "100%";
        contactDetailsContainer.style.display = "flex";
    }
}

function showDesktopView() {
    renderHeader();
    console.log("Switching to desktop view");
    document.querySelector(".contacts-container").style.display = "flex";
    const contactDetailsContainer = document.querySelector(".contact-details-container");
    if (contactDetailsContainer) {
        contactDetailsContainer.style.width = "";
        contactDetailsContainer.style.display = "flex";
    }
}

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

