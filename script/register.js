const BASE_URL = "https://join-gruppenarbeit-137ed-default-rtdb.europe-west1.firebasedatabase.app/"

async function addUser() {
    
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirmPassword");
    let userName = document.getElementById("user");
    let privacyPolicy = document.getElementById("privacyPolicy");

    const isPasswordValid = await checkPassword(password, confirmPassword);
    const isNameValid = await checkName(userName);
    const isEmailValid = await checkEmail(email); 
    const isPrivacyPolicyChecked = await checkPrivacyPolicy(privacyPolicy.checked);

    if (!isPasswordValid || !isNameValid || !isEmailValid || !isPrivacyPolicyChecked) {
        clearData(password, confirmPassword, privacyPolicy);
        return;
    }

    let singleLogInData = {
        "email": email.value,
        "password": password.value
    };

    await updateUser(singleLogInData);
};

async function clearAllUserData() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("user").value = "";
    document.getElementById('privacyPolicy').checked = false
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

async function errorFunctionName() {
    document.getElementById('errorMessageName').innerHTML = /*html*/`
     <div class="errorText">Your name cannot contain numbers or is blank.</div>
     `
    document.getElementById('user').style.border = "1px solid red";
};

async function checkPassword(password, confirmPassword) {
    if (password.value !== confirmPassword.value || password.value.trim() === "") {
        errorFunctionPassword();
        return false;
    } else {
        document.getElementById('confirmPassword').style.border = "1px solid lightgray";
        document.getElementById('password').style.border = "1px solid lightgray";
        document.getElementById('errorMessageConfirmPassword').innerHTML ="";
        return true;
    }
};

async function errorFunctionPassword() {
    document.getElementById('errorMessageConfirmPassword').innerHTML = /*html*/`
    <div class="errorText">Your passwords don't match. Please try again.</div>
    `;
    document.getElementById('confirmPassword').style.border = "1px solid red";
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

async function errorFunctionEmail() {
    document.getElementById('errorMessageEmail').innerHTML = /*html*/`
    <div class="errorText">please enter a valid email address</div>
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

async function clearData(password, confirmPassword) {
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
    console.log("User hinzugefügt:", result);

    window.location.href = "log-in.html?msg=You Signed up successfully"
};

