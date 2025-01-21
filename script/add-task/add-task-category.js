function toggleDropdown() {
    
    const dropdown = document.getElementById('selectOptions');
    dropdown.classList.toggle('open');
  }
  
  function selectOption(value) {
   
    const display = document.getElementById('category-display');
    display.textContent = value;
  
    
    const hiddenInput = document.getElementById('category');
    hiddenInput.value = value;
  
 
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
function resetCategory(){    
  
    document.getElementById("category").value = "";

  
    document.getElementById("category-display").innerText = "Select task category";
  
  
    document.getElementById("taskSubtask").value = "";
  
  
    const subtaskList = document.getElementById("subtask-list");
    subtaskList.innerHTML = "";
  } 


