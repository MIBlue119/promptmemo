// 監聽用戶點擊擴充程式圖示的事件
chrome.runtime.onInstalled.addListener(function() {
chrome.browserAction.onClicked.addListener(function() {
    // 獲取popup.html文件的URL
    var url = chrome.extension.getURL('popup.html');
    
    // 創建一個新的窗口
    chrome.windows.create({
      url: url,
      type: 'popup',
      width: 600,
      height: 400
    });
  });
});
  


document.addEventListener("DOMContentLoaded", function() {

 // Get the DOM elements we need
var promptInput = document.getElementById("promptInput");
var saveButton = document.getElementById("saveButton");
var clearButton = document.getElementById("clearButton");
var promptList = document.getElementById("promptList");

// Load the saved prompts from storage
var savedPrompts = [];
chrome.storage.sync.get({ prompts: [] }, function(data) {
  savedPrompts = data.prompts;
  renderPromptList(savedPrompts);
});

// Add an event listener to the "Save" button
saveButton.addEventListener("click", function() {
  var promptText = promptInput.value.trim();
  if (promptText !== "") {
    savedPrompts.push(promptText);
    chrome.storage.sync.set({ prompts: savedPrompts });
    renderPromptList(savedPrompts);
    promptInput.value = "";
  }
});

// Add an event listener to the "Clear" button
clearButton.addEventListener("click", function() {
  savedPrompts = [];
  chrome.storage.sync.set({ prompts: savedPrompts });
  renderPromptList(savedPrompts);
});

// Render the list of saved prompts
function renderPromptList(prompts) {
  promptList.innerHTML = "";
  prompts.forEach(function(promptText, index) {
    var promptItem = document.createElement("li");
    var promptContainer = document.createElement("div");
    promptContainer.className = "prompt";
    promptContainer.textContent = promptText;
    promptItem.appendChild(promptContainer);
    var copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.className = "copy-button";
    copyButton.addEventListener("click", function() {
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = promptText;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    });
    promptItem.appendChild(copyButton);
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function() {
      savedPrompts.splice(index, 1);
      chrome.storage.sync.set({ prompts: savedPrompts });
      renderPromptList(savedPrompts);
    });
    promptItem.appendChild(deleteButton);
    promptList.appendChild(promptItem);
  });
}


  
});
  