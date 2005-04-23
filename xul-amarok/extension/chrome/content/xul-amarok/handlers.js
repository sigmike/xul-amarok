


var loaded=false;
function onLoad()
{
    dump("onLoad\n");
    if (!loaded ) {
    	getPlaylist();
    	getArtists("");	
    }
    loaded = true;
}