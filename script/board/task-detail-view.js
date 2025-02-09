/**
 * Toggles the completion status of a subtask.
 * @param {HTMLImageElement} currentElement - The checkbox element for the subtask.
 * @param {number} index - The index of the subtask within the task's subtasks array.
 * @param {AllData} allData - The global data containing tasks and their details.
 * @returns {Promise<void>}
 */
async function toggleSubtaskStatus(currentElement, index) {
    const taskId = document.getElementById('overlay').firstElementChild.id;
    const subtask = allData.tasks[taskId].subtasks[index];
    const tempSubtaskDone = subtask.done;
    subtask.done = !subtask.done;
    updateCheckbox();
    if (await updateTaskInDatabase(taskId)) {
        paintTasks();
    } else {
        subtask.done = tempSubtaskDone;
        updateCheckbox();
    }

    /**
     * Updates the checkbox with the correct SVG path.
     * @returns {void}
     */
    function updateCheckbox() {
        const svgPath = subtask.done ? 'checked' : 'unchecked';
        const newSrc = `/assets/icons/check-button-${svgPath}.svg`
        currentElement.src = newSrc;
    }
}

/**
 * Deletes a task and provides an undo option.
 * @param {string} taskId ID of the task to be deleted.
 * @returns {Promise<void>}
 */
async function deleteTask(taskId) {
    const undoTask = structuredClone(allData.tasks[taskId]);
    if (await deleteTaskInDatabase(taskId)) {
        await fetchAllDataAndPaintTasks();
        closeOverlay();
        showUndo({ undoCallbackFn });
    }

    /**
     * Callback: Restores task by posting cloned task to database.
     * @returns {Promise<void>}
     */
    async function undoCallbackFn() {
        if (await fetchResource('tasks/', 'POST', undoTask)) {
            showToastMessage({ message: 'Task has been successfully restored' });
            fetchAllDataAndPaintTasks();
        } else {
            showToastMessage({ message: 'Task could not be restored.' });
        }
    }
}

/**
 * Opens the edit task overlay and sets up the form for editing a task.
 * @param {string} taskId - The ID of the task to edit.
 * @param {AllData} allData - The global data containing tasks and their details.
 */
function editTask(taskId) {
    removeOverlay();
    taskState = allData.tasks[taskId].state;
    const task = allData.tasks[taskId];
    setDataForForm(task);
    const editTaskOverlay = renderEditTaskOverlay(taskId);
    openOverlay(editTaskOverlay, 'fly-in-from-right', 'fly-out-to-right', closeEditTaskOverlay);
    turnOffFormSubmission(document.getElementById('ato-form'));
    fillForm(task);
    adaptTextareaHeightToContent('ato-description');
}

/**
 * Closes the edit task overlay and resets the form.
 */
function closeEditTaskOverlay() {
    resetForm();
    closeOverlay();
}
