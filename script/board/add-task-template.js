function renderAddTaskOverlay() {
    return `
        <div id="overlay" class="overlay">
            <div class="ato fly-in-from-right fc gap-32">
                <div class="fr sb">
                    <span class="headline">Add Task</span>
                    <div class="ui-icon-wrapper close-btn">
                        <img src="/assets/icons/close.svg" alt="Close button" onclick="closeOverlay()">
                    </div>
                </div>
                <form class="ato-form">
                    <div class="inputs w-100 fr wrap gap-32">
                        <div class="input-side fc gap-32">
                            <div class="fc gap-8">
                                <label for="ato-title" class="task-item-designator required-input">Title</label>
                                <input type="text" name="ato-title" id="ato-title" class="ato-input" placeholder="Enter title">
                            </div>
                            <div class="fc gap-8">
                                <label for="ato-description" class="task-item-designator">Description</label>
                                <div class="textarea-container">
                                    <textarea name="ato-description" id="ato-description" rows="4" class="ato-input"
                                        placeholder="Enter description"></textarea>
                                </div>
                            </div>
                            <div class="fc gap-8">
                                <span class="task-item-designator">Assigned to</span>
                                <div name="ato-assigned-to" id="ato-assigned-to" class="custom-select ato-input"
                                    onclick="openSelectOptions('contacts')">
                                    <span>Select contacts to assign</span>
                                    <div class="ui-icon-wrapper input-ui-icon">
                                        <img src="/assets/icons/arrow-drop-down.svg" alt="drop-down button">
                                    </div>
                                </div>
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
                                    <div class="priority-button fr gap-8 jcac ato-input">
                                        <span>Urgent</span>
                                        <img src="/assets/icons/priority-urgent.svg" alt="Select Urgent Priority">
                                    </div>
                                    <div class="priority-button fr gap-8 jcac ato-input selected-prio">
                                        <span>Medium</span>
                                        <img src="/assets/icons/priority-medium.svg" alt="Select Medium Priority">
                                    </div>
                                    <div class="priority-button fr gap-8 jcac ato-input">
                                        <span>Low</span>
                                        <img src="/assets/icons/priority-low.svg" alt="Select Low Priority">
                                    </div>
                                </div>
                            </div>
                            <div class="fc gap-8">
                                <span class="task-item-designator required-input">Category</span>
                                <div name="ato-category" id="ato-category" class="custom-select ato-input"
                                    onclick="openSelectOptions('category')">
                                    <span>Select task category</span>
                                    <div class="ui-icon-wrapper input-ui-icon">
                                        <img src="/assets/icons/arrow-drop-down.svg" alt="drop-down button">
                                    </div>
                                </div>
                            </div>
                            <div class="fc gap-8">
                                <span class="task-item-designator">Subtasks</span>
                                <div name="ato-subtasks" id="ato-subtasks" class="custom-select ato-input"
                                    onclick="openSelectSubtasks()">
                                    <span class="custom-add-placeholder">Add new subtask</span>
                                    <div class="ui-icon-wrapper input-ui-icon">
                                        <img src="/assets/icons/add-blue.svg" alt="add new subtask button">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-100 fr sb ae gap-16 wrap">
                        <div class="required-hint">
                            <span class="required-red">*</span>
                            <span>This field is required</span>
                        </div>
                        <div class="fr gap-16 wrap ato-footer-buttons">
                            <button class="button-2 fr jcac gap-8">
                                <span>Cancel</span>
                                <img src="/assets/icons/close.svg" alt="Cancel create task button">
                            </button>
                            <button class="button fr jcac gap-8">
                                <span>Create Task</span>
                                <img src="/assets/icons/check.svg" alt="Create task button">
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
}