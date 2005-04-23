



function getPlaylist()
{dump("getPlaylist\n");
    // Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(getPlaylistHandler, null, 'getPlaylist', [], 0);
}




/**
* Handler for the getPlaylist function
*/
var getPlaylistHandler = {

    onResult: function(client, ctxt, result) {
        var playlistXml = result.QueryInterface(
            Components.interfaces.nsISupportsCString);
        refreshPlaylist(result);
	},
	onFault: function (client, ctxt, fault) {
		alert('getPlaylistHandler XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('getPlaylistHandler Error: '+status+errorMsg);
	}
};





function refreshPlaylist(xlpPl)
{
    dump("refreshPlaylist\n");
    var dom = new DOMParser();
    var pl = dom.parseFromString (xlpPl,"application/xml");
    var tracks = pl.getElementsByTagName('item');

    var treeView = {
        rowCount : tracks.length,
        getCellText : function(row,column){

            var track = tracks[row];
            fieldElmts = track.getElementsByTagName(column);
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
    document.getElementById('playlist').view = treeView;
    
    for (i=0; i<tracks.length; i++) {
        var track = tracks[i];
        if (track.getAttribute('queue_index') == '0') {
            document.getElementById('playlist').view.selection.select(i);
        }
    }
    
    return true;
}




