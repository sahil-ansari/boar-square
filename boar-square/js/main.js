 var environment = {
    "__START__": {nextCategory: "Coffee"},

    "Coffee": {
        previousCategory: null, 
        nextCategory: "Museum",
        categoryColorClass: "coffee-color",
        categoryDateTime: "1 PM",
        places: [ 
            {name: "Stumptown", address: "123 town", specificCategory: "Cool Coffee", point: [37.9, -122.2], selected: true, pathsTo: [], pathsFrom: []}
        ] 
    },
    "Museum": {
        previousCategory: "Coffee",
        nextCategory: "Restaurant",
        categoryColorClass: "park-color",
        categoryDateTime: "2 PM",
        places: [
            {name: "The Met", address: "123 town", specificCategory: "Art Museum", point: [37.7, -122.0], selected: true, pathsTo: [], pathsFrom: []},
            {name: "History Museum", address: "123 town", specificCategory: "History Museum", point: [37.85, -122.25], selected: false, pathsTo: [], pathsFrom: []},
            {name: "Guggenheim", address: "123 town", specificCategory: "Art Museum", point: [37.9, -122.5], selected: false, pathsTo: [], pathsFrom: []}
        ]
    },
    "Restaurant": {
        previousCategory: "Museum",
        nextCategory: "Bar",
        categoryColorClass: "museum-color",
        categoryDateTime: "3 PM",
        places: [
            {name: "#1 Chinese Food", address: "123 town", specificCategory: "Chinese Restaurant", point: [37.8, -122.4], selected: true, pathsTo: [], pathsFrom: []},
            {name: "Mels", address: "123 town", specificCategory: "Burger bar", point: [37.7, -122.25], selected: false, pathsTo: [], pathsFrom: []},
            {name: "Thai Market", address: "123 town", specificCategory: "Thai Restaurant", point: [37.6, -122.1], selected: false, pathsTo: [], pathsFrom: []}
        ]
    }
    ,
    "Bar": {
        previousCategory: "Restaurant",
        nextCategory: null,
        categoryColorClass: "bar-color",
        categoryDateTime: "4 PM",
        places: [
            {name: "1020", address: "123 town", specificCategory: "College bar", point: [37.65, -122.3], selected: true , pathsTo: [], pathsFrom: []}
        ] 
    }
};
environment.Restaurant.places.push({name: "doodo", address: "123 town", point: [37.89, -122.25], selected: false, pathsTo: [], pathsFrom: []});



$(document).ready(function (){

    var clientId = 'CUZWQH2U4X1MDB2B4CL1PVANQG5K4DDLVWMVTV3OIARYVLT0';
    var secret = 'JVAYYMT2T1YAJHR43LMLKSHOP3PWI42SYQKH1XEPOWFCQMGV';
    var cats;
    
    var area = "";
    var placeID = "";   
    var startTime = "";
    var duration;
    var nearbyVenues = [];

    var $area = $('#place')[0];        //jquery objects for each input field
    var $startTime = $('#start')[0];
    var $duration = $('#duration')[0];

    function toNearbyVenues(venues){ 
        console.log("raw venue object from api:"); 
        console.dir(venues);
            var tmp = [venues.length];
        
        for(var i = 0; i<venues.length;i++)
        {
        //console.log(venues[i].venue.name);

        if('price' in venues[i].venue)          //some places don't list prices which throws an error
            pr = Array(venues[i].venue.price.tier+1).join('$');
        else
            pr = "not listed";
        var categ = function (){
            result = "";
            for(var i = 0; i<cats.response.categorories.length;i++){
                cats.response.categories[i];
            }
        }

        var ven = {
            name: venues[i].venue.name,
            id: venues[i].venue.id,
            point: [venues[i].venue.location.lat, venues[i].venue.location.lng],
            rating: venues[i].venue.rating,
            url: venues[i].venue.url,               //the business' website
            checkInsCount: venues[i].venue.stats.checkinsCount,
            price: pr,
            tips: venues[i].tips[0].text,
            point: [venues[i].venue.location.lat,venues[i].venue.location.lng],                    
            specificCategory: venues[i].venue.categories[0].name,
            address: venues[i].venue.location.address+ " "+venues[i].venue.location.postalCode
            //status: v.venue.hours.status    //number to  $$$ amount

            };
            //console.dir(ven);
            tmp[i]= ven;//push[ven];

         }
         
        return tmp;
    }

 
        $.getJSON('https://api.foursquare.com/v2/venues/categories?client_id='
            +clientId+'&client_secret='+secret+'&v=20120625', function( data ) {
                
                setCategoryRef(data);
            });
    function setCategoryRef(apiCategories){
        console.dir(apiCategories);
        cats = apiCategories;
        console.log("hi");
        for(var i = 0;i<cats.response.categories.length;i++)
        {
            console.log(cats.response.categories[i].name);
        }
    }
    
    //add 'not found' handler later
    $($area).change(function(e){   //find location match, get list of nearby places
                          // of recommended nearby venues
        area = this.value; 
        console.log(area);
        $.getJSON('https://api.foursquare.com/v2/venues/explore?near='+area+'&client_id='
            +clientId+'&client_secret='+secret+'&v=20120625', function( data ) {

        nearbyVenues = data.response.groups[0].items; //all the nearby places
        //console.dir(nearbyVenues);    
        //var p = toVenueObject(nearbyVenues[14]);
        var temp = toNearbyVenues(nearbyVenues);

        nearbyVenues = temp;

        console.dir("our objects with the stuff we want:");
        console.dir(nearbyVenues);
        
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

    var categoryColors = {
        Coffee: 'rgba(255, 215, 128, 0.8)',
        Museum: 'rgba(0, 225, 75, 0.8)',
        Restaurant: 'rgba(225, 0, 25, 0.8)',
        Bar: 'rgba(200, 200, 200, 0.8)'
    }

    var selectedPathOptions = {
        dashArray: null,
        weight: 8,
        opacity: 1.0,
        color: "#2a6496"
    };
    var possiblePathOptions = {
        dashArray: '5, 10',
        weight: 6,
        opacity: 0.5,
        color: "#E6A45E"
    };

    initMap();
    setIteneraryIcons();
   
    addLocations(environment);

    function initMap() {
        var options ={
            center: new L.LatLng(37.7, -122.2),
            //center: new L.LatLng(40.77, -73.94),
            zoom: 10
        };

        map = new L.Map('map', options);

        var cloudmadeUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg',
            subDomains = ['1','2','3','4'],
            cloudmade = new L.TileLayer(cloudmadeUrl, {subdomains: subDomains, maxZoom: 18});

        map.addLayer(cloudmade);
    }

    function findSelectedInCategory(category) {
        return _(environment[category].places).find(function(place) {
            return place.selected;
        })
    }

    function setIteneraryIcons() {
        var category = environment.__START__.nextCategory;
        column = $('#itenerary-div');
        column.empty(); 

        idx = 1; 
        while (category != null) {
            var selected = findSelectedInCategory(category);
            var itenId = '"itenerary_' + category + '"';
            column.append("<div class='itenerary-item'> \
                              <div class='itenerary-item-text' id=" + itenId + ">" + selected.name + "</div>" +
                              "<div class='itenerary-item-details'>" + environment[category].categoryDateTime + "<br>" +
                              selected.address + "</div>" + 
                           "</div>");
            category = environment[category].nextCategory;
            if (category)
                column.append("<div class='itenerary-arrow-transition'><i class='fa fa-arrow-down fa-3x'></i></div>");
            idx += 1; 
        }
    }

    function changeSelection(indexKey) {
        var pieces = indexKey.split('_');

        var category = pieces[0]; 
        var id = pieces[1]; 

        selectedCategory = environment[category]; 
        selectedPlace = _(selectedCategory.places).find(function(place){ 
            return place.marker._leaflet_id == indexKey;
        });

        currentlySelectedPlace = _(selectedCategory.places).find(function(place){
            return place.selected
        });

        setMarkerSelected(currentlySelectedPlace, category, false); 
        setMarkerSelected(selectedPlace, category,  true); 

        setIteneraryIcons();

        var itenerary_piece = $('#itenerary_' + category);
        itenerary_piece.css('color', categoryColors[category]);
        itenerary_piece.css('font-weight', '700');
        setTimeout(function() {
            itenerary_piece.css('color', '#000');
            itenerary_piece.css('font-weight', '400');
        }, 500);
        // itenerary_piece.fadeOut( "slow" );
        // itenerary_piece.html = findSelectedInCategory(category).name; 
        // itenerary_piece.fadeIn("slow");
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
            newOpacity = 0.5; 
            newOptions = possiblePathOptions;
        }

        place.marker.setOpacity(newOpacity);
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
                // drawArrows(selectedLine, lineColor, 0.8, 75);
            }
            else {
                selectedLine.setStyle(possiblePathOptions);
                // drawArrows(selectedLine, lineColor, 0.8, 120);
            }
            // selectedLine.setStyle({color: lineColor});
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
            if (category == '__START__')
                continue;                       //whoa thats cool- henry
            var typeOfPlace = environment[category];
            var locOptions = typeOfPlace.places
            typeOfPlace.color = iToColor[idx]; 

            var option_div = $('#option-column');
            option_div.append('<div class="category-options">');
            option_div.append("<div id='category_header_" + category + "'>");
            var iconClass = '"itenerary-option-icon ' + typeOfPlace.categoryColorClass + '"';
            option_div.append("<h3> <span class=" + iconClass + ">" + (idx+1) + "</span> " + category + " </h3></div>");

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
                marker.on('mouseout', markerMouseLeft);
               
                marker.bindLabel(loc.name, {
                    noHide: true,
                    className: 'marker-label ' + typeOfPlace.categoryColorClass,
                }).showLabel();
               
                marker.bindPopup(loc.specificCategory + ' - ' + loc.address, {
                    closeButton: false,
                });
                
                marker.addTo(map);
                markersInMap.push(marker);
                marker._leaflet_id = category + "_" + marker._leaflet_id;

                thumbnailDiv = $("<div/>", {
                    "class": "place_thumbnail"
                    
                }).appendTo(option_div); 

                $( "<img/>", {
                  "src": "img/placeholder.jpg",
                  "alt": "",
                  "width": "60",
                  "height": "60",
                  "id": "t-"+ marker._leaflet_id,
                  "class": "thumb",
                  click: function(e) {
                    marker_id = this.id.split('-')[1];
                    thumbnailClicked(marker_id);
                  }
                }).appendTo(thumbnailDiv);
                
                thumbnailDiv.append(loc.name);  
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
        tag = ev.target; 
        // category = tag._leaflet_id.split("_")[0]

        // option_div = $('#option-column');
        // option_div.scrollTo("#category_header_" + category);    
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