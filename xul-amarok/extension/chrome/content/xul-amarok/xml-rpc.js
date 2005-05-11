
function getClient() 
{
    return Components.classes['@mozilla.org/xml-rpc/client;1'].createInstance(
            Components.interfaces.nsIXmlRpcClient);
}

var host;
var port;


function getXmlRpc()
{
	if (!host || !port) configure();
	
	var xmlRpcClient = getClient();
	xmlRpcClient.init('http://'+host+':'+port);
	
    return xmlRpcClient;
}
