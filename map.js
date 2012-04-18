
var ROOM_MAX_HEIGHT = 15;
var ROOM_MIN_HEIGHT = 5;
var ROOM_MAX_WIDTH = 30;
var ROOM_MIN_WIDTH = 10;

var SPACE = 0;
var WALL = '#';
var FLOOR = '\'';
var STAIR_UP = '%';
var STAIR_DOWN = '\/';

function random(min, max) {
	return Math.floor((Math.random()*(max-min))+min);
}

function is_wall(x, start, max){
	return ( x === start || x === (start + max - 1) );
}

function Position() {
	this.col = 0;
	this.row = 0;
}

function get_next_item(array, type){
	var p = new Position();
	
        for( row = 0; row < array.length; row++) {
	        for( col = 0; col < array[row].length; col++) {
	                if ( array[row][col] === type ){
				p.row = row;
				p.col = col; 
                                return p;
                        }
                }
	}
}

function get_last_item(array, type){
        var p = new Position();

        for( row = array.length-1; row > 0; row--) {
                for( col = array[row].length-1; col > 0; col--) {
                        if ( array[row][col] === type ){
                                p.row = row;
                                p.col = col;
                                return p;
                        }
                }
        }
}


function Matrix() {
	this.matrix = {};
	this.width = 0;
	this.height= 0;
	
	this.create_matrix = function(width,height){
	        // Create Array
        	var matrix = new Array(height);
	        var row;
	        var col;
	        for( row = 0; row < height; row++) {
	                matrix[row] = new Array(width);
        	}

		this.matrix = matrix;
		this.width = width;
		this.height = height;
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
		var p;
		this.generate_room(get_next_item(this.matrix, SPACE), true);
		p = get_next_item(this.matrix,SPACE);
		while(p != null){
			
			this.generate_room(p, false)
			p = get_next_item(this.matrix, SPACE);
		}
		p = get_last_item(this.matrix, FLOOR);
		this.matrix[p.row][p.col] = STAIR_DOWN;

	}	

	this.generate_room = function(start, entry){
		if ( start === null ){
			return null;
		}

		var room_width = random(ROOM_MIN_WIDTH, ROOM_MAX_WIDTH);
		var room_height = random(ROOM_MIN_HEIGHT, ROOM_MAX_HEIGHT);
	
		// Check walls
		if ( start.row > 0 && this.matrix[start.row-1][start.col] === WALL ){
			start.row--;
		}
                if ( start.col > 0 && this.matrix[start.row][start.col-1] === WALL ){
                        start.col--;
                }

		// Locate End Rows		
		var found = false;
		var end_col = start.col + 1;
		while ( found != true && end_col < this.width){
			if ( this.matrix[start.row+1][end_col] === WALL ){
				found = true;
			}
			end_col++;
		}
		var end_row = this.height;

		// Check room width and height to fill screen
		if ( end_col - (start.col + room_width) <= 2 ){
			room_width = end_col - start.col;
		}
                if ( end_row - (start.row + room_height) <= 2 ){
                        room_height = end_row - start.row;
                }

                for( row = start.row; row < (start.row + room_height); row++) {
                        for( col = start.col; col < (start.col + room_width); col++) {
				if ( is_wall(col, start.col, room_width) || is_wall(row, start.row, room_height)  ){
					this.matrix[row][col] = WALL;
				} else {
	                                this.matrix[row][col] = FLOOR;
				}
                        }
                }
	
		if ( entry === true ) {
			this.matrix[start.row+2][start.col+2] = STAIR_UP;
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

