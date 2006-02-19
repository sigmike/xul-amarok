

var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);



function checkPrefs()
{
	if (prefs.getCharPref("amarok.host")) return true;
	
	configure();
	
	if (prefs.getCharPref("amarok.host")) return true;
	return false;
}





function amarokCall(method, handler, data)
{
	var host = prefs.getCharPref("amarok.host"); 
	var port = prefs.getCharPref("amarok.port");
	var login = prefs.getCharPref("amarok.login");
	var passwd = prefs.getCharPref("amarok.passwd");
	
	var req = new XMLHttpRequest();

	req.open('POST', 'http://'+host+':'+port, true);
	req.handler = handler;
	
	req.onload = function(event) {

		var self = event.target;
		
		if (self.readyState == 4 && self.status != 200) {
			showError(self.status+" : "+self.statusText)
			return false;
		}
		
		response=self.responseXML;
		if (response) eval( self.handler + '\(response\)');
	}

	req.setRequestHeader('Authorization', 'Basic '+btoa(login+':'+passwd));
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.send('method='+method+'&'+data);
}

