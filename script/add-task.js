
let expanded = false;

function processForm(event) {
  
    event.preventDefault();

    
    const form = document.getElementById('add-task-form');


    const formValue = new FormData(form);
    const data = {};

    
    formValue.forEach((value, key) => {
        data[key] = value;
    });

    
    console.log(data);
}




function showCheckboxes() {
  let checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "flex";
    checkboxes.style.flexDirection = "column";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}


