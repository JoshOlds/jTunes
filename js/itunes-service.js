$("#loader-main").fadeTo(1, 0);
var itunes = {
    getMusicByArtist: function(artist, cb) {
      var loaderElement = document.getElementById("loader-main-area");
      $("#loader-main").fadeTo(1000, 1);
      loaderElement.innerHTML = `<div class="loader-main" id="loader-main">Loading...</div>`
      var url = '//bcw-getter.herokuapp.com/?url=';
      var url2 = 'https://itunes.apple.com/search?term=' + artist;
      var apiUrl = url + encodeURIComponent(url2);
      
      $('#get-music-button').text('LOADING....');
      
      return $.getJSON(apiUrl).then(function(response){
        console.log(response);
        var songList = response.results.map(function (song) {
          if(song.kind == "song"){
                  return {
                      title: song.trackName,
                      albumArt: song.artworkUrl60,
                      artist: song.artistName,
                      collection: song.collectionName,
                      price: song.collectionPrice,
                      preview: song.previewUrl,
                      link: song.trackViewUrl
                    };
        }
                })
        $('#get-music-button').text('GET MUSIC');
        $("#loader-main").fadeTo(2000, 0);
        return songList;
      })
    }
}