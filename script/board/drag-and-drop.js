const dropOfferBox = document.createElement('div');
dropOfferBox.innerHTML = `<div class="dashed-box drop-offer"></div>`;
let startDragColumnBody;
let counter = 0;
let ghost = document.createElement('div');

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
                if (navigator.userAgent.indexOf("Firefox") == -1) { // Firefox has no dragevent.clientY
                    createCloneAndSetDragImage(taskCard, e);
                }
                ghost.classList.remove('dni');
                startDragColumnBody = taskCard.parentElement;
                if (document.querySelector('.board-tasks').offsetWidth > 1220) { // prevent feature on grid wrap to prevent need to scroll while dragging
                    extendColumns();
                }
            });
        }

        function registerDrag() {
            taskCard.addEventListener('drag', (e) => {
                changePositionOfGhost(e);
            })
        }

        function registerDragEnd() {
            taskCard.addEventListener('dragend', (e) => {
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
            changePositionOfGhost(e, height, width);
            document.body.appendChild(ghost);
            const dragImg = document.createElement('img');
            dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // 1px transparent img
            e.dataTransfer.setDragImage(dragImg, 0, 0);
        }

        function changePositionOfGhost(e, height = ghost.offsetHeight, width = ghost.offsetWidth) {
            if (e.clientY != 0 && e.clientX != 0) {
                const topValue = e.clientY - height / 2;
                const leftValue = e.clientX - width / 2;
                ghost.style.top = `${topValue}px`;
                ghost.style.left = `${leftValue}px`;
            }
        }

        function removeGhost(taskCard) {
            ghost.remove();
            taskCard.classList.remove('grey-out');
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
        setTimeout(() => {
            columnBodies.forEach(columnBody => {
                columnBody.style.height = `${columnBody.offsetHeight + 240}px`;
            });
        }, 0);
    }

    function shortenColumns() {
        columnBodies.forEach(columnBody => columnBody.style.height = 'unset');
    }
}