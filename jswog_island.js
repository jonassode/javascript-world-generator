var jswog_util = {
	/**
	* Creates and returns all posible directions.
	*
	* @return {Array[Position]}	Returns an array with all the directions.
	*/
	create_directions: function(){
		var dirs = new Array();
		dirs.push( {row: 0, col: -1 } );
		dirs.push( {row: 0, col: 1 } );
		dirs.push( {row: -1, col: 0 } );
		dirs.push( {row: 1, col: 0 } );

		return dirs;
	},

	random: function(max){
		return Math.floor((Math.random()*max)+1);
	}
}

var jswog_island = {

	directions: jswog_util.create_directions(),
	WATER: "~",
	GROUND: "@",
	COAST: "'",

	nodes: new Array(),

	node: function(pos, parent){
		var object = {};		
		object.pos = pos;
		object.active = true;
		object.distance = 0;

		if ( parent != undefined ){
			object.parent = parent;
			object.distance = parent.distance + 1;
		}

		return object;
	},

	next_active_node: function(){
		var node = undefined;
		$.each(jswog_island.nodes, function(){
			if( this.active == true ){
				node = this;
				return true;
			}
		});
		return node;
	},

	traverse: function(matrix, position){

		var node = jswog_island.node(position, undefined);
		node.type = jswog_island.GROUND;
		jswog_island.nodes.push(node);

		while( node = jswog_island.next_active_node() ){

			jswog_island.traverse_node(matrix, node);
			
		}
	},

	node_exists: function(position){
		var found = false;

		// Check if we already have node in table
		$.each(jswog_island.nodes, function(){
			if ( this.pos.row == position.row && this.pos.col == position.col ){
				found = true;
				return false;
			}	
		});
		return found;
	},

	traverse_node: function(matrix, node){
		node.active = false;
		var rows = (matrix.length - 1);
		var cols = (matrix[matrix.length-1].length - 1);

		matrix[node.pos.row][node.pos.col] = node.type;

		if ( node.type == jswog_island.GROUND ) {
			$.each(jswog_island.directions, function(){
				var row = node.pos.row + this.row;
				var col = node.pos.col + this.col;
				var pos = {row: row, col: col };
				if ( row > 0 && col > 0 && row < rows  && col < cols ){
					if ( ! jswog_island.node_exists( pos ) ) {

						var new_node = jswog_island.node(pos, node);

						if ( jswog_util.random(node.distance) > 4 ) {
							new_node.type = jswog_island.COAST;
						} else {
							new_node.type = jswog_island.GROUND;
						}
	
						jswog_island.nodes.push(new_node);
					}
				} else {
						var new_node = jswog_island.node(pos, node);
						new_node.type = jswog_island.COAST;
						jswog_island.nodes.push(new_node);
				}

			});
		}
	
		

	},

	fill_with_water: function(matrix){

		for( row = 0; row < matrix.length; row++) {
	        	for( col = 0; col < matrix[row].length; col++) {
				if ( matrix[row][col] == jswog.SPACE ){
					matrix[row][col] = jswog_island.WATER;
				}
			}
		}

	},

	island: function(width, height){
		var m = new jswog.World();
		m.create_matrix(width,height);
		m.fill_matrix();

		jswog_island.traverse(m.matrix, {row: Math.round(height/2), col: Math.round(width/2)});
		jswog_island.fill_with_water(m.matrix);
	
		return m;

	}

}
