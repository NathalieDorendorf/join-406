let overlayElement;

function showToastMessage(message) {
    alert(message);
}

function openOverlay(HTMLContent) {
    overlayElement = getOverlayElement(HTMLContent);
    document.body.appendChild(overlayElement);
}

function closeOverlay() {
    if (document.getSelection().type !== 'Range') {
        document.body.removeChild(overlayElement);
    }
}

function getOverlayElement(HTMLContent) {
    const tempElem = document.createElement('div');
    const overlayInner = tempElem.firstElementChild;
    tempElem.innerHTML = `
        <div id="overlay" class="overlay" onclick="closeOverlay()">${HTMLContent}</div>
    `;
    overlayInner.tabindex = 0;
    overlayInner.onclick = (event) => event.stopPropagation();
    overlayInner.onkeydown = (event) => handleOverlayInnerKeyInput(event);
    return overlayInner;
}

function handleOverlayInnerKeyInput(event) {
    if (event.key === "Escape") {
        closeOverlay();
    }
}