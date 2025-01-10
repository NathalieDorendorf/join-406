let overlayElement;
let closeAnimation;

function openOverlay(HTMLContent, closeAnimationClass, closeFunction = closeOverlay) {
    closeAnimation = closeAnimationClass;
    overlayElement = getOverlayElement(HTMLContent);
    overlayElement.onclick = closeFunction;
    document.body.appendChild(overlayElement);
    overlayElement.firstElementChild.focus({ preventScroll: true });
}

function closeOverlay() {
    if (document.getSelection().type !== 'Range') {
        if (closeAnimation) {
            overlayElement.classList.add('fade-out');
            overlayElement.firstElementChild.classList.add(closeAnimation);
            overlayElement.firstElementChild.addEventListener('animationcancel', removeOverlay);
            overlayElement.firstElementChild.addEventListener('animationend', removeOverlay);
        } else {
            removeOverlay();
        }
    }
}

function removeOverlay() {
    document.body.removeChild(overlayElement);
}

function getOverlayElement(HTMLContent) {
    const tempElem = document.createElement('div');
    tempElem.innerHTML = `<div id="overlay" class="overlay">${HTMLContent}</div>`;
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

document.addEventListener('DOMContentLoaded', initToastContainer = () => {
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
                    animation: toastIt 4000ms cubic-bezier(0.785, 0.135, 0.15, 0.86) forwards;
                }

                @keyframes toastIt {

                    0%,
                    100% {
                        transform: translateY(+150%);
                        opacity: 0;
                    }

                    5%,
                    90% {
                        transform: translateY(0%);
                        opacity: 1;
                    }
                }
            </style>
        `);
    toastContainer = document.querySelector('.toast-container');
});

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

function turnOffFormSubmission(formElem) {
    formElem.addEventListener('submit', (e) => e.preventDefault());
    formElem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.onkeydown !== inputKeyHandler) {
            e.preventDefault();
        }
    });
}

function inputKeyHandler(event, elem, callbackFn = 'click') {
    if (event.key === "Enter") {
        if (callbackFn === 'click') {
            elem.click();
        } else {
            callbackFn();
        }
        event.preventDefault();
    }
}

function displayInputErrorMessage(inputElement, message, testToPassFn, marginBottomOfParent = 0, listenForChangeElem = inputElement) {
    if (!testToPassFn()) {
        if (!inputElement.parentElement.querySelector('.input-error-message')) {
            errorElemHTML = `<div class="input-error-message" style="margin-top: ${-marginBottomOfParent}px"><span>${message}</span></div>`
            inputElement.insertAdjacentHTML('afterend', errorElemHTML);
            const errorElem = inputElement.parentElement.querySelector('.input-error-message');

            inputElement.classList.add('red-border');
            listenForChangeElem.addEventListener('change', () => {
                if (testToPassFn()) {
                    inputElement.classList.remove('red-border');
                    errorElem.remove();
                }
            })
        }
        return false;
    }
    return true;
}

function adaptTextareaHeightToContent(id) {
    const textarea = document.getElementById(id);
    textarea.style.height = `${textarea.scrollHeight + 10}px`;
}