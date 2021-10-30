let myLinks = [];
let myLinksFolder = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");
const folderBtn = document.getElementById("folder-btn");

//**** before page is fully loaded, list is not yet available
alert(
  "Before page load found " +
    document.querySelectorAll(".accordion-btn").length +
    " 'accordion-btn'"
);

//**** after page has fully loadded, list is available.
window.onload = function () {
  alert(
    "After page loaded found: " +
      document.querySelectorAll(".accordion-btn").length +
      " 'accordion-btn'"
  );

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
      folderItems += `<li>
            <div class="accordion">
                <button type="button" class="accordion-btn">
                  ${folder[i]}
                </button> 
                <div class="folder-links">
                    <p>rstdrstdrsd</p>
                </div>
              </div> 
          </li>`;
    }
  }
  if (leads) {
    for (let i = 0; i < leads.length; i++) {
      listItems += `<li>
              <a target= '_blank' href= '${leads[i]}'>
                ${leads[i]} 
              </a>
          </li>`;
    }
  }
  ulEl.innerHTML = folderItems + listItems;
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
