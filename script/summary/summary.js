/**
 * Initializes the summary view by setting up content, greeting, and task data.
 * @async
 */
async function initSummary() {
    await initializeContent();
    await initializeGreeting();
    await initializeTaskData();
}

/**
 * Renders the summary content and sets up responsive content display.
 * @async
 */
async function initializeContent() {
    renderSummaryContent();
    showResponsiveContent();
}

/**
 * Retrieves the user's email from local storage and renders the greeting.
 * @async
 */
async function initializeGreeting() {
    const mail = localStorage.getItem('mail');
    await renderGreeting(mail);
}

/**
 * Loads task data and displays relevant counts and the closest due date.
 * @async
 */
async function initializeTaskData() {
    await loadTaskCounts();
    await showClosestDueDate();
}

/**
 * Renders a personalized greeting for the user based on their email.
 * @param {string} userEmail - The email of the user.
 * @async
 */
async function renderGreeting(userEmail) {
    try {
        const userName = await getUserNameByEmail(userEmail);
        const greetingHTML = generateGreetingHTML(userName);
        updateGreetingElement(greetingHTML);
    } catch (error) {
        console.error("Error rendering greeting:", error);
    }
}

/**
 * Retrieves the username associated with the given email.
 * @param {string} email - The user's email.
 * @returns {Promise<string|null>} The username, or null if not found.
 * @async
 */
async function getUserNameByEmail(email) {
    const contacts = await fetchResource('contacts');
    const matchingContact = Object.values(contacts).find(contact => contact.mail === email);
    return matchingContact ? matchingContact.name : null;
}

/**
 * Generates the HTML for the greeting message.
 * @param {string|null} userName - The user's name or null.
 * @returns {string} The HTML string for the greeting.
 */
function generateGreetingHTML(userName) {
    const currentGreeting = getGreetingTime();
    return userName
        ? `<h5 class="h5-responsive">${currentGreeting},</h5><span class="user-name">${userName}</span>`
        : `<h5 class="h5-responsive">${currentGreeting}!</h5>`;
}

/**
 * Updates the greeting element with the provided HTML content.
 * @param {string} html - The HTML string for the greeting.
 */
function updateGreetingElement(html) {
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        greetingElement.innerHTML = html;
    }
}

/**
 * Determines the current greeting time based on the hour of the day.
 * @returns {string} The appropriate greeting ("Good morning", "Good afternoon", etc.).
 */
function getGreetingTime() {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
        return "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        return "Good afternoon";
    } else if (currentHour >= 18 && currentHour < 22) {
        return "Good evening";
    } else {
        return "Good night";
    }
}

/**
 * Loads task counts from Firebase and updates the UI.
 * @async
 */
async function loadTaskCounts() {
    const tasks = await fetchResource('tasks');
    if (!tasks) return;

    const counts = countTasks(tasks);
    updateTaskCountsInHTML(counts);
}

/**
 * Counts tasks by their state and priority.
 * @param {Object} tasks - The tasks retrieved from Firebase.
 * @returns {Object} An object containing task counts.
 */
function countTasks(tasks) {
    const counts = { all: 0, toDo: 0, inProgress: 0, awaitFeedback: 0, done: 0, urgent: 0 };
    for (const task of Object.values(tasks)) {
        updateCounts(task, counts);
    }
    counts.all = counts.toDo + counts.inProgress + counts.awaitFeedback + counts.done;
    return counts;
}

/**
 * Updates the task counts based on a single task's state and priority.
 * @param {Object} task - A task object.
 * @param {Object} counts - The counts object to update.
 */
function updateCounts(task, counts) {
    if (task.state === "to-do") counts.toDo++;
    if (task.state === "in-progress") counts.inProgress++;
    if (task.state === "await-feedback") counts.awaitFeedback++;
    if (task.state === "done") counts.done++;
    if (task.priority === "Urgent") counts.urgent++;
}

/**
 * Updates the task count elements in the HTML with the given counts.
 * @param {Object} counts - The task counts to display.
 */
function updateTaskCountsInHTML(counts) {
    document.getElementById("openTodos").textContent = counts.toDo;
    document.getElementById("doneTodos").textContent = counts.done;
    document.getElementById("urgentTodos").textContent = counts.urgent;
    document.getElementById("boardTasks").textContent = counts.all;
    document.getElementById("taskInProgress").textContent = counts.inProgress;
    document.getElementById("awaitingFeedback").textContent = counts.awaitFeedback;
}

/**
 * Displays the closest due date of urgent tasks or the current date if none exist.
 * @async
 */
async function showClosestDueDate() {
    const tasks = await fetchResource('tasks');
    if (!tasks) return;

    const urgentTasksWithDueDate = filterUrgentTasksWithDueDate(tasks);
    const closestDateStr = urgentTasksWithDueDate.length
        ? getClosestDueDate(urgentTasksWithDueDate)
        : getCurrentDateString();

    updateTaskDateElement(closestDateStr);
}

/**
 * Filters tasks to include only those with "Urgent" priority and a due date.
 * @param {Object} tasks - The tasks retrieved from Firebase.
 * @returns {Array} An array of filtered tasks.
 */
function filterUrgentTasksWithDueDate(tasks) {
    return Object.values(tasks).filter(task => task.priority === "Urgent" && task.dueDate);
}

/**
 * Finds the closest due date from a list of tasks.
 * @param {Array} tasks - An array of tasks with due dates.
 * @returns {string} The formatted closest due date.
 */
function getClosestDueDate(tasks) {
    const currentDate = new Date();
    const closestTask = tasks.reduce((closest, task) => {
        const taskDate = new Date(task.dueDate);
        const closestDate = new Date(closest.dueDate);
        return Math.abs(taskDate - currentDate) < Math.abs(closestDate - currentDate) ? task : closest;
    });
    return formatDate(new Date(closestTask.dueDate));
}

/**
 * Gets the current date formatted as a string.
 * @returns {string} The formatted current date.
 */
function getCurrentDateString() {
    return formatDate(new Date());
}

/**
 * Formats a date object as a string.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, ${year}`;
}

/**
 * Updates the task date element in the HTML with the given date string.
 * @param {string} dateStr - The date string to display.
 */
function updateTaskDateElement(dateStr) {
    const element = document.getElementById("taskDate");
    if (element) element.textContent = dateStr;
}

/**
 * Displays responsive content based on the current screen width.
 */
function showResponsiveContent() {
    if (window.innerWidth <= 1024) {
        handleMobileView();
    } else {
        handleDesktopView();
    }
}

/**
 * Handles the display logic for mobile view.
 */
function handleMobileView() {
    renderSummaryHeaderResponsive();
    showGreetingFirstOnMobile();
    setTimeout(showContentAfterGreetingOnMobile, 1500);
}

/**
 * Handles the display logic for desktop view.
 */
function handleDesktopView() {
    renderSummaryHeader();
    showGreetingAndContentOnDesktop();
}

/**
 * Displays the greeting first on mobile view.
 */
function showGreetingFirstOnMobile() {
    const greetingElement = document.getElementById("greeting");
    const summaryContentElement = document.getElementById("summaryContent");
    greetingElement.classList.remove("hidden");
    greetingElement.classList.remove("summary-greetings");
    summaryContentElement.classList.add("d-none");
}

/**
 * Displays the summary content after a delay on mobile view.
 */
function showContentAfterGreetingOnMobile() {
    const greetingElement = document.getElementById("greeting");
    const summaryContentElement = document.getElementById("summaryContent");
    const summaryHeaderElement = document.getElementById("summaryHeader");
    greetingElement.classList.add("hidden");
    greetingElement.classList.add("d-none");
    summaryHeaderElement.classList.remove("d-none");
    summaryContentElement.classList.remove("d-none");
}

/**
 * Displays the greeting and summary content on desktop view.
 */
function showGreetingAndContentOnDesktop() {
    const greetingElement = document.getElementById("greeting");
    const summaryContentElement = document.getElementById("summaryContent");
    const summaryHeaderElement = document.getElementById("summaryHeader");
    greetingElement.classList.remove("hidden");
    greetingElement.classList.add("summary-greetings");
    summaryContentElement.classList.add("visible");
    summaryHeaderElement.classList.remove("d-none");
    summaryContentElement.classList.remove("d-none");
}
