document.addEventListener("DOMContentLoaded", async () => {
    await includeHTML();
    document.body.style.visibility = 'visible';
    paintActiveLink();
});

async function includeHTML() {
    const elements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const file = el.getAttribute("w3-include-html");
        if (file) {
            try {
                const response = await fetch(file);
                let content;
                if (response.ok) {
                    content = await response.text();
                } else {
                    throw new Error("File not found");
                }
                el.innerHTML = content;
                el.removeAttribute("w3-include-html");
            } catch (error) {
                console.error(error);
            }
        }
    }
}

function paintActiveLink() {
    const currentUrl = window.location.pathname;
    const links = document.querySelectorAll('.links-container a');

    links.forEach(link => {
        if (link.getAttribute('href') === currentUrl) {
            link.classList.add('current');
        }
    });
}

function goBackToPreviousPage() {
    window.history.back();
}

function toggleUserMenu() {
    let userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('visible');
    userMenu.classList.toggle('hidden');
}

