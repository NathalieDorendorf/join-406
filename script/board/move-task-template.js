let taskToMoveTaskState;

function renderMoveTaskOverlay(taskId) {
    taskToMoveTaskState = allData.tasks[taskId].state;
    return `
        <div class="move-task-ui">
            <div class="move-task-headline">Move task to:</div>
            <div class="fc jcac gap-32">
                ${renderMoveTaskSelectOptions(taskId)}
            </div>
        </div>
    `
}

function renderMoveTaskSelectOptions(taskId) {
    return renderForAll(taskStates, renderMoveTaskSelectOption, taskId);
}

function renderMoveTaskSelectOption(taskState, index, taskId) {
    if (taskToMoveTaskState !== taskState) {
        return `
            <div class="choose-task-state custom-select ato-input" onclick="moveTaskTo('${taskId}', ${index})">${taskStatesDescription[index]}</div>
        `
    } else {
        return '';
    }
}