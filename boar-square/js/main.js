 var environment = {
    "Coffee": {
        previousCategory: null, 
        nextCategory: "Museum",
        places: [ 
            {name: "Stumptown", point: [37.9, -122.2], selected: true, pathsTo: [], pathsFrom: []}
        ] 
    },
    "Museum": {
        previousCategory: "Coffee",
        nextCategory: "Restaurant",
        places: [
            {name: "Met", point: [37.7, -122.0], selected: true, pathsTo: [], pathsFrom: []},
            {name: "History Museum", point: [37.85, -122.25], selected: false, pathsTo: [], pathsFrom: []},
            {name: "Guggenheim", point: [37.9, -122.5], selected: false, pathsTo: [], pathsFrom: []}
        ]
    },
    "Restaurant": {
        previousCategory: "Museum",
        nextCategory: null,
        places: [
            {name: "#1 Chinese Food", point: [37.8, -122.4], selected: true, pathsTo: [], pathsFrom: []},
            {name: "Mels", point: [37.7, -122.25], selected: false, pathsTo: [], pathsFrom: []},
            {name: "Thai Market", point: [37.6, -122.1], selected: false, pathsTo: [], pathsFrom: []}
        ]
    }
    //,
    // "Bar": {
    //     previousCategory: "Restaurant",
    //     nextCategory: null,
    //     places: [
    //         {name: "1020", point: [37.65, -122.3], selected: true , pathsTo: [], pathsFrom: []  }
    //     ] 
    // }
};



$(document).ready(function (){

    var clientId = 'CUZWQH2U4X1MDB2B4CL1PVANQG5K4DDLVWMVTV3OIARYVLT0';
    var secret = 'JVAYYMT2T1YAJHR43LMLKSHOP3PWI42SYQKH1XEPOWFCQMGV';
    
    var area = "";
    var placeID = "";   
    var startTime = "";
    var duration;
    var nearbyVenues = [];
    
    var $area = $('#place')[0];        //jquery objects for each input field
    var $startTime = $('#start')[0];
    var $duration = $('#duration')[0];

    function toVenueObject(v){ console.log("raw venue object from api:"); 
        console.dir(v);
        if('price' in v.venue)          //some places don't list prices which throws an error
            pr = Array(v.venue.price.tier+1).join('$');
        else
            pr = "not listed";

        return {
            name: v.venue.name,
            id: v.venue.id,
            lat: v.venue.location.lat,
            lng: v.venue.location.lng,
            rating: v.venue.rating,
            url: v.venue.url,               //the business' website
            checkInsCount: v.venue.stats.checkinsCount,
            price: pr,                      
            categories : v.venue.categories,
            address: v.venue.location.address+ " "+v.venue.location.postalCode,
            status: v.venue.hours.status    //number to  $$$ amount

            //photo: '',
        };
    }
    //console.dir($area);
    
    //add 'not found' handler later
    $($area).change(function(e){   //find location match, get list
                          // of recommended nearby venues
        area = this.value; 
        console.log(area);
        $.getJSON('https://api.foursquare.com/v2/venues/explore?near='+area+'&client_id='
            +clientId+'&client_secret='+secret+'&v=20120625', function( data ) {

        nearbyVenues = data.response.groups[0].items; //all the nearby places
        //console.dir(nearbyVenues);    
        var p = toVenueObject(nearbyVenues[14]);
        console.log("our object with the stuff we want:");
        console.dir(p);
        
    
        },'text');
    });

    var map;
    var markersInMap = [];

    var iToColor = [
        "#0099FF",   // blue
        "#00CC99",   // green
        "#FFFF00",   // yellow
        "#CC33FF",   // purple
        "#FF0066",   // pink
        "#FF9933"    // orange
    ];
    iToColor.sort(function() { return 0.5 - Math.random() }); /* shuffle the color array */

    var selectedPathOptions = {
        dashArray: null,
        weight: 8,
        opacity: 1.0
    };
    var possiblePathOptions = {
        dashArray: '5, 10',
        weight: 6,
        opacity: 0.5
    };

    initMap();
    setIteneraryIcons();
   
    addLocations(environment);

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

    function setIteneraryIcons() {
        for (var i=0; i<iToColor.length; i++) {
            var name = '#itenerary' + (i+1);
            var arrowName = '#itenerary-arrow' + (i+1);
            $(name).css('background-color', iToColor[i]);
            $(arrowName).css('color', iToColor[i]);
        }
    }

    function changeSelection(indexKey) {
        var pieces = indexKey.split('_');

        category = pieces[0]; 
        id = pieces[1]; 

        selectedCategory = environment[category]; 
        selectedPlace = _(selectedCategory.places).find(function(place){ 
            return place.marker._leaflet_id == indexKey;
        });

        currentlySelectedPlace = _(selectedCategory.places).find(function(place){
            return place.selected
        });

        setMarkerSelected(currentlySelectedPlace, category, false); 
        setMarkerSelected(selectedPlace, category,  true); 
    }

    function setMarkerSelected(place, category, isSelected) {
        place.selected = isSelected; 
        
        previousCategory = environment[category].previousCategory; 
        nextCategory = environment[category].nextCategory; 

        previousSelected = null; 
        nextSelected = null; 

        if (previousCategory) {
            previousSelected = _(environment[previousCategory].places).find(function(place) {
                return place.selected; 
            });
            
            var prevPath = _(place.pathsTo).find(function (path) {
                return path.adj.marker._leaflet_id == previousSelected.marker._leaflet_id;
            });
        }
        
        if (nextCategory) {
            nextSelected = _(environment[nextCategory].places).find(function(place) {
                return place.selected; 
            });  

            var nextPath = _(place.pathsFrom).find(function (path) {
                return path.adj.marker._leaflet_id == nextSelected.marker._leaflet_id;
            });
        }

        if (isSelected) {
            newOpacity = 1.0;
            newOptions = selectedPathOptions;
            
        } else {
            newOptions = 0.5; 
            newOptions = possiblePathOptions;
        }

        place.marker.setOpacity(newOptions);
        if(nextPath)
            nextPath.edge.setStyle(newOptions);
        if(prevPath)
            prevPath.edge.setStyle(newOptions); 
    }


    function createPaths(startLoc, destinations, lineColor) {
        for (var i=0; i<destinations.length; i++) {
            var selectedLine = L.polyline([startLoc.point, destinations[i].point]).addTo(map);
            
            if (startLoc.selected && destinations[i].selected) {
                selectedLine.setStyle(selectedPathOptions);
                drawArrows(selectedLine, lineColor, 0.8, 75);
            }
            else {
                selectedLine.setStyle(possiblePathOptions);
                drawArrows(selectedLine, lineColor, 0.8, 120);
            }
            selectedLine.setStyle({color: lineColor});
            startLoc.pathsFrom.push({edge: selectedLine, adj: destinations[i]});
            destinations[i].pathsTo.push({edge: selectedLine, adj: startLoc});
        }
    }

    /* 
    takes an array of arrays of points, where each sub-array contains the options for location
    number one in date.
    */
    function addLocations(locations) {
        idx = 0;
        for (category in environment) {
            typeOfPlace = environment[category];
            var locOptions = typeOfPlace.places
            typeOfPlace.color = iToColor[idx]; 

            option_div = $('#option-column');
            option_div.append("<div>");
            option_div.append("<div id='category_header'><h3>" + category + " </h3></div>");

            for (var j=0; j<locOptions.length; j++) {
                var loc = locOptions[j];
                

                var marker = L.marker(loc.point);
                
                if (!loc.selected)  
                    marker.setOpacity(0.5)                  

                if (typeOfPlace.nextCategory) {
                    nextTypeOfPlace = environment[typeOfPlace.nextCategory];
                    createPaths(loc, nextTypeOfPlace.places, typeOfPlace.color); 
                }

                marker.on('click', markerClicked);
                marker.on('mouseover', markerMouseOver);
                marker.on('mouseout', markerMouseLeft)
               
                marker.bindLabel(loc.name, {
                    noHide: true,
                    classcatgory: 'marker-label',
                }).showLabel();
               
                marker.bindPopup('Yum yum yum yum yum a location description', {
                    closeButton: false,
                });
               
                marker._leaflet_id = category + "_" + marker._leaflet_id;

                onClickCall = "thumbnailClicked(\'" + marker._leaflet_id + "\')"
                option_div.append("<div class='place_thumbnail'> " +
                                  " <img src='img/placeholder.jpg' alt='' width='60' height='60'><br />" + 
                                  loc.name + "</div>")
                // just_added = option_div.children().last(); 
                // just_added_thumbnail = just_added.children('img');
                // just_added.click(function() {
                //     thumbnailClicked(marker._leaflet_id)
                // }
                // )

                marker.addTo(map);
                markersInMap.push(marker);
                
                loc.marker = marker;
            }
            idx += 1; 

            option_div.append("<hr class='clear_both'></div>");
        }
    }
  
    function drawArrows(line, arrowColor, arrowOpacity, repeatVal) {
        var arrow = L.polylineDecorator(line, {
            patterns: [
                {
                    offset: '20%', repeat: repeatVal, 
                    symbol: L.Symbol.arrowHead({pixelSize: 20, 
                        pathOptions: {
                            color: arrowColor, 
                            weight: 3, 
                            stroke: true, 
                            opacity: arrowOpacity,
                            fillOpacity: 0.6
                        }
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

    function thumbnailClicked(leaflet_id){
        changeSelection(leaflet_id);
    }

    function markerClicked(ev) {
        tag = ev.target; 
        changeSelection(tag._leaflet_id)
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