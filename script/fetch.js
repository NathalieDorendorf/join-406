/**
 * Base URL for the Firebase database.
 * @constant {string}
 */
const BASE_URL = "https://join-gruppenarbeit-137ed-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetch Resource for a any path after BASE
 * @param {String} path - For example: 'users', 'contacts', 'tasks' or users/{id}...
 * @param {String} [httpMethod = GET] - 'GET', 'POST', 'PUT', 'PATCH', etc.
 * @param {Object} [data = 'undefined']
 * @param {String} [queryString = '']
 * @returns {Object | boolean} - Returns the response body as Object or true if httpMethod is `DELETE` or false if error occured.
 */
async function fetchResource(path, httpMethod = 'GET', data = undefined, queryString = "") {
    try {
        const response = await fetch(BASE_URL + path + ".json" + queryString, getRequestInit(httpMethod, data));
        console.log(response.status); // FDPO
        if (response.ok) {
            const responseJson = await response.json();
            console.log(responseJson); // FDPO
            return httpMethod.toUpperCase() === 'DELETE' ? true : responseJson;
        } else {
            console.error(new Error(`Failed to fetch from ${path}. Response Status ${response.status}. ${await response.text()}`));
            return false;
        }
    } catch (error) {
        console.error(`Exception in fetchResource(${path}).${error}`);
        return false;
    }
}

/**
 * Generates the request initialization object for a fetch request.
 * @param {string} method - The HTTP method to be used (e.g., "GET", "POST", "PUT", etc.).
 * @param {Object} data - The data to be included in the request body. This will be stringified into JSON format.
 * @returns {Object} The request initialization object containing the HTTP method, headers["Content-Type"], and body.
 */
function getRequestInit(method, data) {
    return {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }
}

/**
 * Retrieve all data at once. Access the return value for example like this: data.contacts
 * @param {String} [path] - omit to get all production data, otherwise path
 * @returns {Object} - all data in database, i.e. users, contacts and tasks
 */
async function getAllData(path = '') {
    const allData = {};
    allData.users = await fetchResource(path + '/users');
    allData.contacts = await fetchResource(path + '/contacts');
    allData.tasks = await fetchResource(path + '/tasks');
    return allData;
}

/**
 * Retrieves all example data by calling the `getAllData` function with 'readOnly' as a parameter.
 * @returns {Promise<Object>} The original example data.
 */
async function getAllExampleData() {
    return await getAllData('readOnly');
}

/**
 * Handles both "PUT" and "DELETE" requests for an item in a specified list.
 * Updates or deletes the item based on the provided HTTP method.
 * @param {string} list - The name of the list ("users", "contacts", "tasks").
 * @param {string} itemId - The ID of the item to update or delete.
 * @param {string} httpMethod - The HTTP method to use for the request (either "PUT" or "DELETE").
 * @param {string} [itemDesignator='Data'] - A label for the item being updated or deleted (optional, defaults to 'Data').
 * @returns {Promise<boolean>} Returns `true` if the operation was successful, otherwise `false`.
 */
async function putOrDelteItem(list, itemId, httpMethod, itemDesignator = 'Data') {
    if (isValidList(list) && isValidHttpMethod(httpMethod)) {
        const msgAppendix = httpMethod.toLowerCase() === 'put' ? 'updated' : 'deleted';
        const path = `/${list}/${itemId}`;
        if (await fetchResource(path, httpMethod, allData[list][itemId])) {
            showToastMessage({ message: `${itemDesignator} has been ${msgAppendix}.` });
            return true;
        } else {
            showToastMessage({ message: `${itemDesignator} could not be ${msgAppendix}.`, backgroundColor: 'red' });
        }
    } else {
        console.error('Invalid list name');
    }
    return false;
}

/**
 * Validates if the given list name is valid.
 * @param {string} list - The name of the list to validate (e.g., "users", "contacts", "tasks").
 * @returns {boolean} Returns `true` if the list is valid, otherwise `false`.
 */
function isValidList(list) {
    return ['users', 'contacts', 'tasks'].filter(listItem => listItem === list.toLowerCase()).length > 0;
}

/**
 * Validates if the given HTTP method is valid (either "PUT" or "DELETE").
 * @param {string} httpMethod - The HTTP method to validate (either "PUT" or "DELETE").
 * @returns {boolean} Returns `true` if the HTTP method is valid, otherwise `false`.
 */
function isValidHttpMethod(httpMethod) {
    return ['put', 'delete'].filter(listItem => listItem === httpMethod.toLowerCase()).length > 0;
}

/**
 * Updates a task by calling the `putOrDelteItem` function with 'put' as the HTTP method.
 * @param {string} itemId - The ID of the task to update.
 * @returns {Promise<boolean>} Returns `true` if the task was successfully updated, otherwise `false`.
 */
async function updateTaskInDatabase(itemId) {
    return await putOrDelteItem('tasks', itemId, 'put', 'Task');
}

/**
 * Deletes a task by calling the `putOrDelteItem` function with 'delete' as the HTTP method.
 * @param {string} itemId - The ID of the task to delete.
 * @returns {Promise<boolean>} Returns `true` if the task was successfully deleted, otherwise `false`.
 */
async function deleteTaskInDatabase(itemId) {
    return await putOrDelteItem('tasks', itemId, 'delete', 'Task');
}

/**
 * Restores all example data by fetching read-only data and updating tasks and contacts.
 * @returns {Promise<void>}
 */
async function restoreAllExampleData() {
    const readOnlyData = await getAllData('readOnly');
    fetchResource('tasks', 'PUT', readOnlyData.tasks);
    fetchResource('contacts', 'PUT', readOnlyData.contacts);
}

// for development purposes only (FDPO)
// call for example like this: postData('contacts', localContacts);
async function postArrayData(path, dataArray) {
    for (const data of dataArray) {
        fetchResource(path, 'POST', data);
    }
}

async function putArrayData(path, dataArray) {
    for (const data of dataArray) {
        fetchResource(path, 'PUT', data);
    }
}

async function postObjectData(path, dataObject) {
    for (const data of Object.values(dataObject)) {
        fetchResource(path, 'POST', data);
    }
}

async function putObjectData(path, dataObject) {
    for (const data of Object.values(dataObject)) {
        fetchResource(path, 'PUT', data);
    }
}

async function putListData(list, data) {
    fetchResource(list, 'PUT', data);
}

async function putTasksDataFromExampleData() {
    putListData('tasks', readOnly.tasks);
}

// FDPO end