/**
 * Toggles the dropdown menu's visibility by adding or removing the 'open' class.
 */
function toggleDropdown() {
  const dropdown = document.getElementById('selectOptions');
  dropdown.classList.toggle('open');
}

/**
 * Handles the selection of a dropdown option.
 * Updates the display text, sets the hidden input value, and closes the dropdown menu.
 * @param {string} value - The selected option's value.
 */
function selectOption(value) {
  // Update the displayed category text.
  const display = document.getElementById('category-display');
  display.textContent = value;

  // Set the value of the hidden input field.
  const hiddenInput = document.getElementById('category');
  hiddenInput.value = value;

  // Close the dropdown menu.
  const dropdown = document.getElementById('selectOptions');
  dropdown.classList.remove('open');
}

/**
 * Toggles the dropdown arrow icon for the category selection.
 * Switches between 'arrow-drop-down.svg' and 'arrow_drop_downaa-up.svg'.
 */
function changeDropdownIconCategory() {
  const icon = document.getElementById("arrow-drop-down-category");

  // Check the current icon and switch to the appropriate one.
  if (icon.src.includes("arrow-drop-down.svg")) {
    icon.src = "/assets/icons/arrow_drop_downaa-up.svg";
  } else {
    icon.src = "/assets/icons/arrow-drop-down.svg";
  }
}

/**
 * Resets the selected category and its associated elements.
 * Clears the hidden input value, resets the display text, and removes subtasks.
 */
function resetCategory() {
  // Clear the hidden input field value.
  document.getElementById("category").value = "";

  // Reset the displayed category text.
  document.getElementById("category-display").innerText = "Select task category";

  // Clear the task subtask input value.
  document.getElementById("taskSubtask").value = "";

  // Remove all subtasks from the list.
  const subtaskList = document.getElementById("subtask-list");
  subtaskList.innerHTML = "";
}



