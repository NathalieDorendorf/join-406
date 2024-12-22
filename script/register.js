const BASE_URL = "https://join-gruppenarbeit-137ed-default-rtdb.europe-west1.firebasedatabase.app/"

async function addUser() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirmPassword");
    let userName = document.getElementById("user");
    let privacyPolicy = document.getElementById("privacyPolicy");


    checkPassword(password, confirmPassword);
    checkPrivacyPolicy();

    if(password.value !== confirmPassword.value || privacyPolicy.checked != true){
        clearData(email, password, confirmPassword, userName, privacyPolicy);
        return;
    };

    let singleLogInData = {
        "email": email.value,
        "password": password.value
    };

    await updateUser(singleLogInData);

    

};

async function checkPassword(password, confirmPassword) {
    if (password.value != confirmPassword.value) {
        alert("Passwort stimmt nicht überein, bitte erneut versuchen") //create a new popup 
        return;
    }
};

async function checkPrivacyPolicy() {
    if (privacyPolicy.checked) {
        return;
    } else{
        alert("Bitte Privacy Policy bestätigen")
    }
}

async function clearData(email, password, confirmPassword, userName, privacyPolicy) {
    // checken weleche Daten nicht passen und nur die leeren
    email.value = "";
    password.value = "";
    userName.value = "";
    confirmPassword.value = "";
    privacyPolicy.checked = false;
}

async function updateUser(data) {
    const response = await fetch(BASE_URL + "/users" + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("User hinzugefügt:", result);

    window.location.href = "log-in.html?msg=You Signed up successfully"
};

