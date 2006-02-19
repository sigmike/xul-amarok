



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
	amarokCall('addTracks','playlistHandler','urls='+encodeURIComponent(urls.join('||')));
}


function addAlbums(albums)
{
    if (albums.length == 0) return false;
	amarokCall('addAlbums','playlistHandler','albums='+encodeURIComponent(albums.join('||')));
}



function addArtists(artists)
{
    if (artists.length == 0) return false;
	amarokCall('addArtists','playlistHandler','artists='+encodeURIComponent(artists.join('||')));
}




function playlistHandler(xml)
{
	pl=xml.getElementsByTagName('playlist').item(0);
	refreshPlaylist(pl);
}



var playlistView=null;


function refreshPlaylist(pl)
{
	//parse the xml playlist into a 2D array [rowNb][colName]
	var tracks=new Array();
	var activeIdx=null;
	
	var plitems=pl.getElementsByTagName('item');
	for(var i=0; i < plitems.length; i++) {
		tracks[i]=new Array();
		
		var track=plitems.item(i);
		if (track.getAttribute('queue_index') == '0') activeIdx=i;
		
		var trackValNodes=track.childNodes;
		for(var j=0; j < trackValNodes.length; j++) {
			var valNode=trackValNodes.item(j);
			if (valNode.firstChild) tracks[i][valNode.nodeName]=valNode.firstChild.data;
			else tracks[i][valNode.nodeName]='';
		}
	}

	
    playlistView = {
        rowCount : tracks.length,
        getCellText : function(row,column){ 
        	if (tracks[row]) return tracks[row][column.id]; 
        	else return null
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
        getParentIndex: function(row) { return -1; },
        cycleHeader: function cycleHeader(col, elem) { }
    };
    document.getElementById('playlist').view = playlistView;
    
 	setPlaying(activeIdx);
    return true;
}



function setPlaying(idx)
{
	if (!playlistView || !idx || idx < 0) {
		document.getElementById('statusMessage').setAttribute('value','Stopped');
		return;
	}
	
	playlistView.selection.select(idx);
	
	//display artist/track in the status bar
	titleCol=document.getElementById('Title');
	title=playlistView.getCellText(idx,titleCol);
	
	artistCol=document.getElementById('Artist');
	artist=playlistView.getCellText(idx,artistCol);
	
	albumCol=document.getElementById('Album');
	album=playlistView.getCellText(idx,albumCol);

	
	if (!title) {
		document.getElementById('statusMessage').setAttribute('value','');
		return false;
	}
	
	var message = 'Playing '+ title+' by '+ artist+' on ' + album;
	if (message.length > 60) message=message.slice(0,60)+'...';
	
	document.getElementById('statusMessage').setAttribute('value',message);
	document.getElementById('statusMessage').setAttribute('class','');
}


function showError(message)
{
	document.getElementById('statusMessage').setAttribute('value',message);
	document.getElementById('statusMessage').setAttribute('class','error');
}


