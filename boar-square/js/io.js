function getSelected(environemnt) {
	selectedPlaces = {}

	category = environemnt['__START__'].nextCategory; 

	while(category != null) {
		selectedPlaces
		category = environemnt['category'].nextCategory; 
	}


}

function save(queryObject, environemnt, name) {
	if (!name){
		name = new Date().getTime();
	}

}

function load() {

}