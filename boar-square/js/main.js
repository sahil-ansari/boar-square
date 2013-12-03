$(document).ready(function (){

    var map;
    var markersInMap = [];
    initMap();

    var currentLocations = [
        [
            {point: [37.9, -122.2], selected: true}
        ],
        [
            {point: [37.7, -122.0], selected: true},
            {point: [37.85, -122.25], selected: false},
            {point: [37.9, -122.5], selected: false}
        ],
        [
            {point: [37.8, -122.4], selected: true},
            {point: [37.7, -122.25], selected: false},
            {point: [37.6, -122.1], selected: false}
        ],
        [
            {point: [37.65, -122.3], selected: true}
        ]
    ];

    addLocations(currentLocations);

    function initMap() {
        var options ={
            center: new L.LatLng(37.7, -122.2),
            zoom: 10
        };

        map = new L.Map('map', options);

        var cloudmadeUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg',
            subDomains = ['1','2','3','4'],
            cloudmade = new L.TileLayer(cloudmadeUrl, {subdomains: subDomains, maxZoom: 18});

        map.addLayer(cloudmade);
    }

    $("#select2a").click(function() {
        changeSelection('2a');
    });
    $("#select2b").click(function() {
        changeSelection('2b');
    });

    function changeSelection(indexKey) {
        var letter = indexKey.substring(indexKey.length-1);
        var iIndex = parseInt(indexKey.substring(0, indexKey.length-1)) - 1; // coerce to number
        var jIndex = getJ(letter);

        var locOptions = currentLocations[iIndex];
        for (var j=0; j<locOptions.length; j++)
            locOptions[j].selected = false;
        locOptions[jIndex].selected = true;

        clearMap();
        addLocations(currentLocations);
    }

    /* 
    takes an array of arrays of points, where each sub-array contains the options for location
    number one in date.
    */
    function addLocations(locations) {
        for (var i=0; i<locations.length; i++) {
            var locOptions = locations[i];
            var iColor = getRandomColor();
            for (var j=0; j<locOptions.length; j++) {
                var loc = locOptions[j];
                var marker;
                if (loc.selected) {                     // the highlighted option
                    marker = L.marker(loc.point);
                    if (i < locations.length - 1) {
                        var selectedPoint = getSelectedPoint(locations[i+1]);
                        var unselectedLocs = getUnselectedLocs(locations[i+1]);
                        drawSelectedPath([loc.point, selectedPoint], iColor);      // highlighted line
                        drawPossiblePaths(loc.point, unselectedLocs, iColor); // dotted lines
                    }
                }
                else {
                    marker = L.marker(loc.point, {opacity: 0.5});
                    if (i < locations.length - 1) {
                        drawPossiblePaths(loc.point, locations[i+1], iColor); // all dotted lines
                    }
                }
                marker.on('click', markerClicked);
                marker.on('mouseover', markerMouseOver);
                marker.on('mouseout', markerMouseLeft)
                marker.bindLabel(getLabel(i, j), {noHide: true}).showLabel();
                marker.bindPopup('Yum yum yum yum yum a location description', {
                    closeButton: false
                });
                marker.addTo(map);
                markersInMap.push(marker);
            }
        }
    }

    function getSelectedPoint(locArray) {
        for (var i=0; i<locArray.length; i++) {
            if (locArray[i].selected)
                return locArray[i].point;
        }
        return null;
    }

    function getUnselectedLocs(locArray) {
        return locArray.filter(function(loc) {
            return loc.selected == false;
        });
    }

    function getLabel(i, j) {
        var jLabels = ['a', 'b', 'c', 'd'];
        return (i+1) + jLabels[j];
    }

    function getJ(label) {
        var labelToJ = {
            'a': 0,
            'b': 1,
            'c': 2,
            'd': 3
        };
        return labelToJ[label];
    }

    function drawPossiblePaths(startLoc, destinations, color) {
        for (var i=0; i<destinations.length; i++) {
            var dest = destinations[i];
            drawPossiblePath([startLoc, dest.point], color);
        }
    }

    function drawSelectedPath(points, lineColor) {
        var selectedLine = L.polyline(points, {
            color: lineColor,
            weight: 4,
            opacity: 1.0
        }).addTo(map);
        drawArrows(selectedLine, lineColor, 1.0, 75);
        return selectedLine;
    }

    function drawPossiblePath(points, lineColor) {
        var possibleLine = L.polyline(points, {
            dashArray: '5, 10',
            color: lineColor,
            weight: 3,
            opacity: 0.5
        }).addTo(map);
        drawArrows(possibleLine, lineColor, 0.6, 120);
        return possibleLine;
    }

    function drawArrows(line, arrowColor, arrowOpacity, repeatVal) {
        var arrow = L.polylineDecorator(line, {
            patterns: [
                {
                    offset: '20%', repeat: repeatVal, 
                    symbol: L.Symbol.arrowHead({pixelSize: 12, 
                        pathOptions: {color: arrowColor, weight: 3, stroke: true, opacity: arrowOpacity}
                    })
                }
            ]
        }).addTo(map);
        markersInMap.push(arrow);
    }

    $("#clearMap").click(clearMap);
    function clearMap() {
        for(i in map._layers) {
            if(map._layers[i]._path != undefined) {
                map.removeLayer(map._layers[i]);
            }
        }
        for (var i = 0; i < markersInMap.length; i++)
            map.removeLayer(markersInMap[i]);
        markersInMap = [];
    }

    function markerClicked(ev) {
        console.log(ev);
    }

    function markerMouseOver(ev) {
        ev.target.openPopup();
    }

    function markerMouseLeft(ev) {
        ev.target.closePopup();
    }

    function getRandomColor()  {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ )
           color += letters[Math.round(Math.random() * 15)];
        return color;
    }
});