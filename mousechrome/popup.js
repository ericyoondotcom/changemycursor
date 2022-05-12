
window.onload = () => {
  generateElements();
  registerCallbacks();
};

const defaultCursors = [
  "img/among_us.png",
  "img/cat.png",
  "img/saber.png",
];

function changeCursor(cursor) {
  const elems = document.body.getElementsByTagName("*");
  for(const i of elems){
    i.style.cursor = "url(" + cursor + "), default";
  }
}

function generateElements(){
  chrome.storage.sync.get({
    cursors: []
  }, (data) => {
    const cursors = defaultCursors
      .map(i => chrome.runtime.getURL(i))
      .concat(data.cursors);

    const grid = document.getElementById("grid");
    while(grid.firstChild) grid.removeChild(grid.firstChild);

    for(let cursor of cursors) {
      const img = document.createElement("img");
      img.src = cursor;
    
      img.onclick = () => {
        
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          var currTab = tabs[0];
          if (!currTab) return;
          chrome.scripting.executeScript({
            target: {
              tabId: currTab.id
            },
            func: changeCursor,
            args: [cursor]
          });
        });      
      }
      grid.appendChild(img);
    }
  });
}

function registerCallbacks() {
  document.getElementById("submit").onclick = onSubmitClicked;
}

function onSubmitClicked(){
  const input = document.getElementById("url").value;
  if(!isValidHttpUrl(input)) {
    alert("Image URL is not valid! Please enter the URL to an acceptable image type.");
    return;
  }
  if(!isValidImage(input)) {
    alert("The URL specified is not an image. Acceptable types: jpg, gif, png");
    return;
  }
  getImageWidthHeight(input).then((width, height) => {
    if(width > 32 || height > 32) {
      alert("The image specified must be smaller than 32x32 pixels.");
      return;
    }

    chrome.storage.sync.get({
      cursors: []
    }, (data) => {
      data.cursors.push(input);
      chrome.storage.sync.set({
        cursors: data.cursors
      }, () => {
        generateElements();
      })
    });
  });
}

function getImageWidthHeight(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", function() {
      resolve(this.naturalWidth, this.naturalHeight);
    });
    img.src = url;
  });
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function isValidImage(url) {
  return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}