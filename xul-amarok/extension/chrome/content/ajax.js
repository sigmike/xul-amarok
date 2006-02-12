
function amarokCall(method, handler, data)
{
	var req = new XMLHttpRequest();
	req.open('POST', 'http://'+host+':'+port, true);

	req.handler = handler;
	
	req.onload = function(event) {

		// The current request object object 
		var self = event.target;
		response=self.responseXML;
		if (response) eval( req.handler + '\(response\)');
	}

	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.send('method='+method+'&'+data);
}




/*

function getClient() 
{
    return Components.classes['@mozilla.org/xml-rpc/client;1'].createInstance(
            Components.interfaces.nsIXmlRpcClient);
}


function getXmlRpc()
{
	if (!host || !port) return false;
	
	var xmlRpcClient = getClient();
	xmlRpcClient.init('http://'+host+':'+port);
	
    return xmlRpcClient;
}
*/