$(document).ready(function (){

    initMap();

    function initMap() {
        var options ={
            center: new L.LatLng(37.7, -122.2),
            zoom: 10
        };

        var map = new L.Map('map', options);

        var cloudmadeUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg',
            subDomains = ['1','2','3','4'],
            cloudmade = new L.TileLayer(cloudmadeUrl, {subdomains: subDomains, maxZoom: 18});

        map.addLayer(cloudmade);

        var marker1 = L.marker([37.7, -122.2]).addTo(map);
        var marker2 = L.marker([37.9, -122.2]).addTo(map);
        var marker3 = L.marker([37.7, -122.0]).addTo(map);
        var marker4 = L.marker([38.0, -122.5], {opacity: 0.5}).addTo(map);
        /* marker4.bindLabel('Careful, she might be tired after this!'); */

        var directions = L.polyline([
            [37.7, -122.2],
            [37.9, -122.2],
            [37.7, -122.0]
        ]).addTo(map);

        var possibleDirections = L.polyline([
            [37.7, -122.2],
            [38.0, -122.5]
        ], {dashArray: '5, 10'}).addTo(map);
    }
});