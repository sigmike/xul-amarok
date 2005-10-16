



function getPlaylist()
{
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(playlistHandler, null, 'getPlaylist', [], 0);
}

function clearPlaylist()
{
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(playlistHandler, null, 'clearPlaylist', [], 0);
}


function addTracks(urls)
{
    if (urls.length == 0) return false;

    var xmlRpcClient = getXmlRpc();
	
	var urlsParam = xmlRpcClient.createType(xmlRpcClient.ARRAY,{});

	for (var i=0; i<urls.length ; i++) {
    	var url = xmlRpcClient.createType(xmlRpcClient.STRING,{});
        url.data = urls[i];
    	urlsParam.AppendElement(url);
	}

	try {
   		xmlRpcClient.asyncCall(playlistHandler, null, 'addMediaList', [urlsParam], 1);

	} catch(e) {
		alert('ERROR asyncCall');
    	DUMP_obj (urlsParam);
    	DUMP_obj (e);
	}
    return true;
}



function addAlbums(albums)
{
    if (albums.length == 0) return false;

    var xmlRpcClient = getXmlRpc();
	
	var albumsParam = xmlRpcClient.createType(xmlRpcClient.ARRAY,{});

	for (var i=0; i<albums.length ; i++) {
    	var album = xmlRpcClient.createType(xmlRpcClient.STRING,{});
        album.data = albums[i];
    	albumsParam.AppendElement(album);
	}

	try {
   		xmlRpcClient.asyncCall(playlistHandler, null, 'addAlbums', [albumsParam], 1);

	} catch(e) {
		alert('ERROR asyncCall');
    	DUMP_obj (urlsParam);
    	DUMP_obj (e);
	}
    return true;
}


function addArtists(artists)
{
    if (artists == 0) return false;

    var xmlRpcClient = getXmlRpc();
	
	var artistsParam = xmlRpcClient.createType(xmlRpcClient.ARRAY,{});

	for (var i=0; i<artists.length ; i++) {
    	var artist = xmlRpcClient.createType(xmlRpcClient.STRING,{});
        artist.data = artists[i];
    	artistsParam.AppendElement(artist);
	}

	try {
   		xmlRpcClient.asyncCall(playlistHandler, null, 'addArtists', [artistsParam], 1);

	} catch(e) {
		alert('ERROR asyncCall');
    	DUMP_obj (urlsParam);
    	DUMP_obj (e);
	}
    return true;
}

var playlistHandler = {

    onResult: function(client, ctxt, result) {
        var playlistXml = result.QueryInterface(
            Components.interfaces.nsISupportsCString);
           
        var dom = new DOMParser();
    	var pl = dom.parseFromString (playlistXml,"application/xml");
        refreshPlaylist(pl);
	},
	onFault: function (client, ctxt, fault) {
		alert('getPlaylistHandler XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('getPlaylistHandler Error: '+status+errorMsg);
	}
};




var playlistView=null;

function refreshPlaylist(pl)
{
    var tracks = pl.getElementsByTagName('item');

    playlistView = {
        rowCount : tracks.length,
        getCellText : function(row,column){
            var track = tracks[row];
            fieldElmts = track.getElementsByTagName(column.id);
            if (fieldElmts.length == 1) return fieldElmts[0].firstChild.nodeValue;
            else return "";
        },
        setTree: function(treebox){ this.treebox = treebox; },
        isContainer: function(row){ return false; },
        isSeparator: function(row){ return false; },
        isSorted: function(row){ return false; },
        getLevel: function(row){ return 0; },
        getImageSrc: function(row,col){ return null; },
        getRowProperties: function(row,props){},
        getCellProperties: function(row,col,props){},
        getColumnProperties: function(colid,col,props){}
    };
    document.getElementById('playlist').view = playlistView;
    
    //set active track and update status bar
    for (i=0; i<tracks.length; i++) {
        var track = tracks[i];
        if (track.getAttribute('queue_index') == '0') setPlaying(i);
    }
    
    return true;
}



function setPlaying(idx)
{
	playlistView.selection.select(idx);
	
	//display artist/track in the status bar
	artistCol=document.getElementById('Artist');
	titleCol=document.getElementById('Title');
	albumCol=document.getElementById('Album');
	var message = 'Playing '+ playlistView.getCellText(idx,titleCol)
	message += ' by ' + playlistView.getCellText(idx,artistCol)
	message += ' on ' + playlistView.getCellText(idx,albumCol)
	updateStatus(message);
}






