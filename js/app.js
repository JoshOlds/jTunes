
var audioArr = []; //Array of audio elements... glocal!

//Do Not Modify the getMusic function
function getMusic(event) {
  event.preventDefault();
  var artist = document.getElementById('artist').value;
  itunes.getMusicByArtist(artist).then(drawSongs);
}

function drawSongs(songList) {
  console.log(songList);

  template = '';
  count = 0;

  if (songList.length == 0) {
    template = `
      <div class="column small-12">
        <h1 class="j-tunes">No Tracks Found!</h1>
      </div>`
  }
  else {

    songList.forEach(function (item) {
      if (item !== undefined) {
        var price = item.price.toFixed(2);
        var collection = item.collection;
        if(collection === undefined){collection = ""};
        var title = item.title;
        if(title === undefined){title = ""};


        item.albumArt = swapUrlSize(item.albumArt, 400);
        template += `
    <div class="small-12 large-4 column card-container">
      <div class="row card-contents text-center align-center">
        <div class="play-container">
          <img class="album-art" src="${item.albumArt}"
            alt="${item.collection} album image">
          <div class="play">
            <div class="loader">Loading...</div>
            <audio src="${item.preview}" id="audio${count}">
            </audio>
          </div>
        </div>
        <div class="small-12 column align-self-top">
          <h4>${item.title}</h4>
          <h5>${item.collection}</h5>
        </div>
        <div class="small-12 column align-self-bottom">
          <a class="button success" target="_blank" href="${item.link}"><strong class="button-text">$${item.price} - Buy Now!</strong></a>
        </div>
      </div>
    </div>`

        count++;
      }

    });
  }

  var songSpace = document.getElementById("song-space");
  songSpace.innerHTML = template;

  var audio = require('audio'); //Wonky way to create audio components... not sure if this is good or bad lol
  for (var i = 0; i < 50; i++) {
    var el = document.getElementById('audio' + i);
    var temp = audio(el);
    audioArr.push(temp);
  }
}

function swapUrlSize(url, pixels) {
  sizeString = `${pixels}x${pixels}`;
  var newURL = url.replace("60x60", sizeString);
  return newURL;
}

function activeProgressWheel(id) {
  console.log("clicked: " + id);
}

// Code for enter key submission
document.getElementById("artist").addEventListener("keydown", function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    // enter pressed
    get();
    console.log("test");
  }
}, false);
