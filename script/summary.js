async function initSummary() {
    renderGreeting(userName);
    await loadTaskCountsFromFirebase();
}

let userName = "Sophia Müller";

function renderGreeting(userName = null) {
    let currentGreeting = document.getElementById("greeting").textContent = getGreeting();
    const greeting = userName 
        ? `<h5>${currentGreeting},</h5><span class="user-name">${userName}</span>` 
        : `<h5>${currentGreeting}</h5>`;
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        console.log(greeting);
        greetingElement.innerHTML = greeting;
    }
    console.log(greeting);
    return greeting;
}

/**
 * Displays a greeting based on the current time of day.
 * - 05:00 - 11:59: "Good morning"
 * - 12:00 - 17:59: "Good afternoon"
 * - 18:00 - 21:59: "Good evening"
 * - 22:00 - 04:59: "Good night"
 */
function getGreeting() {
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

async function loadTaskCountsFromFirebase() {
    const tasks = await fetchResource('tasks'); // Holt alle Tasks aus Firebase
    if (!tasks) return;

    const counts = {
        all: 0,
        toDo: 0,
        inProgress: 0,
        awaitFeedback: 0,
        done: 0
    };

    // Iteriere durch alle Tasks und zähle basierend auf dem Status
    for (const taskId in tasks) {
        const task = tasks[taskId];
        if (task.state === "to-do") counts.toDo++;
        if (task.state === "in-progress") counts.inProgress++;
        if (task.state === "await-feedback") counts.awaitFeedback++;
        if (task.state === "done") counts.done++;
        if (task.priority === "urgent") counts.urgent++;
    }

    counts.all = counts.toDo + counts.inProgress + counts.awaitFeedback + counts.done;

    console.log(counts);

    updateTaskCountsInHTML(counts);
}

// Aktualisiert die HTML-Elemente mit den Zählern
function updateTaskCountsInHTML(counts) {
    document.getElementById("openTodos").textContent = counts.toDo;
    document.getElementById("doneTodos").textContent = counts.done;
    document.getElementById("urgentTodos").textContent = counts.urgent;
    document.getElementById("boardTasks").textContent = counts.all;
    document.getElementById("taskInProgress").textContent = counts.inProgress;
    document.getElementById("awaitingFeedback").textContent = counts.awaitFeedback;
}

