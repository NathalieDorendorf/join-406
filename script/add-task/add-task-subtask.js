let subtask = [];
let update = false;
let updateIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("taskSubtask");
  if (inputField) {
      inputField.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
              event.preventDefault();
              addSubtask();
              showAddBlue()
          }
      });
  } 
});

/**
 * Adds an event listener to handle input field interactions after the DOM has fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("taskSubtask");
  inputField.addEventListener("input", function (event) {
    if (event.target.value === "") {
      showAddBlue();
    } else {
      hidenAddBlue();
    }
  });
});

/**
 * Hides the 'add' button and shows the 'close check' button.
 */
function hidenAddBlue() {
  const addBlue = document.getElementById("add-blue");
  const closeCheck = document.getElementById("close-check");
  closeCheck.classList.remove("display-none");
  addBlue.classList.add("display-none"); 
}

/**
 * Shows the 'add' button and hides the 'close check' button.
 */
function showAddBlue() {
  const addBlue = document.getElementById("add-blue");
  const closeCheck = document.getElementById("close-check");
  closeCheck.classList.add("display-none"); 
  addBlue.classList.remove("display-none"); 
}

/**
 * Focuses the specified input field by its ID.
 * @param {string} inputId - The ID of the input field to focus.
 */
function editAndFocus(inputId) {
  const inputField = document.getElementById(inputId);
  inputField.focus();
}

/**
 * Renders the list of subtasks by updating the HTML content of the subtask list.
 */
function renderSubtask() {
  const taskList = document.getElementById("subtask-list");
  taskList.innerHTML = ""; 
  for (let index = 0; index < subtask.length; index++) {
    taskList.innerHTML += renderList(index);
  }
}

/**
 * Adds a new subtask to the list or updates an existing one.
 */
function addSubtask() {
  const task = document.getElementById("taskSubtask").value;
  if (update === true) {
    updateSubtask(updateIndex); 
  } else {
    if (task.trim() !== "") {
      const newSubtask = {
        title: task,
        done: false,
      };
      subtask.push(newSubtask); 
      renderSubtask(); 
      document.getElementById("taskSubtask").value = ""; 
    }
  }
}

/**
 * Deletes a subtask from the list by its index.
 * @param {number} indexSubtask - The index of the subtask to delete.
 */
function delet(indexSubtask) {
  subtask.splice(indexSubtask, 1); 
  renderSubtask(); 
  clearInput(); 
}

/**
 * Edits a subtask by its index, allowing the user to modify its content.
 * @param {number} indexSubtask - The index of the subtask to edit.
 */
function edit(indexSubtask) {
  const task = document.getElementById("taskSubtask");
  task.value = subtask[indexSubtask].title; 
  updateIndex = indexSubtask;
  update = true; 
  showAddBlue(); 
  renderSubtask(); 
}

/**
 * Updates an existing subtask with new data from the input field.
 */
function updateSubtask() {
  const task = document.getElementById("taskSubtask");
  const input = task.value;
  subtask[updateIndex].title = input; 
  renderSubtask(); 
  update = false; 
  clearInput(); 
}

/**
 * Clears the subtask input field and resets the edit mode.
 */
function clearInput() {
  document.getElementById("taskSubtask").value = ""; 
  update = false; // Reset edit mode.
}
