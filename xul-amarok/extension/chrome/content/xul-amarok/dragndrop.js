


var collectionObserver = {
    
    onDragStart: function (evt , transferData, action){
		
		var tree = evt.target.parentNode;
				
		var start = new Object();
		var end = new Object();
		var numRanges = tree.view.selection.getRangeCount();

		transferData.data= new TransferData();
		var tracks = new Array();
		
		for (var t=0; t<numRanges; t++){
			  tree.view.selection.getRangeAt(t,start,end);
			  for (var v=start.value; v<=end.value; v++){
			  	  var level = collectionView.getLevel(v);
			  	  if (level == 2)  tracks.push(v);
			  }
		}

		if (tracks.length == 0) return false;
		transferData.data.addDataForFlavour('amarok/tracks',tracks);
		
  }
};



var playlistObserver = {
	  getSupportedFlavours : function () {
	    var flavours = new FlavourSet();
	    flavours.appendFlavour('amarok/tracks');
	    return flavours;
	  },
	  
	onDragOver: function (evt,flavour,session){},
	  
	onDrop: function (evt,dropdata,session){
		
		if (dropdata.data != "") {
			var tracks = dropdata.data.split(',');
			var urls=new Array();
			for (var i=0; i<tracks.length; i++) {
				var v = tracks[i];
				var url = collectionView.visibleData[v][4];
				urls.push(url);
			}
			addTracks(urls);
		}
		
	}

}


function DUMP_obj (aObj) 
{
  for (var i in aObj)
    dump("*** aObj[" + i + "] = " + aObj[i] + "\n");
}

