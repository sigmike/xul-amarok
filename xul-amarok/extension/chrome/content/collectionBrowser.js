

function getArtists(search)
{
    var xmlRpcClient = getXmlRpc();
    
    var searchParam = xmlRpcClient.createType(xmlRpcClient.STRING,{});
    searchParam.data=escape(search);
    xmlRpcClient.asyncCall(getArtistsHandler, null, 'artists', [searchParam], 1);
}

var getArtistsHandler = {

    onResult: function(client, ctxt, result) {
            var artists = result.QueryInterface(
                Components.interfaces.nsISupportsArray);
            initCollectionBrowser(artists);
	},
	onFault: function (client, ctxt, fault) {
		alert('getArtistsHandler XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('getArtistsHandler Error: '+errorMsg);
	}
};






function getAlbums(artist)
{
    var xmlRpcClient = getXmlRpc();
    
    var artistParam = xmlRpcClient.createType(xmlRpcClient.STRING,{});
    artistParam.data=escape(artist);
    xmlRpcClient.asyncCall(getAlbumsHandler, null, 'albums', [artistParam], 1);
}

var getAlbumsHandler = {

    onResult: function(client, ctxt, result) {
    	var idx = collectionView.currentIdx;

        var albums = result.QueryInterface(
            Components.interfaces.nsISupportsArray);

		for (var i = 0; i < albums.Count(); i++) {
			album = albums.QueryElementAt(i, Components.interfaces.nsISupportsCString);
			collectionView.visibleData.splice(idx + i + 1, 0, [album.toString(), 1,true, false,null]);
		}

		collectionView.rowCount=collectionView.visibleData.length;
		collectionView.treeBox.rowCountChanged(idx + 1, albums.Count());
            
	},
	onFault: function (client, ctxt, fault) {
		alert('getAlbumsHandler XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('getAlbumsHandler Error: '+errorMsg);
	}
};



function getTracks(artist,album)
{
    var xmlRpcClient = getXmlRpc();
    
    var artistParam = xmlRpcClient.createType(xmlRpcClient.STRING,{});
    artistParam.data=escape(artist);
    var albumParam = xmlRpcClient.createType(xmlRpcClient.STRING,{});
    albumParam.data=escape(album);
    xmlRpcClient.asyncCall(getTracksHandler, null, 'tracks', [artistParam,albumParam], 2);
}

var getTracksHandler = {

    onResult: function(client, ctxt, result) {
    	var idx = collectionView.currentIdx ;

        var tracks = result.QueryInterface(
            Components.interfaces.nsISupportsArray);

		var nb=0;
		for (var i=0; i < tracks.Count(); i++) {
			if (i == 0 || i % 2 == 0) track = tracks.QueryElementAt(i, Components.interfaces.nsISupportsCString);
			else {
				url = tracks.QueryElementAt(i, Components.interfaces.nsISupportsCString);
				nb++;
				collectionView.visibleData.splice(idx + nb  , 0, [track.toString(), 2, false, false, url]);
			}
		}
		collectionView.rowCount=collectionView.visibleData.length;
		collectionView.treeBox.rowCountChanged(idx + 1, nb);
            
	},
	onFault: function (client, ctxt, fault) {
		alert('getTracksHandler XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('getTracksHandler Error: '+errorMsg);
	}
};



var initData = [];
var collectionView=null;

function initCollectionBrowser(artists)
{

	initData = [];
	for (i=0; i < artists.Count(); i++) {
        var artist = artists.QueryElementAt(i, Components.interfaces.nsISupportsCString);
        initData[i] = [artist.toString(),0, true,false,null];
    }
	
    collectionView = {
    	
        treeBox:null,
        selection:null,
        widget:null,
        idx : null,
        visibleData : null,
        currentIdx : 0,
        
        rowCount : 0,
		setTree: function(treeBox)         { this.treeBox = treeBox; },
		getCellText: function(idx, column) { return this.visibleData[idx][0]; },
		getLevel: function(idx)     	   { return this.visibleData[idx][1]; },
		isContainer: function(idx)         { return this.visibleData[idx][2]; },
		isContainerOpen: function(idx)     { return this.visibleData[idx][3]; },
		
		isContainerEmpty: function(idx)    { return false; },
		isSeparator: function(idx)         { return false; },
		isSorted: function()               { return false; },
		isEditable: function(idx, column)  { return false; },
  
       
        getCellValue : function (row,column) {return null;},
        getImageSrc: function(row,col){ return null; },
        
     
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
			if (!item[2]) return;
			
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
					this.treeBox.rowCountChanged(idx + 1, -deletecount);
				}
			}
			//closed >> opening
			else {
				item[3] = true;
				this.visibleData[idx][3] = true;
				this.currentIdx = idx;
				
				var thisLevel = this.getLevel(idx);
				dump(thisLevel);
				if (thisLevel == 0) {
					var artist = this.visibleData[idx][0];
					getAlbums(artist)
				}
				if (thisLevel == 1) {
					var pIdx = this.getParentIndex(idx);
					var artist = this.visibleData[pIdx][0];
					var album = this.visibleData[idx][0];
					getTracks(artist,album);
				}
			}
			return true;
		},
        getRowProperties: function(row,props){},
        getCellProperties: function(row,col,props){},
        getColumnProperties: function(colid,col,props){}
  
    }

	collectionView.visibleData = initData;
	collectionView.rowCount = initData.length;

    document.getElementById('collectionBrowser').view = collectionView;
    return true;
}


