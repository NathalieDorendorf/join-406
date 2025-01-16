/**
 * Renders the overlay for adding a new task.
 * @returns {string} HTML string for the "Add Task" overlay.
 */
function renderAddTaskOverlay() {
    return `
        <div id="ato" class="ato fly-in-from-right fc gap-32">
            <div class="fr sb">
                <span class="headline">Add Task</span>
                <div class="ui-icon-wrapper close-btn">
                    <img src="/assets/icons/close.svg" alt="Close button" onclick="closeAddTaskOverlay()">
                </div>
            </div>
            <form id="ato-form" class="ato-form" autocomplete="off">
                ${renderInputFields()}
                <div class="w-100 fr sb ae gap-16 wrap">
                    <div class="required-hint">
                        <span class="required-red">*</span>
                        <span>This field is required</span>
                    </div>
                    <div class="fr gap-16 wrap ato-footer-buttons">
                        <button id="cancel-add-task-btn" class="button-2 fr jcac gap-8" onclick="cancelAddTask()">
                            <span>Cancel / Clear</span>
                            <img src="/assets/icons/close.svg" alt="Cancel create task button">
                        </button>
                        <button type="submit" name="submit" class="button fr jcac gap-8" onclick="addTask()">
                            <span>Create Task</span>
                            <img src="/assets/icons/check.svg" alt="Create task button">
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
}

/**
 * Renders the input fields for the add-task and edit-task form.
 * @returns {string} HTML string for task input fields.
 */
function renderInputFields() {
    return `
        <div class="inputs w-100 fr wrap gap-32">
            <div class="input-side fc gap-32">
                <div class="fc gap-8">
                    <label for="ato-title" class="task-item-designator required-input">Title</label>
                    <input type="text" name="ato-title" id="ato-title" class="ato-input" placeholder="Enter title">
                </div>
                <div class="fc gap-8">
                    <label for="ato-description" class="task-item-designator">Description</label>
                    <textarea name="ato-description" id="ato-description" rows="4" class="ato-input" placeholder="Enter description"></textarea>
                </div>
                <div class="fc gap-8">
                    <span class="task-item-designator">Assigned to</span>
                    <div class="pos-rel">
                        <div name="ato-assigned-to" id="ato-assigned-to" class="custom-select ato-input"
                            onclick="toggleSelectContacts(this)" tabindex="-1">
                            <span>Select contacts to assign</span>
                            <div class="ui-icon-wrapper input-ui-icon">
                                <img src="/assets/icons/arrow-drop-down.svg" alt="drop-down button">
                            </div>
                        </div>
                        <div id="contacts-box" class="custom-select-rendered fc dni" tabindex="-1" onfocusout="closeAwaitSelectDropdown(event, '#ato-assigned-to')"></div>
                    </div>
                    <div id="ato-name-tags" class="ato-name-tags fr wrap">${renderForAll(selectedContacts, renderContactTag)}</div>
                </div>
            </div>
            <div class="vertical-separator"></div>
            <div class="input-side fc gap-32">
                <div class="fc gap-8">
                    <label for="ato-due-date" class="task-item-designator required-input">Due date</label>
                    <div class="pos-rel">
                        <input type="date" name="ato-due-date" id="ato-due-date" class="ato-input">
                        <div class="ui-icon-wrapper input-ui-icon calendar-icon">
                            <img src="/assets/icons/calendar-icon.svg" alt="open calendar">
                        </div>
                    </div>
                </div>
                <div class="fc gap-8">
                    <span class="task-item-designator">Priority</span>
                    <div name="ato-piority" id="ato-piority" class="fr gap-8 ato-priority wrap">
                        <div class="priority-button fr gap-8 jcac ato-input" data-priority="urgent" onclick="selectPriority(this)">
                            <span>Urgent</span>
                            <img src="/assets/icons/priority-urgent.svg" alt="Select Urgent Priority">
                        </div>
                        <div class="priority-button fr gap-8 jcac ato-input selected-priority" data-priority="medium" onclick="selectPriority(this)">
                            <span>Medium</span>
                            <img src="/assets/icons/priority-medium.svg" alt="Select Medium Priority">
                        </div>
                        <div class="priority-button fr gap-8 jcac ato-input" data-priority="low" onclick="selectPriority(this)">
                            <span>Low</span>
                            <img src="/assets/icons/priority-low.svg" alt="Select Low Priority">
                        </div>
                    </div>
                </div>
                <div class="fc gap-8">
                    <span class="task-item-designator required-input">Category</span>
                    <div class="pos-rel">
                        <div name="ato-category" id="ato-category" class="custom-select ato-input" onclick="toggleSelectCategory()" tabindex="-1">
                            <span id="ato-selected-category">Select task category</span>
                            <input type="hidden" id="ato-selected-category-input"></input>
                            <div class="ui-icon-wrapper input-ui-icon">
                                <img src="/assets/icons/arrow-drop-down.svg" alt="drop-down button">
                            </div>
                        </div>
                        <div id="category-box" class="custom-select-rendered ato-category-box fc dni" tabindex="-1" onfocusout="closeImmediateSelectDropdown(event, '#ato-category')">
                            <div class="fr ac gap-16 category-to-select" onclick="selectCategory('Technical Task')"><span>Technical Task</span></div>
                            <div class="fr ac gap-16 category-to-select" onclick="selectCategory('User Story')"><span>User Story</span></div>
                        </div>
                    </div>
                </div>
                <div class="fc gap-8">
                    <span class="task-item-designator">Subtasks</span>
                    <div class="pos-rel">
                        <input type="text" name="ato-subtasks" id="ato-subtasks" class="ato-input ato-subtasks" placeholder="Add new subtask" oninput="showSubtasksInputUIControls(true)" onkeydown="inputKeyHandler(event, this, confirmSubtask)"></input>
                        <div id="ato-subtasks-add-btn" class="ui-icon-wrapper input-ui-icon" onclick="resetSubtasksInput()">
                            <img src="/assets/icons/add-blue.svg" alt="add new subtask button">
                        </div>
                        <div id="ato-subtasks-confirm-btn" class="ui-icon-wrapper input-ui-icon dni" onclick="confirmSubtask()">
                            <img src="/assets/icons/check-blue.svg" alt="confirm or add subtask button">
                        </div>
                        <div id="ato-subtasks-cancel-btn" class="ui-icon-wrapper input-ui-icon dni" onclick="resetSubtasksInput()">
                            <img src="/assets/icons/close.svg" alt="cancel new subtask button">
                        </div>
                    </div>
                    <div id="subtasks-box" class="custom-select-rendered ato-subtasks-box fc">
                        <ul>${renderForAll(writtenSubtasks, renderSubtask)}</ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renders a contact-select-box for selection in the "Assigned to" field.
 * @param {Array} contactEntry - Array containing contact ID and value.
 * @returns {string} HTML string for a contact option.
 */
function renderContactOption(contactEntry) {
    contactId = contactEntry[0];
    contactValue = contactEntry[1];
    return `
        <div id="${contactId}" class="fr ac gap-16 assigend-to-contact" onclick="selectContact(event, this, '${contactId}')">
            ${renderContactTag(contactId)}
            <span>${contactValue.name}</span>
            <img src="/assets/icons/check-button-unchecked.svg" alt="Contact not selected">
        </div>
    `;
}

/**
 * Renders a single subtask item.
 * @param {Object} subtask - Subtask object containing subtask-title.
 * @param {number} index - Index of the subtask in the array
 * @returns {string} HTML string for a subtask item.
 */
function renderSubtask(subtask, index) {
    return `
        <div class="fr sb ac gap-16 written-subtask pos-rel" onclick="editSubtask(${index})">
            <li>
                <span>${subtask.title}</span>   
                <div>
                    <div class="ui-icon-wrapper input-ui-icon d-none" onclick="deleteSubtask(event, ${index})" style="right: 56px">
                        <img src="/assets/icons/delete-blue.svg" alt="delete subtask button">
                    </div>
                    <div class="ui-icon-wrapper input-ui-icon d-none" onclick="editSubtask(${index})">
                        <img src="/assets/icons/edit-blue.svg" alt="edit subtask button">
                    </div>
                </div>
            </li>
        </div>
    `;
}

/**
 * Renders the overlay for editing an existing task.
 * @param {string} taskId - ID of the task to edit.
 * @returns {string} HTML string for the "Edit Task" overlay.
 */
function renderEditTaskOverlay(taskId) {
    return `
        <div id="ato" class="ato fly-in-from-right fc gap-32">
            <div class="ui-icon-wrapper close-btn">
                <img src="/assets/icons/close.svg" alt="Close button" onclick="closeEditTaskOverlay()">
            </div>
            <form id="ato-form" class="ato-form" autocomplete="off">
                ${renderInputFields()}
                <div class="w-100 fr sb ae gap-16 wrap">
                        <div class="required-hint">
                            <span class="required-red">*</span>
                            <span>This field is required</span>
                        </div>
                        <div class="fr gap-16 wrap ato-footer-buttons">
                            <button type="submit" name="submit" class="button fr jcac gap-8" onclick="saveTask('${taskId}')">
                                <span>Save</span>
                                <img src="/assets/icons/check.svg" alt="Save task button">
                            </button>
                        </div>
                    </div>
            </form>
        </div>
    `;
}
