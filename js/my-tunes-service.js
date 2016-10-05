function MyTunes(){

    var _users = [];
    var _currentUser;
    var _currentPlaylist = [];
    var _mySongs = [];

    function User(username){
        this.username = username;
        this.playlists = [];
    }

    function Playlist(name){
        this.name = name;
        this.songs = [];
    }


    this.loadUsers = function(){
        var localData = localStorage.getItem("users");
        if(localData){
            _users = JSON.parse(localData);
        }
    }

    this.saveUsers = function(){
        localStorage.setItem("users", JSON.stringify(_users));
        console.log("Saving Users!")
    }

    this.getUsers = function(){
        return _users;
    }

    this.getCurrentUser = function(){
        return _currentUser;
    }

    this.createPlaylist = function(name){
        if(getPlaylist(name) != undefined){ //Short circuit if exists
            return;
        }
        var playlist = new Playlist(name);
        _currentUser.playlists.push(playlist);
        this.saveUsers();
    }

    this.deletePlaylist = function(name){
        _currentUser.playlists.forEach(function(item, index){
            if(item.name == name){
                _currentUser.playlists.splice(index, 1);
            }
        })
        this.saveUsers();
    }

    function getPlaylist(name){
        var playlist;
        _currentUser.playlists.forEach(function(item){
            if(item.name == name){
                playlist = item;
            }
        })
        return playlist;
    }
    this.existsInPlaylist = function(songID){
        var exists = false;
        _currentPlaylist.songs.forEach(function(song){
            if(song.id == songID){
                exists = true;
            }
        })
        return exists;
    }

    this.getCurrentPlaylist = function(){
        return _currentPlaylist;
    }

    this.selectPlaylist = function(name){
        _currentPlaylist = getPlaylist(name);
    }

    this.addToCurrentPlaylist = function(song){
        if(!this.existsInPlaylist(song.id)){
            _currentPlaylist.songs.push(song);
            this.saveUsers();
        }
        
    }

    function sortPlaylistByRating(playlist){
        var sorted = playlist.songs.sort(function(a,b){
            if(a.rating > b.rating){
                return -1;
            }
            if(a.rating < b.rating){
                return 1;
            }
            if(a.rating == b.rating){
                return 0;
            }
        })
        return sorted;
    }

    this.changeCurrentPlaylistSongRating = function(songID, increment){
        var rating = 0;
        _currentPlaylist.songs.forEach(function(item){
            if(item.id == songID){
                item.rating += increment;
                rating = item.rating;
            }
        });
        _currentPlaylist.songs = sortPlaylistByRating(_currentPlaylist);
        this.saveUsers();
        return rating;
    }

    this.deleteFromCurrentPlaylist = function(id){
        _currentPlaylist.songs.forEach(function(song, index){
            if(song.id == id){
                _currentPlaylist.songs.splice(index, 1);
            }
        })
        this.saveUsers();
    }

    this.login = function(username){
        for(var i = 0; i < _users.length; i++){
            if(_users[i].username == username){
                _currentUser = _users[i];
                return true;
            }
        }
        return false;
    }

    this.createNewUser = function(username){
        var newUser = new User(username);
        _users.push(newUser);
        this.saveUsers();
    }

}