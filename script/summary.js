function renderGreeting(userName = null) {
    const greeting = userName 
        ? `<h5>Good Morning,</h5><span class="user-name">${userName}</span>` 
        : "<h5>Good Morning</h5>";
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        console.log(greeting);
        greetingElement.innerHTML = greeting;
    }
    console.log(greeting);
    return greeting;
}

const userName = "Sophie Müller";
renderGreeting(userName);
