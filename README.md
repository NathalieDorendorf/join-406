# Kanban Task Management Application

This web application provides a Kanban-based task management board to help users organize and track their tasks efficiently. It includes features for creating, assigning, prioritizing, and categorizing tasks, 
as well as drag-and-drop functionality to move tasks between different states.

## Features

* **Task Management:** Create, edit, and delete tasks.
* **Task Organization:** Categorize tasks (e.g., User Story, Technical Task) and assign a priority (urgent, medium, low).
* **Task Assignment:** Assign tasks to contacts.
* **Subtasks:** Break down tasks into smaller subtasks and track their progress.
* **Drag-and-Drop:** Move tasks between different status columns (To Do, In Progress, Awaiting Feedback, Done) using drag-and-drop.
* **Responsive Design:** The application is optimized for desktop and mobile devices.
* **Contact Management:** Manage a list of contacts to whom tasks can be assigned.
* **Overlays:** Use interactive overlays for adding/editing tasks, viewing task details, and moving tasks.
* **Data Persistence:** (Assumption: Firebase - \*If you use a different backend, adjust accordingly\*) Data is stored and retrieved from Firebase to ensure data persistence.
* **Search:** Filter tasks by keywords.
* **Date Handling:** Set and manage due dates for tasks.
* **Animations:** Uses animations for a better user experience (e.g., opening/closing overlays).
* **Validation:** Input validation to ensure data integrity.
* **Overview:** Provides an overview of important task information.
* **Undo Function:** Offers options to undo deleted tasks.
* **Toast Messages:** Displays user-friendly toast messages for feedback.

## Technologies Used

* **HTML**
* **CSS**
* **JavaScript**
* **Firebase** (for data storage - \*adjust if you use something else\*)

## Installation Instructions

2.  **Set up Firebase (if applicable):**

    * Create a Firebase project.
    * Set up a Firebase Realtime Database or Firestore.
    * Obtain your Firebase configuration (API key, etc.).
    * Replace the placeholder Firebase configuration in your JavaScript files with your actual configuration. (\*Pay close attention to where `BASE_URL` is defined and all `fetch` calls to Firebase)

3.  **Open `index.html` in your browser.** (Or use a local server).
