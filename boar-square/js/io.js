function makeSavable(environemnt) {
	category = environemnt['__START__'].nextCategory;

	savable = {};
	savable['__START__'] = {}
	savable['__START__'] = $.extend({}, environment['__START__']);
	while (category != null) {
		savable[category] = {}
		cat = savable[category];
		cat['nextCategory'] = environemnt[category].nextCategory;
		cat['prevCategory'] = environemnt[category].prevCategory;
		cat['categoryColorClass'] = environemnt[category].categoryColorClass;
		cat['categoryDateTime'] = environemnt[category].categoryDateTime;
		cat['places'] = []

		_(environemnt[category].places).each(function(place){
			
			place_copy = {}
			place_copy['name'] = place.name; 
			place_copy['address'] = place.address
			place_copy['point'] = place.point
			place_copy['selected'] = place.selected; 

			cat['places'].push(place_copy)
		}) 

		category = environemnt[category].nextCategory;
	}
	return savable
}

function save_boar_sq(dataBag, currentName) {
	if (!currentName){
        currentName = new Date().getTime();
    }

	savableEnv = makeSavable(dataBag.env); 
	dataBag.env = savableEnv; 
	store.set(currentName, dataBag);
	console.log(currentName);
}

function load_boar_sq(currentName) {
	return store.get(currentName);
}

function getSavedDates(){
<<<<<<< HEAD

return store.getAll();

}

function clearStore(){
store.clear();

=======
	var saved = {"x":"meow"}
	return _.keys(saved);
>>>>>>> 3a80cf178dded350cfcc1687271efbba3362ac41
}