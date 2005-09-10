




function play()
{
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(playerHandler, null, 'play', null, 0);
}

function playTrack(idx)
{
    var xmlRpcClient = getXmlRpc();

    var idxParam = xmlRpcClient.createType(xmlRpcClient.INT,{});
    idxParam.data=idx;
    xmlRpcClient.asyncCall(playerHandler, null, 'playByIndex', [idxParam], 1);
}

function next()
{ 
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(playerHandler, null, 'next', null, 0);
}

function prev()
{ 
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(playerHandler, null, 'prev', null, 0);
}


function pause()
{ 
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(playerHandler, null, 'pause', null, 0);
}

function stop()
{
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(playerHandler, null, 'stop', null, 0);
}
 
var playerHandler = {

    onResult: function(client, action, result) {

        idx = result.QueryInterface(
            Components.interfaces.nsISupportsPRInt32);
		var pbar = document.getElementById('progressBar');
        pbar.value='0';
        setPlaying(idx.toString());

	},
	onFault: function (client, ctxt, fault) {
		alert('playerHandler XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('playerHandler Error: '+errorMsg);
	}
};
 



function togglePartyMode()
{
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(togglePartyModeHandler, null, 'togglePartyMode', null, 0);
}



var togglePartyModeHandler = {

    onResult: function(client, action, result) {

        status = result.QueryInterface(
            Components.interfaces.nsISupportsPRBool);
		button=document.getElementById('partymode');
		if (status == 'true') button.setAttribute('class','enabled');
		else button.setAttribute('class','disabled');
		
	},
	onFault: function (client, ctxt, fault) {
		alert('ERROR: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('togglePartyMode Error: '+errorMsg);
	}
};
 






function getTime()
{
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(getTimeHandler, null, 'trackTime', null, 0);
}


function seekTo(event)
{
	var clickedAt = event.screenX;
	var boxObj = document.getElementById('progressBar').boxObject;
	var from = boxObj.screenX;
	var width = boxObj.width;
	
	var pos =  (100 * (clickedAt - from) / width);
	document.getElementById('progressBar').value=pos;
	
    var xmlRpcClient = getXmlRpc();
    var posParam = xmlRpcClient.createType(xmlRpcClient.INT,{});
    posParam.data=pos;
    xmlRpcClient.asyncCall(getTimeHandler, null, 'seek', [posParam], 1);
}

 
var getTimeHandler = {

    onResult: function(client, ctxt, result) {
        progress = result.QueryInterface(
            Components.interfaces.nsISupportsPRInt32);
            
        var pbar = document.getElementById('progressBar');
        pbar.value= progress.toString();
        
	},
	onFault: function (client, ctxt, fault) {
		alert('getTimeHandler XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('getTimeHandler Error: '+errorMsg);
	}
};








function volumeUp()
{
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(setVolumeHandler, null, 'volumeUp', null, 0);
}

function volumeDown()
{
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(setVolumeHandler, null, 'volumeDown', null, 0);
}


function setVolume(event)
{
	var clickedAt = event.screenX;
	var boxObj = document.getElementById('volumeBar').boxObject;
	var from = boxObj.screenX;
	var width = boxObj.width;
	
	var pos =  (100 * (clickedAt - from) / width);
	document.getElementById('volumeBar').value=pos;
   
    var xmlRpcClient = getXmlRpc();
    var posParam = xmlRpcClient.createType(xmlRpcClient.INT,{});
    posParam.data=pos;
    xmlRpcClient.asyncCall(setVolumeHandler, null, 'setVolume', [posParam], 1);
}

function getVolume()
{
    var xmlRpcClient = getXmlRpc();
    xmlRpcClient.asyncCall(setVolumeHandler, null, 'getVolume', [], 0);
}


var setVolumeHandler = {

    onResult: function(client, ctxt, result) {
        volume = result.QueryInterface(
            Components.interfaces.nsISupportsPRInt32);

        document.getElementById('volumeBar').value=volume.toString();
	},
	onFault: function (client, ctxt, fault) {
		alert('setVolumeHandler XML-RPC Fault: '+fault);
	},
	onError: function (client, ctxt, status, errorMsg) {
		alert('setVolumeHandler Error: '+errorMsg);
	}
};


function updateStatus(strStatus)
{
    var statusElmt = document.getElementById('statusMessage');
    statusElmt.setAttribute('label',strStatus);
    return true;
}

