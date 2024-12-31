/**
 * Renders a feedback message when no tasks are found.
 * @param {string} feedbackText - The text describing the context of the feedback.
 * @param {string} [found] - "found " or leave empty. To clarify, that there are no tasks or there are no tasks found.
 * @returns {string} The HTML string for the feedback message.
 */
function renderNoTaskFeedback(feedbackText, found) {
    return `
        <div class="no-task-feedback">No tasks ${found}in "${feedbackText}"</div>
    `;
}

/**
 * Renders a task card.
 * @param {string} id - The ID of the task.
 * @param {Object} task - The task object containing its details.
 * @param {string} task.category - The category of the task ("User Story", "Technical Task")
 * @param {string} task.title - The title of the task.
 * @param {string} [task.description] - A description of the task.
 * @param {Array<Object>} [task.subtasks] - An array of subtasks.
 * @param {Array<string>} [task.assignedTo] - An array of contact IDs, that are assigned to the task
 * @param {string} task.priority - The priority of the task ("low", "medium", "urgent").
 * @returns {string} The HTML string for the task card.
 */
function renderTask(id, task) {
    return `
        <div id=${id} class="card light-box-shadow" onclick="openTaskDetailView(this)">
            <div class="card-tag ${getTagBackground(task)}">${task.category}</div>
            <div class="card-content">
                <div class="card-title">${task.title}</div>
                ${renderCardSummary(task.description)}
            </div>
            ${renderCardSubtasks(task.subtasks)}
            <div class="member-and-priority">
                ${renderAssignedTo(task.assignedTo)}
                <div class="priority d-flex-c-c"><img src="/assets/icons/priority-${task.priority}.svg"
                        alt="${task.priority} priority"></div>
            </div>
        </div>
    `;
}

/**
 * Determines the CSS class for the task category tag background.
 * @param {Object} task - The task object.
 * @param {string} task.category - The category of the task.
 * @returns {string} The CSS class for the tag background.
 */
function getTagBackground(task) {
    return task.category === "User Story" ? 'blue-tag' : 'teal-tag';
}

/**
 * Renders the summary of a task card.
 * @param {string} [description] - The description of the task.
 * @returns {string} The HTML string for the card summary or an empty string if no description exists.
 */
function renderCardSummary(description) {
    return description ? `<div class="card-summary">${description}</div>` : '';
}

/**
 * Renders the subtasks section of a task card.
 * @param {Array<Object>} [subtasks] - An array of subtasks.
 * @returns {string} The HTML string for the subtasks section or an empty string if no subtasks exist.
 */
function renderCardSubtasks(subtasks) {
    if (subtasks) {
        return `
            <div class="card-subtasks">
                <div class="card-subtasks-bar">
                    <div class="card-subtasks-bar-inner" style="width: calc(100% * ${calcDoneSubtasks(subtasks)} / ${subtasks.length});"></div>
                </div>
                <span class="card-subtasks-count">${calcDoneSubtasks(subtasks)}/${subtasks.length} Subtasks</span>
            </div>
        `;
    } else {
        return '';
    }
}

/**
 * Calculates the number of completed subtasks.
 * @param {Array<Object>} subtasks - An array of subtasks.
 * @returns {number} The number of completed subtasks.
 */
function calcDoneSubtasks(subtasks) {
    let doneSubtasks = 0;
    subtasks.forEach(subtask => {
        if (subtask.done === true) {
            doneSubtasks++;
        }
    });
    return doneSubtasks;
}

/**
 * Renders the assigned members section of a task card.
 * @param {Array<string>} [assignedTo] - An array of assigned contact IDs.
 * @returns {string} The HTML string for the assigned-members-section or an empty string if no members are assigned.
 */
function renderAssignedTo(assignedTo) {
    if (assignedTo) {
        return `
            <div class="member d-flex">
                ${renderForAll(assignedTo, renderMemberTag)}
            </div>
        `;
    } else {
        return '';
    }
}

/**
 * Renders HTML for each element in the provided array using the given render function.
 * @param {Array} dataArray - An array of data elements to be rendered.
 * @param {Function} renderFunction - A function that takes a data element and returns the HTML string representation.
 * @returns {string} A concatenated string of HTML elements rendered for each item in the array.
 */
function renderForAll(dataArray, renderFunction) {
    let renderedHTML = '';
    dataArray.forEach((dataElement, index) => renderedHTML += renderFunction(dataElement, index));
    return renderedHTML;
}

/**
 * Renders a tag for a single assigned member.
 * @param {string} contactId - The ID of the contact.
 * @returns {string} The HTML string for the member tag.
 */
function renderMemberTag(contactId) {
    const contact = allData.contacts[contactId];
    return `
        <div class="member-icon d-flex-c-c" style="${getMemberTagBackgroundColor(contact)}">${contact.initials}</div>
    `;
}

/**
 * Determines the background color for a member tag.
 * @param {Object} contact - The contact object.
 * @param {string} contact.color - The tag color of the contact.
 * @returns {string} The CSS style for the background color.
 */
function getMemberTagBackgroundColor(contact) {
    return `background-color: var(${contact.color});`;
}
