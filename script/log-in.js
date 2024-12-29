
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

let userData = [];



function getInputData() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  console.log(email, password);
  logIn('/users', email, password)
}

if (msg) {
  messageBox.innerHTML = msg;
} else {
  // display: none;
  messageBox.style.display = "none";
}

// infos auf dataBase holen
async function logIn(path, enteredEmail, enteredPassword) {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();

  userData = Object.keys(responseToJson).map(key => (
    { id: key, ...responseToJson[key] }
  ));

  const matchingUser = userData.find(user => user.email === enteredEmail && user.password === enteredPassword);
  validateMatch(matchingUser)
};

async function validateMatch(matchingUser) {
  if (matchingUser) {
    console.log('User gefunden');
  } else {
    console.log('User nicht gefunden');
  };
}

