$(document).foundation();

var audioArr = []; //Array of audio elements... global!
var myUsersService = new MyTunes();
var _songList = [];
myUsersService.loadUsers();

function findSong(id) {
  for (var i = 0; i < _songList.length; i++) {
    if (_songList[i] != undefined) {
      var song = _songList[i];
      if (song.id == id) {
        return song;
      }
    }
  }
}

//Do Not Modify the getMusic function
function getMusic(event) {
  event.preventDefault();
  var artist = document.getElementById('artist').value;
  itunes.getMusicByArtist(artist).then(drawSongs);
}

function drawSongs(songList, playlistFlag) {
  console.log(songList);
  _songList = songList;

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
        if(item.price === undefined){
          item.price = 0.00;
        }
        var price = item.price.toFixed(2);
        var collection = item.collection;
        if (collection === undefined) { collection = "" };
        var title = item.title;
        if (title === undefined) { title = "" };


        var addToMySongs = "";
        if (myUsersService.getCurrentUser() != undefined && (playlistFlag === false || playlistFlag === undefined))  {
          addToMySongs = `
            <button class="button button-add-song-to-playlist" id="${item.id}">Add to Playlist</button>
          `
        }

        var deleteFromPlaylist = "";
        if (playlistFlag === true) {
          addToMySongs = `
            <button class="button alert button-delete-song-from-playlist" id="${item.id}">Delete From Playlist</button>
          `
        }

        var thumbs = "";
        if(playlistFlag === true){
          thumbs = `
          <p class="thumbs-text">
            <span id=${item.id} class="thumbs-down"><i class="fa fa-thumbs-down" aria-hidden="true"></i></span>
            <span id="num">${item.rating}</span>
            <span id=${item.id} class="thumbs-up"><i class="fa fa-thumbs-up" aria-hidden="true"></i></span>
            </p>
          `
        }

        item.albumArt = swapUrlSize(item.albumArt, 400);
        template += `
    <div class="small-12 large-4 column card-container" id="${item.id}">
      <div class="row card-contents text-center align-center">
        <div class="play-container">
          <img class="album-art" src="${item.albumArt}"
            alt="${item.collection} album image">
          <div class="play">
            <div class="loader">Loading...</div>
            <audio src="${item.preview}" id="audio${count}">
            </audio>
          </div>
          <div class="video">
            <button class="button secondary button-video" id="${item.id}" data-open="modal-video">Get Music Video!</button>
          </div>
        </div>
        <div class="small-12 column align-self-top">
          <h4>${item.title}</h4>
          <h5>${item.collection}</h5>
        </div>
        <div class="column small-12 align-self-middle">
        ${thumbs}
        </div>
        <div class="small-12 column align-self-bottom">
          ${addToMySongs}
          ${deleteFromPlaylist}
          <a class="button success button-buy" target="_blank" href="${item.link}"><strong class="button-text">$${item.price} - Buy Now!</strong></a>
        </div>
      </div>
    </div>`
    count++; //Need this for audio player indexing
      }
    }); 
  }

  var songSpace = document.getElementById("song-space");
  songSpace.innerHTML = template;
  if(playlistFlag){
    updateIncludedSongs();
  }

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

function updateIncludedSongs(){
  var container = $("#song-space");
  var array = jQuery.makeArray(container.children());
  array.forEach(function(item){
    if(myUsersService.existsInPlaylist(item.id)){
      item.children[0].className += " green-background"
    }
  })
}

function drawPlaylists() {
  var elem = $("#playlist-area");
  elem.empty();
  var options = ``;
  var user = myUsersService.getCurrentUser();
  user.playlists.forEach(function (item) {
    options += `<option>${item.name}</option>`
  });
  elem.append(`
    <form action="">
        <label class="my-playlists"><strong>My Playlists</strong></label>
        <select name="playlist-select" id="playlist-select" class="select-playlist">
        ${options}
        </select>
      </form>
      <button class="button button-add-playlist" id="button-add-playlist">New Playlist</button>
      <button class="button alert button-delete-playlist" id="button-delete-playlist">Delete Playlist</button>
      <button class="button success button-load-playlist" id="button-load-playlist">Load Playlist</button>
  `)
  $('#playlist-select').on('change', function (e) {
    console.log("option changed!")
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    myUsersService.selectPlaylist(valueSelected);
  })
  myUsersService.selectPlaylist($('#playlist-select').val());
}


$('#login-text').on('click', function (e) {

  e.preventDefault();
  if ($("#form-login").hasClass("login")) {
    return;
  }
  console.log("clicked!")
  var elem = $("#login-text")
  var template = `
    <form id="form-login" class="login">
      <input id="field-login" type="text" placeholder="Username" >
    </form> 
  `
  elem.after(template);
  $("#field-login").focus();


});

$("#login-area").on('submit', "#form-login", function (e) {
  // debugger;
  e.preventDefault;
  console.log("test");
  var username = $('#field-login').val();
  if (!myUsersService.login(username)) { //If login failed
    if (confirm('User does not exist. Create new?')) {
      myUsersService.createNewUser(username);
      myUsersService.login(username);
      $("#login-text").text(`Hi, ${username}`);
      drawPlaylists();
    }
  } else {
    $("#login-text").text(`Hi, ${username}`);
    drawPlaylists();
  }
  $('#form-login').remove();
  return false;
});

$("body").on('click', "#button-delete-playlist", function (e) {
  e.preventDefault;
  var playlist = $('#playlist-select').val();
  myUsersService.deletePlaylist(playlist);
  drawPlaylists();

});

$("body").on('click', "#button-add-playlist", function (e) {
  e.preventDefault;
  var playlist = prompt("Enter new Playlist Name", "Many Songs, such Wow");
  if (playlist != null) {
    myUsersService.createPlaylist(playlist);
    drawPlaylists();
  }

});

$("body").on('click', '.button-add-song-to-playlist', function (e) {
  e.preventDefault();
  var songID = this.id;
  var song = findSong(songID);
  myUsersService.addToCurrentPlaylist(song);
  debugger
  this.innerHTML = "Song Added to Playlist!";
  updateIncludedSongs();
})

$("body").on('click', '.button-delete-song-from-playlist', function (e) {
  e.preventDefault();
  var songID = this.id;
  myUsersService.deleteFromCurrentPlaylist(songID);
  this.parentElement.parentElement.parentElement.remove(); //WE MUST GO DEEPER
  updateIncludedSongs();
})

$("body").on('click', '.button-load-playlist', function (e) {
  e.preventDefault();
  var playlist = myUsersService.getCurrentPlaylist();
  drawSongs(playlist.songs, true)
})

$("body").on('click', '.thumbs-down', function (e) {
  e.preventDefault();
  var songID = this.id;
  var newRating = myUsersService.changeCurrentPlaylistSongRating(songID, -1);
  this.parentElement.innerHTML = this.parentElement.innerHTML.replace(`"num">${newRating + 1}</span>`, `"num">${newRating}</span>`)
})

$("body").on('click', '.thumbs-up', function (e) {
  e.preventDefault();
  var songID = this.id;
  var newRating = myUsersService.changeCurrentPlaylistSongRating(songID, 1);
  this.parentElement.innerHTML = this.parentElement.innerHTML.replace(`"num">${newRating - 1}</span>`, `"num">${newRating}</span>`)
})

$("body").on('click', '.button-video', function (e) {
  e.preventDefault();
  var songID = this.id;
  var song = findSong(songID);
  if(song){
    var searchString = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyBYi_onEt-I9YGd_kTFjLBcQnRIV7UGL3c&maxResults=1&q=replaceme".replace("replaceme", (song.artist + " "+ song.title));
    var response = $.getJSON(searchString).then(function(response){
      var embedCode = response.items[0].id.videoId;
      $("#video-frame").attr("src", "https://www.youtube.com/embed/"+embedCode);
    });
    
  }
})

