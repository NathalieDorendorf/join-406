/**
 * Toggles the dropdown menu's visibility by adding or removing the 'open' class.
 */
function toggleDropdown() {
  const dropdown = document.getElementById("selectOptions");
  dropdown.classList.toggle("open");
}

/**
 * Handles the selection of a dropdown option.
 * Updates the display text, sets the hidden input value, and closes the dropdown menu.
 * @param {string} value - The selected option's value.
 */
function selectOption(value) {
  const display = document.getElementById("category-display");
  display.textContent = value;
  const hiddenInput = document.getElementById("category");
  hiddenInput.value = value;
  const dropdown = document.getElementById("selectOptions");
  dropdown.classList.remove("open");
}

/**
 * Toggles the dropdown arrow icon for the category selection.
 * Switches between 'arrow-drop-down.svg' and 'arrow_drop_downaa-up.svg'.
 */
function changeDropdownIconCategory() {
  const icon = document.getElementById("arrow-drop-down-category");

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
  document.getElementById("category").value = "";
  document.getElementById("category-display").innerText =
    "Select task category";
  document.getElementById("taskSubtask").value = "";
  const subtaskList = document.getElementById("subtask-list");
  subtaskList.innerHTML = "";
}
