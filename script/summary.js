async function initSummary() {
    renderGreeting(userName);
    await loadTaskCountsFromFirebase();
}

let userName = "Sophie Müller";

function renderGreeting(userName = null) {
    const greeting = userName 
        ? `<h5>Good Morning,</h5><span class="user-name">${userName}</span>` 
        : "<h5>Good Morning</h5>";
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        console.log(greeting);
        greetingElement.innerHTML = greeting;
    }
    console.log(greeting);
    return greeting;
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

