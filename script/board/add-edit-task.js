let taskToRestore = null;
let taskState;
let selectedContacts = [];
let selectedCategory = '';
let writtenSubtasks = [];
let currentSubtaskIndex = -1;
let selectContactsOpen = false;

function setDataForForm(task) {
    selectedContacts = task ? structuredClone(task.assignedTo) : [];
    selectedCategory = task ? task.category : '';
    writtenSubtasks = task ? structuredClone(task.subtasks) : [];
}

function fillForm(task) {
    if (task) {
        document.getElementById('ato-title').value = task.title;
        document.getElementById('ato-description').value = task.description;
        document.getElementById('ato-due-date').value = task.dueDate;
        document.querySelectorAll('.priority-button').forEach(priorityButton => priorityButton.classList.remove('selected-priority'));
        document.querySelector(`.priority-button[data-priority="${task.priority.toLowerCase()}"]`).classList.add('selected-priority');
        document.getElementById('ato-selected-category-input').value = document.getElementById('ato-selected-category').textContent = !task.category ? "Select task category" : task.category;
    }
}

function toggleSelectContacts(customSelectElem) {
    const assignToBox = document.getElementById('contacts-box');
    if (!selectContactsOpen) {
        const renderedContactOptions = renderForAll(getSortedContactEntries(), renderContactOption);
        assignToBox.innerHTML = renderedContactOptions;
        const contactOptions = assignToBox.querySelectorAll('.assigend-to-contact');
        selectedContacts.forEach(selectedContact => {
            contactOptions.forEach(elem => {
                if (elem.id === selectedContact) {
                    elem.classList.add('selected');
                }
            })
        })
    } else {
        document.getElementById('ato-name-tags').innerHTML = renderForAll(selectedContacts, renderContactTag);
    }
    toggleSelectDropdown(customSelectElem, assignToBox);
    selectContactsOpen = !selectContactsOpen;
}

function getSortedContactEntries() {
    return Object.entries(allData.contacts).sort((a, b) => (a[1].name.localeCompare(b[1].name)));
}

function closeAwaitSelectDropdown(event, dropdownButtonSelector) {
    if (!event.relatedTarget || !event.relatedTarget.closest(dropdownButtonSelector)) {
        document.querySelector(dropdownButtonSelector).click();
    }
}

function closeImmediateSelectDropdown(event, dropdownButtonSelector) {
    if (!(event.relatedTarget == null && document.hasFocus())
        && (!event.relatedTarget || !event.relatedTarget.closest(dropdownButtonSelector))) {
        document.querySelector(dropdownButtonSelector).click();
    }
}

function toggleSelectDropdown(customSelectElem, dropdownElement) {
    dropdownElement.classList.toggle('dni');
    !dropdownElement.classList.contains('dni') ? dropdownElement.focus() : undefined;
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

function selectContact(event, contactOptionElem, contactId) {
    event.stopPropagation();
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
        const newSubtaskEntry = writtenSubtasks[index] = {};
        newSubtaskEntry.title = inputSubtasks.value.trim();
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
    taskToRestore = createTask();
    closeOverlay();
}

function cancelAddTask() {
    resetForm();
    closeOverlay();
}

function resetForm() {
    taskToRestore = null;
    currentSubtaskIndex = -1;
    document.querySelectorAll('.assigend-to-contact').forEach(contactOption => contactOption.classList.remove('selected'));
}

async function addTask() {
    const submitBtn = document.querySelector('button[type=submit]');
    const cancelBtn = document.getElementById('cancel-add-task-btn');
    toggleButtonDisabled(submitBtn);
    toggleButtonDisabled(cancelBtn);
    if (checkValidity()) {
        const newTask = createTask();
        if (await fetchResource('tasks/', 'POST', newTask)) {
            resetForm();
            showToastMessage({ message: 'Task has been successfully created' });
            fetchAllDataAndPaintTasks();
            closeOverlay();
        } else {
            showToastMessage({ message: 'Task could not be created.' });
        }
    }
    toggleButtonDisabled(submitBtn);
    toggleButtonDisabled(cancelBtn);
}

async function saveTask(taskId) {
    const submitBtn = document.querySelector('button[type=submit]');
    toggleButtonDisabled(submitBtn);
    const tempTask = structuredClone(allData.tasks[taskId]);
    if (checkValidity()) {
        allData.tasks[taskId] = createTask();
        if (await updateTaskInDatabase(taskId)) {
            closeOverlay();
            paintTasks();
        } else {
            allData.tasks[taskId] = tempTask;
        }
    }
    toggleButtonDisabled(submitBtn);
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
    return displayInputErrorMessage(title, 'Please enter at least 3 characters.', checkTitle, 8);
}

function checkDueDate() {
    const dueDate = document.getElementById('ato-due-date');
    const checkDueDate = () => {
        if (dueDate.valueAsNumber && dueDate.valueAsNumber > Date.now()) {
            return true;
        }
        return false;
    }
    return displayInputErrorMessage(dueDate, 'Please pick a date. Must be in the future.', checkDueDate, 0);
}

function checkCategory() {
    const category = document.getElementById('ato-category');
    const hiddenInput = document.getElementById('ato-selected-category-input');
    const checkCategory = () => categories.indexOf(hiddenInput.value) !== -1;
    return displayInputErrorMessage(category, 'Please pick a category.', checkCategory, 0, hiddenInput);
}

function createTask() {
    return {
        state: taskState,
        category: selectedCategory,
        title: document.getElementById('ato-title').value.trim(),
        description: document.getElementById('ato-description').value.trim(),
        dueDate: document.getElementById('ato-due-date').value,
        assignedTo: structuredClone(selectedContacts),
        priority: document.querySelector('.selected-priority').dataset.priority,
        subtasks: structuredClone(writtenSubtasks)
    }
}