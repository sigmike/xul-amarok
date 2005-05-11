


function loadPrefs()
{
	try {
		var prefObj = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		var Branch = prefObj.getBranch("amarok.");
		var prefHost=null;
		var prefPort=null;
		prefHost = Branch.prefHasUserValue("host") && Branch.getCharPref("host"); 
		prefPort = Branch.prefHasUserValue("port") && Branch.getCharPref("port");
	} catch(e) {}
	
	var hostElmt = document.getElementById('host');
	if (prefHost != "") hostElmt.value=prefHost;
	else hostElmt.value='localhost';
	
	var portElmt = document.getElementById('port');
	if (prefPort != "") portElmt.value=prefPort;
	else portElm.value="8888";
}





// Save the settings and close the window.
function saveSettings()
{

	var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	var prefObj = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	var Branch = prefObj.getBranch("amarok.");
	
	Branch.setCharPref("host", document.getElementById('host').value);
	Branch.setCharPref("port", document.getElementById('port').value);
	
	//update main window preferences
	if (window.arguments.length > 0) {
		parentGetPrefs =  window.arguments[0];
		parentGetPrefs();
	}
	window.close();
}


