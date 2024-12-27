"use strict";

let addTaskBtn;
let columnsBodies;
let allData = {};

document.addEventListener('DOMContentLoaded', () => {
    getElementRefs();
    paintTasks();
})

function getElementRefs() {
    addTaskBtn = document.getElementById('add-task');
    columnsBodies = document.querySelectorAll('.column-body');
}

async function paintTasks() {
    allData = await getAllData();
    createHTMLContents(allData).forEach((html, index) => columnsBodies.item(index).innerHTML = html);
}

function createHTMLContents(allData) {
    const states = ['to-do', 'in-progress', 'await-feedback', 'done'];
    const columnsHTMLContents = [];
    for (const task of Object.values(allData.tasks)) {
        const columnIndex = states.indexOf(task.state);
        if (columnIndex !== -1) {
            columnsHTMLContents[columnIndex] += renderTask(task);
        }
        else {
            console.error('task-state does not exist.');
        }
    }
    return columnsHTMLContents;
}

function openNewTaskOverlay(category = '') {

}
