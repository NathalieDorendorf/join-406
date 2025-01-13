const BASE_URL = "https://join-gruppenarbeit-137ed-default-rtdb.europe-west1.firebasedatabase.app/"

async function addUser() {
    
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirmPassword");
    let userName = document.getElementById("user");
    let privacyPolicy = document.getElementById("privacyPolicy");

    checkEmailExisting(email)

    
    const isPasswordValid = await checkPassword(password, confirmPassword);
    const isNameValid = await checkName(userName);
    const isEmailValid = await checkEmail(email); 
    const isPrivacyPolicyChecked = await checkPrivacyPolicy(privacyPolicy.checked);
    const mailAlreadyExists = await checkEmailExisting(email);
    
     

    if (!isPasswordValid || !isNameValid || !isEmailValid || !isPrivacyPolicyChecked || mailAlreadyExists) {
        clearData(password, confirmPassword);
        return;
    }

    let singleLogInData = {
        "email": email.value,
        "password": password.value
    };

    await updateUser(singleLogInData);
};

function clearAllUserData() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("user").value = "";
    document.getElementById('privacyPolicy').checked = false
}

async function checkEmailExisting(email) {
    email = email.value;
    const path = "users";
    const queryUrl = `${BASE_URL}${path}.json?orderBy=%22email%22&equalTo=%22${email}%22`;

    try {
        const response = await fetch(queryUrl);
        
        if (!response.ok) {
            console.error("HTTP Error:", response.status, response.statusText);
            return false;
        };
        const result = await response.json();

        if (Object.keys(result).length > 0) {
            errorFunctionEmailExist()
            return true;
        } else {
            return false;
        };

    } catch (error) {
        console.error("Error:", error);
        return false;
    };
}

async function checkName(userName) {
    if (/\d/.test(userName.value) || userName.value.trim() === "") {
        errorFunctionName();
        return false;
    } else {
        document.getElementById('user').style.border = "1px solid lightgray";
        document.getElementById('errorMessageName').innerHTML = "";
        return true;
    };
}

function errorFunctionName() {
    document.getElementById('errorMessageName').innerHTML = /*html*/`
     <div class="errorText">Your name cannot contain numbers or is blank.</div>
     `
    document.getElementById('user').style.border = "1px solid red";
};

function checkPassword(password, confirmPassword) {    
    if (password.value !== confirmPassword.value ||
        password.value.trim() === "" ||
        password.value.length < 8 ||
        password.value.length > 20) {
        errorFunctionPassword();
        return false;
    } else {
        document.getElementById('confirmPassword').style.border = "1px solid lightgray";
        document.getElementById('password').style.border = "1px solid lightgray";
        document.getElementById('errorMessageConfirmPassword').innerHTML ="";
        return true;
    }
};

function errorFunctionPassword() {
    const errorMessage = '<div class="errorText">Your passwords do not match or have less than 8 or more than 20 characters. Please try again.</div>';
    document.getElementById('errorMessageConfirmPassword').innerHTML = errorMessage
    document.getElementById('errorMessagePassword').innerHTML = errorMessage

    document.getElementById('confirmPassword').style.border = "1px solid red";
    document.getElementById('password').style.border = "1px solid red";
};

async function checkEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value) || email.value.trim() === "") {
        errorFunctionEmail();
        return false;
    } else {
        document.getElementById('email').style.border = "1px solid lightgray";
        document.getElementById('errorMessageEmail').innerHTML = "";
        return true; 
    }
}

function errorFunctionEmail() {
    document.getElementById('errorMessageEmail').innerHTML = /*html*/`
    <div class="errorText">please enter a valid email address</div>
    `
    document.getElementById('email').style.border = "1px solid red";
};

function errorFunctionEmailExist() {
    document.getElementById('errorMessageEmail').innerHTML = /*html*/`
    <div class="errorText">This email address is already taken</div>
    `
    document.getElementById('email').style.border = "1px solid red";
};

async function checkPrivacyPolicy() {
    if (privacyPolicy.checked) {
        document.getElementById('privacyPolicy').style.outline = "";
        document.getElementById('errorMessageprivacyPolicy').innerHTML = "";
        return true;
    } else {
        document.getElementById('errorMessageprivacyPolicy').innerHTML = /*html*/`
        <div class="errorText">please check the privacy policy</div>`
        document.getElementById('privacyPolicy').style.outline = "2px solid red";
        return false;
    }
};

function clearData(password, confirmPassword) {
    password.value = "";
    confirmPassword.value = "";
};

async function updateUser(data) {
    const response = await fetch(BASE_URL + "/users" + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    clearAllUserData()

    window.location.href = "log-in.html?msg=You Signed up successfully"
};

