function toggleDropdown() {
    // Öffnen/Schließen des Dropdowns
    const dropdown = document.getElementById('selectOptions');
    dropdown.classList.toggle('open');
  }
  
  function selectOption(value) {
    // Aktualisiere die Anzeige des ausgewählten Werts
    const display = document.getElementById('category-display');
    display.textContent = value;
  
    // Setze den Wert im versteckten Eingabefeld
    const hiddenInput = document.getElementById('category-input');
    hiddenInput.value = value;
  
    // Schließe das Dropdown
    const dropdown = document.getElementById('selectOptions');
    dropdown.classList.remove('open');
  }


  function changeDropdownIcon() {
    const icon = document.getElementById("arrow-drop-down");
  
  
    if (icon.src.includes("arrow-drop-down.svg")) {
      icon.src = "/assets/icons/arrow_drop_downaa-up.svg"; 
    } else {
      icon.src = "/assets/icons/arrow-drop-down.svg"; 
    }
  }
  
  function changeDropdownIconCategory() {
    const icon = document.getElementById("arrow-drop-down-category");
  
    
    
    if (icon.src.includes("arrow-drop-down.svg")) {
      icon.src = "/assets/icons/arrow_drop_downaa-up.svg"; 
    } else {
      icon.src = "/assets/icons/arrow-drop-down.svg"; 
    }
  
  }