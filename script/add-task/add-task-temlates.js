function contactsTemlates(renderArry, index) {
    return ` 
   
  <div >
    <label  class ="checkbox-content">
    <div class="custom-checkbox">
  <img  id ="${renderArry[index].id}"
    src="/assets/icons/check-button-unchecked.svg" 
    alt="Unchecked" 
    class="unchecked"
  />
   </div>
  <input type="checkbox" 
  value = "${renderArry[index].id}" 
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

function renderList(indexSubtask) {
    return `
 
  <li ondblclick="edit('${indexSubtask}');" >
    <div class="flex-row list-container"> <span class="task-text">${subtask[indexSubtask].title}</span>
      <div class="option-container flex-row gab8px">
        <img onclick="delet(${indexSubtask})" src="/assets/icons/delete-blue.svg" alt="delet" />
        <div class="form-middle"></div>
  <img onclick="edit('${indexSubtask}'); hide()" src="/assets/icons/edit-blue.svg" alt="Bearbeiten" />

      </div>
    </div>
  </li>
  
  `;
}




function renderBadge(color, initials) {
    return `
  <div style="background-color: var(${color});" class="badge margin0">${initials}</div>
  
  `;
}
