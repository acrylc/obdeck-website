
(function(){


    foo = function(feature) {
        var o = '<h2 id="b">' + feature.properties.title + '</h2>' +
            '<div id="coord">' + feature.properties.lat +','+feature.properties.lon+ '</div>';
        return o;
    };
	
	var map = maps.init(9);
	maps.readCsv('test.txt', map, maps.plotMap, foo);
	maps.readCsv('ed.csv', map, maps.plotMap, foo);



})();
