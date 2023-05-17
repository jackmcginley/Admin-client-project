'use strict'

const promptSection = document.getElementById("promptSection");
let changesMade = false;
let initialPrompts = new Array();
let editedPrompts = new Array();

const populatePage = function(){
  // Fetch the array of prompts from the API then pass it to the render function
  getPrompts().then(prompts=> initialise(prompts));
}


async function getPrompts() {
  const res = await fetch('https://adminapi-jeu0.onrender.com/prompts');
  const response = await res.json();
  const promptsData = response["data"];
  const prompts = promptsData.promptsJson.prompts;
  return prompts;

}

populatePage();

const url = 'https://adminapi-jeu0.onrender.com/prompts.json'; // URL of the file to download
const filename = 'prompts.json'; // name of the file to save
async function getFile(){
    fetch(url)
   .then(response => response.blob())
    .then(blob => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  });
}
  


// function populatePage(){
//   // Fetch the array of prompts from the API then pass it to the render function
//   getPrompts().then(prompts=> initialise(prompts));
// }

function initialise(prompts){
  initialiseObjects(prompts);
  renderPrompts(prompts);
  renderBlankTopic(prompts[0], prompts.length);
}

function renderPrompts(prompts){
   for (let i=0; i<prompts.length; i++){
    const topic = prompts[i];
    renderTopic(topic, i);
  }
}

// Render the detail of each topic in the prompts array
function renderTopic(item, index){
  const itemEntries = Object.entries(item);
  const entryDiv = document.createElement("div");
  entryDiv.classList.add("w3-panel");
  entryDiv.classList.add("w3-display-container");
  const topicTitle = itemEntries[0][1];
  

  entryDiv.innerHTML = `<div class = "w3-bar"><button id = "button${index}" onclick="accordian(${index})" class="w3-btn w3-green w3-left-align w3-display-container" style = "width:85%">${topicTitle}</button><span onclick = "deleteTopic(${index})" class="w3-button w3-large w3-hover-red " title="Delete "><img src = "./images/icons8-delete-30.png"></span><span onclick = "saveTopic(${index})" class="w3-button w3-large w3-hover-light-green w3-display-topright" title="Save "><img src = "./images/icons8-save-32.png"></span></div>`;


  const accordianDiv = document.createElement("div");
  accordianDiv.classList.add("w3-container");
  accordianDiv.classList.add("w3-hide");
  accordianDiv.setAttribute("id", `${index}`);
  
  for (const entry of itemEntries){
    
    const entryLabel = document.createElement("label");
    entryLabel.innerHTML = `<b>${entry[0]}</b>`
    accordianDiv.appendChild(entryLabel);
    // Check if there are multiple values in the item
    if (typeof(entry[1]) == "object"){
      const arr = entry[1];
      const count = arr.length;
      for(let j=0; j<count; j++){
       
        const entryInput = document.createElement("input");
        entryInput.setAttribute("class", "w3-input w3-border w3-margin-bottom");
        entryInput.setAttribute("type", "text");
        entryInput.value = arr[j];
        accordianDiv.appendChild(entryInput);
      }
      // Add one extra input for additional question
      const entryInput = document.createElement("input");
      entryInput.setAttribute("class", "w3-input w3-border w3-margin-bottom");
      entryInput.setAttribute("type", "text");
      entryInput.setAttribute("placeholder", "Add an additional item here if needed");
      
      accordianDiv.appendChild(entryInput);
    } 
    else{
      if(entry[1].length <70){
        const entryInput = document.createElement("input");
        entryInput.setAttribute("class", "w3-input w3-border w3-margin-bottom");
        entryInput.setAttribute("type", "text");
        entryInput.value = entry[1];
        accordianDiv.appendChild(entryInput);
      } else{
        const entryInput = document.createElement("textarea");
        entryInput.setAttribute("class", "w3-input w3-border w3-margin-bottom");
        entryInput.setAttribute("rows", "5");
        entryInput.setAttribute("cols", "70");
        entryInput.value = entry[1];
        accordianDiv.appendChild(entryInput);
      }
    }
  }
    entryDiv.appendChild(accordianDiv);
    promptSection.appendChild(entryDiv);
}

// Render a  blank section to add a new topic if needed
function renderBlankTopic(item, index){
  const itemEntries = Object.entries(item);
  const entryDiv = document.createElement("div");
  entryDiv.classList.add("w3-panel");
  entryDiv.classList.add("w3-display-container");
  // entryDiv.setAttribute("id", "addedtopic");
  entryDiv.innerHTML = `<div class = "w3-bar"><button id = "addedtopic" onclick="accordian(${index})" class="w3-btn  w3-green w3-left-align w3-display-container" style = "width:85%">Add new topic if required</button><span id = "addicon" onclick = "addTopic(${index})" class="w3-button w3-large w3-hover-light-green w3-display-topright" title="Add "><img src = "./images/icons8-add-32.png"></span></div>`;
  const accordianDiv = document.createElement("div");
  accordianDiv.classList.add("w3-container");
  accordianDiv.classList.add("w3-hide");
  accordianDiv.setAttribute("id", `${index}`);
  for (const entry of itemEntries){
    const entryLabel = document.createElement("label");
    entryLabel.innerHTML = `<b>${entry[0]}</b>`
    
    accordianDiv.appendChild(entryLabel);
    // Check if there are multiple values in the item
    if (typeof(entry[1]) == "object"){
      const arr = entry[1];
      const count = arr.length;
      for(let j=0; j<count; j++){
       
        const entryInput = document.createElement("input");
        entryInput.setAttribute("class", "w3-input w3-border w3-margin-bottom");
        entryInput.setAttribute("type", "text");
        if(j===0){
          entryInput.setAttribute("placeholder", "Required");
        }
        entryInput.value = "";
        accordianDiv.appendChild(entryInput);
      }
      
    } 
    else{
      if(entry[1].length <70){
        const entryInput = document.createElement("input");
        entryInput.setAttribute("class", "w3-input w3-border w3-margin-bottom");
        entryInput.setAttribute("type", "text");
        entryInput.setAttribute("placeholder", "Required");
        entryInput.value = "";
        accordianDiv.appendChild(entryInput);
      } else{
        const entryInput = document.createElement("textarea");
        entryInput.setAttribute("class", "w3-input w3-border w3-margin-bottom");
        entryInput.setAttribute("rows", "5");
        entryInput.setAttribute("cols", "70");
        entryInput.setAttribute("placeholder", "Required.  Refer to existing topics for the use of { } syntax to include the user's inputs in this text.");
        entryInput.value = "";
        accordianDiv.appendChild(entryInput);
      }
    }
  }
    entryDiv.appendChild(accordianDiv);
    promptSection.appendChild(entryDiv);
}

function accordian(id) {
  let x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else { 
    x.className = x.className.replace(" w3-show", "");
  }
}

// function to create the objects holding the original set of prompts, and the edited set
function initialiseObjects(prompts){
  initialPrompts = prompts;
  // this techique using JSON is used to ensure the editedPrompts array is not pointing to the same address as the initialPrompts, so they can be edited independently
  editedPrompts = JSON.parse(JSON.stringify(prompts));
}

function saveTopic(index){
  changesMade = true;
  const uploadButton = document.getElementById("upload");
  uploadButton.className += "w3-show";
  document.getElementById(`button${index}`).classList.add("w3-orange");
  buildPrompt(index);
  
}
function addTopic(ind){
  if (!validateNewTopic(ind)){
    alert("validation failed - mandatory field is empty");
  }
  else{
    const index = editedPrompts.length
    editedPrompts.push({});
    buildPrompt(index);
    changesMade = true;
    document.getElementById("addicon").remove();
    const addBar = document.getElementById("addedtopic");
    addBar.classList.add("w3-orange");
    addBar.innerText = editedPrompts[editedPrompts.length -1]["topic"];
    addBar.insertAdjacentHTML("afterend", `<span onclick = "deleteTopic(${index})" class="w3-button w3-large w3-hover-red " title="Delete "><img src = "./images/icons8-delete-30.png"></span><span onclick = "saveTopic(${index})" class="w3-button w3-large w3-hover-light-green w3-display-topright" title="Save "><img src = "./images/icons8-save-32.png"></span>`);
  

    const uploadButton = document.getElementById("upload");
    uploadButton.className += "w3-show";
  }
}

function validateNewTopic(ind){
  let valid = true;
  const topicDiv = document.getElementById(ind);
  const labels = topicDiv.getElementsByTagName("label");
  for (const lbl of labels){
    const nextElement = lbl.nextElementSibling;
    if(!nextElement.value) valid = false;
      }
  return valid;
}

function buildPrompt(index){
  const buildObject = {};
  const topicDiv = document.getElementById(index);
  const labels = topicDiv.getElementsByTagName("label");
  for (const lbl of labels){
    const key = lbl.innerText;
    const nextElement = lbl.nextElementSibling;
    if (nextElement.nextElementSibling.tagName.toLowerCase() ==="label"){
      // this is a single field
      const val = nextElement.value.toString();
      editedPrompts[index][key] = val.toString();
      buildObject[key] = val;
    }else {
      let vals = [];
      let thisElement = nextElement;
      
      while (thisElement.tagName.toLowerCase() !=="label"){
        if (thisElement.value) vals.push(thisElement.value);
        thisElement = thisElement.nextElementSibling;
        // check if this is the last sibling in the DOM section
        if(!thisElement) break;
      }
    
      editedPrompts[index][key] = vals;
      buildObject[key] = vals;
    }

  }
}

function uploadChanges(){
  const editedFile = {};
  editedFile.date = Date();
  editedFile.changelog = "log of changes";
  editedFile.prompts = editedPrompts;
  postJSON(editedFile);

}

async function postJSON(data) {
  try {
    const response = await fetch('https://adminapi-jeu0.onrender.com/prompts', {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.status==="success"){
    alert ("Changes have been saved. \nBrowser will refresh and display the new data.")
    location.reload();
    }
  } catch (error) {
    alert(`A problem occured while saving the data.  Please retry.  Error received ${error}`)
    console.error("Error:", error);
  }
}

function deleteTopic(index){
  if(confirm("Are you sure you want to delete this topic?")){
    editedPrompts.splice(index,1);
    promptSection.innerHTML = '';
    renderPrompts(editedPrompts);
    renderBlankTopic(initialPrompts[0], editedPrompts.length);
    const uploadButton = document.getElementById("upload");
    uploadButton.className += "w3-show";
  } 
}

