

function onLoad()
{
	if (!checkPrefs()) return false;
	initCollectionBrowser();
	initPlaylist();
	getPlaying();
	getVolume();
	
	setTimer();
    return true;
}


function refresh()
{
	getPlaylist();
	getPlaying();
	getVolume();
}



var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

function checkPrefs()
{
	if (prefs.getCharPref("amarok.host")) return true;
	
	configure();
	
	if (prefs.getCharPref("amarok.host")) return true;
	return false;
}


function configure()
{
	window.openDialog("chrome://xul-amarok/content/settings.xul","settings", "chrome,modal");
}






var timerObj = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);

function setTimer()
{
    var callback = {
	 	notify:function (timer) {
	 		//following code will be executed every 10 secs:
	 		refresh();
	 	} 
	} 
 	timerObj.initWithCallback (callback , 10000 , Components.interfaces.nsITimer.TYPE_REPEATING_SLACK );
}





function DUMP_obj (aObj) 
{
  for (var i in aObj)
    dump("*** aObj[" + i + "] = " + aObj[i] + "\n");
}

