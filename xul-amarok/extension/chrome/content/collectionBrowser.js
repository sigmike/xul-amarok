


var collectionView = {
	
    visibleData : [],
    rowCount : 0,
    
	setTree: function(treeBox)         { this.treeBox = treeBox; },
	
	getCellText: function(idx, column) { 
		if (this.visibleData[idx]) return this.visibleData[idx][0];
		else return null;
	},
	getLevel: function(idx) { 
		if (this.visibleData[idx]) return this.visibleData[idx][1];
		else return 0;
	},
	isContainer: function(idx) { 
		if (this.visibleData[idx]) return this.visibleData[idx][2];
		else return false;
	},
	isContainerOpen: function(idx) {
		if (this.visibleData[idx]) return this.visibleData[idx][3];
		else return false;
	},
	
	isContainerEmpty: function(idx)    { return false; },
	isSeparator: function(idx)         { return false; },
	isSorted: function()               { return false; },
	isEditable: function(idx, column)  { return false; },
	canDrop: function()                { return false; },
  
    getCellValue : function (row,column) {return null;},
    getImageSrc: function(row,col){ return null; },
    cycleHeader: function cycleHeader(col, elem) { },
 
    getParentIndex: function(row) {
    	var thisLevel = this.getLevel(row);
    	if (thisLevel == 0)  return -1;
	    for (var t = row - 1 ; t >= 0 ; t--) {
	      	if (this.getLevel(t) < thisLevel) return t;
	    }
	    return false;
    },
        
    hasNextSibling: function(idx, after) {
        var thisLevel = this.getLevel(idx);
	    for (var t = idx + 1; t < this.visibleData.length; t++) {
	      var nextLevel = this.getLevel(t)
	      if (nextLevel == thisLevel) return true;
	      else if (nextLevel < thisLevel) return false;
	    }
	    return false;
    },
    
   
	toggleOpenState: function(idx) {
		var item = this.visibleData[idx];
		
		//not a container
		if (!item[2]) return true;
		
		//already opened >> closing
		if (item[3]) {
			item[3] = false;
			this.visibleData[idx][3] = false;
			
			var thisLevel = this.getLevel(idx);
			
			var deletecount = 0;
			for (var t = idx + 1; t < this.visibleData.length; t++) {
				if (this.getLevel(t) > thisLevel) deletecount++;
				else break;
			}
			if (deletecount) {
				this.visibleData.splice(idx + 1, deletecount);
				this.rowCount=this.visibleData.length;
				this.treeBox.rowCountChanged(idx + 1, -deletecount);
			}
		}
		//closed >> opening
		else {
			item[3] = true;
			this.visibleData[idx][3] = true;
			this.currentIdx = idx;
			
			var thisLevel = this.getLevel(idx);
			if (thisLevel == 0) {
				var artist = this.visibleData[idx][0];
				this.getAlbums(artist)
			}
			if (thisLevel == 1) {
				var pIdx = this.getParentIndex(idx);
				var artist = this.visibleData[pIdx][0];
				var album = this.visibleData[idx][0];
				this.getTracks(artist,album);
			}
		}
		return true;
	},
    getRowProperties: function(row,props){},
    getCellProperties: function(row,col,props){},
    getColumnProperties: function(colid,col,props){},
    
    
    
    
    
	getArtists: function(search)
	{
	    return XulRemote.amarokCall('artists','collectionView.setArtists','search='+encodeURIComponent(search));
	},

    setArtists: function(xmlartists)
	{
		var artists = xmlartists.getElementsByTagName('artist');
	
		var initData = [];
		for (i=0; i < artists.length; i++) {
			if (artists.item(i).firstChild) var artist = artists.item(i).firstChild.nodeValue;
			else var artist='unknown';
	        initData[i] = [artist,0, true,false,null];
	    }
	
		var prevCount=this.rowCount;
	
		this.visibleData = initData;
		this.rowCount = initData.length;
		this.treeBox.rowCountChanged(0, initData.length - prevCount);
	},
	
	
	
	getAlbums: function(artist)
	{
	    if (artist=='Unknown') artist='';
		return XulRemote.amarokCall('albums','collectionView.setAlbums','artist='+encodeURIComponent(artist));
	},
	
	setAlbums: function(xmlalbums)
	{
		var idx = this.currentIdx;
	
	    var albums = xmlalbums.getElementsByTagName('album');
	
		for (var i = 0; i < albums.length; i++) {
			if (albums.item(i).firstChild) album = albums.item(i).firstChild.nodeValue;
			else album='Unknown';
			this.visibleData.splice(idx + i + 1, 0, [album, 1,true, false,null]);
		}
	
		this.rowCount=collectionView.visibleData.length;
		this.treeBox.rowCountChanged(idx + 1, albums.length);
	},


	
	getTracks: function(artist,album)
	{
	    if (album=='Unknown') album='';
	    return XulRemote.amarokCall('tracks','collectionView.setTracks','artist='+encodeURIComponent(artist)+'&album='+encodeURIComponent(album));
	},
	
	setTracks: function(xmltracks)
	{
		var idx = this.currentIdx ;
	
	    var tracks = xmltracks.getElementsByTagName('track');
	
		for (var i=0; i < tracks.length; i++) {
			var trackElmt = tracks.item(i);
			var track=trackElmt.firstChild.nodeValue;
			var url=trackElmt.getAttribute('url');
			
			this.visibleData.splice(idx + 1 + i , 0, [track, 2, false, false, url]);
	
		}
		this.rowCount=collectionView.visibleData.length;
		this.treeBox.rowCountChanged(idx + 1, tracks.length);
	}

}



var collectionObserver = {
    
    onDragStart: function (evt , transferData, action){
		
		var tree = evt.target.parentNode;
		if (!tree.view) return false;

		transferData.data= new TransferData();
		transferData.data.addDataForFlavour('amarok/browseritems',"foobar");
		return true;
	}
};











function addSelectedCollectionItems()
{
	var tracks=new Array();
	var albums=new Array();
	var artists=new Array();

	var start = new Object();
	var end = new Object();
	var numRanges = collectionView.selection.getRangeCount();
	
	for (var t=0; t<numRanges; t++){
		collectionView.selection.getRangeAt(t,start,end);
		for (var v=start.value; v<=end.value; v++){

			var level = collectionView.getLevel(v);
			if (level == 2)  {
				var url = collectionView.visibleData[v][4];
				tracks.push(url);
			}
	    	if (level == 1)  {
				var album = collectionView.visibleData[v][0];
				albums.push(album);
			}	
			if (level == 0)  {
				var artist = collectionView.visibleData[v][0];
				artists.push(artist);
			}
		}
	}

	if (tracks.length)  XulRemote.addTracks(tracks);
	if (albums.length)  XulRemote.addAlbums(albums);
	if (artists.length) XulRemote.addArtists(artists);

}




