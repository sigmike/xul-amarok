

function getClient() {
    dump("getClient\n");
    // Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    return Components.classes['@mozilla.org/xml-rpc/client;1'].createInstance(
            Components.interfaces.nsIXmlRpcClient);
}




var xmlRpcClient;


function getXmlRpc() {
    dump("getXmlRpc\n");
    if (!xmlRpcClient) {
        xmlRpcClient = getClient();
    }

    // Initialize the client with the URL
    xmlRpcClient.init('http://localhost:8888');

    return xmlRpcClient;
}


var loaded=false;
function onLoad()
{
    dump("onLoad\n");
    if (!loaded ) getPlaylist();
    loaded = true;
}


function play()
{
    dump("play\n");// Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(playerHandler, null, 'play', null, 0);
}

function playTrack(idx)
{
    dump("playTrack\n");// Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    var idxParam = xmlRpcClient.createType(xmlRpcClient.INT,{});
    idxParam.data=idx;
    xmlRpcClient.asyncCall(playerHandler, null, 'playByIndex', [idxParam], 1);
}

function next()
{ dump("next\n");
    // Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(playerHandler, null, 'next', null, 0);
}

function prev()
{ dump("prev\n");
    // Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(playerHandler, null, 'prev', null, 0);
}


function pause()
{ dump("pause\n");
    // Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(playerHandler, null, 'pause', null, 0);
}

function stop()
{ dump("stop\n");
    // Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(playerHandler, null, 'stop', null, 0);
}

var playerHandler = {

        onResult: function(client, ctxt, result) {

            methodSignatureResult = result.QueryInterface(
                Components.interfaces.nsISupportsCString);
            //getPlaylist();
            updateStatus(methodSignatureResult.toString());
            updateContextBrowser();

	},
	onFault: function (client, ctxt, fault) {
		alert('playerHandler XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('playerHandler Error: '+errorMsg);
	}
};



function volumeUp()
{
    dump("volumeUp\n");// Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(setVolumeHandler, null, 'volumeUp', null, 0);
}

function volumeDown()
{
    dump("volumeDown\n");// Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(setVolumeHandler, null, 'volumeDown', null, 0);
}



var setVolumeHandler = {

        onResult: function(client, ctxt, result) {
            volume = result.QueryInterface(
                Components.interfaces.nsISupportsPRInt32);
            volElmt = document.getElementById('volumeLabel');
            volElmt.setAttribute('label',volume + '%');

	},
	onFault: function (client, ctxt, fault) {
		alert('setVolumeHandler XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('setVolumeHandler Error: '+errorMsg);
	}
};


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




function getArtists()
{
    dump("getArtists\n");// Enable correct security
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(getArtistsHandler, null, 'artists', null, 0);
}

/**
* Handler for the getPlaylist function
*/
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






var collectionData;
var visibleData;

function initCollectionBrowser(artists)
{
dump("initCollectionBrowser\n");

    for (i=0; i<artists.Count(); i++) {
        artist = artists.QueryElementAt(i, Components.interfaces.nsISupportsCString);
        collectionData[artist]=['toto','titi'];
        visibleData[i]=[artist, true, false];
    }

    var treeView = {

        treeBox: null,
        selection: null,
        
        rowCount : visibleData.length,
        getCellText : function(idx,column){ return visibleData[idx][0]; },
        isContainer: function(idx){ return visibleData[idx][1]; },
        isContainerOpen: function(idx) {return visibleData[idx][2]},
        
        isSeparator: function(row){ return false; },
        isSorted: function(row){ return false; },
        getLevel: function(row){ return 0; },
        getImageSrc: function(row,col){ return null; },
        getRowProperties: function(row,props){},
        getCellProperties: function(row,col,props){},
        getColumnProperties: function(colid,col,props){},
        setTree: function(treebox){ this.treebox = treebox; },
       
        getParentIndex: function(idx) {
            if (this.isContainer(idx)) return -1;
            for (var t = idx - 1; t >= 0 ; t--) {
                if (this.isContainer(t)) return t;
            }
        },
        getLevel: function(idx) {
            if (this.isContainer(idx)) return 0;
            return 1;
        },
        hasNextSibling: function(idx, after) {
            var thisLevel = this.getLevel(idx);
            for (var t = idx + 1; t < visibleData.length; t++) {
                var nextLevel = this.getLevel(t);
                if (nextLevel == thisLevel) return true;
                else if (nextLevel < thisLevel) return false;
            }
        },
        
        toggleOpenState: function(idx) {
            var item = visibleData[idx];
            if (!item[1]) return;
        
            if (item[2]) {
                item[2] = false;
            
                var thisLevel = this.getLevel(idx);
                var deletecount = 0;
                for (var t = idx + 1; t < visibleData.length; t++) {
                    if (this.getLevel(t) > thisLevel) deletecount++;
                    else break;
                }
                if (deletecount) {
                    visibleData.splice(idx + 1, deletecount);
                    this.treeBox.rowCountChanged(idx + 1, -deletecount);
                }
            }
            else {
                item[2] = true;
            
                var label = visibleData[idx][0];
                var toinsert = collectionData[label];
                for (var i = 0; i < toinsert.length; i++) {
                    visibleData.splice(idx + i + 1, 0, [toinsert[i], false]);
                }
                this.treeBox.rowCountChanged(idx + 1, toinsert.length);
            }
        }
  
    };

    document.getElementById('collectionBrowser').view = treeView;
    return true;
}


/*
function refreshAll()
{
    getPlaylist();
    updateStatus('updated');
    updateContextBrowser();
}

function updateStatus(strStatus)
{
    var statusElmt = document.getElementById('statusMessage');
    statusElmt.setAttribute('label',strStatus);
    return true;
}

function updateContextBrowser()
{
    var contextBrowser = document.getElementById('contextBrowser');
    contextBrowser.reloadWithFlags(256);
    return true;
}
*/
