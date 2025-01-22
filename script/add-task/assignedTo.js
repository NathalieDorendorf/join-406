/**
 * Filters the contacts based on the input value.
 * Uses a regular expression to match the contact names.
 */
function filterContacts() {
  const filterInput = document.getElementById("assigned");
  const filterText = filterInput.value.toLowerCase();
  const regexPattern = filterText.split("").join(".*");
  const regex = new RegExp(regexPattern, "i");
  const filteredItems = contactsArray.filter(contact => regex.test(contact.name));
  render(filteredItems);
  expanded = false;
  showCheckboxes();
}

/**
 * Handles the checkbox selection for a contact.
 * Updates styles, manages badges, and reflects the selection state.
 * @param {Event} event - The event object from the checkbox interaction.
 * @param {string} initials - The initials of the contact.
 * @param {string} color - The color associated with the contact.
 * @param {string} id - The ID of the contact's checkbox.
 */
function checkt(event, initials, color, id) {
  const badgeContainer = document.getElementById("badge-Container");
  const checkboxContent = event.target.closest(".checkbox-content");
  const customCheckbox = document.getElementById(id);

  if (event.target.checked) {
    badgeArry.push({ initials, color });
    updateStyle(checkboxContent, customCheckbox);

    badgeContainer.innerHTML = "";
    badgeArry.forEach(badge => {
      badgeContainer.innerHTML += renderBadge(badge.color, badge.initials);
    });
  } else {
    removeStyle(checkboxContent, customCheckbox);
    badgeArry = badgeArry.filter(
      badge => badge.initials !== initials || badge.color !== color
    );

    badgeContainer.innerHTML = "";
    badgeArry.forEach(badge => {
      badgeContainer.innerHTML += renderBadge(badge.color, badge.initials);
    });
  }
}

/**
 * Updates the style of the selected checkbox.
 * @param {HTMLElement} checkboxContent - The container of the checkbox.
 * @param {HTMLElement} customCheckbox - The custom checkbox element.
 */
function updateStyle(checkboxContent, customCheckbox) {
  checkboxContent.style.backgroundColor = "var(--checkt)";
  checkboxContent.style.color = "white";
  customCheckbox.src = "/assets/icons/check-button-checked-white.svg";
}

/**
 * Removes the style from the unselected checkbox.
 * @param {HTMLElement} checkboxContent - The container of the checkbox.
 * @param {HTMLElement} customCheckbox - The custom checkbox element.
 */
function removeStyle(checkboxContent, customCheckbox) {
  checkboxContent.style.backgroundColor = "";
  checkboxContent.style.color = "";
  customCheckbox.src = "/assets/icons/check-button-unchecked.svg";
}

/**
 * Toggles the visibility of the checkboxes and badge container.
 */
function showCheckboxes() {
  const checkboxes = document.getElementById("checkboxes");
  const badgeContainer = document.getElementById("badge-Container");

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
  changeDropdownIconAssign(expanded);
}

/**
 * Renders the filtered contacts into the checkboxes list.
 * @param {Array} renderArry - The array of filtered contacts.
 */
function render(renderArry) {
  const assaigtList = document.getElementById("checkboxes");
  assaigtList.innerHTML = "";

  handleEmptyContacts(renderArry, assaigtList);
}

/**
 * Handles rendering empty contacts or a filtered list.
 * @param {Array} renderArry - The array of filtered contacts.
 * @param {HTMLElement} assaigtList - The container element for the contacts.
 */
function handleEmptyContacts(renderArry, assaigtList) {
  if (renderArry.length == 0) {
    assaigtList.innerHTML = renderEmptyContacts();
  } else {
    for (let index = 0; index < renderArry.length; index++) {
      assaigtList.innerHTML += contactsTemlates(renderArry, index);
    }
  }
}

/**
 * Fetches all contacts and processes them into an array.
 */
async function fetchContacts() {
  const allData = await getAllData();
  arrayContacts(allData.contacts);
}

/**
 * Converts a contacts object into an array and sorts it alphabetically.
 * @param {Object} contactObject - The object containing contact data.
 */
function arrayContacts(contactObject) {
  for (const [key, value] of Object.entries(contactObject)) {
    contactsArray.push({ id: key, ...value });
  }
  contactsArray.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Resets the contacts selection and input field.
 */
function resetContacts() {
  badgeArry.splice(0, badgeArry.length);

  const badgeContainer = document.getElementById("badge-Container");
  badgeContainer.innerHTML = "";

  const filterInput = document.getElementById("assigned");
  if (filterInput) filterInput.value = "";

  const checkboxes = document.querySelectorAll("#checkboxes input[type='checkbox']");
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;

    const checkboxContent = checkbox.closest(".checkbox-content");
    const customCheckbox = document.getElementById(checkbox.id);
    if (checkboxContent && customCheckbox) {
      removeStyle(checkboxContent, customCheckbox);
    }
  });
  expanded = true;
  showCheckboxes();
}

/**
 * Toggles the dropdown icon for the assigned contacts.
 * @param {boolean} isExpanded - Whether the dropdown is expanded.
 */
function changeDropdownIconAssign(isExpanded) {
  const icon = document.getElementById("arrow-drop-down");

  if (isExpanded) {
    icon.src = "/assets/icons/arrow_drop_downaa-up.svg";
  } else {
    icon.src = "/assets/icons/arrow-drop-down.svg";
  }
}

/**
 * Resets the dropdown icon to its default state.
 */
function resetIconAssign() {
  const icon = document.getElementById("arrow-drop-down");
  icon.src = "/assets/icons/arrow-drop-down.svg";
  icon.classList.remove("dropdown-icon-up");
}
