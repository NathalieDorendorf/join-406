const dataToSubmit = {};

async function init() {
  buttonDisabled(true); 

  includeHTML();
  await fetchContacts();
  render(contactsArray);

  buttonDisabled(false); 
}



// duDate

/**
 * Initializes a click event for a custom date icon.
 * Opens the date picker or focuses the input field.
 */
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
/**
 * Validates all required fields for a task.
 * @returns {boolean} - Returns true if all validations pass, false otherwise.
 */
function completeValidaishon() {
  if (!titleValidaishon() || !dateValidaishon() || !categoryValidaishon()) {
    return false;
  }
  return true;
}

/**
 * Validates the task title for length requirements.
 * Highlights errors if validation fails.
 * @returns {boolean} - Returns true if the title is valid, false otherwise.
 */

function titleValidaishon() {
  const taskTitle = document.getElementById("taskTitle");
  const requiredText = document.getElementById("required-title");
  const valueTitle = taskTitle.value.trim();

  if (valueTitle.length < 3 || valueTitle.length > 30) {
    taskTitle.style.border = "1px solid red";
    requiredText.classList.remove("display-none");
    return false;
  } else {
    resetValidaishon(taskTitle, requiredText);

    return true;
  }
}
/**
 * Validates the due date for presence and correctness.
 * Highlights errors if validation fails.
 * @returns {boolean} - Returns true if the date is valid, false otherwise.
 */
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

  resetValidaishon(dueDate, requiredDate);
  return true;
}

/**
 * Validates the selected category for presence.
 * Highlights errors if validation fails.
 * @returns {boolean} - Returns true if the category is valid, false otherwise.
 */

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
    resetValidaishon(categorySelect, requiredText);
    return true;
  }
}
/**
 * Resets validation styles and error messages for a field.
 * @param {HTMLElement} restBorder - The input element to reset the border style.
 * @param {HTMLElement} resetClass - The error message element to hide.
 */
function resetValidaishon(restBorder, resetClass) {
  restBorder.style.border = "";
  resetClass.classList.add("display-none");

  return { restBorder, resetClass };
}

/**
 * Resets all validation styles and error messages for all fields.
 */

function resetAllValidations() {
  const elementsToReset = [
    { field: "taskTitle", error: "required-title" },
    { field: "dueDate", error: "required-date" },
    { field: "category-select", error: "required-category" },
  ];

  elementsToReset.forEach(({ field, error }) => {
    const fieldElement = document.getElementById(field);
    const errorElement = document.getElementById(error);

    if (fieldElement) {
      fieldElement.style.border = "";
    }

    if (errorElement) {
      errorElement.classList.add("display-none");
    }
  });
}

// Send form data

/**
 * Processes the form submission.
 * Prevents the default form behavior, validates the form, and prepares data for submission.
 * @param {Event} event - The form submission event.
 */
async function processForm(event) {
  event.preventDefault();

  // Validates the form. If validation fails, stops execution.
  if (!completeValidaishon()) {
    return;
  }

  const form = document.getElementById("add-task-form");
  const formData = new FormData(form);

  // Prepares form data for submission.
  prepareDataToSubmit(formData, form);

  // Sends the request to create the task.
  fetchTask();
}

/**
 * Prepares form data for submission by processing and formatting it.
 * Adds additional fields like subtasks and a default state.
 * @param {FormData} formData - The form data object containing input values.
 * @param {HTMLFormElement} form - The form element.
 */
function prepareDataToSubmit(formData, form) {
  formData.forEach((value, key) => {
    if (key === "assignedTo") {
      // Adds multiple assignees to an array.
      if (Array.isArray(dataToSubmit[key])) {
        dataToSubmit[key].push(value);
      } else {
        dataToSubmit[key] = dataToSubmit[key]
          ? [dataToSubmit[key], value]
          : [value];
      }
    } else {
      // Processes other fields, allowing multiple inputs as arrays.
      if (dataToSubmit[key]) {
        if (Array.isArray(dataToSubmit[key])) {
          dataToSubmit[key].push(value);
        } else {
          dataToSubmit[key] = [dataToSubmit[key], value];
        }
      } else {
        dataToSubmit[key] = value;
      }
    }
  });

  // Adds subtasks and the default state "to-do".
  dataToSubmit.subtasks = subtask;
  dataToSubmit.state = "to-do";
}

/**
 * Sends a request to create a task and handles the response.
 * Displays a success message or an error and redirects to the board page after success.
 */
async function fetchTask() {
  const response = await fetchResource("tasks", "POST", dataToSubmit);

  if (response) {
    // Resets the form and displays a success message.
    resetForm();
    showToastMessage({ message: "Task has been successfully created" });
    setTimeout(() => {
      window.location.href = "/html/board.html";
    }, 1500);
  }
}

function buttonDisabled(isDisabled) {
  const buttons = ['button-creat', 'button-clear']; 
  buttons.forEach(id => {
      const button = document.getElementById(id);
      if (button) {
          button.disabled = isDisabled; 
      }
  });
}

function resetForm() {
  const form = document.getElementById("add-task-form");
  subtask.splice(0, subtask.length);
  resetContacts();
  resetCategory();
  renderSubtask();
  resetIconAssign();
  clearInput();
  resetAllValidations();
  form.reset();
}
