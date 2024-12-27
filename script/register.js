const BASE_URL = "https://join-gruppenarbeit-137ed-default-rtdb.europe-west1.firebasedatabase.app/"

async function addUser() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirmPassword");
    let userName = document.getElementById("user");
    let privacyPolicy = document.getElementById("privacyPolicy");


    checkPassword(password, confirmPassword);
    checkName(userName)
    checkPrivacyPolicy();

    if(password.value !== confirmPassword.value || privacyPolicy.checked != true){
        clearData(password, confirmPassword, privacyPolicy);
        return;
    };
    if(userName.value){
        clearData(userName);
        return;
    };

    let singleLogInData = {
        "email": email.value,
        "password": password.value
    };

    await updateUser(singleLogInData);

    

};

async function checkName(userName) {
    if (/\d/.test(userName.value) || userName.value.trim() === "" )  {
        errorFunctionName()
        checkPrivacyPolicy()
        return;
    } else{
        document.getElementById('confirmPassword').style.border =  "1px solid light-gray";
        document.getElementById('errorMessageConfirmPassword').innerHTML = "";
    }
};

async function errorFunctionName(){
    document.getElementById('errorMessageName').innerHTML= /*html*/`
     <div class="errorText">Your name cannot contain numbers.</div>
     `
     document.getElementById('user').style.border =  "1px solid red";
 }


async function checkPassword(password, confirmPassword) {
    if (password.value != confirmPassword.value) {
        errorFunctionRegister()
        checkPrivacyPolicy()
        return;
    } else{
        document.getElementById('confirmPassword').style.border =  "1px solid light-gray";
        document.getElementById('errorMessageConfirmPassword').innerHTML = "";
    }
};

async function errorFunctionRegister(){
   document.getElementById('errorMessageConfirmPassword').innerHTML= /*html*/`
    <div class="errorText">Your passwords don't match. Please try again.</div>
    `
    document.getElementById('confirmPassword').style.border =  "1px solid red";
}

async function checkPrivacyPolicy() {
    if (privacyPolicy.checked) {
        return;
    } else{
        document.getElementById('errorMessageprivacyPolicy').innerHTML= /*html*/`
        <div class="errorText">please check the privacy policy</div>
        `
        document.getElementById('privacyPolicy').style.border = "red";
    }
}

async function clearData(username, password, confirmPassword, privacyPolicy) {
    username.value ="";
    password.value = "";
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

