const selectedContacts = [];

function toggleSelectContacts(customSelectElem) {
    const assignToBox = document.getElementById('contacts-box');
    assignToBox.onclick = (e) => e.stopPropagation();
    const renderedContactOptions = renderForAll(Object.entries(allData.contacts), renderContactOption);
    assignToBox.innerHTML = renderedContactOptions;
    toggleCustomSelectBackground(customSelectElem, 'rgb(245, 245, 245)');
    toggleAssignToBox(assignToBox);
}

function toggleCustomSelectBackground(customSelectElem, backgroundColor = 'white') {
    if (!document.querySelector('.cover-custom-select')) {
        const coverCustomSelect = document.createElement('div');
        coverCustomSelect.classList.add('cover-custom-select');
        coverCustomSelect.style.backgroundColor = backgroundColor;
        customSelectElem.insertAdjacentElement('afterend', coverCustomSelect);
    } else {
        document.querySelector('.cover-custom-select').remove();
    }
}

function toggleAssignToBox(assignToBox) {
    assignToBox.classList.toggle('dni');
    document.getElementById('ato').addEventListener('click', () => {
        toggleSelectContacts()
    })
}

function renderContactOption(contactEntry, index) {
    contactId = contactEntry[0];
    contactValue = contactEntry[1];
    return `
        <div class="fr ac gap-16 assigend-to-contact" onclick="selectContact(this, '${contactId}')" tabindex="0">
            ${renderContactTag(contactId)}
            <span>${contactValue.name}</span>
            ${renderContactBoxCheckbox(contactId)}
        </div>
    `
}

function renderContactBoxCheckbox(contactId) {
    const svgPath = 'unchecked';
    return `
        <img src="/assets/icons/check-button-${svgPath}.svg" alt="${svgPath} button">
    `
}

function selectContact(contactOptionElem, contactId) {
    contactOptionElem.classList.toggle('selected');
}

function openSelectSubtasks() {

}