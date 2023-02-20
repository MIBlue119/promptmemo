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
  


let prompts = [];

function loadPrompts() {
  chrome.storage.sync.get("prompts", function (data) {
    prompts = data.prompts || [];
    renderPromptList();
    renderTagOptions();
  });
}

function savePrompts() {
  chrome.storage.sync.set({ prompts });
}

function addPrompt(promptText, tag) {
  const prompt = { text: promptText, tag: tag };
  prompts.push(prompt);
  savePrompts();
}

function deletePrompt(prompt) {
  prompts = prompts.filter((p) => p !== prompt);
  savePrompts();
}

function copyPrompt(prompt) {
  const input = document.createElement("input");
  input.value = prompt.text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

function renderPromptList() {
  const promptList = document.getElementById("prompt-list");
  promptList.innerHTML = "";

  const filteredPrompts = filterPrompts(prompts);

  for (let i = 0; i < filteredPrompts.length; i++) {
    const prompt = filteredPrompts[i];

    const li = document.createElement("li");
    const div = document.createElement("div");
    const tagLabel = document.createElement("div");
    const copyButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    div.classList.add("prompt");
    tagLabel.classList.add("tag-label");
    copyButton.classList.add("copy-button");
    deleteButton.classList.add("delete-button");

    div.textContent = prompt.text;
    tagLabel.textContent = prompt.tag;
    copyButton.textContent = "Copy";
    deleteButton.textContent = "Delete";

    copyButton.addEventListener("click", function () {
      copyPrompt(prompt);
    });

    deleteButton.addEventListener("click", function () {
      deletePrompt(prompt);
      renderPromptList();
    });

    li.appendChild(div);
    li.appendChild(tagLabel);
    li.appendChild(copyButton);
    li.appendChild(deleteButton);

    promptList.appendChild(li);
  }
}

function renderTagOptions(prompts) {
  const tagSet = new Set(['Program']); // add a default tag here
  if (prompts) {
    prompts.forEach(prompt => {
      tagSet.add(prompt.tag);
    });
  }
  const tagSelect = document.getElementById('tag-select');
  tagSelect.innerHTML = '';
  tagSet.forEach(tag => {
    const option = document.createElement('option');
    option.text = tag;
    tagSelect.add(option);
  });
  // add some extra tags for the user to choose
  const extraTags = ['Write', 'Art', 'Work', 'Advertise', 'Lang'];
  extraTags.forEach(tag => {
    const option = document.createElement('option');
    option.text = tag;
    tagSelect.add(option);
  });
}



function getUniqueTags(prompts) {
  const tags = [];

  for (let i = 0; i < prompts.length; i++) {
    const tag = prompts[i].tag;
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  }

  return tags;
}

function filterPrompts(prompts) {
  const tagFilter = document.getElementById("tag-filter").value.toLowerCase();
  const filteredPrompts = prompts.filter((prompt) =>
    prompt.tag.toLowerCase().includes(tagFilter)
  );
  return filteredPrompts;
}

document.addEventListener("DOMContentLoaded", function () {
  loadPrompts();

  const saveButton = document.getElementById("save-button");
  saveButton.addEventListener("click", function () {
    const promptInput = document.getElementById("prompt-input");
    const tagSelect = document.getElementById("tag-select");
    const promptText = promptInput.value;
    const tag = tagSelect.value;
    addPrompt(promptText, tag);
    promptInput.value = "";
    renderPromptList();
    renderTagOptions();
  });

  const tagFilter = document.getElementById("tag-filter");
  tagFilter.addEventListener("input", function () {
    renderPromptList();
  });
});
