let subtask = [];
let update = false;
let updateIndex = null;

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("taskSubtask");

  inputField.addEventListener("input", function (event) {
    if (event.target.value === "") {
      show();
    } else {
      hide();
    }
  });
});

function hide() {
  let addBlue = document.getElementById("add-blue");
  let closeCheck = document.getElementById("close-check");
  closeCheck.classList.remove("display-none");
  addBlue.classList.add("display-none");
}

function show() {
  let addBlue = document.getElementById("add-blue");
  let closeCheck = document.getElementById("close-check");
  closeCheck.classList.add("display-none");
  addBlue.classList.remove("display-none");
}

function editAndFocus(inputId) {
  const inputField = document.getElementById(inputId);
  inputField.focus();
}

function renderSubtask() {
  let task = document.getElementById("subtask-list");

  task.innerHTML = "";

  for (let index = 0; index < subtask.length; index++) {
    task.innerHTML += renderList(index);
  }
}

function addSubtask() {
  let task = document.getElementById("taskSubtask").value;

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

function delet(indexSubtask) {
 
    subtask.splice(indexSubtask, 1);
    renderSubtask();
    clearInput()
  
}

function edit(indexSubtask) {
  let task = document.getElementById("taskSubtask");
  task.value = subtask[indexSubtask].title;
  updateIndex = indexSubtask;
  update = true;

  show();
  renderSubtask();
}

function updateSubtask(index) {
  let task = document.getElementById("taskSubtask");
  let input = task.value;
  console.log(index);

  subtask[updateIndex].title = input;
  renderSubtask();
  update = false;

  clearInput();

  console.log(subtask);
  
}

function clearInput() {
  document.getElementById("taskSubtask").value = "";
}
