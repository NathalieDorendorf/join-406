function renderNoTaskFeedback(feedbackText, found) {
    return `
        <div class="no-task-feedback">No tasks ${found}in "${feedbackText}"</div>
    `
}

function renderTask(id, task) {
    return `
        <div id=${id} class="card light-box-shadow">
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
    `
}

function getTagBackground(task) {
    return task.category === "User Story" ? 'blue-tag' : 'teal-tag';
}

function existsNonEmpty(property) {
    return property !== undefined ? !!property : false;
}

function renderCardSummary(description) {
    return existsNonEmpty(description) ? `<div class="card-summary">${description}</div>` : '';
}

function renderCardSubtasks(subtasks) {
    if (existsNonEmpty(subtasks)) {
        return `
            <div class="card-subtasks">
                <div class="card-subtasks-bar">
                    <div class="card-subtasks-bar-inner" style="width: calc(100% * ${calcDoneSubtasks(subtasks)} / ${subtasks.length});"></div>
                </div>
                <span class="card-subtasks-count">${calcDoneSubtasks(subtasks)}/${subtasks.length} Subtasks</span>
            </div>
        `
    } else {
        return '';
    }
}

function calcDoneSubtasks(subtasks) {
    let doneSubtasks = 0;
    subtasks.forEach(subtask => {
        if (subtask.done === true) {
            doneSubtasks++;
        }
    });
    return doneSubtasks;
}

function renderAssignedTo(assignedTo) {
    if (existsNonEmpty(assignedTo)) {
        return `
            <div class="member d-flex">
                ${renderMemberTags(assignedTo)}
            </div>
        `
    } else {
        return '';
    }
}

function renderMemberTags(assignedTo) {
    let assignedToHTML = '';
    assignedTo.forEach((member) => assignedToHTML += renderMemberTag(member));
    return assignedToHTML;
}

function renderMemberTag(contactId) {
    const contact = allData.contacts[contactId];
    return `
        <div class="member-icon d-flex-c-c" style="${getMemberTagBackgroundColor(contact)}">${contact.initials}</div>
    `
}

function getMemberTagBackgroundColor(contact) {
    return `background-color: var(${contact.color});`
}

function renderTaskDetailView(taskId) {

}

function renderNewTaskOverlay(state) {

}