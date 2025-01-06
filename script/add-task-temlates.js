function contactsTemlates(renderArry, index) {
  return ` 
   
  <div >
    <label class ="checkbox-content">
    <div class="custom-checkbox">
  <img  id ="${renderArry[index].id}"
    src="/assets/icons/check-button-unchecked.svg" 
    alt="Unchecked" 
    class="unchecked"
  />
   </div>
  <input type="checkbox" 
  value = "${renderArry[index].id}'" 
  name="assignedTo"
  id = "${renderArry[index].id}" 
  onchange="checkt(event, '${renderArry[index].initials}', '${renderArry[index].color}','${renderArry[index].id}')"/>
  <div class="name-badge">${renderArry[index].name}
  <div style="background-color: var(${renderArry[index].color});" class="badge">${renderArry[index].initials}</div>
  </div>

  </label>
  
  </div>

`;
}



function renderBadge(color,initials) {
  return `
  <div style="background-color: var(${color});" class="badge margin0">${initials}</div>
  
  `;
}
