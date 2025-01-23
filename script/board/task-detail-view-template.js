/**
 * Renders the detailed view of a task.
 * @param {string} taskId - The ID of the task to display.
 * @param {AllData} allData - the global data containing also tasks
 * @returns {string} The HTML string of the task detail view.
 */
function renderTaskDetailView(taskId) {
    const task = allData.tasks[taskId];
    return `
        <div id="${taskId}" class="detail-card light-box-shadow">
            <div class="d-flex-sb-c gap-16">
                <div class="card-tag ${getTagBackground(task)}">${task.category}</div>
                <div class="ui-icon-wrapper">
                    <img src="/assets/icons/close.svg" alt="Close button" onclick="closeOverlay()">
                </div>
            </div>
            <div class="card-title">${task.title}</div>
            ${renderTaskDescription(task.description)}
            <div class="date-and-prio-alignment-box">
                <div>
                    <span class="task-item-designator">Due date:</span>
                    ${renderDueDate(task.dueDate)}
                </div>
                <div class="detail-card-priority">
                    <span class="task-item-designator">Priority:</span>
                    <div class="fr jsac gap-8">
                        <span class="task-priority-string">${task.priority}</span>
                        <img src="/assets/icons/priority-${task.priority}.svg" alt="${task.priority} priority">
                    </div>
                </div>
            </div>
            ${renderDetailCardAssignedToSection(task.assignedTo)}
            ${renderDetailCardSubtasks(task.subtasks)}
            <div class="fr je gap-8 detail-card-ui-footer">
                <div class="fr gap-8 ui-icon" onclick="deleteTask('${taskId}')">
                    <img src="/assets/icons/delete-blue.svg" alt="Delete button">
                    <span>Delete</span>
                </div>
                <div class="vertical-separator"></div>
                <div class="fr gap-8 ui-icon" onclick="editTask('${taskId}')">
                    <img src="/assets/icons/edit-blue.svg" alt="Edit button">
                    <span>Edit</span>
                </div>
            </div>
        </div>
    `
}

/**
 * Renders the task description.
 * @param {string} description - The description of the task.
 * @returns {string} The HTML string of the task description.
 */
function renderTaskDescription(description) {
    return description ? `<div>${description}</div>` : '';
}

/**
 * Formats and renders the due date of a task.
 * @param {string} dueDate - The due date of the task in ISO format.
 * @returns {string} The formatted due date. (01/01/2000)
 */
function renderDueDate(dueDate) {
    return new Date(Date.parse(dueDate)).toLocaleDateString('en', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Renders the "Assigned To" section of the task.
 * @param {Array<string>} assignedTo - Array of contact IDs assigned to the task.
 * @returns {string} The HTML string of the "Assigned To" section.
 */
function renderDetailCardAssignedToSection(assignedTo) {
    if (assignedTo) {
        return `
            <div class="assigned-to">
                <span class="task-item-designator">Assigned To:</span>
                <div class="detail-card-members">
                    ${renderForAll(assignedTo, renderDetailCardAssignedTo)}
                </div>
            </div>
        `;
    } else {
        return '';
    }
}

/**
 * Renders a member card for an assigned contact.
 * @param {string} contactId - The ID of the contact assigned to the task.
 * @returns {string} The HTML string of the assigned member card.
 */
function renderDetailCardAssignedTo(contactId) {
    return `
        <div class="member-card fr jsac">
            ${renderContactTag(contactId)}
            <span>${allData.contacts[contactId].name}</span>
        </div>
    `
}

/**
 * Renders the subtasks section of the task.
 * @param {Array<Object>} subtasks - Array of subtask objects.
 * @returns {string} The HTML string of the subtasks section.
 */
function renderDetailCardSubtasks(subtasks) {
    if (subtasks && subtasks.length > 0) {
        return `
            <div class="fc gap-8">
                <span class="task-item-designator">Subtasks</span>
                <div class="fc detail-card-subtasks">
                    ${renderForAll(subtasks, renderDetailCardSubtask)}
                </div>
            </div>
        `
    } else {
        return '';
    }
}

/**
 * Renders a single subtask.
 * @param {Object} subtask - The subtask object.
 * @param {string} subtask.title - The title of the subtask.
 * @param {boolean} subtask.done - Whether the subtask is completed.
 * @param {number} index - The index of the subtask.
 * @returns {string} The HTML string of the subtask.
 */
function renderDetailCardSubtask(subtask, index) {
    const svgPath = subtask.done ? 'checked' : 'unchecked';
    return `
        <div class="fr jsac gap-16 detail-card-subtask">
            <img src="/assets/icons/check-button-${svgPath}.svg" alt="${svgPath} button" class="check-btn" onclick="toggleSubtaskStatus(this, ${index})">
            <span>${subtask.title}</span>
        </div>
    `
}