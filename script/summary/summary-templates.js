/**
 * Renders the header for the summary view in desktop layout.
 * Updates the `#summaryHeader` element with a title and subtitle.
 */
function renderSummaryHeader() {
    document.getElementById("summaryHeader").innerHTML = `
        <h1 class="h1-responsive">Join 360</h1>
        <div class="sideline-blue"></div>
        <h4>Key Metrics at a Glance</h4>
    `;
}

/**
 * Renders the header for the summary view in responsive (mobile) layout.
 * Updates the `#summaryHeader` element with a title, subtitle, and rearranged structure.
 */
function renderSummaryHeaderResponsive() {
    document.getElementById("summaryHeader").innerHTML = `
        <h1 class="h1-responsive">Join 360</h1>
        <h4 class="h4-responsive">Key Metrics at a Glance</h4>
        <div class="sideline-blue"></div>
    `;
}

/**
 * Renders the main content of the summary view, including task metrics and navigation links.
 * Updates the `#summaryContent` element with task counts, urgent task information, and board statistics.
 */
function renderSummaryContent() {
    document.getElementById("summaryContent").innerHTML = `
        <div class="d-flex-c-c section-gap">
            <div class="todo-container" onclick="location.href='/html/board.html';">
                <div class="todo-icon">
                    <img src="/assets/icons/edit.svg" alt="edit">
                </div>
                <div class="counts-container">
                    <span id="openTodos" class="counts">1</span>
                    <p>To-do</p>
                </div>
            </div>
            <div class="todo-container" onclick="location.href='/html/board.html';">
                <div class="todo-icon">
                    <img src="/assets/icons/done.svg" alt="done">
                </div>
                <div class="counts-container">
                    <span id="doneTodos" class="counts">1</span>
                    <p>Done</p>
                </div>
            </div>
        </div>
        <div class="urgent-container" onclick="location.href='/html/board.html';">
            <div class="d-flex-c-c">
                <div class="todo-icon-urgent">
                    <img src="/assets/icons/double-arrow-up.svg" alt="urgent">
                </div>
                <div class="counts-container">
                    <span id="urgentTodos" class="counts">1</span>
                    <p>Urgent</p>
                </div>
            </div>
            <div class="sideline-gray"></div>
                <div class="summary-date">
                    <span id="taskDate"></span>
                    <p>Upcoming Deadline</p>
                </div>
            </div>
        </div>
        <div class="d-flex-c-c section-gap">
            <div class="tasks-container" onclick="location.href='/html/board.html';">
                <span id="boardTasks" class="counts">5</span>
                <p>Tasks in Board</p>
            </div>
            <div class="tasks-container" onclick="location.href='/html/board.html';">
                <span id="taskInProgress" class="counts">2</span>
                <p>Tasks in Progress</p>
            </div>
            <div class="tasks-container" onclick="location.href='/html/board.html';">
                <span id="awaitingFeedback" class="counts">2</span>
                <p>Awaiting Feedback</p>
            </div>
        </div>
    `;
}
