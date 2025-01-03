const dropOfferBox = document.createElement('div');
dropOfferBox.innerHTML = `<div class="dashed-box drop-offer"></div>`;
let startDragColumnBody;
let counter = 0;
let ghost = null;

function addDragAndDropEventListeners() {
    const taskCards = document.querySelectorAll('.draggable');
    const columnBodies = document.querySelectorAll('.column-body');

    taskCards.forEach(taskCard => {
        if (!taskCard.hasEventListener) {
            registerDragStart();
            registerDrag();
            registerDragEnd();
            taskCard.hasEventListener = true;
        }

        function registerDragStart() {
            taskCard.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', taskCard.id);
                createCloneAndSetDragImage(taskCard, e);
                ghost.classList.remove('dni');
                startDragColumnBody = taskCard.parentElement;
                extendColumns();
            });
        }

        function registerDrag() {
            taskCard.addEventListener('drag', (e) => {
                const topValue = e.clientY - ghost.offsetHeight / 2;
                const leftValue = e.clientX - ghost.offsetWidth / 2;
                ghost.style.top = `${topValue}px`;
                ghost.style.left = `${leftValue}px`;
            })
        }

        function registerDragEnd() {
            taskCard.addEventListener('dragend', () => {
                removeGhost(taskCard);
                counter = 0;
                dropOfferBox.remove();
                shortenColumns();
            })
        }

        function createCloneAndSetDragImage(taskCard, e) {
            const width = taskCard.offsetWidth;
            const height = taskCard.offsetHeight;
            ghost = taskCard.cloneNode(true);
            taskCard.classList.add('grey-out');
            ghost.classList.add('ghost', 'dni');
            ghost.style.width = `${width}px`;
            ghost.style.height = `${height}px`;
            document.body.appendChild(ghost);
            const dragImg = document.createElement('img');
            dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // 1px transparent img
            e.dataTransfer.setDragImage(dragImg, 0, 0);
        }

        function removeGhost(taskCard) {
            taskCard.classList.remove('grey-out');
            ghost.remove();
        }
    });

    columnBodies.forEach(columnBody => {
        if (!columnBody.hasEventListener) {
            registerDragover();
            registerDragenter();
            registerDragleave();
            registerDrop();
            columnBody.hasEventListener = true;
        }

        function registerDragover() {
            columnBody.addEventListener('dragover', (e) => {
                if (columnBody != startDragColumnBody) {
                    e.preventDefault();
                }
            });
        }

        function registerDragenter() {
            columnBody.addEventListener('dragenter', () => {
                if (columnBody != startDragColumnBody && counter === 0) {
                    const noFeedbackBox = document.querySelector('.dashed-box:not(.drop-offer)');
                    if (columnBody.contains(noFeedbackBox)) {
                        noFeedbackBox.classList.add('dni');
                    }
                    columnBody.appendChild(dropOfferBox);
                }
                counter++;
            })
        }

        function registerDragleave() {
            columnBody.addEventListener('dragleave', () => {
                counter--;
                if (counter === 0) {
                    const noFeedbackBox = document.querySelector('.dashed-box:not(.drop-offer)');
                    if (columnBody.contains(noFeedbackBox)) {
                        noFeedbackBox.classList.remove('dni');
                    }
                    dropOfferBox.remove();
                }
            })
        }

        function registerDrop() {
            columnBody.addEventListener('drop', (e) => {
                const draggedElement = document.getElementById(`${e.dataTransfer.getData('text')}`);
                if (columnBody !== startDragColumnBody) {
                    columnBody.appendChild(draggedElement);
                    taskId = draggedElement.id;
                    allData.tasks[taskId].state = columnBody.dataset.tasksState;
                    paintTasks();
                    if (!updateTaskInDatabase(taskId)) {
                        paintTasks();
                    }
                }
            })
        }
    })

    function extendColumns() {
        columnBodies.forEach(columnBody => columnBody.style.height = `${columnBody.offsetHeight + 240}px`);
    }

    function shortenColumns() {
        columnBodies.forEach(columnBody => columnBody.style.height = 'unset');
    }
}

function updatePositionRemoteAndLocal(taskCard) {
    const taskId = taskCard.id;
}