var jswog = {

	ROOM_MAX_HEIGHT: 9,
	ROOM_MIN_HEIGHT: 3,
	ROOM_MAX_WIDTH: 3,
	ROOM_MIN_WIDTH: 9,

	MIN_NO_ROOMS: 10,
	MAX_NO_ROOMS: 50,

	SPACE: "#",
	WALL: "X",
	FLOOR: "'",
	STAIR_UP: '%',
	STAIR_DOWN: '\/',
	BLOCKED: 'B',
	CORRIDOR: "C",


	random: function(min, max) {
		return Math.floor((Math.random()*(max+1-min))+min);
	},

	is_wall: function(x, start, max){
		return ( x === start || x === (start + max - 1) );
	},

	p: function(row,col){
		return { row: row, col: col };
	},

	get_next_item: function(array, type){
		for( row = 0; row < array.length; row++) {
			for( col = 0; col < array[row].length; col++) {
			        if ( array[row][col] === type ){
		                        return jswog.p(row,col);
		                }
		        }
		}
	},

	get_last_item: function(array, type){
		for( row = array.length-1; row > 0; row--) {
		        for( col = array[row].length-1; col > 0; col--) {
		                if ( array[row][col] === type ){
		                        return jswog.p(row,col);
		                }
		        }
		}
	},


	World: function() {
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
		        // Fill Array with space
		        for( row = 0; row < this.matrix.length; row++) {
		                for( col = 0; col < this.matrix[row].length; col++) {
		                        this.matrix[row][col] = jswog.SPACE;
		                }
		        }
		}

		this.generate_rooms = function(){
			var room_width;
			var room_height;

			var p;
			this.generate_room(jswog.get_next_item(this.matrix, jswog.SPACE), true, 20, 10);
			p = jswog.get_next_item(this.matrix,jswog.SPACE);
			while(p != null){
				room_width = jswog.random(jswog.ROOM_MIN_WIDTH, jswog.ROOM_MAX_WIDTH);
				room_height = jswog.random(jswog.ROOM_MIN_HEIGHT, jswog.ROOM_MAX_HEIGHT);

				this.generate_room(p, false, room_width, room_height)
				p = jswog.get_next_item(this.matrix, jswog.SPACE);
			}
			p = jswog.get_last_item(this.matrix, jswog.FLOOR);
			this.matrix[p.row][p.col] = jswog.STAIR_DOWN;

		}	

	 	this.generate_room = function(start, entry, room_width, room_height){
			if ( start === null ){
				return null;
			}

			// Check jswog.WALLs
			if ( start.row > 0 && this.matrix[start.row-1][start.col] === jswog.WALL ){
	//			start.row--;
			}
		        if ( start.col > 0 && this.matrix[start.row][start.col-1] === jswog.WALL ){
	//                        start.col--;
		        }

			// Locate End Rows		
			var found = false;
			var end_col = start.col + 1;
			while ( found != true && end_col < this.width){
				if ( this.matrix[start.row+1][end_col] === jswog.WALL ){
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
					if ( jswog.is_wall(col, start.col, room_width) || jswog.is_wall(row, start.row, room_height)  ){
						this.matrix[row][col] = jswog.WALL;
					} else {
			                        this.matrix[row][col] = jswog.FLOOR;
					}
		                }
		        }
	
			if ( entry === true ) {
				this.matrix[start.row+2][start.col+2] = jswog.STAIR_UP;
			}

		}

		this.set_map_border = function(){

		        for( row = 0; row < this.matrix.length; row++) {
		                for( col = 0; col < this.matrix[row].length; col++) {
					if ( row === 0 || col === 0 || row === this.matrix.length-1 || col === this.matrix[row].length-1 ){
			                        this.matrix[row][col] = jswog.BLOCKED;
					}
		                }
		        }

		}

		this.generate_spread_rooms = function(){
			var room_counter;	
			var number_of_rooms = jswog.random(jswog.MIN_NO_ROOMS, jswog.MAX_NO_ROOMS);
			var q = jswog.room(jswog.p(1,1),0,0);
			var max_counter = 0;

			for ( room_counter = 0; ( room_counter < number_of_rooms && max_counter < 100 ); max_counter++ ){
				q.width = jswog.random(jswog.ROOM_MIN_WIDTH, jswog.ROOM_MAX_WIDTH);
				q.height = jswog.random(jswog.ROOM_MIN_HEIGHT, jswog.ROOM_MAX_HEIGHT);
				q.row = jswog.random(1,(this.height-q.height));
				q.col = jswog.random(1,(this.width-q.width));
				while ( jswog.isEven(q.width) ){
					q.width++;
				}
				if ( jswog.isEven(q.height) ){
					q.height++;
				}
				if ( jswog.isEven(q.row) ){
					q.row++;
				}
				if ( jswog.isEven(q.col) ){
					q.col++;
				}

				if ( this.check_room_availability(q) ){
					this.generate_room(jswog.p(q.row,q.col), false, q.width, q.height);
					this.find_entrance(q);				
					room_counter++;
				}
			}
			

		}
		this.find_entrance = function(room){
			var no_of_entrances = jswog.random(1, 2);
			var directions = new Array();
			directions.push(jswog.p(room.row, room.col + 1));
			directions.push(jswog.p(room.row+room.height-1, room.col + room.width-2));
			directions.push(jswog.p(room.row + 1, room.col));
			directions.push(jswog.p(room.row + room.height-2, room.col + room.width-1));

			var i = 0;

			while ( i < no_of_entrances ){
				direction = directions[jswog.random(0,3)];
				if ( this.matrix[direction.row][direction.col] != jswog.FLOOR ) {			
					this.matrix[direction.row][direction.col] = jswog.FLOOR;
					i++;
				}
			}
		}

		this.check_room_availability = function(room){
			var row;
			var col;
			var available = true;
			if ( room.row + room.height >= this.matrix.length || room.col + room.width >= this.matrix[0].length ){
				return false;
			}
			for ( row = room.row; row < room.row + room.height; row++){
				for ( col = room.col; col < room.col + room.width; col++){
					if ( row < 0 || col < 0 || row > this.matrix.length || col > this.matrix[0].length || this.matrix[row][col] != jswog.SPACE ){
						return false;
					}
				}
			}
			return true;	
		}

		this.create_corridors = function(){
		        for( row = 0; row < this.matrix.length; row+=2) {
		                for( col = 0; col < this.matrix[row].length; col+=2) {
					if ( this.matrix[row][col] == jswog.SPACE ){
			                        this.dig_corridor(jswog.p(row,col));
					}
		                }
		        }
		}

		this.get_directions = function(pos){
			var directions = new Array();
			directions.push(jswog.p(pos.row-1, pos.col  ));
			directions.push(jswog.p(pos.row+1, pos.col  ));
			directions.push(jswog.p(pos.row  , pos.col-1));
			directions.push(jswog.p(pos.row  , pos.col+1));
		
			return directions;
		}

		this.is_dead_end = function(pos){

			var deadend = false;
			if ( this.matrix[pos.row][pos.col] === jswog.FLOOR ){
				var directions = this.get_directions(pos);


				var roads = 0;
				for( var i = 0; i<directions.length; i++){
					direction = directions[i];
					if ( 
						direction.row < 0 ||
						direction.row >= this.height ||
						direction.col < 0 ||
						direction.col >= this.width ||
						this.matrix[direction.row][direction.col] != jswog.FLOOR
					) {
						roads++;			
					}
				}
				if ( roads === 3 ){
					deadend = true;		
				}
			}		
			return deadend;
		}

		this.remove_end = function(pos){
			this.matrix[pos.row][pos.col] = jswog.WALL;

			var direction;
			var directions = this.get_directions(pos);
			for( var i = 0; i<directions.length; i++){
				direction = directions[i];
				if ( 
					direction.row >= 0 &&
					direction.row < this.height &&
					direction.col >= 0 &&
					direction.col < this.width &&
					this.matrix[direction.row][direction.col] === jswog.FLOOR
				) {
					if ( this.is_dead_end(direction) ){
						this.matrix[direction.row][direction.col] = jswog.WALL;
						this.remove_end(direction);
					}
				}
			}
		}

		this.remove_dead_ends = function(){
			var r;
		        for( row = 0; row < this.matrix.length; row+=2) {
		                for( col = 0; col < this.matrix[row].length; col+=2) {
					var pos = jswog.p(row,col);
					if ( this.is_dead_end(pos) ){
						r = jswog.random(1,100);
						if( r <= 80 ) {
				                        this.remove_end(pos);
						}
					}
		                }
		        }
		}

		this.place_entry = function(){
		        for( row = 0; row < this.matrix.length; row+=2) {
		                for( col = 0; col < this.matrix[row].length; col+=2) {
					var pos = jswog.p(row,col);
					if ( this.is_dead_end(pos) ){
						this.matrix[pos.row][pos.col] = jswog.STAIR_UP;
						return null;
					}
		                }
		        }		
		}

		this.check = function(pos, rel, type){
			var val = false;

			if ( pos.row+rel.row < 0 || pos.row+rel.row >= this.height || pos.col+rel.col < 0 || pos.col+rel.col >= this.width ){
				val = false;
			} else {
				val = (this.matrix[(pos.row+rel.row)][(pos.col+rel.col)] === type);
			}
		
			return val;
		}

		this.get_dig_directions = function(pos){
			var directions = new Array();
		
			// UP
			if ( this.check(pos,jswog.p(-1,0),jswog.SPACE) && this.check(pos,jswog.p(-2,0),jswog.SPACE) ){
				directions.push(jswog.p(-1,0));
			}
			// DOWN
			if ( this.check(pos,jswog.p(1,0),jswog.SPACE) && this.check(pos,jswog.p(2,0),jswog.SPACE) ){
				directions.push(jswog.p(1,0));
			}
			// RIGHT
			if ( this.check(pos,jswog.p(0,1),jswog.SPACE) && this.check(pos,jswog.p(0,2),jswog.SPACE) ){
				directions.push(jswog.p(0,1));
			}
			// LEFT
			if ( this.check(pos,jswog.p(0,-1),jswog.SPACE) && this.check(pos,jswog.p(0,-2),jswog.SPACE) ){
				directions.push(jswog.p(0,-1));
			}

			return directions;
		}

		this.dig_corridor = function(pos){
			var row = pos.row;
			var col = pos.col;

			var possible_directions = this.get_dig_directions(pos);

			if ( possible_directions.length === 0 ){

			} else {
				var direction = possible_directions[jswog.random(0,possible_directions.length-1)];

				this.matrix[row][col] = jswog.FLOOR;
				this.matrix[row+direction.row][col+direction.col] = jswog.FLOOR;
				this.matrix[row+(direction.row*2)][col+(direction.col*2)] = jswog.FLOOR;

				// Dig next section, will keep digging untill it dies die
				this.dig_corridor(jswog.p(row+(direction.row*2),col+(direction.col*2)));

				// Check your self again
				this.dig_corridor(pos);

			}
		}

	},


	isEven: function(someNumber){
	    return (someNumber%2 == 0) ? true : false;
	},

	DivisableWithThree: function(someNumber){
	    return (someNumber%3 == 0) ? true : false;
	},

	room: function(p, width, height){
		return { row: p.row, col: p.col, width: width, height:height };
	},

	dungeon: function(width, height){
		var m = new jswog.World();
		m.create_matrix(width,height);
		m.fill_matrix();
		m.generate_room(jswog.p(23,23), false, 5, 5);
		m.find_entrance(jswog.room(jswog.p(23,23),5,5));
		m.matrix[25][25] = jswog.STAIR_DOWN;
		m.generate_spread_rooms();
		m.create_corridors();
		m.place_entry();
		m.remove_dead_ends();

		return m;
	},

	house: function(width, height){
		var m = new jswog.World();
		m.create_matrix(width,height);
		m.fill_matrix();
		m.generate_rooms();

		return m;
	},

}

