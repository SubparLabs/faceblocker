//Retrieve the user-selected ad replacement option from Chrome storage
var option = "";
chrome.storage.sync.get("selectedOption", function(data) {
    option = data.selectedOption;
    console.log("Ok, so you want me to replace all ads with " + option + "?")
  });

// Do the vendor prefix dance
navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

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
    window.stream = stream;
    var videoElements = document.getElementsByClassName('fckads');
    console.log(videoElements);
    for (i=0; i < videoElements.length; i++) {
        video = videoElements[i];
        video.src = window.URL.createObjectURL(stream);
        video.play();
    }
}

function replaceAdDivsWithVideoTag(document, divs) {
    for (i=0; i<divs.length; i++) {
        div = divs[i]
        console.log("Iterating over " + div.id);
        height = div.clientHeight;
        width = div.clientWidth;
        var video_dim = ""
        if (height < width) {
            video_dim = "width=" + width + "px";
        } else {            
            video_dim = "height=" + height + "px";
        }
      document.getElementById(divs[i].id).innerHTML = "<div style='height:" + height + "px;width:" + width + "px;border-style:solid;border-width:1px;overflow:hidden'><video muted autoplay class='fckads' style='object-fit:cover;'" + video_dim + "></video></div>";
    }

    if ("stream" in window) {
        console.log("Found existing video stream");
        showMedia(stream);
    } else {
        console.log("Didnt find existing video stream");
        navigator.getUserMedia({video: true, audio: false}, showMedia, errCallback);
    }
}

var feeds = [];

//Opens a new WS stream for a given img target
var getNewFeed = function(targetId) {
      var ws = new WebSocket("ws://127.0.0.1:8000/feed");
      ws.onopen = function () {
          console.log("Opened a new connection to video feed for target " + targetId);
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

function replaceAdDivsWithRandomVideo(document, divs) {
    for (i=0; i<divs.length; i++) {
            div = divs[i]
            console.log("Iterating over " + div.id);
            height = div.clientHeight;
            width = div.clientWidth;
            var video_dim = ""
            if (height < width) {
                video_dim = "width=" + width + "px";
            } else {            
                video_dim = "height=" + height + "px";
            }
          document.getElementById(divs[i].id).innerHTML = "<div style='height:" + height + "px;width:" + width + "px;border-style:solid;border-width:1px;overflow:hidden'><img id='target"+i+"' style='display:inline;object-fit:cover;'" + video_dim + " /></div>";
          feeds.push(getNewFeed("target" + i));
        }
    }

function replaceAdDivsWithCatImg(document, divs) {
    var replace_img = "http://1.bp.blogspot.com/-CzqzzBV2tMk/TxBM3ar18MI/AAAAAAAAPm0/6faLPO9BM8w/s1600/i-can-has-cheezburger.jpg";
    for (i=0; i<divs.length; i++) {
        div = divs[i]
        console.log("Iterating over " + div.id);
        height = div.clientHeight;
        width = div.clientWidth;
        document.getElementById(divs[i].id).innerHTML = "<a><img src=" + replace_img + " width=" + width + " height=" + height + "></img></a>";
    }
}

function replaceAdDivsWithYouTubeVideo(document, divs, src) {
    for (i=0; i<divs.length; i++) {
        div = divs[i]
        console.log("Iterating over " + div.id);
        height = div.clientHeight;
        width = div.clientWidth;
        document.getElementById(divs[i].id).innerHTML = "<iframe width=" + width + " height=" + height + "frameborder='0' allowfullscreen src=" + src + "></img></a>";
    }
}

function getAllGoogleAdsIframeDivs(document) {
    var slots = []
    var addivs = document.querySelectorAll("div[id^=google_ads_iframe]");
    for (i=0; i < addivs.length; i++) {
        slots.push(addivs[i].parentElement);
    }
    return slots;
}

function replaceAds(document, addivs, option) {
  console.log("Replacing all ads with " + option);
  if (option == "cat") {
    replaceAdDivsWithCatImg(document, addivs);
  }
  else if (option == "video") {
    replaceAdDivsWithVideoTag(document,addivs);
  }
  else if (option == "rickroll") {
    replaceAdDivsWithYouTubeVideo(document, addivs, "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1")
  }
  else if (option == "darude") { 
    replaceAdDivsWithYouTubeVideo(document, addivs, "https://www.youtube.com/embed/2HQaBWziYvY?autoplay=1")
  }
  else if (option == "random") { 
    replaceAdDivsWithRandomVideo(document, addivs);
  }
  else {
    console.log("Hmmm.... something went wrong here")
  }
}

function init(document) {
    /***
     * Need to do the setTimeout to:
     * 1) do the initial wait for ad code to load
     * TODO: Fix hacky polling to use MutationObserver
     * 2) poll every 2 seconds for 2 minutes to see if knew iframes have
     *    been added.
     * ad divs before we can discover them.
    ***/
    var main = function() {
        console.log("Finding Ad Divs");
        var addivs = getAllGoogleAdsIframeDivs(document);
        console.log(addivs);
        if (addivs.length > 0) {
            replaceAds(document, addivs, option);
        } else {
            console.log("Addivs is empty");
        }

        // Run Forever
        setTimeout(main, 2000);
    };
    setTimeout(main, 2000);
}

if (document instanceof HTMLDocument) {
    window.onload = init(document);
}
