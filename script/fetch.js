const BASE_URL = "https://join-gruppenarbeit-137ed-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * 
 * @param {String} path - For example: 'users', 'contacts', 'tasks' or users/{id}...
 * @param {String} [httpMethod=GET] - also 'POST', 'PUT', 'PATCH', etc.
 * @param {Object} [data='undefined']
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