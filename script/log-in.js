const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

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
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();

    const matchingUser = Object.values(responseToJson).find(user =>
      user.email === enteredEmail && user.password === enteredPassword
    );
    validateMatch(matchingUser);
  } catch (error) {
    console.error("Fehler beim Login:", error);
  };
};


function validateMatch(matchingUser) {
  if (matchingUser) {
    addToSessionStorage(login = true);
    window.location.href = "summary.html?msg=you have logged in successfully&isLoggedIn=true"
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

function addToSessionStorage(login) {
  sessionStorage.setItem("isLoggedIn", JSON.stringify(login))
};

