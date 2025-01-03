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

/**
 * Lädt die Anzahl der Tasks in den Kategorien 'todo', 'done' und 'urgent'
 * und aktualisiert die entsprechenden HTML-Elemente.
 */
// async function loadTaskCounts() {
//     try {
//         // Alle Tasks aus der Datenbank abrufen
//         const allTasks = await fetchResource('tasks');

//         if (!allTasks) {
//             console.error('Tasks konnten nicht geladen werden.');
//             return;
//         }

//         // Kategorien initialisieren
//         let todoCount = 0;
//         let doneCount = 0;
//         let urgentCount = 0;
//         let boardTasks = 0;
//         let taskInProgress = 0;
//         let awaitingFeedback = 0;

//         // Tasks durchgehen und Kategorien zählen
//         for (const taskId in allTasks) {
//             const task = allTasks[taskId];

//             // Gesamtzahl der Tasks im Board
//             boardTasksCount++;

//             // Status-basierte Zählung
//             if (task.status === 'todo') {
//                 todoCount++;
//             } else if (task.status === 'done') {
//                 doneCount++;
//             } else if (task.status === 'inProgress') {
//                 taskInProgressCount++;
//             } else if (task.status === 'awaitingFeedback') {
//                 awaitingFeedbackCount++;
//             }

//             // Dringende Tasks
//             if (task.urgent) {
//                 urgentCount++;
//             }
//         }

//         // HTML-Elemente aktualisieren
//         document.getElementById('openTodos').textContent = todoCount;
//         document.getElementById('doneTodos').textContent = doneCount;
//         document.getElementById('urgentTodos').textContent = urgentCount;
//         document.getElementById('boardTasks').textContent = boardTasks;
//         document.getElementById('taskInProgress').textContent = taskInProgress;
//         document.getElementById('awaitingFeedback').textContent = awaitingFeedback;


//         console.log(`Tasks geladen: ${todoCount} To-do, ${doneCount} Done, ${urgentCount} Urgent. ${boardTasks} Board-Tasks, ${taskInProgress} in Bearbeitung, ${awaitingFeedback} auf Feedback.`);
//     } catch (error) {
//         console.error('Fehler beim Laden der Task-Zahlen:', error);
//     }
// }

// function countTasksInColumns() {
//     const toDoCount = document.getElementById('to-do-column').children.length;
//     const inProgressCount = document.getElementById('in-progress-column').children.length;
//     const awaitFeedbackCount = document.getElementById('await-feedback-column').children.length;
//     const doneCount = document.getElementById('done-column').children.length;

//     console.log(`To Do: ${toDoCount}`);
//     console.log(`In Progress: ${inProgressCount}`);
//     console.log(`Awaiting Feedback: ${awaitFeedbackCount}`);
//     console.log(`Done: ${doneCount}`);
// }

// function updateTaskCounts() {
//     const toDoCount = document.getElementById('to-do-column').children.length;
//     const inProgressCount = document.getElementById('in-progress-column').children.length;
//     const awaitFeedbackCount = document.getElementById('await-feedback-column').children.length;
//     const doneCount = document.getElementById('done-column').children.length;

//     // Elemente überprüfen, bevor sie aktualisiert werden
//     const openTodosElement = document.getElementById('openTodos');
//     const inProgressElement = document.getElementById('taskInProgress');
//     const awaitingFeedbackElement = document.getElementById('awaitingFeedback');
//     const doneTodosElement = document.getElementById('doneTodos');

//     if (openTodosElement) openTodosElement.textContent = toDoCount;
//     if (inProgressElement) inProgressElement.textContent = inProgressCount;
//     if (awaitingFeedbackElement) awaitingFeedbackElement.textContent = awaitFeedbackCount;
//     if (doneTodosElement) doneTodosElement.textContent = doneCount;
// }

// Nach jeder Änderung die Funktion aufrufen
// updateTaskCounts();

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

    // Aktualisiere die HTML-Elemente in beiden Seiten
    updateTaskCountsInHTML(counts);
}

// Aktualisiert die HTML-Elemente mit den Zählern
function updateTaskCountsInHTML(counts) {
    // Für summary.html
    document.getElementById("openTodos").textContent = counts.toDo;
    document.getElementById("doneTodos").textContent = counts.done;
    document.getElementById("urgentTodos").textContent = counts.urgent;
    document.getElementById("boardTasks").textContent = counts.all;
    document.getElementById("taskInProgress").textContent = counts.inProgress;
    document.getElementById("awaitingFeedback").textContent = counts.awaitFeedback;
}

