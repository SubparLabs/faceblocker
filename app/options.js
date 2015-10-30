// This script will ask for permissions for the user's the webcam in the options page, then pass those
// permissions over to background.js for persistent storage. A user should only have to do this once.
// See https://code.google.com/p/chromium/issues/detail?id=453150 for more info.

// Do the vendor prefix dance
navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

// Once user grants camera permissions, pass those permissions to the background page
function success(_stream) {
  console.log( "Camera opened successfully, stopping it now." );
  _stream.stop();
  console.log( "Requesting camera stream in the background page." );
  var bg = chrome.extension.getBackgroundPage();
  bg.requestMedia();
}

function failure(e) {
  console.log("Camera failed to open with error: " + e);
}

//  Check to see if the background page is already streaming. If not, request camera access from the user.
window.onload = function() {
  var bg = chrome.extension.getBackgroundPage();
  if( bg.stream != null ) {
    console.log("Background page is already streaming!")
  }
  else {
     navigator.getUserMedia({video: true, audio: false}, success, failure);
  }
};

//Test function. Grabs a feed from the WS server and displays it on the options page
function test() {
  var feeds = []
  var getNewFeed = function(targetId) {
      var ws = new WebSocket("ws://127.0.0.1:8000/feed");
      ws.onopen = function () {
          console.log("Opened a new connection to video feed");
      }
      ws.onmessage = function (msg) {
          var target = document.getElementById(targetId);
          url=window.URL.createObjectURL(msg.data);

          target.onload = function() {
              window.URL.revokeObjectURL(url);
          };
          target.src = url;
          console.log('received!')
      }
    }
  feeds.push(getNewFeed("target1"));
}

//Run test() when the user clicks the button
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('test_button').addEventListener('click', test);
})