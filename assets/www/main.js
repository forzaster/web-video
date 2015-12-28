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
	    item.innerHTML = "<a href=\"#\">"
		+ "<div class=\"cover\" "
		+ "style=\"background-image: url(\'" + posterPath
		+ "\')\">" + "<button data-role=\"none\" "
		+ "class=\"listitem\" type\"button\" "
		+ "onclick=\"onClickPoster(\'"
                + videoPath + "\',\'" + posterPath + "\')\"/></div></a>";
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
    var prevTitle = document.getElementById("video_title");
    if (prevTitle != null) {
	player.removeChild(prevTitle);
    }

    var video = document.createElement("video");
    video.id = "video";
    video.poster = posterPath;
    video.width = videoWidth;
    video.innerHTML = "<source src=\"" + videoPath + "\" type=\"video/mp4\" />"
    video.setAttribute("controls");
    player.appendChild(video);

    var s = videoPath.lastIndexOf("/");
    if (s != -1) {
	var title = videoPath.substr(s+1);
	var titleEle = document.createElement("p");
	titleEle.id = "video_title";
	titleEle.innerHTML = title;
	player.appendChild(titleEle);
    }

    video.play();
}

function onError(error) {
    alert("Error " + error.code);
}