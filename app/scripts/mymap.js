if (typeof app.MyMap == 'undefined') app.MyMap = {};

app.MyMap.init = function( zoom, layer, centerLat , centerLon){

	// console.log(zoom);
	if (!centerLat)
		centerLat = 33.8833;
	if (!centerLon)
		centerLon = 35.500;
	if (!layer) 
		layer = 'mayakreidieh.map-whlhg44m';
	if (!zoom)
		zoom = 10;

	var map = L.mapbox.map('map-vis');
	map.addLayer(L.mapbox.tileLayer(layer));
	map.setView([centerLat, centerLon], zoom);
	map.options.minZoom=2;
	// map.zoom(zoom,true);
	return map;
}

// Returns the content of filename as a string
app.MyMap.readCsv = function( filename, map, callback, foo ){

	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET",filename,false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseText;
	console.log(xmlDoc);
	callback(map, xmlDoc, foo);
}


app.MyMap.plotMap = function(map, csvData, foo){

	var markerLayer = L.mapbox.markers.tileLayer().csv(csvData);
	L.mapbox.markers.interaction(markerLayer);
	map.addLayer(markerLayer);

	 var interaction = L.mapbox.markers.interaction(markerLayer);


	    // Set a custom formatter for tooltips
    // Provide a function that returns html to be used in tooltip
    interaction.formatter(foo);

    

}

