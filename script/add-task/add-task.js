let contactsArray = [];
let badgeArry = [];
let expanded = false;

async function init() {
    includeHTML();
    await fetchContacts();
    render(contactsArray);
}

// duDate

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("dueDate");
    const dateIcon = document.getElementById("custom-date-icon");

    dateIcon.addEventListener("click", function () {
        if (dateInput.showPicker) {
            dateInput.showPicker();
        } else {
            dateInput.focus();
        }
    });
});

// form validation
function completeValidaishon() {
    if (!titleValidaishon() || !dateValidaishon() || !categoryValidaishon()) {
        return false;
    }
    return true;
}

function titleValidaishon() {
    const taskTitle = document.getElementById("taskTitle");
    const requiredText = document.getElementById("required-title");
    const valueTitle = taskTitle.value.trim();

    if (valueTitle.length < 3 || valueTitle.length > 15) {

        taskTitle.style.border = "1px solid red";
        requiredText.classList.remove("display-none");
        return false;
    } else {

        resetValidaishon(taskTitle, requiredText)

        return true;
    }
}

function dateValidaishon() {
    const dueDate = document.getElementById("dueDate");
    const requiredDate = document.getElementById("required-date");
    const valueDate = dueDate.value.trim();

    if (!valueDate) {
        dueDate.style.border = "1px solid red";
        requiredDate.classList.remove("display-none");
        return false;
    }

    const isValidDate = !isNaN(Date.parse(valueDate));
    if (!isValidDate) {
        dueDate.style.border = "1px solid red";
        requiredDate.classList.remove("display-none");
        return false;
    }


    resetValidaishon(dueDate, requiredDate)
    return true;
}

function categoryValidaishon() {
    const categorySelect = document.getElementById("category-select");
    const requiredText = document.getElementById("required-category");
    const category = document.getElementById("category");
    const valueCategory = category.value.trim();


    if (valueCategory === "") {
        categorySelect.style.border = "1px solid red";
        requiredText.classList.remove("display-none");
        return false;
    } else {
        resetValidaishon(categorySelect, requiredText)
        return true;
    }
}

function resetValidaishon(restBorder, resetClass) {
    restBorder.style.border = "";
    resetClass.classList.add("display-none");

    return { restBorder, resetClass };
}


// Send form data

async function processForm(event) {
    event.preventDefault();

    if (!completeValidaishon()) {
        return; // Abbruch, wenn die Validierung fehlschlägt
    }
    const form = document.getElementById("add-task-form");
    const formData = new FormData(form);

    const data = {};

    // Hier sammeln wir die Formulardaten in einem Objekt
    formData.forEach((value, key) => {
        if (key === "assignedTo") {
            // Ensure assignedTo is always an array
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = data[key] ? [data[key], value] : [value];
            }
        } else {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
    });

    data.subtasks = subtask;
    data.state = "to-do";

    console.log("Formulardaten:", data);

    // Jetzt schicken wir das Objekt an die "tasks"-Collection in deiner Firebase-Realtime-DB
    // Das erzeugt einen neuen Eintrag mit einer auto-generierten ID:
    const response = await fetchResource("tasks", "POST", data);

    if (response) {
        console.log("Daten erfolgreich in die DB geschickt:", response);

        resetForm();
        showToastMessage({ message: "Task has been successfully created" });
        setTimeout(() => {
            window.location.href = "/html/board.html";
        }, 4000);
    } else {
        console.error("Fehler beim Übermitteln der Daten.");
        alert("Fehler beim Anlegen des Tasks!");
    }
}

function resetForm() {
    const form = document.getElementById("add-task-form");

    subtask.splice(0, subtask.length);
    resetContacts();
    resetCategory();
    renderSubtask();
    clearInput();
    form.reset();
}
