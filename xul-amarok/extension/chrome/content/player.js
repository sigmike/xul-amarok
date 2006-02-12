


function play()
{
	amarokCall('play','playerHandler','');
}

function playTrack(idx)
{
    amarokCall('playByIndex','playerHandler','idx='+idx);
}

function next()
{ 
    amarokCall('next','playerHandler','');
}

function prev()
{ 
    amarokCall('prev','playerHandler','');
}


function pause()
{ 
    amarokCall('pause','playerHandler','');
}

function stop()
{
    amarokCall('stop','playerHandler','');
}


function seek(pos)
{
	amarokCall('seek','playerHandler','pos='+pos);
}

function getPlaying()
{
	amarokCall('getPlaying','playerHandler','');
}


function playerHandler(xml)
{
	elmt = xml.getElementsByTagName('index').item(0);
	idx=elmt.firstChild.nodeValue;
	pos = elmt.getAttribute('position');
	
    var pbar = document.getElementById('progressBar').setAttribute('curpos',pos);
    setPlaying(idx);
}


function viewCover()
{
	window.open("http://"+host+":"+port+"/image.png",'coverwindow','chrome=no,width=300,height=300,resizable,centerscreen');
}


function setVolume(vol)
{
	amarokCall('setVolume','setVolumeHandler','vol='+vol);
}

function getVolume()
{
	amarokCall('getVolume','setVolumeHandler','');
}

function setVolumeHandler(xml)
{
	volume = xml.getElementsByTagName('volume').item(0).firstChild.nodeValue;
	document.getElementById('volumeBar').setAttribute('curpos', volume);
}




