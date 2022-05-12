
window.onload = generateElements;

function changeCursor(cursor) {
  const elems = document.body.getElementsByTagName("*");
  for(const i of elems){
    i.style.cursor = "url(" + cursor + "), default";
  }
}

function generateElements(){
  console.log("Generating elements")
  const defaultCursors = [
    "img/among_us.png",
    "img/cat.png",
    "img/saber.png",
  ].map(i => chrome.runtime.getURL(i));

  const cursors = defaultCursors;
  
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
  
    document.getElementById("grid").appendChild(img);
  }
}
