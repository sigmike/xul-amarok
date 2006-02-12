



function getPlaylist()
{
	amarokCall('getPlaylist','playlistHandler','');
}

function clearPlaylist()
{
	amarokCall('clearPlaylist','playlistHandler','');
}


function addTracks(urls)
{
    if (urls.length == 0) return false;
	amarokCall('addTracks','playlistHandler','urls='+urls.join('||'));
}


function addAlbums(albums)
{
    if (albums.length == 0) return false;
	amarokCall('addAlbums','playlistHandler','albums='+albums.join('||'));
}



function addArtists(artists)
{
    if (artists == 0) return false;
	amarokCall('addArtists','playlistHandler','artists='+artists.join('||'));
}



function playlistHandler(xml)
{
	pl=xml.getElementsByTagName('playlist').item(0);
	refreshPlaylist(pl);
}



var playlistView=null;

function refreshPlaylist(pl)
{
    var tracks = pl.getElementsByTagName('item');

    playlistView = {
        rowCount : tracks.length,
        getCellText : function(row,column){
        
            if (!tracks.item(row)) return null;
            var fieldElmt = tracks.item(row).getElementsByTagName(column.id).item(0);
            
            if (fieldElmt && fieldElmt.firstChild) {
            
            	if (column.id == 'Length') {
            		var secs=fieldElmt.firstChild.nodeValue;
            		var mins = parseInt(secs/60);
            		secs= secs - 60 * mins;
            		if (secs < 10) secs='0'+secs;
            		return mins+':'+secs;
            	}
            	else return fieldElmt.firstChild.nodeValue;
            }
            else return null;
        },
        setTree: function(treebox){ this.treebox = treebox; },
        isContainer: function(row){ return false; },
        isSeparator: function(row){ return false; },
        isSorted: function(row){ return false; },
        canDrop: function(){ return true; },
        drop: function(row,col,props){ return true; },
        getLevel: function(row){ return 0; },
        getImageSrc: function(row,col){ return null; },
        getRowProperties: function(row,props){},
        getCellProperties: function(row,col,props){},
        getColumnProperties: function(colid,col,props){},
        getParentIndex: function(row) { return -1; }
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
	if (!playlistView || !idx) {
		document.getElementById('statusMessage').setAttribute('value','');
		return false;
	}
	
	playlistView.selection.select(idx);
	
	//display artist/track in the status bar
	titleCol=document.getElementById('Title');
	title=playlistView.getCellText(idx,titleCol);
	
	artistCol=document.getElementById('Artist');
	artist=playlistView.getCellText(idx,artistCol);
	
	albumCol=document.getElementById('Album');
	album=playlistView.getCellText(idx,albumCol)
	
	if (!title) {
		document.getElementById('statusMessage').setAttribute('value','');
		return false;
	}
	
	var message = 'Playing '+ title+' by '+ artist+' on ' + album;
	document.getElementById('statusMessage').setAttribute('value',message);
}



