const tempItemsContainer = {};

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

    function updateCheckbox() {
        const svgPath = subtask.done ? 'checked' : 'unchecked';
        const newSrc = `/assets/icons/check-button-${svgPath}.svg`
        currentElement.src = newSrc;
    }
}

async function deleteTask(taskId) {
    if (window.confirm("Do you want to delete the task?")) {
        if (await deleteTaskInDatabase(taskId)) {
            await fetchAllDataAndPaintTasks();
            closeOverlay();
        }
    }
}

function editTask(taskId) {
    removeOverlay();
    taskState = allData.tasks[taskId].state;
    const task = allData.tasks[taskId];
    setDataForForm(task);
    const editTaskOverlay = renderEditTaskOverlay(taskId);
    openOverlay(editTaskOverlay, 'fly-out-to-right', closeEditTaskOverlay);
    turnOffFormSubmission(document.getElementById('ato-form'));
    fillForm(task);
    adaptTextareaHeightToContent('ato-description');
}

function closeEditTaskOverlay() {
    resetForm();
    closeOverlay();
}