
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
