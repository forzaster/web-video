function load() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onGetFileSystem, onError);
}

function onGetFileSystem(fileSystem) {
    var directoryEntry = fileSystem.root;
    var directoryReader = directoryEntry.createReader();
    directoryReader.readEntries(onRootReadEntries, onError);
}

function onRootReadEntries(entries) {
    for (var index = 0; index < entries.length; index++) {
	if (entries[index].name == "VIDEO") {
	    entries[index].createReader().readEntries(onVideoReadEntries, onError);
	}
    }
}

function onVideoReadEntries(entries) {
    var list = document.getElementById("list");
    var isFirst = true;
    for (var index = 0; index < entries.length; index++) {
	var fullPath = entries[index].fullPath;
	var n = fullPath.lastIndexOf(".");
	if (n == -1) {
	    continue;
	}
	var ext = fullPath.substr(n);
	if (ext == ".mp4") {
	    var posterPath = fullPath + ".jpg";
	    var videoPath = fullPath;
	    if (isFirst == true) {
		loadVideo(videoPath, posterPath);
		isFirst = false;
	    }
	    var item = document.createElement("li");
	    item.innerHTML = "<a href=\"#\">" + "<img src=\"" + posterPath
		+ "\" alt=\"" + videoPath
		+ "\" onclick=\"onClickPoster(\'"
		+ videoPath + "\',\'" + posterPath + "\')\"/></a>";
	    list.appendChild(item);
	}
    }
}

function onClickPoster(videoPath, posterPath) {
    loadVideo(videoPath, posterPath);
    window.scroll(0,0);
}

function loadVideo(videoPath, posterPath) {
    var player = document.getElementById("player_container");
    var videoWidth = screen.width;
    var prevVideo = document.getElementById("video");
    if (prevVideo != null) {
	player.removeChild(prevVideo);
    }
/*
    player.innerHTML="<video id=\"video\" src=\"" + videoPath + "\" width=\"" + videoWidth + "\" controls autoplay preload=\"none\" poster=\"" + posterPath + "\"/>";
*/
    var video = document.createElement("video");
    video.id = "video";
    video.poster = posterPath;
    video.width = videoWidth;
    video.innerHTML = "<source src=\"" + videoPath + "\" type=\"video/mp4\" />"
    video.setAttribute("controls");
    player.appendChild(video);
    video.play();
}

function onError(error) {
    alert("Error " + error.code);
}