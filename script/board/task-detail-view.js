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

async function deleteTask() {
    if (window.confirm("Do you want to delete the task?")) {
        const taskId = document.getElementById('overlay').firstElementChild.id;
        if (await deleteTaskInDatabase(taskId)) {
            await fetchAllDataAndPaintTasks();
            closeOverlay();
        }
    }
}