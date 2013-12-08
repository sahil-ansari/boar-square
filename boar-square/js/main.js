 var blankEnvironment = {
    "__START__": {nextCategory: null}
 };

 var environment = {
    "__START__": {nextCategory: null}
    //"__START__": {nextCategory: "Coffee"}

    
    // "Coffee": {
    //     previousCategory: null, 
    //     nextCategory: "Museum",
    //     categoryColorClass: "coffee-color",
    //     categoryDateTime: "1 PM",
    //     places: [ 
    //         {name: "Stumptown", address: "123 town", point: [37.9, -122.2], selected: true, pathsTo: [], pathsFrom: []}
    //         // ,{name: "doodo", address: "123 town", point: [37.89, -122.25], selected: false, pathsTo: [], pathsFrom: []}
        
    //     ] 
    // },
    // "Museum": {
    //     previousCategory: "Coffee",
    //     nextCategory: "Restaurant",
    //     categoryColorClass: "park-color",
    //     categoryDateTime: "2 PM",
    //     places: [
    //         {name: "Met", address: "123 town", point: [37.7, -122.0], selected: true, pathsTo: [], pathsFrom: []},
    //         {name: "History Museum", address: "123 town", point: [37.85, -122.25], selected: false, pathsTo: [], pathsFrom: []},
    //         {name: "Guggenheim", address: "123 town", point: [37.9, -122.5], selected: false, pathsTo: [], pathsFrom: []}
    //     ]
    // },
    // "Restaurant": {
    //     previousCategory: "Museum",
    //     nextCategory: "Bar",
    //     categoryColorClass: "museum-color",
    //     categoryDateTime: "3 PM",
    //     places: [
    //         {name: "#1 Chinese Food", address: "123 town", point: [37.8, -122.4], selected: true, pathsTo: [], pathsFrom: []},
    //         {name: "Mels", address: "123 town", point: [37.7, -122.25], selected: false, pathsTo: [], pathsFrom: []},
    //         {name: "Thai Market", address: "123 town", point: [37.6, -122.1], selected: false, pathsTo: [], pathsFrom: []}
    //     ]
    // }
    // ,
    // "Bar": {
    //     previousCategory: "Restaurant",
    //     nextCategory: null,
    //     categoryColorClass: "bar-color",
    //     categoryDateTime: "4 PM",
    //     places: [
    //         {name: "1020", address: "123 town", point: [37.65, -122.3], selected: true , pathsTo: [], pathsFrom: []  }
    //     ] 
    // }
    
};

var clientId = 'CUZWQH2U4X1MDB2B4CL1PVANQG5K4DDLVWMVTV3OIARYVLT0';
var secret = 'JVAYYMT2T1YAJHR43LMLKSHOP3PWI42SYQKH1XEPOWFCQMGV';
var cats;
var categoryIds = {};

var placeID = "";   
var nearbyVenues = {};

var map;
var markersInMap = [];
var mapInitiated = false;
var resetMap = true;

var searchVenuesCounter = 0;
var searchVenuesCounterLimit;
var mostRecentCategoryAdded = "__START__";
var timeForNextDate = 1;
var currentArea = null;

var the_lat;
var the_lon;

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

var iToColor = [
        "#0099FF",   // blue
        "#00CC99",   // green
        "#FFFF00",   // yellow
        "#CC33FF",   // purple
        "#FF0066",   // pink
        "#FF9933"    // orange
];

var foursquareSections = ['food', 'drinks', 'coffee', 'shops', 'arts', 'outdoors', 'sights', 'trending'];
var foursquareSectionToCat = {
    'food': 'Restaurant',
    'drinks': 'Bar',
    'coffee': 'Coffee',
    'shops': 'Shopping',
    'arts': 'Museum',
    'outdoors': 'Outdoors',
    'sights': 'Sights',
    'trending': 'Hot spots'
};
var categoryColors = {
    Coffee: {color: 'rgba(255, 215, 128, 0.8)', 'class': 'coffee-color'},
    Museum: {color: 'rgba(0, 225, 75, 0.8)', 'class': 'park-color'}, 
    Restaurant: {color: 'rgba(225, 0, 25, 0.8)', 'class': 'restaurant-color'},
    Bar: {color: 'rgba(200, 200, 200, 0.8)', 'class': 'bar-color'},
    Shopping: {color: 'rgba(155, 100, 200, 0.8)', 'class': 'shopping-color'},
    Outdoors: {color: 'rgba(100, 150, 175, 0.8)', 'class': 'outdoors-color'},
    Sights: {color: 'rgba(50, 75, 100, 0.8)', 'class': 'sights-color'},
    'Hot spots': {color: 'rgba(25, 25, 200, 0.8)', 'class': 'hotspots-color'}
};
var sectionToIcon = {
    'food': 'img/icons/food.jpg',
    'drinks': 'img/icons/nightlife.jpg',
    'coffee': 'img/icons/coffee.jpg',
    'shops': 'img/icons/shopping.jpg',
    'arts': 'img/icons/arts.jpg',
    'outdoors': 'img/icons/outdoors.jpg',
    'sights': 'img/icons/sights.jpg',
    'trending': 'img/icons/trending.jpg'
}

//function addToEnvironment(category, new_name, new_address, new_point, new_selected) {
function addToEnvironment(category, placeObject, new_selected) {
    if (!environment[category]){
        console.error("Category: " + category + " doesn't exist! Can't add: " + placeObject.name + "!");
        return;
    }

    var newPlace = jQuery.extend(true, {
        selected: new_selected,
        pathsTo: [],
        pathsFrom: []
    }, placeObject); // deep copy

    environment[category].places.push( newPlace ); 
    //console.log(environment[category]);

    return newPlace;
}

function addNewCategory(name, previous, color, date_time) {
    if (environment[name]) {
        console.error("Category: " + category + " already exists!");
    }
    
    //console.log(previous);
    var nextCat = environment[previous].nextCategory;
    environment[name] = {
        previousCategory: previous,
        nextCategory: nextCat, 
        categoryColorClass: color, 
        categoryDateTime: date_time, 
        places: []
    }

    environment[previous].nextCategory = name;
    if (nextCat != null) {
        environment[nextCat].previousCategory = name;
    }
}

 // what the api takes as 'section' parameter
function toNearbyVenues(venues, section){ 
    //log("raw venue object from api:"); 
    //console.dir(venues);
    var tmp = [venues.length];
    
    for(var i = 0; i<venues.length; i++)
    {
        //console.log(venues[i].venue.name);
        var ven = rawVenueToOurVenue(venues[i].venue, venues[i].tips, section);

        //console.dir(ven);
        tmp[i]= ven;//push[ven];
     }
     
    return tmp;
}

function rawVenueToOurVenue(venue, tips, section) {
    var ven = {
        name: venue.name,
        id: venue.id,
        point: [venue.location.lat, venue.location.lng],
        rating: venue.rating,
        url: venue.url,               //the business' website
        checkInsCount: venue.stats.checkinsCount,
        point: [venue.location.lat, venue.location.lng],                    
        address: venue.location.address + ", " + venue.location.postalCode
        //status: v.venue.hours.status    //number to  $$$ amount
    };

    if (venue.categories.length >= 1) {
        ven.specificCategory = venue.categories[0].name;
    }
    else {
        ven.specificCategory = 'No category';
    }

    if('price' in venue)          //some places don't list prices which throws an error
        ven.price = Array(venue.price.tier+1).join('$');
    else
        ven.price = "not listed";

    if (tips && tips.length >= 1) {
        ven.tip = tips[0].text;
    }
    else {
        ven.tip = '';
    }

    var photogroups = venue.photos.groups;
    if (photogroups.length > 0) {
        var photoZone = photogroups[photogroups.length - 1].items[0];
        ven.photo = photoZone.prefix + 'original' + photoZone.suffix;
    }
    else {
        ven.photo = sectionToIcon[section];
    }

    return ven;
}

function setCategoryRef(apiCategories){
    cats = apiCategories;
    console.log("hi");
    for(var i = 0;i<cats.response.categories.length;i++) {
        var cat = cats.response.categories[i];
        categoryIds[cat.name] = cat.id;
        for (var j=0; j<cat.categories.length; j++) {
            var subcat = cat.categories[j];
            //categoryIds[subcat.name] = subcat.id;
        }
    } 
    //console.log(categoryIds);
}

function initMap(lat,lon) {
    the_lon = lon; 
    the_lat = lat; 
    var options ={
        center: new L.LatLng(lat, lon),
        //center: new L.LatLng(40.77, -73.94),
        zoom: 15
    };

    map = new L.Map('map', options);

    var cloudmadeUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg',
        subDomains = ['1','2','3','4'],
        cloudmade = new L.TileLayer(cloudmadeUrl, {subdomains: subDomains, maxZoom: 18});

    map.addLayer(cloudmade);
    mapInitiated = true;
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
        column.append("<div class='special-well'><div class='itenerary-item'> \
                          <div class='itenerary-item-text' id=" + itenId + ">" + selected.name + "</div>" +
                          "<div class='itenerary-item-details'>" + environment[category].categoryDateTime + "<br>" +
                          selected.address + "</div>" + 
                       "</div></div>");
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
    doIteneraryAnimation(category);
    
    selectedPlace.thumb.addClass('thumb_selected');
    currentlySelectedPlace.thumb.removeClass('thumb_selected');
}

function doIteneraryAnimation(category) {
    var itenerary_piece = $('#itenerary_' + category);
    itenerary_piece.css('color', categoryColors[category].color);
    itenerary_piece.css('font-weight', '700');
    setTimeout(function() {
        itenerary_piece.css('color', '#000');
        itenerary_piece.css('font-weight', '400');
    }, 500);
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
function initLocations(locations) {
    var idx = 0;
    var category = environment["__START__"].nextCategory;
    var option_column = $('#option-column');
        var option_div = $("<div/>", {
            "class": "category-options"
        }).appendTo(option_column); 
   
    while(category != null ) { 
        var typeOfPlace = environment[category];
        var locOptions = typeOfPlace.places
        typeOfPlace.color = iToColor[idx]; 

        var cat_header = $("<div/>", {
            "id": "category_header_" + category
        }).appendTo(option_div);

        var iconClass = '"itenerary-option-icon ' + typeOfPlace.categoryColorClass + '"';
        cat_header.append("<h3> <span class=" + iconClass + ">" + (idx+1) + "</span> " + category + " </h3></div>");
        
        var container_div = $("<div/>", {
            "class": "wrapper"
        }).appendTo(option_div);

        var category_div = $("<div/>", {
            "id": "category_div_" + category,
            "class": "option-row scrolls",
        }).appendTo(container_div)

        for (var j=0; j<locOptions.length; j++) {
            var loc = locOptions[j];
            
            var marker = L.marker(loc.point);
            loc.marker = marker;
            
            if (!loc.selected)  
                marker.setOpacity(0.5)                  

            if (typeOfPlace.nextCategory) {
                var nextTypeOfPlace = environment[typeOfPlace.nextCategory];
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

            var thumbnailDiv = $("<div/>", {
                "class": "place_thumbnail"
            }).appendTo(category_div);
            loc.thumbnailDiv = thumbnailDiv; 
            addThumbnail(loc, true);
        }
        idx += 1; 

        option_div.append("<hr class='clear_both'></div>");
        category = environment[category].nextCategory;
    }
}

function addThumbnail(loc, suggested) {
    if (suggested)
        var thumbnailClass = "thumb_suggested";
    else
        var thumbnailClass = "thumb_personal";

    if (loc.selected) {
        thumbnailClass += " thumb_selected";
    }
    //console.log(loc.photo);
    var thumb = $( "<img/>", {
      //"src": "img/placeholder.jpg",
      "src": loc.photo,
      "alt": "",
      "width": "60",
      "height": "60",
      "id": "t-"+ loc.marker._leaflet_id,
      "class": thumbnailClass,
      click: function(e) {
        marker_id = this.id.split('-')[1];
        thumbnailClicked(marker_id);
      }
    }).appendTo(loc.thumbnailDiv);
    loc.thumbnailDiv.append(loc.name);
    loc.thumb = thumb;
}

function addNewLocation(category, location, personal) {
    var category_div = $("#category_div_" + category)
    var loc = location;

    if (loc.selected) {
       var currentlySelectedPlace = _(environment[category].places).find(function(place){
        return place.selected
       });

       setMarkerSelected(currentlySelectedPlace, category, false); 
       setIteneraryIcons();
       doIteneraryAnimation(category);
       currentlySelectedPlace.thumb.removeClass('thumb_selected');
    }

    var marker = L.marker(loc.point);
    loc.marker = marker;
    if (!loc.selected)  
        marker.setOpacity(0.5)                  

    typeOfPlace = environment[category];
    if (typeOfPlace.nextCategory) {
        nextTypeOfPlace = typeOfPlace.nextCategory;
        createPaths(loc, environment[nextTypeOfPlace].places, typeOfPlace.color); 
    }

    if(typeOfPlace.previousCategory) {
        prevTypeOfPlace = typeOfPlace.previousCategory;
        _(environment[prevTypeOfPlace].places).each(function(place){ 
            createPaths(place, [loc], null);
        });
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

    var thumbnailDiv = $("<div/>", {
        "class": "place_thumbnail"
        
    }).appendTo(category_div); 
    loc.thumbnailDiv = thumbnailDiv;
    addThumbnail(loc, !personal);

    category_div.width(category_div.width() + 85)
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
    $('#option-column').empty();
    $('#option-column').append('<h2 class="major-column-header">Date template</h2>');
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

function queryFoursquare(queryString, sectionName) {
    var lat,lon;
    $.getJSON(queryString, function( data ) {
       // console.log('objects from section ' + sectionName);
        var thisCategory = foursquareSectionToCat[sectionName];
        nearbyVenues[thisCategory] = toNearbyVenues(data.response.groups[0].items, sectionName); //all the nearby places
        var theseVenues = nearbyVenues[thisCategory];

        if(resetMap)
        {   
            //console.dir(theseVenues[0].point[0]);//.venue.location.lat);
            if (!mapInitiated) {
                initMap(theseVenues[0].point[0], theseVenues[0].point[1]);
            }
            else {
                var center = new L.LatLng(theseVenues[0].point[0], theseVenues[0].point[1]);
                map.panTo(center);
            }
            resetMap = false;
        }
        //console.dir("our objects with the stuff we want:");
        //console.dir(nearbyVenues);

        /* add the new category */
        addNewCategory(thisCategory, mostRecentCategoryAdded, categoryColors[thisCategory].class, timeForNextDate + ":00");
        mostRecentCategoryAdded = thisCategory;
        timeForNextDate += 1; // 1 hour change
    
        // take 3 random ones for now (others are saved via cache)
        theseVenues.sort(function() { return 0.5 - Math.random() });
        for (var i=0; i<3 && i<theseVenues.length; i++)
        {   
            var v = theseVenues[i];
            var selected = false;
            if (i == 0)
                selected = true;
            //console.log(v);
            //console.dir(v.point);
            //lat = nearbyVenues[i].point[0];  
            //lon = nearbyVenues[i].point[1];

            addToEnvironment(thisCategory, v, selected);
        }
        searchVenuesCounter++;
    },'text');
}

function querySpecificVenueFoursquare(venueTerms, location, categoryName) {
    var queryString = 'https://api.foursquare.com/v2/venues/search?' +
        'query=' + venueTerms + 
        '&near=' + location + 
        '&intent=browse' + 
        '&limit=5' +
        '&venuePhotos=1' +
        '&client_id=' + clientId + 
        '&client_secret=' + secret + 
        '&v=20120625';
    if (categoryName !== null) {
        var categoryId = categoryIds[categoryName];
        queryString += '&categoryId=' + categoryId;
    }
    $.getJSON(queryString, function(data) {
        //console.log(venueTerms + ' results:');

        var bestMatch = data.response.venues[0];
        //console.log(bestMatch.id);
        var photoQuery = 'https://api.foursquare.com/v2/venues/' + bestMatch.id + '/photos?' +
            'limit=1' + 
            '&client_id=' + clientId + 
            '&client_secret=' + secret + 
            '&v=20120625';
        $.getJSON(photoQuery, function(photoData) {
            var photos = photoData.response.photos;
            bestMatch.photos = photos;
            var niceMatch = rawVenueToOurVenue(bestMatch, 'food');
            addedPlace = addToEnvironment("Restaurant", niceMatch, true);
            addNewLocation("Restaurant", addedPlace, true);
        })        
    }, 'text');
}

// get the parameters in our url. Sourced from stackoverflow (sort of).
function getUrlParams() {
    var vars = {};
    var terms = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < terms.length; i++) {
        var termSplit = terms[i].split('=');
        vars[termSplit[0]] = unescape(termSplit[1]);
    }
    return vars;
    //console.dir(vars);
}

function doFoursquareSectionsSearch(locationName) {
    foursquareSections.sort(function() { return 0.5 - Math.random() }); // sort the sections list

    // only take the top 3.
    // TODO: Have it take variable amount based on length of date
    searchVenuesCounterLimit = 3;
    for (var i=0; i<searchVenuesCounterLimit && i<foursquareSections.length; i++) {
        var queryString = 'https://api.foursquare.com/v2/venues/explore?near=' + locationName + 
            '&section=' + foursquareSections[i] +
            '&limit=15' + 
            '&venuePhotos=1' + 
            '&time=any' +
            '&day=any' + 
            '&client_id=' + clientId + 
            '&client_secret=' + secret + 
            '&v=20120625';
        queryFoursquare(queryString, foursquareSections[i]);
    };
}

function resetMapKeepingVariables() {
    searchVenuesCounter = 0;
    mostRecentCategoryAdded = "__START__";
    timeForNextDate = 1;
    environment = jQuery.extend(true, {}, blankEnvironment); // deep copy
}

function loadFromStore(saveName) {
    data = load_boar_sq("myData"); 

    savedEnv = data.env; 
    thisCategory = savedEnv['__START__'].nextCategory;
    while (thisCategory != null) {
        addNewCategory(thisCategory, mostRecentCategoryAdded, categoryColors[thisCategory].class, timeForNextDate + ":00");
        mostRecentCategoryAdded = thisCategory;
        timeForNextDate += 1; // 1 hour change

        _(savedEnv[thisCategory].places).each(function(savedPlace){
            addToEnvironment(thisCategory, savedPlace, savedPlace.selected); 
        }); 

        thisCategory = savedEnv[thisCategory].nextCategory;
    }

    initMap(data.loc[0], data.loc[1]);
}

function setFooterDescription(queryParams) {
    var d = "A date in " + queryParams.location + 
        " from " + queryParams.startTime + 
        " to " + queryParams.endTime +
        ". Have fun!";
    $('#footer-loc').html(d);
}

$(document).ready(function (){
    if (!store.enabled) {
        console.error('Local storage is not supported by your browser. Please disabled "Private Mode", or upgrade to a modern browser')
    }


    $.getJSON('https://api.foursquare.com/v2/venues/categories?client_id='
        +clientId+'&client_secret='+secret+'&v=20120625', function( data ) {
            setCategoryRef(data);
    });

    //querySpecificVenueFoursquare('mels burger', 'New York City', null);
    
    var $area = $('#place')[0];        //jquery objects for each input field
    var $startTime = $('#start')[0];
    var $duration = $('#duration')[0];
    
    //add 'not found' handler later
    $($area).change(function(e){   //find location match, get list of nearby places
        resetMap = true;                  // of recommended nearby venues
        area = this.value;
        currentArea = area; 

        clearMap();
        resetMapKeepingVariables();
        doFoursquareSectionsSearch(area);
        addNewLocationsOnceDone();
    });

    $('#specific-venue').submit(function() {
        var venueTerms = $("#specific-venue-query").val();
       // console.log('specific venue query');
        //console.log(currentArea);
        querySpecificVenueFoursquare(venueTerms, currentArea, null);

        return false;
    });

    //initMap(37.7,-122.2);
    //setIteneraryIcons();
    //addNewCategory("Cookies", "Coffee", "park-color", "11 AM")
    //addToEnvironment("Cookies", "insomnia", "123 town", [37.8, -122.25], true);
    //addToEnvironment("Coffee", "doodo", "123 town", [37.89, -122.25], false);
    //initLocations(environment);

    var initialQueryParams = getUrlParams();
    //console.log(initialQueryParams);
    if (!initialQueryParams.location) {
        initialQueryParams.location = 'San Francisco';
    }
    if (!initialQueryParams.startTime) {
        initialQueryParams.startTime = "3:00";
    }
    if (!initialQueryParams.endTime) {
        initialQueryParams.endTime = "6:00";
    }
    currentArea = initialQueryParams.location;
    doFoursquareSectionsSearch(initialQueryParams.location);
    setFooterDescription(initialQueryParams);
    // loadFromStore("myData");
    // initLocations(environment);
    // setIteneraryIcons();

    function addNewLocationsOnceDone() {
        if (searchVenuesCounter < searchVenuesCounterLimit) {
            //console.log('not done');
            setTimeout(addNewLocationsOnceDone, 100);
            return false;
        }
        initLocations(environment);
        setIteneraryIcons();
        save_boar_sq({
                      q: initialQueryParams, 
                      env: environment,
                      loc: [the_lat, the_lon],
                      },  
                      "myData");
        // data = load('myData');
        // console.log(load_boar_sq("myData"));
    }
    addNewLocationsOnceDone();

    $("#startTime").clockpick({
          starthour : 8,
          endhour : 23,
          layout : "horizontal",
          event : "mouseover"
    });

    $("#endTime").clockpick({
      starthour : 8,
      endhour : 23,
      layout : "horizontal",
      event : "mouseover"
    });
});