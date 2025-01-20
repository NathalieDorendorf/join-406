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


function filterContacts() {
  const filterInput = document.getElementById("assigned"); 
 
  const filterText = filterInput.value.toLowerCase();
  
 
  
 
  const regexPattern = filterText.split("").join(".*"); 
  const regex = new RegExp(regexPattern, "i"); 

  
  const filteredItems = contactsArray.filter(contact => 
    regex.test(contact.name) 
  );

  console.log(filteredItems);
  render(filteredItems);
  expanded = false;
  showCheckboxes()
}


function checkt(event, initials, color, id) {
  const badgeContainer = document.getElementById("badge-Container");
  const checkboxContent = event.target.closest(".checkbox-content"); 
  const customCheckbox = document.getElementById(id);

  if (event.target.checked) {

    badgeArry.push({ initials: initials, color: color });
    updateStyle(checkboxContent , customCheckbox)
    
    badgeContainer.innerHTML = "";
    badgeArry.forEach((badge) => {
      badgeContainer.innerHTML += renderBadge(badge.color, badge.initials);
    });
  } else {
    removeStyle(checkboxContent,customCheckbox) 
    badgeArry = badgeArry.filter(
      (badge) => badge.initials !== initials || badge.color !== color
    );

    
    badgeContainer.innerHTML = "";
    badgeArry.forEach((badge) => {
      badgeContainer.innerHTML += renderBadge(badge.color, badge.initials);
    });
  }
}

function updateStyle(checkboxContent,customCheckbox) {
  checkboxContent.style.backgroundColor = "var(--checkt)";
  checkboxContent.style.color = "white";
  customCheckbox.src = "/assets/icons/check-button-checked-white.svg"; 
}

function removeStyle(checkboxContent,customCheckbox) {
  checkboxContent.style.backgroundColor = ""; 
  checkboxContent.style.color = "";
  customCheckbox.src = "/assets/icons/check-button-unchecked.svg";
}



/**
 * showCheckboxes - Toggles the visibility of a group of checkboxes.
 * 
 * Functionality:
 * - Checks whether the checkboxes are currently visible or hidden.
 * - If hidden, sets the display style to "flex" and arranges the checkboxes in a column.
 * - If visible, hides the checkboxes by setting the display style to "none".
 * - Updates the `expanded` state to track the current visibility status.
 * 
 * Example Usage:
 * - Called when a dropdown or toggle element is clicked to show or hide checkboxes.
 */


function showCheckboxes() {
  let checkboxes = document.getElementById("checkboxes");
  let badgeContainer = document.getElementById("badge-Container")
  if (!expanded) {
    badgeContainer.style.display = "none";
    checkboxes.style.display = "flex";
    checkboxes.style.flexDirection = "column";
    expanded = true;
  } else {
    badgeContainer.style.display = "flex";
    checkboxes.style.display = "none";
    expanded = false;
  }
}



function render(renderArry) {
  let assaigtList = document.getElementById("checkboxes");
  assaigtList.innerHTML = ``;



  for (let index = 0; index < renderArry.length; index++) {

    assaigtList.innerHTML += contactsTemlates(renderArry,index);
  }
}

async function fetchContacts() {
  let allData = await getAllData(); 
  arrayContacts(allData.contacts); 
}


function arrayContacts(contactObject) {

  for (const [key, value] of Object.entries(contactObject)) {
    contactsArray.push({ id: key, ...value });
  }

  contactsArray.sort((a, b) => a.name.localeCompare(b.name));

  console.log(contactsArray); 
  console.log(contactsArray[0]); 
}







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

function reset() {
  const form = document.getElementById("add-task-form");

  subtask.splice(0, subtask.length);
  renderSubtask();
  clearInput()
  form.reset();
}