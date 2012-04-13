
var ROOM_MAX_HEIGHT = 15;
var ROOM_MIN_HEIGHT = 5;
var ROOM_MAX_WIDTH = 30;
var ROOM_MIN_WIDTH = 10;

var SPACE = 0;
var WALL = 2;
var FLOOR = 1;
var STAIR_UP = 3;

function random(min, max) {
	return Math.floor((Math.random()*(max-min))+min);
}

function is_wall(x, start, max){
	return ( x === start || x === (start + max - 1) );
}

function Matrix() {
	this.matrix = {};
	
	this.create_matrix = function(width,height){
	        // Create Array
        	var matrix = new Array(height);
	        var row;
	        var col;
	        for( row = 0; row < height; row++) {
	                matrix[row] = new Array(width);
        	}

		this.matrix = matrix;
	}

	this.fill_matrix = function(){
                // Fill Array with zeros
                for( row = 0; row < this.matrix.length; row++) {
                        for( col = 0; col < this.matrix[row].length; col++) {
                                this.matrix[row][col] = SPACE;
                        }
                }
	}

	this.generate_rooms = function(){
		this.generate_room(0,0, true);
	}	

	this.generate_room = function(startrow, startcol, entry){
		var room_width = random(ROOM_MIN_WIDTH, ROOM_MAX_WIDTH);
		var room_height = random(ROOM_MIN_HEIGHT, ROOM_MAX_HEIGHT);

                for( row = startrow; row < room_height; row++) {
                        for( col = startcol; col < room_width; col++) {
				if ( is_wall(col, startcol, room_width) || is_wall(row, startrow, room_height)  ){
					this.matrix[row][col] = WALL;
				} else {
	                                this.matrix[row][col] = FLOOR;
				}
                        }
                }
	
		if ( entry === true ) {
			this.matrix[startrow+2][startcol+2] = STAIR_UP;
		}

	}


}


function dungeon(widht, height)
{
	var m = new Matrix();
	m.create_matrix(width,height);
	m.fill_matrix();
	m.generate_rooms();

	return m;
}

