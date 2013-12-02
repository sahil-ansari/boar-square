$(document).ready(function (){

    var map;
    initMap();

    var dummyLocations = [
        [
            [37.7, -122.2],
            [37.9, -122.2]
        ],
        [
            [37.7, -122.0],
            [37.85, -122.25],
            [38.0, -122.5]
        ],
        [
            [37.8, -122.4],
            [37.7, -122.25],
            [37.6, -122.1]
        ]
    ];

    addLocations(dummyLocations);

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

    /* 
    takes an array of arrays of points, where each sub-array contains the options for location
    number one in date. First element of each sub-array is selected by default
    */
    function addLocations(locations) {
        var selectedLocs = [];
        var possiblePaths = [];
        for (var i=0; i<locations.length; i++) {
            var locOptions = locations[i];
            var iColor = getRandomColor();
            for (var j=0; j<locOptions.length; j++) {
                var loc = locOptions[j];
                var marker;
                if (j == 0) { // first option is highlighted
                    marker = L.marker(loc);
                    selectedLocs.push(loc);
                    if (i < locations.length - 1) { 
                        var nextOptions = locations[i+1];
                        var nextLoc = nextOptions[0];

                        for (var k=1; k<nextOptions.length; k++) {  // connect the dashes
                            var nextOpLoc = nextOptions[k];
                            var possibleLine = L.polyline([loc, nextOpLoc], {
                                dashArray: '5, 10',
                                color: iColor,
                                weight: 3,
                                opacity: 0.75
                            }).addTo(map);
                        }
                    }
                }
                else {
                    marker = L.marker(loc, {opacity: 0.75});
                }
                marker.on('click', markerClicked).addTo(map);
            }
        }
        drawSelectedPath(selectedLocs);

        /* marker.bindLabel('Careful, she might be tired after this!'); */
    }

    function drawSelectedPath(points) {
        var lineColor = 'red'
        var selectedLine = L.polyline(points, {
            color: lineColor,
            weight: 4,
            opacity: 1.0
        }).addTo(map);
    }

    function drawPossiblePath(points) {
        var lineColor = getRandomColor();
        var possibleLine = L.polyline(points, {
            dashArray: '5, 10',
            color: lineColor,
            weight: 3,
            opacity: 0.75
        }).addTo(map);
    }

    function markerClicked(ev) {
        console.log(ev);
    }

    function getRandomColor()  {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ )
           color += letters[Math.round(Math.random() * 15)];
        return color;
    }
});