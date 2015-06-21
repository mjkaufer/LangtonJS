/*
Rules
At an empty square, turn 90° left, toggle color, move forwards
At a full square, turn 90° right, toggle color, move forwards
When moving forwards, do so if possible, else keep rotating in the same direction
If two ants land on the same place, the non-first one to reach the spot turns according to the above pattern
*/

var EAST = 0,
	NORTH = 90,
	WEST = 180,
	SOUTH = 270
var n = 16

var grid = makeGrid(n)
var clearCol = "\x1b[0m"
var color = "\x1b[36m"
var generation = 0;
//grid[y][x]
var ants = []
ants.push(makeAnt(parseInt(n/4), parseInt(n/4), EAST))
ants.push(makeAnt(n - parseInt(n/4), n - parseInt(n/4), NORTH))
ants.push(makeAnt(n - parseInt(n/4), parseInt(n/4), WEST))
clearScreen()
setInterval(function(){
	move(ants, grid, true)
})

function clearScreen(){
	process.stdout.write("\u001b[2J\u001b[0;0H");
}

function orientationToCoords(orientation){
	return {
		x: Math.round(Math.cos(orientation / 180 * Math.PI)),
		y: Math.round(Math.sin(orientation / 180 * Math.PI))
	}
}

function nextPosition(ant, grid){//returns either an Object with x & y, or false if the next position is not valid
	var delta = orientationToCoords(ant.orientation)
	// var nx = delta.x + ant.x
	// var ny = delta.y + ant.y
	var ny = (delta.y + ant.y + grid.length) % grid.length
	var nx = (delta.x + ant.x + grid[ny].length) % grid[ny].length
	
	if(0 <= ny && ny < grid.length && 0 <= nx && nx < grid[ny].length)
		return {
			x: nx,
			y: ny
		}
	return false
}

function makeAnt(startX, startY, orientation){//orientation of 0 is east, 90 is north, etc...
	return {
		x: startX,
		y: startY,
		orientation: orientation,
		// toString: function(){
		// 	switch(this.orientation){
		// 		case 0:
		// 			return "→"
		// 		case 90:
		// 			return "↑"
		// 		case 180:
		// 			return "←"
		// 		case 270:
		// 			return "↓"
		// 	}
		// },
		toString: function(){
			return color
		},
		turn: function(isFilled){
			this.orientation += 90

			if(isFilled)
				this.orientation += 180
				
			this.orientation %= 360
		},
		updatePosition: function(next){
			this.x = next.x
			this.y = next.y
		}
	}
}

function move(ants, grid, printBoard){//todo, make efficient datastructure for iterating over all ants - idea: two arrays, x and y, compare indices of them
	//also, write code for when ants meet
	var toggleArray = []

	for(var i = 0; i < ants.length; i++){
		var ant = ants[i]

		var start = {
			x: ant.x,
			y: ant.y
		}

		var isFilled = (grid[start.y][start.x] == 1)

		ant.turn(isFilled)

		var next = nextPosition(ant, grid)

		while(!next){

			ant.turn(isFilled)
			next = nextPosition(ant, grid)
		}

		ant.updatePosition(next)

		if(positionInPositionArray(toggleArray, start.x, start.y)){
			ant.turn(isFilled)
		} else {
			toggleArray.push({
				x: start.x,
				y: start.y,
				ant: ant
			})
		}

	}

	for(var i = 0; i < toggleArray.length; i++){

		var pos = toggleArray[i]

		grid[pos.y][pos.x] = (grid[pos.y][pos.x] + 1) % 2	
	}
	generation++

	if(printBoard){
		clearScreen()
		printGrid(ants, grid)
		console.log(clearCol)
		console.log(generation)
	} else {
		if(generation % 1000 == 0){
			console.log(generation)
		}
	}



}

function zeroArray(elements){
	var arr = []
	for(var i = 0; i < elements; i++)
		arr.push(0)
	return arr
}

function makeGrid(n){
	var grid = []
	for(var i = 0; i < n; i++)
		grid.push(zeroArray(n-1))//n-1 so that we have coprime dimensions
	return grid

}

function positionInPositionArray(positionArray, x, y){
	for(var i = 0; i < positionArray.length; i++){
		var position = positionArray[i]
		if(position.x == x && position.y == y)
			return true
	}

	return false
}

function printGrid(ants, grid){
	for(var y = 0; y < grid.length; y++){
		var printString = ""
		for(var x = 0; x < grid[y].length; x++){
			if(positionInPositionArray(ants, x, y))
				printString += color
			printString += grid[y][x]
			printString += clearCol
		}
		console.log(printString)
	}

}