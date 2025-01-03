function renderTaskDetailView(taskId) {
    const task = allData.tasks[taskId];
    return `
        <div id="${taskId}" class="detail-card light-box-shadow fly-in-from-right">
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
                <div class="fr gap-8 ui-icon" onclick="deleteTask()">
                    <img src="/assets/icons/delete-blue.svg" alt="Delete button">
                    <span>Delete</span>
                </div>
                <div class="vertical-separator"></div>
                <div class="fr gap-8 ui-icon">
                    <img src="/assets/icons/edit-blue.svg" alt="Edit button">
                    <span>Edit</span>
                </div>
            </div>
        </div>
    `
}

function renderTaskDescription(description) {
    return description ? `<div>${description}</div>` : '';
}

function renderDueDate(dueDate) {
    return new Date(Date.parse(dueDate)).toLocaleDateString('en', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

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

function renderDetailCardAssignedTo(contactId) {
    return `
        <div class="member-card fr jsac">
            ${renderContactTag(contactId)}
            <span>${allData.contacts[contactId].name}</span>
        </div>
    `
}

function renderDetailCardSubtasks(subtasks) {
    if (subtasks) {
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

function renderDetailCardSubtask(subtask, index) {
    const svgPath = subtask.done ? 'checked' : 'unchecked';
    return `
        <div class="fr jsac gap-16 detail-card-subtask">
            <img src="/assets/icons/check-button-${svgPath}.svg" alt="${svgPath} button" class="check-btn" onclick="toggleSubtaskStatus(this, ${index})">
            <span>${subtask.title}</span>
        </div>
    `
}
