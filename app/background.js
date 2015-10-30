// Do the vendor prefix dance
navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

stream = null;

//setup canvas for video capture
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var timer;

//open websocket connection
var wsUp = new WebSocket("ws://127.0.0.1:8000/up");
wsUp.onopen = function () {
    console.log("Connected to websocket up");
}

// Set up an error handler on the getUserMedia callback
var errCallback = function(e) {
  console.log("Camera failed to open with error: " + e);
};

// Request the user's media
function requestMedia(e) {   
  
  // Use the vendor prefixed getUserMedia we set up above and request just video
  navigator.getUserMedia({video: true, audio: false}, showMedia, errCallback);
}

function showMedia(_stream) {
  stream = _stream; // just to keep camera alive
  console.log("Great Stream Success");
  var videos = document.getElementsByTagName("video");
  console.log(videos)
  var video = document.getElementById('user-media');
  video.src = window.URL.createObjectURL(stream);
  timer = setInterval(function () {
      ctx.drawImage(video, 0, 0, 320, 240);
      var data = canvas.toDataURL('image/jpeg', 1.0);
      newblob = dataURItoBlob(data);
      wsUp.send(newblob);
  }, 100);
  video.onloadedmetadata = function(e) {
    console.log('Locked and loaded.');
  };
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

//start streaming on load
window.onload = function() {
   requestMedia();
 } 