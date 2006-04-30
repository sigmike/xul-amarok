
//handle the AJAX response
function playerHandler(xml)
{
	elmt = xml.getElementsByTagName('index').item(0);
	idx=elmt.firstChild.nodeValue;
	pos = elmt.getAttribute('position');
	
    var pbar = document.getElementById('progressBar').setAttribute('curpos',pos);
    return setPlaying(idx);
}

function play()
{
	return amarokCall('play','playerHandler','');
}

function playTrack(idx)
{
    return amarokCall('playByIndex','playerHandler','idx='+idx);
}

function next()
{ 
    return amarokCall('next','playerHandler','');
}

function prev()
{ 
    return amarokCall('prev','playerHandler','');
}


function pause()
{ 
    return amarokCall('pause','playerHandler','');
}

function stop()
{
    return amarokCall('stop','playerHandler','');
}


function seek(pos)
{
	return amarokCall('seek','playerHandler','pos='+pos);
}

function getPlaying()
{
	return amarokCall('getPlaying','playerHandler','');
}







//handle the AJAX response
function setVolumeHandler(xml)
{
	volume = xml.getElementsByTagName('volume').item(0).firstChild.nodeValue;
	document.getElementById('volumeBar').setAttribute('curpos', volume);
	return true;
}


function setVolume(vol)
{
	return amarokCall('setVolume','setVolumeHandler','vol='+vol);
}

function getVolume()
{
	return amarokCall('getVolume','setVolumeHandler','');
}




function viewCover()
{
	var host = prefs.getCharPref("amarok.host"); 
	var port = prefs.getCharPref("amarok.port");
	return window.open("http://"+host+":"+port+"/image.png",'coverwindow','chrome=no,width=300,height=300,resizable,centerscreen');
}



