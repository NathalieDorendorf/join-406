"use strict";

let searchForm;
let searchInputfield;
let addTaskBtn;
let columnTitles;
let columnsBodies;
let allData = {};
let searchData = [];
let filteredTasks = {};
let filtered = false;

document.addEventListener('DOMContentLoaded', () => {
    getElementRefs();
    registerEventHandlers();
    fetchDataAndPaintTasks();
})

function getElementRefs() {
    searchForm = document.getElementById('search-form');
    searchInputfield = document.getElementById('search');
    addTaskBtn = document.getElementById('add-task');
    columnTitles = document.querySelectorAll('.column-title');
    columnsBodies = document.querySelectorAll('.column-body');
}

function registerEventHandlers() {
    searchForm.oninput = searchForm.onsubmit = (e) => {
        e.preventDefault();
        search();
    }
}

async function fetchDataAndPaintTasks() {
    allData = await getAllData();
    paintTasks(allData.tasks);
}

function paintTasks(tasks) {
    createHTMLContents(tasks).forEach((html, index) => columnsBodies.item(index).innerHTML = html);
    columnsBodies.forEach((columnbody, index) => {
        if (!columnbody.children.length) {
            columnbody.innerHTML = renderNoTaskFeedback(columnTitles.item(index).textContent, filtered ? 'found ' : '');
        }
    })
}

function createHTMLContents(tasks) {
    const states = ['to-do', 'in-progress', 'await-feedback', 'done'];
    const columnsHTMLContents = ['', '', '', ''];
    for (const [id, task] of Object.entries(tasks)) {
        const columnIndex = states.indexOf(task.state);
        if (columnIndex !== -1) {
            columnsHTMLContents[columnIndex] += renderTask(id, task);
        }
        else {
            console.error('task-state does not exist.');
        }
    }
    return columnsHTMLContents;
}

function searchHint() {
    searchInputfield.value = "Suchbegriff eingeben";
    searchInputfield.select();
}

function search() {
    if (searchInputfield.value.length == 0) {
        filtered = false;
        paintTasks(allData.tasks);
    } else {
        executeSearch(searchInputfield);
    }
}

function executeSearch(searchInputfield) {
    searchInputfield.disabeld = true;
    filteredTasks = {};
    setTimeout(() => {
        if (!filtered) {
            showToastMessage("Searching tasks");
        }
    }, 100);
    filteredTasks = getMatchingTasks(searchInputfield.value);
    filtered = true;
    paintTasks(filteredTasks);
    searchInputfield.disabeld = false;
}

function getMatchingTasks(searchString) {
    const searchTerms = searchString.toLowerCase().split(/\s+/);
    const filteredTasks = {};
    for (const [id, task] of Object.entries(allData.tasks)) {
        let taskHasAllSearchTerms = false;
        for (const searchTerm of searchTerms) {
            if (task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm)) {
                taskHasAllSearchTerms = true;
            } else {
                taskHasAllSearchTerms = false;
                break;
            }
        }
        if (taskHasAllSearchTerms) {
            filteredTasks[id] = task;
        }
    }
    return filteredTasks;
}

function openOverlayNewTask(category = '') {

}

function showToastMessage(message) {
    alert(message);
}