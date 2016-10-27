chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({


    code: `

    var elems = document.getElementsByTagName("body");
    var switchto = prompt("Change My Cursor says... what URL should we use? (Leaving an invalid URL OR ONE THAT IS LARGER THAN 32x32px will switch your cursor to default.)");

if(switchto == null || switchto == "" || switchto == " "){
  alert("Change My Cursor says...No URL specified, using a pre-chosen image.");
  switchto = "http://icons.iconarchive.com/icons/iconsmind/outline/128/Cursor-icon.png";
}

    for(var i = 0; i < elems.length; i++){
      elems[i].style.cursor = "url(" + switchto + "), default";
      elems[i].style.zIndex = "99999";
//      alert("we changed, " + elems[i].innerHTML);

    }



`
  });
});
