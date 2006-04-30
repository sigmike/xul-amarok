

var aserv=Components.classes["@mozilla.org/atom-service;1"].getService(Components.interfaces.nsIAtomService);

var playlistView = {

    rowCount : 0,
    visibleData : [],
    
    getCellText : function(row,column){ 
    	if (this.visibleData[row]) return this.visibleData[row][column.id]; 
    	else return null
    },
    
    setTree: function(treeBox){ this.treeBox = treeBox; },
    isContainer: function(row){ return false; },
    isSeparator: function(row){ return false; },
    isSorted: function(row){ return false; },
    canDrop: function(){ return true; },
    drop: function(row,col,props){ return true; },
    getLevel: function(row){ return 0; },
    getImageSrc: function(row,col){ return null; },
    
    getRowProperties: function(row,props){
    	//the playing track gets the 'playing' property
    	if (this.visibleData[row]['playing'] == true) props.AppendElement(aserv.getAtom("playing"));
    },
    
    getCellProperties: function(row,col,props){},
    getColumnProperties: function(colid,col,props){},
    getParentIndex: function(row) { return -1; },
    cycleHeader: function cycleHeader(col, elem) { }
};

function initPlaylist()
{
	document.getElementById('playlist').view = playlistView;
	getPlaylist();
}



//refresh the playlist
function playlistHandler(xmlplaylist)
{
	pl=xmlplaylist.getElementsByTagName('playlist').item(0);

	//parse the xml playlist into a 2D array [rowNb][colName]
	
	var activeIdx=null;
	var tracks = [];
	
	var plitems=pl.getElementsByTagName('item');
	for(var i=0; i < plitems.length; i++) {
		tracks[i]=new Array();
		
		var track=plitems.item(i);
		if (track.getAttribute('queue_index') == '0') activeIdx=i;
		
		var trackValNodes=track.childNodes;
		for(var j=0; j < trackValNodes.length; j++) {
			var valNode=trackValNodes.item(j);
			if (valNode.firstChild) {
				var data= valNode.firstChild.data;
				
				if (valNode.nodeName == 'Length') {
					//compute minutes/secs from secs
					var mins=parseInt(data/60);
					var secs=data%60;
					if (secs < 10) secs='0'+secs;
					data=mins+':'+secs;
				}
				tracks[i][valNode.nodeName]=data;
			}
			else tracks[i][valNode.nodeName]='';
		}
	}
    
    var prevCount=playlistView.rowCount;

	playlistView.visibleData = tracks;
	playlistView.rowCount = tracks.length;
	
	var changed = tracks.length - prevCount;
	if (changed != 0) {
		playlistView.treeBox.rowCountChanged(0, changed);
		playlistView.selection.clearSelection();
	}
 	setPlaying(activeIdx);
    return true;
}


function setPlaying(idx)
{
	var tree=document.getElementById('playlist');

	//hilight active track
	for (var i=0; i < playlistView.visibleData.length; i++) {
		if (i == idx) playlistView.visibleData[i]['playing']=true;
		else playlistView.visibleData[i]['playing']=false;
	}
	playlistView.treeBox.invalidate();
	
	
	if (!playlistView || !idx || idx < 0) {
		document.getElementById('statusMessage').setAttribute('value','Stopped');
		return true;
	}
	
	//display artist/track in the status bar
	var titleCol=tree.columns.getNamedColumn('Title');
	var title=tree.view.getCellText(idx,titleCol);
	
	var artistCol=tree.columns.getNamedColumn('Artist');
	var artist=tree.view.getCellText(idx,artistCol);
	
	var albumCol=tree.columns.getNamedColumn('Album');
	var album=tree.view.getCellText(idx,albumCol);

	if (!title) {
		document.getElementById('statusMessage').setAttribute('value','');
		return false;
	}
	
	var message = 'Playing "'+ title+'" by "'+ artist+'" on "' + album + '"';
	if (message.length > 60) message=message.slice(0,60)+'...';
	
	document.getElementById('statusMessage').setAttribute('value',message);
	document.getElementById('statusMessage').setAttribute('class','');
	
	return true;
}




function getPlaylist()
{
	return amarokCall('getPlaylist','playlistHandler','');
}

function clearPlaylist()
{
	return amarokCall('clearPlaylist','playlistHandler','');
}


function addTracks(urls)
{
    if (urls.length == 0) return false;
	return amarokCall('addTracks','playlistHandler','urls='+encodeURIComponent(urls.join('||')));
}


function rsort(a,b)
{
	return b - a;
}


function deleteTracks(tracksIds)
{
    if (tracksIds.length == 0) return false;
    
    //remove playlist entries
    tracksIds.sort(rsort);
	for (var i=0; i<tracksIds.length; i++) {
		playlistView.visibleData.splice(tracksIds[i],1);
	}
	playlistView.rowCount = playlistView.visibleData.length;
	playlistView.treeBox.rowCountChanged(0, -tracksIds.length);
	playlistView.selection.clearSelection();
	
	return amarokCall('deleteTracks','playlistHandler','ids='+encodeURIComponent(tracksIds.join('||')));
}

function addAlbums(albums)
{
    if (albums.length == 0) return false;
	return amarokCall('addAlbums','playlistHandler','albums='+encodeURIComponent(albums.join('||')));
}



function addArtists(artists)
{
    if (artists.length == 0) return false;
	return amarokCall('addArtists','playlistHandler','artists='+encodeURIComponent(artists.join('||')));
}




function showError(message)
{
	document.getElementById('statusMessage').setAttribute('value',message);
	document.getElementById('statusMessage').setAttribute('class','error');
	return true;
}


function onPlaylistKeyPress(event)
{
	if (event.keyCode != 46) return false;
	
	//get selected tracks to remove
	var start = new Object();
	var end = new Object();
	var tracksIds=new Array();
	var numRanges = playlistView.selection.getRangeCount();
	
	for (var t=0; t<numRanges; t++){
		playlistView.selection.getRangeAt(t,start,end);
	    for (var trackId=start.value; trackId<=end.value; trackId++){
			tracksIds.push(trackId);
	    }
	}
	
	return deleteTracks(tracksIds);
}

