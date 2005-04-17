

// Enable correct security
netscape.security.PrivilegeManager.enablePrivilege(
                    'UniversalXPConnect UniversalBrowserAccess');
var xmlRpcClient = Components.classes['@mozilla.org/xml-rpc/client;1'].createInstance(
                    Components.interfaces.nsIXmlRpcClient);

serverUrl = 'http://localhost:8888';
// Initialize the client with the URL
xmlRpcClient.init(serverUrl);



function play()
{
    netscape.security.PrivilegeManager.enablePrivilege(
                    'UniversalXPConnect UniversalBrowserAccess');
    xmlRpcClient.asyncCall(playerHandler, null, 'play', null, 0);
}

function playTrack(idx)
{
    netscape.security.PrivilegeManager.enablePrivilege(
                    'UniversalXPConnect UniversalBrowserAccess');
    var idxParam = xmlRpcClient.createType(xmlRpcClient.INT,{});
    idxParam.data=idx;
    xmlRpcClient.asyncCall(playerHandler, null, 'playByIndex', [idxParam], 1);
}

function next()
{
    netscape.security.PrivilegeManager.enablePrivilege(
                    'UniversalXPConnect UniversalBrowserAccess');
    xmlRpcClient.asyncCall(playerHandler, null, 'next', null, 0);
}

function prev()
{
    netscape.security.PrivilegeManager.enablePrivilege(
                    'UniversalXPConnect UniversalBrowserAccess');
    xmlRpcClient.asyncCall(playerHandler, null, 'prev', null, 0);
}


function pause()
{
    netscape.security.PrivilegeManager.enablePrivilege(
                    'UniversalXPConnect UniversalBrowserAccess');
    xmlRpcClient.asyncCall(playerHandler, null, 'pause', null, 0);
}

function stop()
{
    netscape.security.PrivilegeManager.enablePrivilege(
                    'UniversalXPConnect UniversalBrowserAccess');
    xmlRpcClient.asyncCall(playerHandler, null, 'stop', null, 0);
}

var playerHandler = {

        onResult: function(client, ctxt, result) {
            netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess')
            methodSignatureResult = result.QueryInterface(
                Components.interfaces.nsISupportsCString);
            //getPlaylist();
            updateStatus(methodSignatureResult.toString());
            updateContextBrowser();
	},
	onFault: function (client, ctxt, fault) {
        netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess')
		alert('XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
        netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess')
		alert('Error: '+errorMsg);
	}
};



function volumeUp()
{
    netscape.security.PrivilegeManager.enablePrivilege(
                    'UniversalXPConnect UniversalBrowserAccess');
    xmlRpcClient.asyncCall(setVolumeHandler, null, 'volumeUp', null, 0);
}

function volumeDown()
{
    netscape.security.PrivilegeManager.enablePrivilege(
                    'UniversalXPConnect UniversalBrowserAccess');
    xmlRpcClient.asyncCall(setVolumeHandler, null, 'volumeDown', null, 0);
}



var setVolumeHandler = {

        onResult: function(client, ctxt, result) {
            netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
            volume = result.QueryInterface(
                Components.interfaces.nsISupportsPRInt32);
            volElmt = document.getElementById('volumeLabel');
            volElmt.setAttribute('label',volume + '%');

	},
	onFault: function (client, ctxt, fault) {
        netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
		alert('XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
        netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
		alert('Error: '+errorMsg);
	}
};


function getPlaylist()
{
    netscape.security.PrivilegeManager.enablePrivilege(
                    'UniversalXPConnect UniversalBrowserAccess');
    // Make the XML-RPC call, passing the parameter
    xmlRpcClient.asyncCall(getPlaylistHandler, null, 'getPlaylist', null, 0);
}

/**
* Handler for the getPlaylist function
*/
var getPlaylistHandler = {

        onResult: function(client, ctxt, result) {
            netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
            var playlistXml = result.QueryInterface(
                Components.interfaces.nsISupportsCString);
            refreshPlaylist(playlistXml);
	},
	onFault: function (client, ctxt, fault) {
		alert('XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('Error: '+errorMsg);
	}
};




function refreshPlaylist(xlpPl)
{
    var dom = new DOMParser();
    var pl = dom.parseFromString (xlpPl,"application/xml");
    var tracks = pl.getElementsByTagName('item');
    
    netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
                
    var treeView = {
        rowCount : tracks.length,
        getCellText : function(row,column){
            netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
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




function getArtists()
{
    netscape.security.PrivilegeManager.enablePrivilege(
                    'UniversalXPConnect UniversalBrowserAccess');
    xmlRpcClient.asyncCall(getArtistsHandler, null, 'artists', null, 0);
}

/**
* Handler for the getPlaylist function
*/
var getArtistsHandler = {

        onResult: function(client, ctxt, result) {
            netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
            var artists = result.QueryInterface(
                Components.interfaces.nsISupportsArray);
            initCollectionBrowser(artists);
	},
	onFault: function (client, ctxt, fault) {
            netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
		alert('XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
            netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
		alert('Error: '+errorMsg);
	}
};



function initCollectionBrowser(artists)
{
    
    var treeView = {
        rowCount : artists.Count(),
        getCellText : function(row,column){
            netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
            artist = artists.QueryElementAt(
                            row, Components.interfaces.nsISupportsCString);
            return artist.toString();
        },
        setTree: function(treebox){ this.treebox = treebox; },
        isContainer: function(row){ return true; },
        isSeparator: function(row){ return false; },
        isSorted: function(row){ return false; },
        getLevel: function(row){ return 0; },
        getImageSrc: function(row,col){ return null; },
        getRowProperties: function(row,props){},
        getCellProperties: function(row,col,props){},
        getColumnProperties: function(colid,col,props){}
    };

    document.getElementById('collectionBrowser').view = treeView;
    return true;
}

/*  <treeitem container="true">
                    <treerow><treecell label="artist" /></treerow>
                    <treechildren class="albums">
                    <treeitem container="true">
                            <treerow><treecell label="album"/></treerow>
                            <treechildren class="tracks">
                            <treeitem>
                                    <treerow><treecell label="track1"/></treerow>
                            </treeitem>
                            <treeitem>
                                    <treerow><treecell label="track2"/></treerow>
                            </treeitem>
                            <treeitem>
                                    <treerow><treecell label="track3"/></treerow>
                            </treeitem>
                            <treeitem>
                                    <treerow><treecell label="track4"/></treerow>
                            </treeitem>
                            </treechildren>
                    </treeitem>
                    </treechildren>
            </treeitem>
            </treechildren>*/

function updateStatus(strStatus)
{
    netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
    var statusElmt = document.getElementById('statusMessage');
    statusElmt.setAttribute('label',strStatus);
    return true;
}


function refreshAll()
{
    netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
    getPlaylist();
    updateStatus('updated');
    updateContextBrowser();
    
}

function updateContextBrowser()
{
    netscape.security.PrivilegeManager.enablePrivilege(
                'UniversalXPConnect UniversalBrowserAccess');
    var contextBrowser = document.getElementById('contextBrowser');
    contextBrowser.reloadWithFlags(256);
    return true;
}

