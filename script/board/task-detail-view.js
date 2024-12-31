const tempItemsContainer = {};

async function toggleSubtaskStatus(currentElement, index) {
    const taskId = document.getElementById('overlay').firstElementChild.id;
    const subtask = allData.tasks[taskId].subtasks[index];
    saveState(subtask.done);
    subtask.done = !subtask.done;
    const svgPath = subtask.done ? 'checked' : 'unchecked';
    if (await updateTaskInDatabase(taskId)) {
        const newSrc = `/assets/icons/check-button-${svgPath}.svg`
        currentElement.src = newSrc;
        paintTasks();
    } else {
        subtask.done = restoreState();
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

function saveState(item, id = 'veryShortLifeSpan') {
    tempItemsContainer[id] = structuredClone(item);
}

function restoreState(id = 'veryShortLifeSpan') {
    const temp = structuredClone(tempItemsContainer[id]);
    delete tempItemsContainer[id];
    return temp;
}