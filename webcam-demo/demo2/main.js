// Do the vendor prefix dance
navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

var canvas = $("#canvas");
var ctx = canvas.get()[0].getContext('2d');
var timer;
var wsUp = new WebSocket("ws://127.0.0.1:8000/up");
wsUp.onopen = function () {
    console.log("Openened connection to websocket up");
}

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
feeds.push(getNewFeed("target2"));
feeds.push(getNewFeed("target3"));
feeds.push(getNewFeed("target4"));
feeds.push(getNewFeed("target5"));
feeds.push(getNewFeed("target6"));
feeds.push(getNewFeed("target7"));
feeds.push(getNewFeed("target8"));
feeds.push(getNewFeed("target9"));
feeds.push(getNewFeed("target10"));
feeds.push(getNewFeed("target11"));
feeds.push(getNewFeed("target12"));

//wsUp.onmessage = function (msg) {
//    console.log('sent');
//}



// Set up an error handler on the callback
var errCallback = function(e) {
  console.log('Did you just reject me?!', e);
};

// Request the user's media
function requestMedia(e) {
  e.preventDefault();

  // Use the vendor prefixed getUserMedia we set up above and request just video
  navigator.getUserMedia({video: true, audio: false}, showMedia, errCallback);
}

function showMedia(stream) {
  var videos = document.getElementsByTagName("video");
  console.log(videos)
  var video = document.getElementById('user-media');
  video.src = window.URL.createObjectURL(stream);
  timer = setInterval(function () {
      ctx.drawImage(video, 0, 0, 320, 240);
      var data = canvas.get()[0].toDataURL('image/jpeg', 1.0);
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

$(function() {
  $('#get-user-media').click(requestMedia);
});
