(function () {
    var foundLocation,
        markTime,
        map = new L.Map('map', {center: new L.LatLng(64, 16), zoom: 6}),
        tmp_coords = new L.LatLng(62.3868,16.32239);

    function onLocationFound(e)
    {
        if (!markTime) markTime = Date.now();
        var radius = e.accuracy / 2;
        myMarker.setLatLng( e.latlng );
        myMarker.bindPopup("Du är inom " + radius + " meter från denna punkt");
        myCircle.setRadius(radius);
        myCircle.setLatLng( e.latlng );

        // foundLocation skull kunna uteslutas...
        if (!foundLocation) {
            if (Date.now() < markTime+6000) {
                // Centrerar inte kartan om det gått mer ä6 sec sedan start
                map.setView(e.latlng,11);
            }

            if (Date.now() > markTime+4000) {
                // Centrerar kartan om det är inom 4 sec sedan start
                foundLocation = true;
            }
        }
    }

    function onLocationError(e)
    {
        alert("Kunde inte hitta din possition!");
        map.setView(tmp_coords,6);
    }

    function onBaseLayerChange(e)
    {
        // console.log(e);
        var url = e.layer._url;
        var skoterleder = -1;

        if (url) skoterleder = url.lastIndexOf("skoterleder");

        if (skoterleder > 1) {
            // Om det är skoterleder.org kartan så ska inte overlay lagret visas!
            map.removeLayer(overl);
        } else {
            map.addLayer(overl);
        }

        // https://github.com/Leaflet/Leaflet/issues/1165
        layersControl._update();
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.on('baselayerchange', onBaseLayerChange);

    var touchClassName = L.Browser.touch ? "leaflet-touch " : "";

    var moreInfoButton = L.Control.extend({
        options: {
            position: 'topright'
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div', touchClassName + 'moreinfo');
            container.id ='moreinfo';
            container.innerHTML += '<a href="#info" data-rel="dialog" data-transition="slidedown">Mer information</a>';

            return container;
        }
    });

    var openOsmLink = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function (map) {
            // Denna <a> borde ligga inom <div class='leaflet-control-attribution leaflet-control-link'>
            // <a> taggen behöver ej ha någon class.

            var container = L.DomUtil.create('a', touchClassName +
                                             'leaflet-control-attribution leaflet-control-links');
            container.href ='#';
            container.innerHTML ='Öppna i OSM';
            container.title = 'Öppna kartan i OpenStreetMap';

            container.onclick = function() {
                latlong = map.getCenter();
                zoom = map.getZoom();
                lat = latlong.lat;
                lng = latlong.lng;
                openLink = "http://www.openstreetmap.org/?lat="
                    + lat+"&lon="+lng+"&zoom="+zoom;
                window.open(openLink,'_blank');
            };

            return container;
        }
    });

    var openOsmEditLink = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function (map) {
            // Denna <a> borde ligga inom <div class='leaflet-control-attribution leaflet-control-link'>
            // <a> taggen behöver ej ha någon class.

            var container = L.DomUtil.create('a', touchClassName +
                                             'leaflet-control-attribution leaflet-control-links');
            container.href ='#';
            container.innerHTML ='Editera i OSM';
            container.title = 'Öppna kartan i OpenStreetMap Editor';

            container.onclick = function() {
                latlong = map.getCenter();
                zoom = map.getZoom();
                if (zoom < 13) zoom=13;
                lat = latlong.lat;
                lng = latlong.lng;
                openLink = "http://www.openstreetmap.org/edit?lat="
                    + lat+"&lon="+lng+"&zoom="+zoom;
                window.open(openLink,'_blank');
            };

            return container;
        }
    });



    var skoterleder = new L.tileLayer('http://tiles.skoterleder.org/tiles/{z}/{x}/{y}.png', {
        maxZoom: 14,
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> bidragsgivare, Imagery &copy; <a href="http://skoterleder.org">Skoterleder.org</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });

    var osm = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> bidragsgivare, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });

    var overl = new L.tileLayer('http://overl.skoterleder.org/tiles/{z}/{x}/{y}.png', {
        maxZoom: 16,
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> bidragsgivare, Imagery &copy; <a href="http://skoterleder.org">Skoterleder.org</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });

    var info = new L.tileLayer('http://overl.skoterleder.org/info/{z}/{x}/{y}.png', {
        maxZoom: 16,
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> bidragsgivare, Imagery &copy; <a href="http://skoterleder.org">Skoterleder.org</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    });

    var ggl = new L.Google("ROADMAP");
    var ggh = new L.Google("HYBRID");
    var ggt = new L.Google("TERRAIN");

    map.addLayer(skoterleder);
    var layersControl = new L.Control.Layers( {'Skoterleder.org':skoterleder,
                                               'Open Street Map':osm,
                                               'Google Road':ggl, 'Google Satelit':ggh, 'Google Terräng':ggt},
                                              {'Visa skoterleder':overl, 'Visa information':info });

    map.addControl(new moreInfoButton());
    map.addControl(new L.Control.SLMarkers());
    map.addControl(layersControl);
    map.addControl(new L.Control.Permalink({
        text: 'Permalink', useAnchor: true,
        useLocation: false, layers: layersControl
    }));
    map.addControl(new openOsmLink());
    map.addControl(new openOsmEditLink());

    // Använder position bara på mobila enheter och om inte "lat" är med i url:en
    if (L.Browser.touch && window.location.hash.indexOf("lat") < 1) {
        var myMarker = L.marker(tmp_coords).addTo(map).bindPopup("Söker efter position...");
        var myCircle = L.circle(tmp_coords, 1).addTo(map);
        map.locate({setView: false, maxZoom: 14,watch: true, enableHighAccuracy: true});
    }

    (function () {
	var geoJsonData = {
	    "type": "FeatureCollection",
	    "features": [
		{ "type": "Feature", "id":"1", "properties": { "address": "2"   }, "geometry":
		  { "type": "Point", "coordinates": [15.7665,62.5233 ] } },
		{ "type": "Feature", "id":"2", "properties": { "address": "151" }, "geometry":
		  { "type": "Point", "coordinates": [15.5665,62.5133    ] } },
		{ "type": "Feature", "id":"3", "properties": { "address": "21"  }, "geometry":
		  { "type": "Point", "coordinates": [15.5665,62.5433     ] } },
		{ "type": "Feature", "id":"4", "properties": { "address": "14"  }, "geometry":
		  { "type": "Point", "coordinates": [15.7165,62.5333    ] } },
		{ "type": "Feature", "id":"5", "properties": { "address": "38B" }, "geometry":
		  { "type": "Point", "coordinates": [15.7265,62.5333 ] } },
		{ "type": "Feature", "id":"6", "properties": { "address": "38"  }, "geometry":
		  { "type": "Point", "coordinates": [15.7465,62.5323 ] } }
	    ]
	};

	var markers = new L.MarkerClusterGroup();

	var geoJsonLayer = L.geoJson(geoJsonData, {
	    onEachFeature: function (feature, marker) {
		marker.bindPopup("Loading...");
		marker.on('click', function () {
		    setTimeout(function () {
			marker.bindPopup("DONE");
			marker.openPopup();
		    }, 1000);
		});
	    }
	});
	markers.addLayer(geoJsonLayer);

	map.addLayer(markers);
	map.fitBounds(markers.getBounds());
    })();
})();

    function showChooseMarker (){
        document.getElementById('cross').style.display = 'none';
        document.getElementById('center-top').style.display = 'none';
        document.getElementById('chooseMarker').style.display  = 'block';
        document.getElementById('center-bottom').style.display = 'none';

    }