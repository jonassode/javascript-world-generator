
var nodes = {

	WATER: "blue",
	GROUND: "green",
	AIR: "lightblue",	

	background: function(type){
		var object = {};
		object.color = type;

		return object;
	},

	// Unit Base Class
	unit: function(type, image, movement){
		var object = {};
		object.type = type;
		object.image = image;
		object.movement = movement;
		return object;
	},

	// Units
	settler: function(){
		return this.unit('settler','settler.png', 1);
	},

	soldier: function(){
		return this.unit('soldier','soldier.png', 2);
	},

	engineer: function(){
		return this.unit('engineer','engineer.png', 1);
	},

}

