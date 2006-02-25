


function refresh()
{
	getPlaylist();
	getPlaying();
	getVolume();
}



var timerObj;

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




var loaded=false;
function onLoad()
{
    //avoid onload to be fired 2 times
    if (!loaded ) {
    	if (!checkPrefs()) return false;
    	
    	getArtists("");
    	refresh();
    	setTimer();
 	}
    loaded = true;
    return true;
}



function configure()
{
	window.openDialog("chrome://xul-amarok/content/settings.xul","settings", "chrome,modal");
}

