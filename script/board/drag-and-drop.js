/**
 * Drag-and-drop functionality for task management.
 * Adds event listeners to task cards and column bodies to enable dragging tasks between columns.
 */

/**
 * A visual indicator element shown in a column when a task is dragged over it.
 * @constant {HTMLDivElement} dropOfferBox
 */
const dropOfferBox = document.createElement('div');
dropOfferBox.innerHTML = `<div class="dashed-box drop-offer"></div>`;

/**
 * The column body where the drag operation starts.
 * @type {HTMLDivElement}
 */
let startDragColumnBody;

/**
 * Counter to track dragenter/dragleave events for accurate event handling.
 * @type {number} 
 */
let counter = 0;

/**
 * A clone of the dragged task card used as a visual representation during the drag.
 * @type {HTMLDivElement}
 */
let ghost = document.createElement('div');

/**
 * Adds event listeners to task cards and column bodies for drag-and-drop functionality.
 * - Handles dragging tasks between columns.
 * - Updates task states in the UI and backend.
 */
function addDragAndDropEventListeners() {
    /** 
     * taskCards - List of draggable task cards.
     * @type {NodeListOf<HTMLElement>} 
     */
    const taskCards = document.querySelectorAll('.draggable');
    /** 
     * columnBodies - List of column bodies where tasks are displayed.
     * @type {NodeListOf<HTMLElement>}
     */
    const columnBodies = document.querySelectorAll('.column-body');

    // Register drag-and-drop events for task cards
    taskCards.forEach(taskCard => {
        if (!taskCard.hasEventListener) {
            registerDragStart();
            registerDrag();
            registerDragEnd();
            taskCard.hasEventListener = true;
        }

        /**
         * Registers the 'dragstart' event for task cards.
         * Creates a ghost element and prepares the column for drop operations.
         */
        function registerDragStart() {
            taskCard.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', taskCard.id);
                if (navigator.userAgent.indexOf("Firefox") === -1) { // Handle drag image for non-Firefox browsers
                    createCloneAndSetDragImage(taskCard, e);
                }
                ghost.classList.remove('dni');
                startDragColumnBody = taskCard.parentElement;
                extendColumns();
            });
        }

        /**
         * Registers the 'drag' event for task cards.
         * Updates the position of the ghost element.
         */
        function registerDrag() {
            taskCard.addEventListener('drag', (e) => {
                changePositionOfGhost(e);
            });
        }

        /**
         * Registers the 'dragend' event for task cards.
         * Cleans up ghost elements and restores column styles.
         */
        function registerDragEnd() {
            taskCard.addEventListener('dragend', (e) => {
                removeGhost(taskCard);
                counter = 0;
                dropOfferBox.remove();
                shortenColumns();
            });
        }

        /**
         * Creates a clone of the dragged element to act as the drag image.
         * @param {HTMLElement} taskCard - The dragged task card.
         * @param {DragEvent} e - The drag event.
         */
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
            dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // 1px transparent image
            e.dataTransfer.setDragImage(dragImg, 0, 0);
        }

        /**
         * Updates the position of the ghost element based on mouse movement.
         * @param {DragEvent} e - The drag event.
         * @param {number} [height=ghost.offsetHeight] - The height of the ghost element.
         * @param {number} [width=ghost.offsetWidth] - The width of the ghost element.
         */
        function changePositionOfGhost(e, height = ghost.offsetHeight, width = ghost.offsetWidth) {
            if (e.clientY !== 0 && e.clientX !== 0) {
                ghost.style.top = `${e.clientY - height / 2}px`;
                ghost.style.left = `${e.clientX - width / 2}px`;
            }
        }

        /**
         * Removes the ghost element and clears styling from the original task card.
         * @param {HTMLElement} taskCard - The dragged task card.
         */
        function removeGhost(taskCard) {
            ghost.remove();
            taskCard.classList.remove('grey-out');
        }
    });

    // Register drag-and-drop events for column bodies
    columnBodies.forEach(columnBody => {
        if (!columnBody.hasEventListener) {
            registerDragover();
            registerDragenter();
            registerDragleave();
            registerDrop();
            columnBody.hasEventListener = true;
        }

        /**
         * Registers the 'dragover' event for column bodies.
         * Allows tasks to be dropped onto columns.
         */
        function registerDragover() {
            columnBody.addEventListener('dragover', (e) => {
                if (columnBody !== startDragColumnBody) {
                    e.preventDefault();
                }
            });
        }

        /**
         * Registers the 'dragenter' event for column bodies.
         * Displays the drop offer box.
         */
        function registerDragenter() {
            columnBody.addEventListener('dragenter', () => {
                if (columnBody !== startDragColumnBody && counter === 0) {
                    const noFeedbackBox = document.querySelector('.dashed-box:not(.drop-offer)');
                    if (columnBody.contains(noFeedbackBox)) {
                        noFeedbackBox.classList.add('dni');
                    }
                    columnBody.appendChild(dropOfferBox);
                }
                counter++;
            });
        }

        /**
         * Registers the 'dragleave' event for column bodies.
         * Removes the drop offer box when the dragged element leaves the column.
         */
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
            });
        }

        /**
         * Registers the 'drop' event for column bodies.
         * Moves the task to the new column and updates the database.
         * @param {DragEvent} e - The drop event.
         */
        function registerDrop() {
            columnBody.addEventListener('drop', async (e) => {
                if (columnBody === startDragColumnBody) return;

                const taskId = e.dataTransfer.getData('text');
                const draggedElement = document.getElementById(taskId);
                columnBody.appendChild(draggedElement);
                const prevState = updateTaskState(taskId, columnBody.dataset.tasksState);
                paintTasks();
                if (!await updateTaskInDatabase(taskId)) rollback(taskId, prevState);
            });

            /**
             * Updates the task state and database on drop.
             * @param {string} taskId - The ID of the task.
             * @param {string} newState - The new state of the task.
             * @returns {string} The previous state of the task.
             */
            function updateTaskState(taskId, newState) {
                const prevState = allData.tasks[taskId].state;
                allData.tasks[taskId].state = newState;
                return prevState;
            }

            /**
             * Rolls back the task state change
             * @param {string} taskId - The ID of the task.
             * @param {string} prevState - The previous state of the task.
             * @returns {Promise<void>}
             */
            async function rollback(taskId, prevState) {
                allData.tasks[taskId].state = prevState;
                paintTasks();
            }
        }
    });

    /**
     * Extends the height of columns to ensure smoother drag-and-drop operations.
     */
    function extendColumns() {
        if (document.querySelector('.board-tasks').offsetWidth > 1220) { // do not extend if content is wrapped
            setTimeout(() => {
                columnBodies.forEach(columnBody => {
                    columnBody.style.height = `${columnBody.offsetHeight + 240}px`;
                });
            }, 0);
        }
    }

    /**
     * Resets the height of columns to their original state after dragging ends.
     */
    function shortenColumns() {
        columnBodies.forEach(columnBody => columnBody.style.height = 'unset');
    }
}