let contactsArray = [];
let badgeArry = [];
let expanded = false;


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



function filterContacts() {
    const filterInput = document.getElementById("assigned"); 
    const filterText = filterInput.value.toLowerCase();
    const regexPattern = filterText.split("").join(".*"); 
    const regex = new RegExp(regexPattern, "i");  
    const filteredItems = contactsArray.filter(contact => 
      regex.test(contact.name) 
    );
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
  
  
  
  
  
  
  function showCheckboxes() {
    const checkboxes = document.getElementById("checkboxes");
    const badgeContainer = document.getElementById("badge-Container");
console.log();

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
  
  
  
function render(renderArry) {
  let assaigtList = document.getElementById("checkboxes");
  assaigtList.innerHTML = ``;

 
  handleEmptyContacts(renderArry, assaigtList);
}

function handleEmptyContacts(renderArry, assaigtList) {
  if (renderArry.length == 0) {
      
      assaigtList.innerHTML = renderEmptyContacts();
  } else {
      for (let index = 0; index < renderArry.length; index++) {
          assaigtList.innerHTML += contactsTemlates(renderArry, index);
      }
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
  
   
  }
  
  
  
    
  function resetContacts() {
  
    badgeArry.splice(0, badgeArry.length);
  
  
    const badgeContainer = document.getElementById("badge-Container");
    badgeContainer.innerHTML = "";
  
  
    const filterInput = document.getElementById("assigned");
    if (filterInput) filterInput.value = "";
  
  
    const checkboxes = document.querySelectorAll("#checkboxes input[type='checkbox']");
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

  function changeDropdownIconAssign(isExpanded) {
    const icon = document.getElementById("arrow-drop-down");

    if (isExpanded) {
        icon.src = "/assets/icons/arrow_drop_downaa-up.svg";
    } else {
        icon.src = "/assets/icons/arrow-drop-down.svg";
    }
}

  function resetIconAssign(){

    const icon = document.getElementById("arrow-drop-down");
    icon.src = "/assets/icons/arrow-drop-down.svg";
    icon.classList.remove("dropdown-icon-up");
  }
  