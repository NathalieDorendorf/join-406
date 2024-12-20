const BASE_URL = "https://join-gruppenarbeit-137ed-default-rtdb.europe-west1.firebasedatabase.app/"


function getData() {
    laodUser();
    updateUserGender();
};

// Load Data und show in consloe
async function laodUser() {
    let response = await fetch(BASE_URL + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);

    getUserData(responseToJson);
};

// Put userData in variables
function getUserData(responseToJson) {
    let userName = responseToJson.user.name
    let userPassword = responseToJson.user.login.password
    console.log(userName, userPassword);
};

// Update User
async function updateUserGender() {
    await postData("/user", {"gender": "male"});
};

//  Patch userData in dataBase
async function postData(path = "", newData = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newData)
    });
};