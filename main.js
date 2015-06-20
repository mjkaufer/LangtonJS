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
var n = 8

var grid = makeGrid(n)
var clearCol = "\x1b[0m"
var color = "\x1b[36m"
var generation = 0;
//grid[y][x]
var ants = []
ants.push(makeAnt(parseInt(n/4), parseInt(n/4), EAST))
ants.push(makeAnt(n - parseInt(n/4), n - parseInt(n/4), NORTH))
clearScreen()
// printGrid(ant, grid)
setInterval(function(){
	clearScreen()
	move(ants, grid)
	// console.log(ant)
	// console.log(orientationToCoords(ant.orientation))
	console.log(clearCol)
}, 200)

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


function move(ants, grid){//todo, make efficient datastructure for iterating over all ants - idea: two arrays, x and y, compare indices of them
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

		toggleArray.push({
			x: start.x,
			y: start.y
		})
	}

	for(var i = 0; i < toggleArray.length; i++){

		var pos = toggleArray[i]

		grid[pos.y][pos.x] = (grid[pos.y][pos.x] + 1) % 2	
	}
	
	printGrid(ants, grid)
	console.log(generation++)

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

function antInPosition(ants, x, y){
	for(var i = 0; i < ants.length; i++){
		var ant = ants[i]
		if(ant.x == x && ant.y == y)
			return true
	}

	return false
}

function printGrid(ants, grid){
	for(var y = 0; y < grid.length; y++){
		var printString = ""
		for(var x = 0; x < grid[y].length; x++){
			if(antInPosition(ants, x, y))
				printString += color
			printString += grid[y][x]
			printString += clearCol
		}
		console.log(printString)
	}

}