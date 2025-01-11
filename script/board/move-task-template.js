function renderMoveTaskOverlay(taskId) {
    return `
        <div class="move-task-ui">
            <div class="move-task-headline">Move task to:</div>
            <div class="fc jcac gap-32">
                ${renderForAll(taskStates, renderMoveTaskSelectOption, allData.tasks[taskId].state, taskId)}
            </div>
        </div>
    `
}

function renderMoveTaskSelectOption(taskState, index, taskToMoveTaskState, taskId) {
    if (taskToMoveTaskState !== taskState) {
        return `
            <div class="choose-task-state custom-select ato-input" onclick="moveTaskTo('${taskId}', ${index})">${taskStatesDescription[index]}</div>
        `
    } else {
        return '';
    }
}