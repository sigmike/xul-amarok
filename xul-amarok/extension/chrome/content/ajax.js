

var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var host;
var port;



function checkPrefs()
{
	if (prefs.getCharPref("amarok.host") == '' )  {
		configure();
		if (prefs.getCharPref("amarok.host") != '' ) return true;
		else return false;
	}
	else return true;
}


function amarokCall(method, handler, data)
{
	host = prefs.getCharPref("amarok.host"); 
	port = prefs.getCharPref("amarok.port");

	var req = new XMLHttpRequest();
	req.open('POST', 'http://'+host+':'+port, true);

	req.handler = handler;
	
	req.onload = function(event) {

		var self = event.target;
		
		if (self.readyState == 4 && self.status != 200) {
			alert(self.status+" : "+self.statusText);
			return false;
		}
		
		response=self.responseXML;
		if (response) eval( self.handler + '\(response\)');
	}

	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.send('method='+method+'&'+data);
}

