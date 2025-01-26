/**
 * Global variable holding the task to restore if the form is closed without saving.
 * @type {Object|null}
 */
let taskToRestore = null;

/**
 * Current state of the task being created or edited.
 * @type {string}
 */
let taskState;

/**
 * List of selected contact IDs for the task.
 * @type {string[]}
 */
let selectedContacts = [];

/**
 * Array of written subtasks for the task.
 * @type {Object[]}
 */
let writtenSubtasks = [];

/**
 * Index of the subtask currently being edited. -1 if none.
 * @type {number}
 */
let currentSubtaskIndex = -1;

/**
 * Boolean flag indicating if the contact selection dropdown is open.
 * @type {boolean}
 */
let selectContactsOpen = false;

/**
 * Sets form data (that needs to be rendered) using the given task object.
 * @param {Object} task - Task object containing the data to populate the form.
 */
function setDataForForm(task) {
    selectedContacts = task && task.assignedTo ? structuredClone(task.assignedTo) : [];
    writtenSubtasks = task && task.subtasks ? structuredClone(task.subtasks) : [];
}

/**
 * Fills the form fields with the provided task data.
 * @param {Object} task - Task object with data to fill the form fields.
 */
function fillForm(task) {
    if (task) {
        document.getElementById('ato-title').value = task.title;
        document.getElementById('ato-description').value = task.description;
        document.getElementById('ato-due-date').value = task.dueDate;
        document.querySelectorAll('.priority-button').forEach(priorityButton => priorityButton.classList.remove('selected-priority'));
        document.querySelector(`.priority-button[data-priority="${task.priority.toLowerCase()}"]`).classList.add('selected-priority');
        document.getElementById('ato-selected-category-input').value = document.getElementById('ato-selected-category').textContent = task.category || "Select task category";
    }
}

/**
 * Toggles the visibility of the "Assign to" dropdown and updates its content.
 * @param {HTMLElement} customSelectElem - The custom select element clicked.
 */
function toggleSelectContacts(customSelectElem) {
    const assignToBox = document.getElementById('contacts-box');
    if (!selectContactsOpen) {
        assignToBox.innerHTML = renderForAll(getSortedContactEntries(), renderContactOption);
        const contactOptions = assignToBox.querySelectorAll('.assigend-to-contact');
        selectedContacts.forEach(selectedContact => {
            contactOptions.forEach(elem => {
                if (elem.id === selectedContact) {
                    elem.classList.add('selected');
                }
            });
        });
    } else {
        document.getElementById('ato-name-tags').innerHTML = renderForAll(selectedContacts, renderContactTag);
    }
    toggleSelectDropdown(customSelectElem, assignToBox);
    selectContactsOpen = !selectContactsOpen;
}

/**
 * Returns a sorted list of contact entries
 * @returns {Array} Sorted array of contact entries.
 */
function getSortedContactEntries() {
    return Object.entries(allData.contacts).sort((a, b) => (a[1].name.localeCompare(b[1].name)));
}

/**
 * Use in dropdown where it stays open after user selects an option.
 * Closes the dropdown unless user clicks on dropdown-button.
 * @param {FocusEvent} event - Focus event object (focusout)
 * @param {string} dropdownButtonSelector - CSS selector for the dropdown button.
 */
function closeAwaitSelectDropdown(event, dropdownButtonSelector) {
    if (!event.relatedTarget || !event.relatedTarget.closest(dropdownButtonSelector)) {
        document.querySelector(dropdownButtonSelector).click();
    }
}

/**
 * Use in dropdown where it closes after user selects an option.
 * Closes the dropdown unless user clicks on dropdown-button.
 * @param {FocusEvent} event - Focus event object.
 * @param {string} dropdownButtonSelector - CSS selector for the dropdown button.
 */
function closeImmediateSelectDropdown(event, dropdownButtonSelector) {
    if (!(event.relatedTarget == null && document.hasFocus())
        && (!event.relatedTarget || !event.relatedTarget.closest(dropdownButtonSelector))) {
        document.querySelector(dropdownButtonSelector).click();
    }
}

/**
 * Toggles visibility and background of the custom dropdown.
 * @param {HTMLElement} customSelectElem - The custom dropdown-button.
 * @param {HTMLElement} dropdownElement - The dropdown element to toggle.
 */
function toggleSelectDropdown(customSelectElem, dropdownElement) {
    dropdownElement.classList.toggle('dni');
    !dropdownElement.classList.contains('dni') ? dropdownElement.focus() : undefined;
    toggleCustomSelectBackground(customSelectElem, 'rgb(245, 245, 245)');
}

/**
 * Toggles the background of the custom dropdown-button
 * @param {HTMLElement} customSelectElem - The custom dropdown-button.
 * @param {string} [backgroundColor='white'] - Background color to set.
 */
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

/**
 * Selects or deselects a contact from the dropdown.
 * @param {MouseEvent} event - Mouse event object.
 * @param {HTMLElement} contactOptionElem - The clicked contact option element.
 * @param {string} contactId - The ID of the selected contact.
 */
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

/**
 * Selects the priority for the task.
 * @param {HTMLElement} priorityElement - The clicked priority-option element.
 */
function selectPriority(priorityElement) {
    document.querySelectorAll('.priority-button').forEach(priorityButton => priorityButton.classList.remove('selected-priority'));
    priorityElement.classList.add('selected-priority');
}

/**
 * Toggles the visibility of the category selection dropdown.
 * Updates the background of the custom select element based on the dropdown state.
 */
function toggleSelectCategory() {
    const customSelectElem = document.getElementById('ato-category');
    const categoryBox = document.getElementById('category-box');
    toggleSelectDropdown(customSelectElem, categoryBox);
}

/**
 * Selects a category and updates the UI and internal state accordingly.
 * @param {string} category - The selected category name.
 */
function selectCategory(category) {
    document.getElementById('ato-selected-category').textContent = category;
    document.getElementById('ato-selected-category-input').value = category;
    document.getElementById('ato-selected-category-input').dispatchEvent(new Event('change'));
    toggleSelectCategory();
    selectedCategory = category;
}

/**
 * Confirms and saves the current subtask input to the list of subtasks.
 * Updates the UI and resets the input field after saving.
 */
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

/**
 * Toggles the visibility of subtask input control buttons based on the input state.
 * @param {boolean} show - true/false: Whether to show or hide the confirm and cancel buttons.
 */
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

/**
 * Renders the list of written subtasks and updates the subtasks display in the UI.
 */
function paintSubtasks() {
    const subtasksBox = document.getElementById('subtasks-box');
    subtasksBox.innerHTML = renderForAll(writtenSubtasks, renderSubtask);
}

/**
 * Deletes a subtask from the list at the specified index and updates the UI.
 * @param {Event} event - The event object from the delete action.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask(event, index) {
    event.stopPropagation();
    writtenSubtasks.splice(index, 1);
    resetSubtasksInput();
    paintSubtasks();
}

/**
 * Prepares a subtask for editing by populating the input field with its value.
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask(index) {
    const inputSubtasks = document.getElementById('ato-subtasks');
    currentSubtaskIndex = index;
    inputSubtasks.value = writtenSubtasks[index].title;
    inputSubtasks.focus();
}

/**
 * Resets the subtask input field and UI controls to their default state.
 */
function resetSubtasksInput() {
    showSubtasksInputUIControls(false);
    document.getElementById('ato-subtasks').value = '';
    document.getElementById('ato-subtasks').focus();
    currentSubtaskIndex = -1;
}

/**
 * Closes the task creation overlay and saves data to restore task data if needed.
 */
function closeAddTaskOverlay() {
    taskToRestore = createTask();
    closeOverlay();
}

/**
 * Cancels the task creation process, resets the form, and closes the overlay.
 */
function cancelAddTask() {
    resetForm();
    closeOverlay();
}

/**
 * Resets the task form and clears all input and selection states.
 */
function resetForm() {
    taskToRestore = null;
    currentSubtaskIndex = -1;
    document.querySelectorAll('.assigend-to-contact').forEach(contactOption => contactOption.classList.remove('selected'));
}

/**
 * Submits a new task to the server and updates the UI if successful.
 * Displays appropriate messages for success or failure.
 */
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

/**
 * Updates an existing task with new data and saves it to the server.
 * Restores the task state if the update fails.
 * @param {string} taskId - The ID of the task to update.
 */
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

/**
 * Validates all required inputs in the task form and returns the overall validity.
 * @returns {boolean} - True if all checks pass, otherwise false.
 */
function checkValidity() {
    const checks = [];
    index = 0;
    checks[index] = checkTitle();
    checks[++index] = checkDueDate();
    checks[++index] = checkCategory();
    return checks.indexOf(false) === -1;
}

/**
 * Validates the task title input.
 * @returns {boolean} - True if the title is at least 3 characters long, otherwise false.
 */
function checkTitle() {
    const title = document.getElementById('ato-title');
    const checkTitle = () => title.value.length > 2;
    return displayInputErrorMessage(title, 'Please enter at least 3 characters.', checkTitle, 8);
}

/**
 * Validates the task due date input.
 * @returns {boolean} - True if the due date is in the future, otherwise false.
 */
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

/**
 * Validates the task category selection.
 * @returns {boolean} - True if the category is one of the existing categories, otherwise false.
 */
function checkCategory() {
    const category = document.getElementById('ato-category');
    const hiddenInput = document.getElementById('ato-selected-category-input');
    const checkCategory = () => categories.indexOf(hiddenInput.value) !== -1;
    return displayInputErrorMessage(category, 'Please pick a category.', checkCategory, 0, hiddenInput);
}

/**
 * Creates a task object based on the current form inputs and selections.
 * @returns {Object} - A task object containing the current task data.
 */
function createTask() {
    return {
        state: taskState,
        category: document.getElementById('ato-selected-category').textContent,
        title: document.getElementById('ato-title').value.trim(),
        description: document.getElementById('ato-description').value.trim(),
        dueDate: document.getElementById('ato-due-date').value,
        assignedTo: structuredClone(selectedContacts),
        priority: document.querySelector('.selected-priority').dataset.priority,
        subtasks: structuredClone(writtenSubtasks)
    };
}