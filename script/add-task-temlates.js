function contactsTemlates(value, name ,initials,cssClass) {
   return ` 
<label for="one">
  <input type="checkbox" name="assigned" id="${value}" value="${value}" /><div class="name-patch">${name}
  <div style="background-color: var(${cssClass});" class="patch">${initials}</div></div></label
>
`
}