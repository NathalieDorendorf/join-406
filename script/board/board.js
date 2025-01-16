/**
 * Form element for handling search operations and preventing form submission.
 * @type {HTMLFormElement}
 */
let searchForm;

/**
 * Input field for entering search terms.
 * @type {HTMLInputElement}
 */
let searchInputfield;

/**
 * Button element for adding a new task.
 * @type {HTMLButtonElement}
 */
let addTaskBtn;

/**
 * NodeList of column titles in the task board.
 * @type {NodeListOf<HTMLElement>}
 */
let columnTitles;

/**
 * NodeList of column bodies where tasks are displayed.
 * @type {NodeListOf<HTMLElement>}
 */
let columnsBodies;

/**
 * Object to store tasks filtered by the search.
 * @type {Object<string, Object>}
 */
let filteredTasks = {};

/**
 * Boolean flag indicating if the tasks are currently filtered.
 * @type {boolean}
 */
let filtered = false;

/**
 * Array of available task states values in the database.
 * @type {string[]}
 */
const taskStates = ['to-do', 'in-progress', 'await-feedback', 'done'];

/**
 * Array of available task state names.
 * @type {string[]}
 */
const taskStatesDescription = ['To Do', 'In progress', 'Await feedback', 'Done'];

/**
 * Array of available task categories.
 * @type {string[]}
 */
const categories = ['User Story', 'Technical Task'];


/**
 * Event listener for initializing the task board on document load.
 */
document.addEventListener('DOMContentLoaded', async () => {
    getElementRefs();
    registerEventHandlers();
    await fetchAllDataAndPaintTasks();
});

/**
 * Retrieves references to key DOM elements and stores them in global variables.
 */
function getElementRefs() {
    searchForm = document.getElementById('search-form');
    searchInputfield = document.getElementById('search');
    addTaskBtn = document.getElementById('add-task');
    columnTitles = document.querySelectorAll('.column-title');
    columnsBodies = document.querySelectorAll('.column-body');
}

/**
 * Registers event handlers for search
 */
function registerEventHandlers() {
    searchForm.oninput = searchForm.onsubmit = (e) => {
        e.preventDefault();
        search();
    };
}

/**
 * Fetches all data from the server and paints tasks in the task board.
 */
async function fetchAllDataAndPaintTasks() {
    allData = await getAllData();
    paintTasks(allData.tasks);
}

/**
 * Paints tasks into their respective columns based on their state.
 * Displays feedback messages if no tasks are available.
 * @param {Object} [tasks=allData.tasks] - Tasks to be rendered, defaults to all tasks.
 */
function paintTasks(tasks = allData.tasks) {
    createHTMLContents(tasks).forEach((html, index) => columnsBodies.item(index).innerHTML = html);
    columnsBodies.forEach((columnbody, index) => {
        if (!columnbody.children.length) {
            columnbody.innerHTML = renderNoTaskFeedback(columnTitles.item(index).textContent, filtered ? 'found ' : '');
        }
    });
    addDragAndDropEventListeners();
}

/**
 * Creates HTML content for tasks organized by their state.
 * @param {Object} tasks - Object containing tasks to render.
 * @returns {string[]} - Array of HTML strings for each column.
 */
function createHTMLContents(tasks) {
    const columnsHTMLContents = ['', '', '', ''];
    for (const [id, task] of Object.entries(tasks)) {
        const columnIndex = taskStates.indexOf(task.state);
        if (columnIndex !== -1) {
            columnsHTMLContents[columnIndex] += renderTask(id, task);
        } else {
            console.error('task-state does not exist.');
        }
    }
    return columnsHTMLContents;
}

/**
 * Displays a hint in the search input field.
 */
function showSearchHint() {
    searchInputfield.value = "Enter search term";
    searchInputfield.select();
}

/**
 * Handles the search functionality for filtering tasks.
 * Resets the task board if the search input is empty.
 */
function search() {
    if (searchInputfield.value.length == 0) {
        filtered = false;
        paintTasks(allData.tasks);
    } else {
        executeSearch(searchInputfield);
    }
}

/**
 * Executes the search and updates the task board with matching tasks.
 * Disables the search input field temporarily during processing.
 * @param {HTMLInputElement} searchInputfield - The input field containing the search term(s).
 */
function executeSearch(searchInputfield) {
    filteredTasks = {};
    setTimeout(() => {
        if (!filtered && searchInputfield.value.length > 0) {
            showToastMessage({ message: "Searching tasks" });
        }
    }, 100);
    filteredTasks = getMatchingTasks(searchInputfield.value);
    filtered = true;
    paintTasks(filteredTasks);
}

/**
 * Filters tasks based on a search terms.
 * @param {string} searchString - The search term(s) to match tasks against.
 * @returns {Object} - Object containing tasks that match the search term(s).
 */
function getMatchingTasks(searchString) {
    const searchTerms = searchString.toLowerCase().split(/\s+/);
    const filteredTasks = {};
    for (const [id, task] of Object.entries(allData.tasks)) {
        let taskHasAllSearchTerms = false;
        for (const searchTerm of searchTerms) {
            if (task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm)) {
                taskHasAllSearchTerms = true;
            } else {
                taskHasAllSearchTerms = false;
                break;
            }
        }
        if (taskHasAllSearchTerms) {
            filteredTasks[id] = task;
        }
    }
    return filteredTasks;
}

/**
 * Opens the detailed view of a task in an overlay.
 * @param {HTMLElement} currentElement - The task element that was clicked.
 */
function openTaskDetailView(currentElement) {
    const taskId = currentElement.id;
    const taskDetailView = renderTaskDetailView(taskId);
    openOverlay(taskDetailView, 'fly-out-to-right');
}

/**
 * Opens the "Add Task" overlay prefilled with optional data, if overlay was previously closed without saving
 * @param {string} [state='to-do'] - Initial state of the task being added.
 */
function openOverlayNewTask(state = 'to-do') {
    taskState = state;
    setDataForForm(taskToRestore);
    const addTaskOverlay = renderAddTaskOverlay();
    openOverlay(addTaskOverlay, 'fly-out-to-right', closeAddTaskOverlay);
    turnOffFormSubmission(document.getElementById('ato-form'));
    fillForm(taskToRestore);
    adaptTextareaHeightToContent('ato-description');
}

/**
 * Opens the "Move Task" overlay for selecting a new state for the task.
 * @param {MouseEvent} event - The triggering click event.
 * @param {string} taskId - The ID of the task to move.
 */
function openMoveTaskOverlay(event, taskId) {
    event.stopPropagation();
    const moveTaskOverlay = renderMoveTaskOverlay(taskId);
    openOverlay(moveTaskOverlay, 'fly-out-to-right');
}

/**
 * Moves a task to a new state and updates the server.
 * Restores the previous state if the update fails.
 * @param {string} taskId - The ID of the task to move.
 * @param {number} index - The index of the new state in <code>taskStates</code>.
 */
async function moveTaskTo(taskId, index) {
    const tempTaskState = allData.tasks[taskId].state;
    allData.tasks[taskId].state = taskStates[index];
    paintTasks();
    if (!await updateTaskInDatabase(taskId)) {
        allData.tasks[taskId].state = tempTaskState;
        paintTasks();
    }
    closeOverlay();
}
