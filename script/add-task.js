let contactsArray = [];
let expanded = false;



async function init() {
  includeHTML()
  await fetchContacts();
  render();
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
  if (!expanded) {
    checkboxes.style.display = "flex";
    checkboxes.style.flexDirection = "column";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}

/**
 * render - Renders a list of contacts in a dropdown menu or checkbox group.
 * 
 * Functionality:
 * - Accesses the HTML element with the ID "checkboxes" to update the list.
 * - Clears the content of the list before adding new entries.
 * - Iterates through the `contactsArray` and extracts information such as ID, name, initials, and CSS class.
 * - Appends an HTML template (created by `contactsTemplates`) for each contact to the list.
 * 
 * Variables:
 * - `value`: The ID of the contact, used as the value for a checkbox.
 * - `name`: The name of the contact.
 * - `initials`: The initials of the contact.
 * - `cssClass`: A CSS class used for styling.
 * 
 * Example Usage:
 * - Called to dynamically load and display contacts, e.g., after fetching data or a user action.
 */


function render() {
  let assaigtList = document.getElementById("checkboxes");
  assaigtList.innerHTML + ``;
  let value;
  let name;
  let initials;
  let cssClass;

  for (let index = 0; index < contactsArray.length; index++) {
    value = contactsArray[index].id;
    name = contactsArray[index].name;
    initials = contactsArray[index].initials;
    cssClass = contactsArray[index].color
    assaigtList.innerHTML += contactsTemlates(value, name, initials,cssClass);
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

  console.log(contactsArray ); 
  console.log(contactsArray[0] ); 
}


/**
 * processForm - Processes form input and creates a data object.
 * 
 * @param {Event} event - The submit event of the form.
 * 
 * Functionality:
 * - Prevents the default browser submit behavior.
 * - Captures all form input data using `FormData`.
 * - Constructs an object (`data`) containing form data as key-value pairs.
 *   - If a key occurs multiple times (e.g., for checkboxes), the values are stored in an array.
 * - Logs the resulting object to the console.
 * 
 * Example Output:
 * {
 *   taskName: "My Task",
 *   assigned: ["Peter", "Lara"],
 *   priority: "high"
 * }
 */


function processForm(event) {
  event.preventDefault(); 

  const form = document.getElementById("add-task-form");
  const formData = new FormData(form);

  const data = {};

  
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

  console.log(data); 
}
