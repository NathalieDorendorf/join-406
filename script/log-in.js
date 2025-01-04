
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

let userData = [];

function getInputData() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  logIn('/users', email, password)
}

if (msg) {
  messageBox.innerHTML = msg;
} else {
  messageBox.style.display = "none";
}

async function logIn(path, enteredEmail, enteredPassword) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();

  userData = Object.keys(responseToJson).map(key => (
    { id: key, ...responseToJson[key] }
  ));

  const matchingUser = userData.find(user => user.email === enteredEmail && user.password === enteredPassword);
  validateMatch(matchingUser)
};

function validateMatch(matchingUser) {
  if (matchingUser) {
    addToLocalStorage(login = true);
    window.location.href = "board.html?msg=you have logged in successfully"
  } else {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    checkLogin(email, password);
    clearLoginData(email, password);
  };
};

function checkLogin(email, password) {
  if (email || password) {
    document.getElementById('errorMessageLogin').innerHTML = /*html*/`
    <div class="errorText">Check your email and password. Please try again</div>
    `
    document.getElementById('email').style.border = "1px solid red";
    document.getElementById('password').style.border = "1px solid red";
  };
};

function clearLoginData(password) {
  password.value = "";
};

function addToLocalStorage(login) {
  localStorage.setItem("user_Logged_in", login)
}

function validateLoggin() {
  if (localStorage.getItem("user_Logged_in") === null) {
    console.log('storage is not set');
  } else {
    console.log('storage is set'); }
}

