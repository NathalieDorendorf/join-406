let overlayElement;
let closeAnimation;

/**
 * Opens an overlay with specified content and animations.
 * @param {string} HTMLContent - The HTML content to display in the overlay.
 * @param {string} closeAnimationClass - The CSS class for the closing animation.
 * @param {Function} [closeFunction=closeOverlay] - Function to handle closing the overlay.
 */
function openOverlay(HTMLContent, closeAnimationClass, closeFunction = closeOverlay) {
    closeAnimation = closeAnimationClass;
    overlayElement = getOverlayElement(HTMLContent);
    overlayElement.onclick = closeFunction;
    document.body.appendChild(overlayElement);
    overlayElement.firstElementChild.focus({ preventScroll: true });
}

/**
 * Closes the overlay, applying animations if specified.
 */
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

/**
 * Removes the overlay from the DOM.
 */
function removeOverlay() {
    document.body.removeChild(overlayElement);
}

/**
 * Creates and returns the overlay element.
 * @param {string} HTMLContent - The HTML content to embed inside the overlay.
 * @returns {HTMLElement} The constructed overlay element.
 */
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

/**
 * Handles keyboard input for the overlay, closing it on Escape key.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleOverlayInnerKeyInput(event) {
    if (event.key === "Escape") {
        overlayElement.click();
    }
}

let toastContainer;

/**
 * Provide toast messages
 */
document.addEventListener('DOMContentLoaded', initToastContainer = () => {
    document.body.insertAdjacentHTML('beforeend', `
            <div class="toast-container"></div>
            <style>
                .toast-container {
                    position: fixed;
                    width: 100%;
                    pointer-events: none;
                    bottom: 16px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: grid;
                    gap: 8px;
                    justify-items: center;
                    z-index: 100;
                }
                .toast {
                    padding: 16px 32px;
                    border-radius: 20px;
                    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
                    font-size: 16px;
                    font-weight: 500;
                    text-align: center;
                    animation: toastIt 4000ms cubic-bezier(0.785, 0.135, 0.15, 0.86) forwards;
                }
                @keyframes toastIt {
                    0%, 100% {
                        transform: translateY(+150%);
                        opacity: 0;
                    }
                    5%, 90% {
                        transform: translateY(0%);
                        opacity: 1;
                    }
                }
            </style>
        `);
    toastContainer = document.querySelector('.toast-container');
});

/**
 * Displays a toast message.
 * @param {Object} options - Configuration options for the toast message.
 * @param {string} options.message - The message to display.
 * @param {string} [options.backgroundColor='white'] - Background color of the toast.
 * @param {string} [options.color='black'] - Text color of the toast.
 */
function showToastMessage({
    message,
    backgroundColor = '#2A3647',
    color = 'white',
    onAnimationEnd = function () { }
}) {
    toastContainer.insertAdjacentHTML('beforeend',
        `<div class="toast" style="
            background-color: ${backgroundColor};
            color: ${color};
        ">
        ${message}</div>`
    );

    const toast = toastContainer.lastElementChild;
    toast.addEventListener('animationend', () => {
        toast.remove();
        onAnimationEnd();
    });
}

/**
 * Prevents form submission and allows Enter in textareas and inputs with keydown-eventhandler 'inputKeyHandler'
 * @param {HTMLFormElement} formElem - The form element to modify.
 */
function turnOffFormSubmission(formElem) {
    formElem.addEventListener('submit', (e) => e.preventDefault());
    formElem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.onkeydown !== inputKeyHandler) {
            e.preventDefault();
        }
    });
}

/**
 * Handles keyboard input for triggering actions on specific elements.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {HTMLElement} elem - The element to trigger the callback on.
 * @param {Function|string} [callbackFn='click'] - The callback function or event to trigger.
 */
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

/**
 * Displays an input error message if a condition is not met.
 * @param {HTMLElement} inputElement - The input element to display an error under
 * @param {string} message - The error message to display.
 * @param {Function} testToPassFn - Returns true, if the input passes the validation
 * @param {number} [marginBottomOfParent=0] - Margin adjustment for the error message if needed
 * @param {HTMLElement} [listenForChangeElem=inputElement] - if change-eventlistener can't be registered on inputElement, register here (e.g. hidden input, that is set via function call)
 * @returns {boolean} True if the input passes validation, false otherwise.
 */
function displayInputErrorMessage(inputElement, message, testToPassFn, marginBottomOfParent = 0, listenForChangeElem = inputElement) {
    if (!testToPassFn()) {
        if (!inputElement.parentElement.querySelector('.input-error-message')) {
            errorElemHTML = `<div class="input-error-message" style="margin-top: ${-marginBottomOfParent}px"><span>${message}</span></div>`;
            inputElement.insertAdjacentHTML('afterend', errorElemHTML);
            const errorElem = inputElement.parentElement.querySelector('.input-error-message');

            inputElement.classList.add('red-border');
            listenForChangeElem.addEventListener('change', () => {
                if (testToPassFn()) {
                    inputElement.classList.remove('red-border');
                    errorElem.remove();
                }
            });
        }
        return false;
    }
    return true;
}

/**
 * Adjusts the height of a textarea to match its content.
 * @param {string} id - The ID of the textarea.
 */
function adaptTextareaHeightToContent(id) {
    const textarea = document.getElementById(id);
    textarea.style.height = `${textarea.scrollHeight + 10}px`;
}

/**
 * Toggles the disabled state of a button and applies styling.
 * Do not immediately show not-allowed cursor - only when it takes more time to update in database than 200ms
 * @param {HTMLButtonElement} buttonElement - The button to toggle.
 */
function toggleButtonDisabled(buttonElement) {
    if (buttonElement) {
        buttonElement.disabled = !buttonElement.disabled;
        setTimeout(() => {
            if (buttonElement) {
                buttonElement.classList.toggle('button-disabled');
            }
        }, 200);
    }
}