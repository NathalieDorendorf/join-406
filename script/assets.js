let overlayElement;

function openOverlay(HTMLContent) {
    overlayElement = getOverlayElement(HTMLContent);
    document.body.appendChild(overlayElement);
    overlayElement.firstElementChild.focus();
}

function closeOverlay() {
    if (document.getSelection().type !== 'Range') {
        document.body.removeChild(overlayElement);
    }
}

function getOverlayElement(HTMLContent) {
    const tempElem = document.createElement('div');
    tempElem.innerHTML = `
    <div id="overlay" class="overlay" onclick="closeOverlay()">${HTMLContent}</div>
    `;
    const overlay = tempElem.firstElementChild;
    const overlayInner = overlay.firstElementChild;
    overlayInner.tabIndex = -1;
    overlayInner.onclick = (event) => event.stopPropagation();
    overlayInner.onkeydown = (event) => handleOverlayInnerKeyInput(event);
    return overlay;
}

function handleOverlayInnerKeyInput(event) {
    if (event.key === "Escape") {
        closeOverlay();
    }
}

let toastContainer;

(function initToastContainer() {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="toast-container"></div>
            <style>
                .toast-container {
                    position: fixed;
                    bottom: 16px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: grid;
                    gap: 8px;
                    justify-items: center;
                    z-index: 100;
                }

                .toast {
                    padding: 8px 16px;
                    border-radius: 32px;
                    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
                    font-size: 16px;
                    font-weight: 500;
                    animation: toastIt 5000ms cubic-bezier(0.785, 0.135, 0.15, 0.86) forwards;
                }

                @keyframes toastIt {

                    0%,
                    100% {
                        transform: translateY(+150%);
                        opacity: 0;
                    }

                    10%,
                    90% {
                        transform: translateY(0%);
                        opacity: 1;
                    }
                }
            </style>
        `);
        toastContainer = document.querySelector('.toast-container');
    });
})();

function showToastMessage({
    message,
    backgroundColor = 'white',
    color = 'black'
}) {
    toastContainer.insertAdjacentHTML('beforeend',
        `<div class="toast" style="
            background-color: ${backgroundColor};
            color: ${color};
        ">
        ${message}</div>`
    );

    const toast = toastContainer.lastElementChild;
    toast.addEventListener('animationend', () => toast.remove());
}