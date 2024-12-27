function renderTask(task) {
    return `
        <div class="card light-box-shadow">
            <div class="tag">${task.category}</div>
            <div class="content">
                <div class="headline">${task.title}</div>
                <div class="summary">${task.description}</div>
            </div>
            <div class="subtasks">
                <div class="bar">
                    <div class="inner"></div>
                </div>
                <span class="subtask-count">${calcDoneSubtasks(task)}/${task.subtasks.length} Subtasks</span>
            </div>
            <div class="member-and-priority">
                <div class="member d-flex">
                    ${renderAssignedTo(task)}
                </div>
                <div class="priority d-flex-c-c"><img src="/assets/icons/priority-medium.svg"
                        alt="Medium priority"></div>
            </div>
        </div>
    `
}

function calcDoneSubtasks(task) {
    let doneSubtasks = 0;
    task.subtasks.forEach(subtask => {
        if (subtask.done === true) {
            doneSubtasks++;
        }
    });
    return doneSubtasks;
}

function renderAssignedTo(task) {
    let assignedToHTML = '';
    task.assignedTo.forEach((member) => assignedToHTML += renderMemberTag(member));
    return assignedToHTML;
}

function renderMemberTag(contactId) {
    return `
        <div class="member-icon d-flex-c-c">${allData.contacts[contactId].initials}</div>
    `
}

function renderTaskDetailView(taskId) {

}

function renderNewTaskOverlay(state) {

}