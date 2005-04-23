
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
    //if (!xmlRpcClient) {
        xmlRpcClient = getClient();
    //}

    // Initialize the client with the URL
    xmlRpcClient.init('http://localhost:8888');

    return xmlRpcClient;
}
