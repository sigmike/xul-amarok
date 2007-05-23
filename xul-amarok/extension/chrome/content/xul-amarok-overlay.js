

function xulamarok() 
{
	var prefs = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService)
        .getBranch("amarok.");
    prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

    if (prefs.getBoolPref("openintab") == true) {
    	gBrowser.selectedTab = gBrowser.addTab("chrome://xul-amarok/content/xul-amarok.xul");
    }
    else {
    	var amarokWin = window.open("chrome://xul-amarok/content/xul-amarok.xul", 
    								"xul-amarok", "chrome,resizable,centerscreen");
    
    }

}
