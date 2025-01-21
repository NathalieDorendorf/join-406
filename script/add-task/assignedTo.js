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
    changeDropdownIcon()
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