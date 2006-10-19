

var XulRemote = {

   prefs: null,
   host: '',
   port: '',
   login: '',
   passwd: '',
   intervId: null,
   confDialog: null,


   startup: function()
   {
     	// Register to receive notifications of preference changes
	    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
	        .getService(Components.interfaces.nsIPrefService)
	        .getBranch("amarok.");
	    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
	    this.prefs.addObserver("", this, false);


      	this.host = this.prefs.getCharPref("host"); 
      	this.port = this.prefs.getCharPref("port"); 
      	this.login = this.prefs.getCharPref("login"); 
      	this.passwd = this.prefs.getCharPref("passwd"); 

	    var delay = this.prefs.getIntPref("delay"); 
	    this.setRefreshInterval(delay);

		document.getElementById('collectionBrowser').view = collectionView;
		document.getElementById('playlist').view = playlistView;

		collectionView.getArtists('');
		this.refresh();
	},

	shutdown: function()
	{
	    this.prefs.removeObserver("", this);
	},


	setRefreshInterval: function(delay)
	{
		if (this.intervId) {
			window.clearInterval(this.intervId);
			this.intervId=null;
		}
		if (delay >= 2) this.intervId = window.setInterval(this.refresh, delay * 1000);
	},


	//Preferences observer
	observe: function(subject, topic, data)
    {
		if (topic != "nsPref:changed") return;
		switch(data) {
			case "delay":
				var delay = this.prefs.getIntPref("delay"); 
	            this.setRefreshInterval(delay);
	            break;
	        case "host":
	        	this.host = this.prefs.getCharPref("host"); 
	            break;
	        case "port":
	        	this.port = this.prefs.getCharPref("port");
	            break;
	        case "login":
	        	this.login = this.prefs.getCharPref("login");
	            break;
	        case "passwd":
	        	this.passwd = this.prefs.getCharPref("passwd");
	            break;
	     }
    },

	
	//AJAX CALL
	amarokCall: function(method, handler, data)
	{
		var req = new XMLHttpRequest();
	
		req.open('POST', 'http://'+this.host+':'+this.port, true);
		//alert('http://'+this.host+':'+this.port);
		req.handler = handler;
		
		req.onload = function(event) {
	
			var self = event.target;
			
			if (self.readyState == 4 && self.status != 200) {
				showError(self.status+" : "+self.statusText)
				return false;
			}
			
			response=self.responseXML;
			if (response) {
				eval( self.handler + '\(response\)');
				return true;
			}
			else return false;	
		}
	
		req.setRequestHeader('Authorization', 'Basic '+btoa(this.login+':'+this.passwd));
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		var query = 'method='+method;
		if (data) query += "&"+data;
	    req.send(query);
	},


	//content update
	refresh: function()
	{
		XulRemote.getPlaylist();
		XulRemote.getPlaying();
		XulRemote.getVolume();
	},




	/*   ============= Playlist ==================== */
	
	
	getPlaylist: function()
	{
		return this.amarokCall('getPlaylist','setPlaylist','');
	},



	clearPlaylist: function()
	{
		return this.amarokCall('clearPlaylist','setPlaylist','');
	},

	
	addTracks: function(urls)
	{
	    if (urls.length == 0) return false;
		return this.amarokCall('addTracks','setPlaylist','urls='+encodeURIComponent(urls.join('||')));
	},


	
	deleteTracks: function(tracksIds)
	{
		return this.amarokCall('deleteTracks','setPlaylist','ids='+encodeURIComponent(tracksIds.join('||')));
	},
	
	addAlbums: function(albums)
	{
	    if (albums.length == 0) return false;
		return this.amarokCall('addAlbums','setPlaylist','albums='+encodeURIComponent(albums.join('||')));
	},

	addArtists: function(artists)
	{
	    if (artists.length == 0) return false;
		return this.amarokCall('addArtists','setPlaylist','artists='+encodeURIComponent(artists.join('||')));
	},



	/*   ============= Player ==================== */
   
	   
	play: function()
	{
		return this.amarokCall('play','playerHandler','');
	},
	
	playTrack: function(idx)
	{
	    return this.amarokCall('playByIndex','playerHandler','idx='+idx);
	},
	
	next: function()
	{ 
	    return this.amarokCall('next','playerHandler','');
	},
	
	prev: function()
	{ 
	    return this.amarokCall('prev','playerHandler','');
	},
	
	
	pause: function()
	{ 
	    return this.amarokCall('pause','playerHandler','');
	},
	
	stop: function()
	{
	    return this.amarokCall('stop','playerHandler','');
	},

	
	seek: function(pos)
	{
		return this.amarokCall('seek','playerHandler','pos='+pos);
	},
	
	getPlaying: function()
	{
		return this.amarokCall('getPlaying','playerHandler','');
	},

	
	setVolume: function(vol)
	{
		return this.amarokCall('setVolume','setVolumeHandler','vol='+vol);
	},
	
	getVolume: function()
	{
		return this.amarokCall('getVolume','setVolumeHandler','');
	},
	

	/*   ============= MISC ==================== */
	
	
	configure: function()
	{
		window.openDialog("chrome://xul-amarok/content/settings.xul","settings", "chrome,modal");
	},
	
	
	viewCover: function()
	{
		return window.open("http://"+this.host+":"+this.port+"/image.png",'coverwindow','chrome=no,width=300,height=300,resizable,centerscreen');
	}

	
   
}

window.addEventListener("load", function(e) { XulRemote.startup(); }, false);
window.addEventListener("unload", function(e) { XulRemote.shutdown(); }, false);


