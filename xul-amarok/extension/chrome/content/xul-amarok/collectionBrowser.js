

function getArtists(search)
{
    dump("getArtists\n");
    
    //if (!search.length) return false;

    
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();
    
    var searchParam = xmlRpcClient.createType(xmlRpcClient.STRING,{});
    searchParam.data=search;
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

    dump("getAlbums\n");// Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();
    
    var artistParam = xmlRpcClient.createType(xmlRpcClient.STRING,{});
    artistParam.data=artist;
    xmlRpcClient.asyncCall(getAlbumsHandler, null, 'albums', [artistParam], 1);
}
var getAlbumsHandler = {

        onResult: function(client, ctxt, result) {
        	var idx = from

            var albums = result.QueryInterface(
                Components.interfaces.nsISupportsArray);

			for (var i = 0; i < albums.Count(); i++) {
				album = albums.QueryElementAt(i, Components.interfaces.nsISupportsCString);
				treeView.visibleData.splice(idx + i + 1, 0, [album.toString(), 1,true, false]);
			}

			treeView.rowCount=treeView.visibleData.length;
			treeView.treeBox.rowCountChanged(idx + 1, albums.Count());
           
            
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

    dump("getTracks\n");// Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();
    
    var artistParam = xmlRpcClient.createType(xmlRpcClient.STRING,{});
    artistParam.data=artist;
    var albumParam = xmlRpcClient.createType(xmlRpcClient.STRING,{});
    albumParam.data=album;
    xmlRpcClient.asyncCall(getAlbumsHandler, null, 'tracks', [artistParam,albumParam], 2);
}
var getTracksHandler = {

        onResult: function(client, ctxt, result) {
        	var idx = from

            var tracks = result.QueryInterface(
                Components.interfaces.nsISupportsArray);

			for (var i = 0; i < tracks.Count(); i++) {
				track = tracks.QueryElementAt(i, Components.interfaces.nsISupportsCString);
				treeView.visibleData.splice(idx + i + 1, 0, [track.toString(),2, false, false]);
			}

			treeView.rowCount=treeView.visibleData.length;
			treeView.treeBox.rowCountChanged(idx + 1, tracks.Count());
           
            
	},
	onFault: function (client, ctxt, fault) {
		alert('getTracksHandler XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('getTracksHandler Error: '+errorMsg);
	}
};



var from = 0;
var initData = [];
var treeview=null;

function initCollectionBrowser(artists)
{
	dump("initCollectionBrowser\n");

	initData = [];
	for (i=0; i < artists.Count(); i++) {
        var artist = artists.QueryElementAt(i, Components.interfaces.nsISupportsCString);
        initData[i] = [artist.toString(),0, true,false];
    }
	
    treeView = {
    	
        treeBox:null,
        selection:null,
        widget:null,
        idx : null,
        visibleData : null,
        
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
        
        
        	if (this.getLevel(row) == 0)  return -1;
           
		    for (var t = row - 1 ; t >= 0 ; t--) {
		      if (this.getlevel(t) == (this.getLevel(row) - 1)) return t;
		    }
        },
        
        hasNextSibling: function(idx, after) {
            var thisLevel = this.getLevel(idx);
		    for (var t = idx + 1; t < this.visibleData.length; t++) {
		      var nextLevel = this.getLevel(t)
		      if (nextLevel == thisLevel) return true;
		      else if (nextLevel < thisLevel) return false;
		    }
        },
        
   
		toggleOpenState: function(idx) {
			var item = this.visibleData[idx];
			if (!item[2]) return;
			
			if (item[3]) {
				item[3] = false;
				
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
			else {
				item[3] = true;
				from = idx;
				var thisLevel = this.getLevel(idx);
				
				if (thisLevel == 0) {
					var artist = this.visibleData[idx][0];
					getAlbums(artist)
				}
				else if (thisLevel == 1) {
					var pIdx = this.getParentIndex(idx);
					var artist = this.visibleData[pIdx][0];
					var album = this.visibleData[idx][0];
					getTracks(artist,album);
				}

			}
		},
        getRowProperties: function(row,props){},
        getCellProperties: function(row,col,props){},
        getColumnProperties: function(colid,col,props){}
  
    }

	treeView.visibleData = initData;
	treeView.rowCount = initData.length;

    document.getElementById('collectionBrowser').view = treeView;
    return true;
}


