let contactsArray = [];
let badgeArry = [];
let expanded = false;

/**
 * Event listener to close the dropdown if clicked outside.
 * @param {Event} event - The click event.
 */
document.addEventListener("click", (event) => {
  const checkboxes = document.getElementById("checkboxes");
  const badgeContainer = document.getElementById("badge-Container");
  const dropdownToggle = document.getElementById("assigned");
  if (
    expanded &&
    !checkboxes.contains(event.target) &&
    !badgeContainer.contains(event.target) &&
    !dropdownToggle.contains(event.target)
  ) {
    expanded = true;
    showCheckboxes();
  }
});

/**
 * Filters the contacts based on the input value and updates the dropdown.
 */
function filterContacts() {
  const filterInput = document.getElementById("assigned");
  const filterText = filterInput.value.toLowerCase();
  const regexPattern = filterText.split("").join(".*");
  const regex = new RegExp(regexPattern, "i");
  const filteredItems = contactsArray.filter((contact) =>
    regex.test(contact.name)
  );
  render(filteredItems);
  expanded = false;
  showCheckboxes();
}

/**
 * Toggles the selection of a contact and updates the badge list.
 * @param {Event} event - The change event.
 * @param {string} initials - The initials of the contact.
 * @param {string} color - The color associated with the contact.
 * @param {string} id - The ID of the checkbox.
 */
function checkt(event, initials, color, id) {
  const badgeContainer = document.getElementById("badge-Container");
  const checkboxContent = event.target.closest(".checkbox-content");
  const customCheckbox = document.getElementById(id);
  if (event.target.checked) {
    badgeArry.push({ initials: initials, color: color });
    updateStyle(checkboxContent, customCheckbox);
    badgeContainer.innerHTML = "";
    badgeArry.forEach((badge) => {
      badgeContainer.innerHTML += renderBadge(badge.color, badge.initials);
    });
  } else {
    removeStyle(checkboxContent, customCheckbox);
    badgeArry = badgeArry.filter(
      (badge) => badge.initials !== initials || badge.color !== color
    );
    badgeContainer.innerHTML = "";
    badgeArry.forEach((badge) => {
      badgeContainer.innerHTML += renderBadge(badge.color, badge.initials);
    });
  }
}

/**
 * Updates the style of the selected checkbox.
 * @param {HTMLElement} checkboxContent - The content of the checkbox.
 * @param {HTMLElement} customCheckbox - The custom checkbox element.
 */
function updateStyle(checkboxContent, customCheckbox) {
  checkboxContent.style.backgroundColor = "var(--checkt)";
  checkboxContent.style.color = "white";
  customCheckbox.src = "/assets/icons/check-button-checked-white.svg";
}

/**
 * Removes the style of the deselected checkbox.
 * @param {HTMLElement} checkboxContent - The content of the checkbox.
 * @param {HTMLElement} customCheckbox - The custom checkbox element.
 */
function removeStyle(checkboxContent, customCheckbox) {
  checkboxContent.style.backgroundColor = "";
  checkboxContent.style.color = "";
  customCheckbox.src = "/assets/icons/check-button-unchecked.svg";
}

/**
 * Toggles the visibility of the checkboxes.
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
 * Renders the list of contacts in the dropdown.
 * @param {Array} renderArry - Array of filtered contacts.
 */
function render(renderArry) {
  let assaigtList = document.getElementById("checkboxes");
  assaigtList.innerHTML = ``;
  handleEmptyContacts(renderArry, assaigtList);
}

/**
 * Handles the case where there are no contacts to display.
 * @param {Array} renderArry - Array of filtered contacts.
 * @param {HTMLElement} assaigtList - The container element for the contact list.
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
 * Fetches the contact data asynchronously and populates the contact array.
 */
async function fetchContacts() {
  let allData = await getAllData();
  arrayContacts(allData.contacts);
}

/**
 * Populates the contact array from the fetched data and sorts it.
 * @param {Object} contactObject - Object containing contact data.
 */
function arrayContacts(contactObject) {
  for (const [key, value] of Object.entries(contactObject)) {
    contactsArray.push({ id: key, ...value });
  }
  contactsArray.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Resets the contact selection and UI to the default state.
 */
function resetContacts() {
  badgeArry.splice(0, badgeArry.length);
  const badgeContainer = document.getElementById("badge-Container");
  badgeContainer.innerHTML = "";
  const filterInput = document.getElementById("assigned");
  if (filterInput) filterInput.value = "";
  const checkboxes = document.querySelectorAll(
    "#checkboxes input[type='checkbox']"
  );
  checkboxes.forEach((checkbox) => {
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
 * Updates the dropdown icon based on the expansion state.
 * @param {boolean} isExpanded - The state of the dropdown.
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

/**
 * Adjusts the placeholder text based on screen size.
 */
document.addEventListener("DOMContentLoaded", function () {
  const inputElement = document.getElementById("assigned");
  const mediaQuery853 = window.matchMedia("(min-width: 853px)");
  const mediaQuery918 = window.matchMedia("(max-width: 964px)");
  mediaQuery853.addEventListener("change", () => {
    updatePlaceholder();
  });
  mediaQuery918.addEventListener("change", () => {
    updatePlaceholder();
  });

  /**
   * Updates the placeholder text based on media queries.
   */
  function updatePlaceholder() {
    if (mediaQuery853.matches && mediaQuery918.matches) {
      inputElement.placeholder = "Select contacts";
    } else {
      inputElement.placeholder = "Select contacts to assign";
    }
  }
  updatePlaceholder();
});


