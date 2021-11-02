let myLinks = [];
let myLinksFolder = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("folderUl-el");
const folderUlEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");
const folderBtn = document.getElementById("folder-btn");
const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container");
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const searchBox = document.querySelector(".search-box input");

const optionsList = document.querySelectorAll(".option");

draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});

containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

//**** after page has fully loadded, list is available.
window.onload = function () {
  ///for all ".accordion", there are event listeners
  document.querySelectorAll(".accordion-btn").forEach((button) => {
    button.addEventListener("click", () => {
      ///var set to div which is set to maxheight=0
      const folderLinks = button.nextElementSibling;

      //toggle activate state
      button.classList.toggle("accordion-btn:active");

      //if active, text visible, else not
      if (button.classList.contains("accordion-btn:active")) {
        folderLinks.style.maxHeight = folderLinks.scrollHeight + "px";
      } else {
        folderLinks.style.maxHeight = 0;
      }
    });
  });
};

///string from local storage is turned back into an array
const linksFromLocalStorage = JSON.parse(localStorage.getItem("links"));
const linksFolderFromLocalStorage = JSON.parse(
  localStorage.getItem("linksFolder")
);

///when the browser is reset, this will be the first to run. If the storage isnt empty, it will call render to render all from local storage
if (linksFromLocalStorage || linksFolderFromLocalStorage) {
  myLinks = linksFromLocalStorage;
  myLinksFolder = linksFolderFromLocalStorage;

  render(myLinks, myLinksFolder);
}

//on tab button click, function selects active window on current and sends arg to be pushed into myLinks array and turned into string to be stored in local and render out tab with render() invocation
tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLinks.push(tabs[0].url);
    localStorage.setItem("links", JSON.stringify(myLinks));
    render(myLinks, myLinksFolder);
  });
});

//render() iterates through the array which all the links/folders are pushed, and for every item creates a li and link/folder and stores them in another array. This array is then written into the html
function render(leads, folder) {
  let listItems = "";
  let folderItems = "";
  if (folder) {
    for (let i = 0; i < folder.length; i++) {
      folderItems += `<li class="draggable" draggable="true">
            <div class="accordion">
                <button class="accordion-btn" type="button">
                  ${folder[i]}
                </button> 
                <div class="folder-links container">
                    <p class="draggable" draggable="true">rstdrstdrsd</p>
                </div>
              </div> 
          </li>`;
    }
  }
  if (leads) {
    for (let i = 0; i < leads.length; i++) {
      listItems += `
          <li class="draggable" draggable="true">
              <a class="draggable" draggable="true" target= '_blank' href= '${leads[i]}'>
                ${leads[i]} 
              </a>
          </li>
        `;
    }
  }
  folderUlEl.innerHTML = folderItems;
  ulEl.innerHTML = listItems;
}

///Sets myLinks array to empty string and invokes render to render empy string, clearing
deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  myLinks = [];
  myLinksFolder = [];
  render(myLinks, myLinksFolder);
});

//if the save input button is pressed, then invoke function
inputBtn.addEventListener("click", function () {
  //this function pushes the value of the input into an array then clears the field
  myLinks.push(inputEl.value);
  inputEl.value = "";
  ///this stores the array in the local storage as a string then calls render leads
  localStorage.setItem("links", JSON.stringify(myLinks));

  render(myLinks, myLinksFolder);
});

folderBtn.addEventListener("click", function () {
  //this function pushes the value of the input into an array then clears the field
  myLinksFolder.push(inputEl.value);
  inputEl.value = "";
  ///this stores the array in the local storage as a string then calls render leads
  localStorage.setItem("linksFolder", JSON.stringify(myLinksFolder));

  render(myLinks, myLinksFolder);
});

selected.addEventListener("click", () => {
  optionsContainer.classList.toggle("active");

  searchBox.value = "";
  filterList("");

  if (optionsContainer.classList.contains("active")) {
    searchBox.focus();
  }
});

//each one is defined by o
optionsList.forEach((o) => {
  o.addEventListener("click", () => {
    selected.innerHTML = o.querySelector("label").innerHTML;
    optionsContainer.classList.remove("active");
  });
});

///keyup whenever key is released, so whenever someone starts typing
//function gets value of the searchbox and passes to filterList
searchBox.addEventListener("keyup", function (e) {
  filterList(e.target.value);
});

const filterList = (searchTerm) => {
  searchTerm = searchTerm.toLowerCase();
  optionsList.forEach((option) => {
    let label =
      option.firstElementChild.nextElementSibling.innerText.toLowerCase();
    if (label.indexOf(searchTerm) != -1) {
      option.style.display = "block";
    } else {
      option.style.display = "none";
    }
  });
};
