



function play()
{
    dump("play\n");
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(playerHandler, null, 'play', null, 0);
}

function playTrack(idx)
{
    dump("playTrack\n");
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    var idxParam = xmlRpcClient.createType(xmlRpcClient.INT,{});
    idxParam.data=idx;
    xmlRpcClient.asyncCall(playerHandler, null, 'playByIndex', [idxParam], 1);
}

function next()
{ 
	dump("next\n");

    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(playerHandler, null, 'next', null, 0);
}

function prev()
{ 
	dump("prev\n");

    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(playerHandler, null, 'prev', null, 0);
}


function pause()
{ 
	dump("pause\n");
   
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(playerHandler, null, 'pause', null, 0);
}

function stop()
{
	dump("stop\n");
   
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
    dump("volumeUp\n");
    netscape.security.PrivilegeManager.enablePrivilege(
            'UniversalXPConnect UniversalBrowserAccess');
    var xmlRpcClient = getXmlRpc();

    xmlRpcClient.asyncCall(setVolumeHandler, null, 'volumeUp', null, 0);
}

function volumeDown()
{
    dump("volumeDown\n");
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