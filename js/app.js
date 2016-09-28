
//Do Not Modify the getMusic function
function getMusic() {
    var artist = document.getElementById('artist').value;
    itunes.getMusicByArtist(artist).then(drawSongs);
}

function drawSongs(songList) {
    console.log(songList);

    template = '';
    

    songList.forEach(function (item) {

        item.albumArt = swapUrlSize(item.albumArt, 400);

        template += `
    <div class="small-12 large-4 column card-container">
      <div class="row card-contents text-center align-center">
        <div class="play-container">
          <img class="album-art" src="${item.albumArt}"
            alt="${item.collection} album image">
          <div class="play">
            <i class="fa fa-play-circle-o play-icon" aria-hidden="true"></i>
          </div>
        </div>
        <div class="small-12 column align-self-top">
          <h4>${item.title}</h4>
          <h5>${item.collection}</h5>
        </div>
        <div class="small-12 column align-self-bottom">
          <button class="button success" href="#"><strong class="button-text">$${item.price} - Buy Now!</strong></button>
        </div>
      </div>
    </div>`
    });

    var songSpace = document.getElementById("song-space");
    songSpace.innerHTML = template;
}

function swapUrlSize(url, pixels){
    sizeString = `${pixels}x${pixels}`;
    var newURL = url.replace("60x60", sizeString);
    return newURL;
}
