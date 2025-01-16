/**
 * Renders the move task overlay HTML for a given task.
 * @param {string} taskId - The ID of the task to be moved.
 * @returns {string} The HTML string of the move task overlay.
 */
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

/**
 * Renders an option for selecting a task state in the move task overlay.
 * @param {string} taskState - One of the available task states
 * @param {number} index - The index of the task state in the <code>taskStates</code> array.
 * @param {string} taskToMoveTaskState - The current state of the task being moved (do not offer to move to)
 * @param {string} taskId - The ID of the task being moved.
 * @returns {string} The HTML string of the task state option.
 */
function renderMoveTaskSelectOption(taskState, index, taskToMoveTaskState, taskId) {
    if (taskToMoveTaskState !== taskState) {
        return `
            <div class="choose-task-state custom-select ato-input" onclick="moveTaskTo('${taskId}', ${index})">${taskStatesDescription[index]}</div>
        `
    } else {
        return '';
    }
}