async function initSummary() {
    renderSummaryContent();
    renderGreeting(userName);
    await loadTaskCountsFromFirebase();
    await showClosestDueDate();
    showResponsiveContent();
}

let userName = "Sophia Müller";

function renderGreeting(userName = null) {
    const currentGreeting = document.getElementById("greeting").textContent = getGreetingTime();
    const greeting = userName 
        ? `<h5>${currentGreeting},</h5><span class="user-name">${userName}</span>` 
        : `<h5>${currentGreeting}!</h5>`;
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

async function loadTaskCountsFromFirebase() {
    const tasks = await fetchResource('tasks'); // Holt alle Tasks aus Firebase
    if (!tasks) return;

    const counts = {
        all: 0,
        toDo: 0,
        inProgress: 0,
        awaitFeedback: 0,
        done: 0,
        urgent: 0
    };

    // Iteriere durch alle Tasks und zähle basierend auf dem Status
    for (const taskId in tasks) {
        const task = tasks[taskId];
        if (task.state === "to-do") counts.toDo++;
        if (task.state === "in-progress") counts.inProgress++;
        if (task.state === "await-feedback") counts.awaitFeedback++;
        if (task.state === "done") counts.done++;
        if (task.priority === "Urgent") counts.urgent++;
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

async function showClosestDueDate() {
    const tasks = await fetchResource('tasks'); // Holt alle Tasks aus Firebase
    if (!tasks) return;

    const currentDate = new Date();

    // Filtere nur die Tasks mit dueDate und priority "urgent"
    const urgentTasksWithDueDate = [];
    for (const key in tasks) {
        if (tasks.hasOwnProperty(key)) {
            const task = tasks[key];
            if (task.priority === "Urgent" && task.dueDate) {
                urgentTasksWithDueDate.push(task);
            }
        }
    }
    console.log("gefilterte Tasks", urgentTasksWithDueDate);
    

    if (urgentTasksWithDueDate.length === 0) {
        // Wenn keine Tasks mit dueDate vorhanden sind, zeige das aktuelle Datum an
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
        const currentYear = currentDate.getFullYear();
        const currentDateStr = `${currentMonth} ${currentDay}, ${currentYear}`;
        document.getElementById("taskDate").textContent = currentDateStr;
        return;
    }

    // Finde das dueDate, das dem aktuellen Datum am nächsten ist
    const closestTask = urgentTasksWithDueDate.reduce((closest, task) => {
        const taskDate = new Date(task.dueDate);
        const closestDate = new Date(closest.dueDate);
        return Math.abs(taskDate - currentDate) < Math.abs(closestDate - currentDate) ? task : closest;
    });

    // Formatierung des nächsten dueDate
    const closestDate = new Date(closestTask.dueDate);
    const day = closestDate.getDate();
    const month = closestDate.toLocaleString('default', { month: 'long' });
    const year = closestDate.getFullYear();
    const monthName = month.charAt(0).toUpperCase() + month.slice(1);

    // Erstelle den Datumsstring
    const dateStr = `${monthName} ${day}, ${year}`;
    console.log(dateStr);

    // Zeige das Datum in einem HTML-Element mit der ID "taskDate" an
    document.getElementById("taskDate").textContent = dateStr;
}

function showResponsiveContent() {
    const greetingElement = document.getElementById("greeting");
    const summaryContentElement = document.getElementById("summaryContent");
    const summaryHeaderElement = document.getElementById("summaryHeader");

    if (window.innerWidth <= 768) {
        renderSummaryHeaderResponsive();
        // Zeige die Begrüßung zuerst
        greetingElement.classList.remove("hidden");
        summaryContentElement.classList.add("d-none");

        // Nach ein paar Sekunden die Begrüßung ausblenden und den Inhalt einblenden
        setTimeout(() => {
            greetingElement.classList.add("hidden");
            greetingElement.classList.add("d-none");
            summaryHeaderElement.classList.remove("d-none");
            summaryContentElement.classList.remove("d-none");
        }, 1500); // 1500 ms = 1,5 Sekunden
    } else {
        renderSummaryHeader();
        // Auf größeren Bildschirmen direkt beide anzeigen
        greetingElement.classList.remove("hidden");
        summaryContentElement.classList.add("visible");
        summaryHeaderElement.classList.remove("d-none");
        summaryContentElement.classList.remove("d-none");

    }
}