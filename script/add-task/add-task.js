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
  
    form.reset();
    alert('Task erfolgreich angelegt!');
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