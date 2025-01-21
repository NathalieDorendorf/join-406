let contactsArray = [];
let badgeArry = []; 
let expanded = false;




async function init() {
  includeHTML()
  await fetchContacts();
  render(contactsArray)
}

// duDate

document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('dueDate');
  const dateIcon = document.getElementById('custom-date-icon');

  
  dateIcon.addEventListener('click', function() {
    
    if (dateInput.showPicker) {
      dateInput.showPicker();
    } else {
      
      dateInput.focus();
     
    }
  });
});


// form validation
  

function processForm(event) {
  event.preventDefault(); // Verhindert das automatische Absenden des Formulars
  
  let isValid = true;

  // Überprüfe alle required-Felder
  const requiredFields = document.querySelectorAll("#add-task-form [required]");
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      // Zeigt eine rote Border für ungültige Felder an
      field.style.border = "2px solid red";
      isValid = false;
    } else {
      // Entfernt die rote Border, wenn das Feld gültig ist
      field.style.border = "";
    }
  });

  // Überprüfe, ob die Kategorie ausgewählt ist
  const categoryInput = document.getElementById("category");
  if (!categoryInput.value) {
    const categoryDisplay = document.getElementById("category-display");
    categoryDisplay.style.border = "2px solid red";
    isValid = false;
  } else {
    const categoryDisplay = document.getElementById("category-display");
    categoryDisplay.style.border = "";
  }

  // Wenn alle Felder gültig sind, Formular abschicken oder weitere Logik ausführen
  if (isValid) {
    alert("Formular erfolgreich validiert!");
    // Hier könntest du das Formular absenden:
    // event.target.submit();
  } else {
    alert("Bitte fülle alle erforderlichen Felder aus!");
  }
}





// Send form data

async function processForm(event) {
  event.preventDefault();

  const form = document.getElementById("add-task-form");
  const formData = new FormData(form);

  const data = {};

  // Hier sammeln wir die Formulardaten in einem Objekt
  formData.forEach((value, key) => {
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  });
  data.subtasks = subtask;
  data.state = "to-do";

  console.log("Formulardaten:", data);

  // Jetzt schicken wir das Objekt an die "tasks"-Collection in deiner Firebase-Realtime-DB
  // Das erzeugt einen neuen Eintrag mit einer auto-generierten ID:
  const response = await fetchResource('tasks', 'POST', data);

  if (response) {
    console.log("Daten erfolgreich in die DB geschickt:", response);
  
    resetForm()
    showToastMessage({ message: 'Task has been successfully created' });
  } else {
    console.error("Fehler beim Übermitteln der Daten.");
    alert('Fehler beim Anlegen des Tasks!');
  }
}



function resetForm() {
  const form = document.getElementById("add-task-form");
  
  subtask.splice(0, subtask.length);
  resetContacts()
  resetCategory()
  renderSubtask();
  clearInput()
  form.reset();
}