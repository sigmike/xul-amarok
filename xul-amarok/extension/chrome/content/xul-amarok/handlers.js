

var timerObj;


var loaded=false;
function onLoad()
{
    dump("onLoad\n");
    //avoid onload to be fired 2 times
    if (!loaded ) {
    	getPrefs();
    	getArtists("");
    	refresh();
    	setTimer();
 	}
    loaded = true;
}


function refresh()
{
	dump('refresh\n');
	getPlaylist();
	getTime();
	getVolume();
}



function setTimer()
{
    
    var callback = {
	 	notify:function (timer) {
	 		//following code will be executed every 10 secs:
	 		refresh();
	 		
	 		
	 	} 
	} 
	
	timerObj = Components.classes["@mozilla.org/timer;1"].createInstance(
        Components.interfaces.nsITimer);
 	timerObj.initWithCallback (callback , 10000 , Components.interfaces.nsITimer.TYPE_REPEATING_SLACK );
}


function configure()
{
	//getPrefs() will be called on close
	window.openDialog("chrome://xul-amarok/content/settings.xul","settings",
                  "chrome,modal",getPrefs);
}


function getPrefs()
{
	try {
		var prefObj = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		var Branch = prefObj.getBranch("amarok.");
		var prefHost = Branch.prefHasUserValue("host") && Branch.getCharPref("host"); 
		var prefPort = Branch.prefHasUserValue("port") && Branch.getCharPref("port");
	} catch(e) {}
	
	if (prefHost && prefPort) {
		host=prefHost;
		port=prefPort;
	}
}

