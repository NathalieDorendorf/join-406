const BASE_URL = "https://join-gruppenarbeit-137ed-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * 
 * @param {String} path - For example: 'users', 'contacts', 'tasks' or users/{id}...
 * @param {String} [httpMethod = GET] - also 'POST', 'PUT', 'PATCH', etc.
 * @param {Object} [data = 'undefined']
 * @returns JSON
 */
async function fetchResource(path, httpMethod = 'GET', data = undefined) {
    try {
        const response = await fetch(BASE_URL + path + ".json", getRequestInit(httpMethod, data));
        if (response.ok) {
            const responseJson = await response.json();
            console.log(responseJson); // remove for live version
            return responseJson;
        } else {
            console.error(new Error(`Failed to fetch from ${path}.${response.status} ${await response.text()}`))
        }
    } catch (error) {
        console.error(`Exception in fetchResource(${path}).${error}`);
    }
}

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
 * @returns Object - all data in database, i.e. users, contacts and tasks
 */
async function getAllData(path = '') {
    const allData = {};
    allData.users = await fetchResource(path + '/users');
    allData.contacts = await fetchResource(path + '/contacts');
    allData.tasks = await fetchResource(path + '/tasks');
    return allData;
}

async function getAllExampleData() {
    return await getAllData('readOnly');
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

// FDPO end