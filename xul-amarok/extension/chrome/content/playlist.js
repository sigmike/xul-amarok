
var atomService = Components.classes["@mozilla.org/atom-service;1"].getService(Components.interfaces.nsIAtomService);



var playlistView = {

    rowCount : 0,
    visibleData : [],
    
    aserv : atomService,
    
    
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
    	if (this.visibleData[row]['playing'] == true) props.AppendElement(this.aserv.getAtom("playing"));
    },
    
    getCellProperties: function(row,col,props){},
    getColumnProperties: function(colid,col,props){},
    getParentIndex: function(row) { return -1; },
    cycleHeader: function cycleHeader(col, elem) { }
};



var playlistObserver = {
	
	getSupportedFlavours : function () {
	    var flavours = new FlavourSet();
	    flavours.appendFlavour('amarok/browseritems');
	    return flavours;
	  },

	onDragOver: function (evt,flavour,session){},
	  
	onDrop: function (evt,dropdata,session){
		addSelectedCollectionItems();
	}

}






//set the playlist contents
function setPlaylist(xmlplaylist)
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




//hilight the current track and updates status bar
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
	
	document.getElementById('statusMessage').setAttribute('value',message);
	document.getElementById('statusMessage').setAttribute('class','');
	
	return true;
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
	return removeSelectedItems();
}





function rsort(a,b)
{
	return b - a;
}



function removeSelectedItems()
{
	//get selected tracks
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

    if (tracksIds.length == 0) return false;
    
    //remove playlist entries
    tracksIds.sort(rsort);
	for (var i=0; i<tracksIds.length; i++) {
		playlistView.visibleData.splice(tracksIds[i],1);
	}
	playlistView.rowCount = playlistView.visibleData.length;
	playlistView.treeBox.rowCountChanged(0, -tracksIds.length);
	playlistView.selection.clearSelection();
	
	return XulRemote.deleteTracks(tracksIds);
}






//handle the AJAX response
function playerHandler(xml)
{
	elmt = xml.getElementsByTagName('index').item(0);
	idx=elmt.firstChild.nodeValue;
	pos = elmt.getAttribute('position');
	
    var pbar = document.getElementById('progressBar').setAttribute('curpos',pos);
    return setPlaying(idx);
}





//handle the AJAX response
function setVolumeHandler(xml)
{
	volume = xml.getElementsByTagName('volume').item(0).firstChild.nodeValue;
	document.getElementById('volumeBar').setAttribute('curpos', volume);
	return true;
}





