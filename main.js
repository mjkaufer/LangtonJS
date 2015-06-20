/*
Rules
At an empty square, turn 90° left, toggle color, move forwards
At a full square, turn 90° right, toggle color, move forwards
When moving forwards, do so if possible, else keep rotating in the same direction
*/

var EAST = 0,
	NORTH = 90,
	WEST = 180,
	SOUTH = 270
var n = 4
var ants = []
var grid = makeGrid(n)
var clearCol = "\x1b[0m"
var color = "\x1b[36m"
//grid[y][x]
var ant = makeAnt(0, 1, EAST)
clearScreen()
// printGrid(ant, grid)

setInterval(function(){
	clearScreen()
	move(ant, grid)
	// console.log(ant)
	// console.log(orientationToCoords(ant.orientation))
	console.log(clearCol)
}, 50)

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
	var nx = delta.x + ant.x
	var ny = delta.y + ant.y
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


function move(ant, grid){//todo, make efficient datastructure for iterating over all ants - idea: two arrays, x and y, compare indices of them
	//also, write code for when ants meet
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
	grid[start.y][start.x] = (grid[start.y][start.x] + 1) % 2

	printGrid(ant, grid)

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

function printGrid(ant, grid){
	for(var y = 0; y < grid.length; y++){
		var printString = ""
		for(var x = 0; x < grid[y].length; x++){
			if(ant.x == x && ant.y == y)
				printString += ant.toString()
			printString += grid[y][x]
			printString += clearCol
		}
		console.log(printString)
	}

}