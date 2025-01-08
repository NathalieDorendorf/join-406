let tempTask = null;
let taskState;
let selectedContacts = [];
let selectedCategory = '';
let writtenSubtasks = [];
let currentSubtaskIndex = -1;

function restoreForm() {
    if (tempTask) {
        document.getElementById('ato-title').value = tempTask.title;
        document.getElementById('ato-description').value = tempTask.description;
        selectedContacts = tempTask.assignedTo;
        document.getElementById('ato-due-date').valueAsNumber = tempTask.dueDate;
        document.querySelectorAll('.priority-button').forEach(priorityButton => priorityButton.classList.remove('selected-priority'));
        document.querySelector(`.priority-button[data-priority="${tempTask.priority}"]`).classList.add('selected-priority');
        document.getElementById('ato-selected-category-input').value = document.getElementById('ato-selected-category').textContent = !tempTask.category ? "Select task category" : tempTask.category;
        writtenSubtasks = tempTask.subtasks.map(item => item.title)
    }
}

function toggleSelectContacts(customSelectElem) {
    const assignToBox = document.getElementById('contacts-box');
    const renderedContactOptions = renderForAll(Object.entries(allData.contacts), renderContactOption);
    assignToBox.innerHTML = renderedContactOptions;
    const contactOptions = assignToBox.querySelectorAll('.assigend-to-contact');
    selectedContacts.forEach(selectedContact => {
        contactOptions.forEach(elem => {
            if (elem.id === selectedContact) {
                elem.classList.add('selected');
            }
        })
    })
    toggleSelectDropdown(customSelectElem, assignToBox);
}

function toggleSelectDropdown(customSelectElem, dropdownElement) {
    dropdownElement.classList.toggle('dni');
    toggleCustomSelectBackground(customSelectElem, 'rgb(245, 245, 245)');
}

function toggleCustomSelectBackground(customSelectElem, backgroundColor = 'white') {
    if (!customSelectElem.parentElement.querySelector('.cover-custom-select')) {
        const coverCustomSelect = document.createElement('div');
        coverCustomSelect.classList.add('cover-custom-select');
        coverCustomSelect.style.backgroundColor = backgroundColor;
        customSelectElem.insertAdjacentElement('afterend', coverCustomSelect);
    } else {
        customSelectElem.parentElement.querySelector('.cover-custom-select').remove();
    }
}

function selectContact(contactOptionElem, contactId) {
    contactOptionElem.classList.toggle('selected');
    contactOptionElem.querySelector('img').alt = contactOptionElem.querySelector('img').alt === "Contact not selected" ? "Contact selected" : "Contact not selected";
    const selectedContactPosition = selectedContacts.indexOf(contactId);
    if (selectedContactPosition === -1) {
        selectedContacts.push(contactId);
    } else {
        selectedContacts.splice(selectedContactPosition, 1);
    }
}

function selectPriority(priorityElement) {
    document.querySelectorAll('.priority-button').forEach(priorityButton => priorityButton.classList.remove('selected-priority'));
    priorityElement.classList.add('selected-priority');
}

function toggleSelectCategory() {
    const customSelectElem = document.getElementById('ato-category');
    const categoryBox = document.getElementById('category-box');
    toggleSelectDropdown(customSelectElem, categoryBox);
}

function selectCategory(category) {
    document.getElementById('ato-selected-category').textContent = category;
    document.getElementById('ato-selected-category-input').value = category;
    document.getElementById('ato-selected-category-input').dispatchEvent(new Event('change'));
    toggleSelectCategory();
    selectedCategory = category;
}

function confirmSubtask() {
    const inputSubtasks = document.getElementById('ato-subtasks');
    if (inputSubtasks.value.length > 0) {
        const index = currentSubtaskIndex !== -1 ? currentSubtaskIndex : writtenSubtasks.length;
        writtenSubtasks[index] = inputSubtasks.value.trim();
        resetSubtasksInput();
        paintSubtasks();
    }
}

function showSubtasksInputUIControls(show) {
    if (show && document.getElementById('ato-subtasks').value.length > 0) {
        document.getElementById('ato-subtasks-add-btn').classList.add('dni');
        document.getElementById('ato-subtasks-confirm-btn').classList.remove('dni');
        document.getElementById('ato-subtasks-cancel-btn').classList.remove('dni');
    } else {
        document.getElementById('ato-subtasks-confirm-btn').classList.add('dni');
        document.getElementById('ato-subtasks-cancel-btn').classList.add('dni');
        document.getElementById('ato-subtasks-add-btn').classList.remove('dni');
    }
}

function paintSubtasks() {
    const subtasksBox = document.getElementById('subtasks-box');
    subtasksBox.innerHTML = renderForAll(writtenSubtasks, renderSubtask);
}

function deleteSubtask(event, index) {
    event.stopPropagation();
    writtenSubtasks.splice(index, 1);
    resetSubtasksInput();
    paintSubtasks();
}

function editSubtask(index) {
    const inputSubtasks = document.getElementById('ato-subtasks');
    currentSubtaskIndex = index;
    inputSubtasks.value = writtenSubtasks[index];
    inputSubtasks.focus();
}

function resetSubtasksInput() {
    showSubtasksInputUIControls(false);
    document.getElementById('ato-subtasks').value = '';
    document.getElementById('ato-subtasks').focus();
    currentSubtaskIndex = -1;
}

function closeAddTaskOverlay() {
    tempTask = createOrUpdateTask();
    closeOverlay();
}

function cancelAddTask() {
    resetForm();
    closeOverlay();
}

function resetForm() {
    tempTask = null;
    selectedContacts = [];
    selectedCategory = '';
    writtenSubtasks = [];
    currentSubtaskIndex = -1;
    document.querySelectorAll('.assigend-to-contact').forEach(contactOption => contactOption.classList.remove('selected'));
}

async function addTask() {
    if (checkValidity()) {
        const newTask = createOrUpdateTask();
        if (await fetchResource('tasks/', 'POST', newTask)) {
            resetForm();
            showToastMessage({ message: 'Task has been successfully created' });
            fetchAllDataAndPaintTasks();
        } else {
            showToastMessage({ message: 'Task could not be created.' });
        }
    }
}

function checkValidity() {
    const checks = [];
    index = 0;
    checks[index] = checkTitle();
    checks[++index] = checkDueDate();
    checks[++index] = checkCategory();
    return checks.indexOf(false) === -1;
}

function checkTitle() {
    const title = document.getElementById('ato-title');
    const checkTitle = () => title.value.length > 2;
    return displayInputErrorMessage(title, 'Please enter at least 3 characters.', checkTitle);
}

function checkDueDate() {
    const dueDate = document.getElementById('ato-due-date');
    const checkDueDate = () => {
        if (dueDate.valueAsNumber && dueDate.valueAsNumber > Date.now()) {
            return true;
        }
        return false;
    }
    return displayInputErrorMessage(dueDate, 'Please pick a date. Must be in the future.', checkDueDate);
}

function checkCategory() {
    const category = document.getElementById('ato-category');
    const hiddenInput = document.getElementById('ato-selected-category-input');
    const checkCategory = () => categories.indexOf(hiddenInput.value) !== -1;
    return displayInputErrorMessage(category, 'Please pick a category.', checkCategory, hiddenInput);
}

function createOrUpdateTask() {
    return {
        state: taskState,
        category: selectedCategory,
        title: document.getElementById('ato-title').value.trim(),
        description: document.getElementById('ato-description').value.trim(),
        dueDate: document.getElementById('ato-due-date').valueAsNumber,
        assignedTo: selectedContacts.slice(),
        priority: document.querySelector('.selected-priority').dataset.priority,
        subtasks: writtenSubtasks.map(writtenSubtask => {
            return {
                title: writtenSubtask,
                done: false
            }
        }),
    }
}