var canvas = document.getElementById("mine-field");
var ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

var canvasScale = 4;
canvas.width = 600 * canvasScale;
canvas.height = 600 * canvasScale;

var lost = false;
var paused = false;


// will depend on difficulty
// easy: 10 x 10    mines: 10
var cellNums = { x: 10, y: 10, total: 100 };
var mineNums = 10;

// width should == height

// 240px
var cellWidth = canvas.width / cellNums.x;

// cells : { x, y, mines}
var cells = [];
var mines = [];

var mineClues = [];

var score = 0;

// will change to image
var cellColor = "#89CFF0";
var cellBgColor = "#c6e5f7"

var imgSrcNumbers = ["snackpack/number1_240px.png", "snackpack/number2_240px.png", "snackpack/number3_240px.png",  "snackpack/number4_240px.png",  "snackpack/number5_240px.png", "snackpack/number6_240px.png",  "snackpack/number7_240px.png", "snackpack/number8.png"]

// var imgClicked = new Image();
// // size of image should == cellWidth
// imgClicked.src = "snackpack/number8.png" // 240px x 240px
// imgClicked.height = cellWidth;
// imgClicked.width = cellWidth;

var imgMine = new Image();
imgMine.src = "snackpack/mine.png"
imgMine.height = cellWidth;
imgMine.width = cellWidth;

window.addEventListener("click", clickHandler);

function clickHandler(e) {
  // check if click is in field
  var rect = canvas.getBoundingClientRect();
  var mouseX = (e.clientX - rect.left) * canvasScale;
  var mouseY = (e.clientY - rect.top) * canvasScale;

  // i-th cell in the first row whose x ==
  var xCell;
  if (mouseX > 0 && mouseX < canvas.width
      && mouseY > 0 && mouseY < canvas.height) {

    xCell = Math.floor(mouseX / cellWidth) * cellWidth;
    yCell = Math.floor(mouseY / cellWidth) * cellWidth;

    clickedCell(xCell, yCell);

  }

  // check which cell it is in

}

function clickedCell(x, y) {

  if(cellIsMine(x, y)) {
    clickCell(x, y, "mine");
  } else if (cells[cellsIndex(x, y)].mines == 0){
    clickCell(x, y, "empty");


    console.log("clicked: " + x + ' ' + y);
  } else {
    clickCell(x, y, "number");
  }
}

function clickCell(x, y, type) {
  if(type == "mine") {
    // ctx.imageSmoothingEnabled = false;
    ctx.drawImage(imgMine, x, y, cellWidth, cellWidth);
    setTimeout(playerLoses, 200);
  } else if(type == "number"){
    // ctx.imageSmoothingEnabled = false;
    var imgClicked = new Image();
    imgClicked.src = "snackpack/number" + cells[cellsIndex(x, y)].mines + "_" + cellWidth + "px.png"
    imgClicked.height = cellWidth;
    imgClicked.width = cellWidth;
    ctx.drawImage(imgClicked, x, y, cellWidth, cellWidth);
  } else if(type == "empty") {
    neightbouringEmptyCells(x, y);
  }

  if(type == "mine") {
    // ctx.imageSmoothingEnabled = false;
    ctx.drawImage(imgMine, x, y, cellWidth, cellWidth);
    setTimeout(playerLoses, 200);
  } else if(type == "number"){
    // ctx.imageSmoothingEnabled = false;
    var imgClicked = new Image();
    imgClicked.src = "snackpack/number" + cells[cellsIndex(x, y)].mines + "_" + cellWidth + "px.png"
    imgClicked.height = cellWidth;
    imgClicked.width = cellWidth;
    ctx.drawImage(imgClicked, x, y, cellWidth, cellWidth);
  } else if(type == "empty") {
    neightbouringEmptyCells(x, y);
  }
}

var cell, cellsToVisit, visited;

function neightbouringEmptyCells(x, y) {
  // use bfs
  cellsToVisit = [];
  visited = [];
  var i = cellsIndex(x, y);
  cellsToVisit.push(cells[i])
  visited[i] = true;

  while(cellsToVisit.length > 0) {
    console.log("s1: " + cellsToVisit);
    cell = cellsToVisit.shift();
    console.log(cell);
    // var x = cell.x
    // var y = cell.y
    console.log("s2: Visiting Cell: x: " + x +" y: " + y);
    clickCell(cell.x, cell.y, "number");

    // cell is not a clue cell
    if(cell.mines == 0) {
      var neighboursIndex = [];
      // left
      if (cell.x > 0) {
        i = cellsIndex(cell.x-cellWidth, cell.y);
        neighboursIndex.push(i);
      }
      if (cell.x < (cellNums.x - 1) * cellWidth) {
        i = cellsIndex(cell.x+cellWidth, cell.y);
        neighboursIndex.push(i);
      }
      if (cell.y > 0) {
        i = cellsIndex(cell.x, cell.y-cellWidth);
        neighboursIndex.push(i);
      }
      // bottom
      if (cell.y < (cellNums.y - 1) * cellWidth) {
        i = cellsIndex(cell.x, cell.y+cellWidth);
        neighboursIndex.push(i);
      }

      console.log(neighboursIndex);

      for(n = 0; n < neighboursIndex.length; n++) {
        console.log(neighboursIndex[n] + " " + visited[neighboursIndex[n]]);
        if(!cells[neighboursIndex[n]].isMine && !visited[neighboursIndex[n]] ){
          console.log("S3: pushing: { " + cells[neighboursIndex[n]].x , cells[neighboursIndex[n]].y, cells[neighboursIndex[n]].mines);
          cellsToVisit.push(cells[neighboursIndex[n]]);
          visited[neighboursIndex[n]] = true;
        }
      }

    }
  }

}

function createCells() {
  var xCell = 0;
  var yCell = 0;

  // remove when images are added

  ctx.fillStyle = cellBgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < cellNums.y; i++) {
    xCell = 0;
    for (var j = 0; j < cellNums.x; j++) {
      // top left position of cell
      cells.push( { x: xCell, y: yCell, mines: 0, isMine: false } );
      drawCell(xCell, yCell);
      console.log("x: " + xCell + " y: " + yCell);
      xCell += cellWidth;
    }
    yCell += cellWidth;
  }
}

function drawCell(x, y) {
  // ctx.drawImage(cellImg, x, y, cellWidth, cellWidth);
  // ctx.fillStyle = cellColor;
  // ctx.fillRect(x, y, cellWidth, cellWidth);
  // ctx.fillRect(x, y, cellWidth, cellWidth);
  ctx.beginPath();
  ctx.strokeStyle = cellColor;
  ctx.rect(x, y, cellWidth, cellWidth);
  ctx.stroke();
}

function generateMines() {
  var minesCreated = 0;
  while (minesCreated < mineNums) {

    // suggested change: use indexes
    var xmine = Math.floor(Math.random() * cellNums.x) * cellWidth;
    var ymine = Math.floor(Math.random() * cellNums.y) * cellWidth;


    var duplicate = false;
    for(i = 0; i < mines.length; i++) {
      if(xmine == mines[i].x && ymine == mines[i].y) {
        duplicate = true;
      }
    }
    if(duplicate == false) {

      mines.push( { x: xmine, y: ymine } );

      var i = cellsIndex(xmine, ymine);
      cells[i].isMine = true;

      minesCreated++;
      // console.log(" mine : " + xmine + ymine);

      // add the mine to clues

      // case 1: middle of board
      // 2: left edge
      // 3: right edge
      // 4: top edge
      // 5: bottom edge
      // 6: 2 & 4, 2 & 5
      // 7: 3 & 4, 3 & 5\
      addMineClues(xmine, ymine);
    }
  }
}


function addMineClues(x, y) {
  var leftEdge = false, rightEdge = false, topEdge = false, bottomEdge = false;
  // check for left & right edges
  if (x == 0) {
    leftEdge = true;
  } else if (x == (cellNums.x - 1) * cellWidth) {
    rightEdge = true;
  }

  // check for top & bottom edges
  if (y == 0) {
    topEdge = true;
  } else if (y == (cellNums.y - 1) * cellWidth) {
    bottomEdge = true;
  }

  var i;
  if(!leftEdge) {
    i = cellsIndex(x - cellWidth, y);
    cells[i].mines = cells[i].mines + 1;
  }
  if (!rightEdge) {
    i = cellsIndex(x + cellWidth, y);
    cells[i].mines = cells[i].mines + 1;
  }
  if (!topEdge) {
    i = cellsIndex(x, y - cellWidth);
    cells[i].mines = cells[i].mines + 1;
  }
  if (!bottomEdge) {
    i = cellsIndex(x, y + cellWidth);
    cells[i].mines = cells[i].mines + 1;
  }

  // top left clue
  if (!topEdge && !leftEdge) {
    i = cellsIndex(x - cellWidth, y - cellWidth);
    cells[i].mines = cells[i].mines + 1;
  }
  // top right clue
  if (!topEdge && !rightEdge) {
    i = cellsIndex(x + cellWidth, y - cellWidth);
    cells[i].mines = cells[i].mines + 1;
  }

  // bottom left clue
  if (!bottomEdge && !leftEdge) {
    i = cellsIndex(x - cellWidth, y + cellWidth);
    cells[i].mines = cells[i].mines + 1;
  }
  // bottom right clue
  if (!bottomEdge && !rightEdge) {
    i = cellsIndex(x + cellWidth, y + cellWidth);
    cells[i].mines = cells[i].mines + 1;
  }

}

function cellIsMine(x, y) {
  var isMine = false;
  for(i = 0; i < mineNums; i++) {
    if(x == mines[i].x && y == mines[i].y) {
      isMine = true;
    }
  }
  return isMine;
}

function cellsIndex(x, y) {
  if ((x/cellWidth) + ((y/cellWidth) * cellNums.y) < 0 || (x/cellWidth) + ((y/cellWidth) * cellNums.y) > 99) {
    console.log ("ERRORRRR");
  }
  var index = Math.round((x/cellWidth) + ((y/cellWidth) * cellNums.y));

  console.log("x :" + x + " Y: " + y + " INDEX: " + index);
  return Math.round((x/cellWidth) + ((y/cellWidth) * cellNums.y));
}

function playerLoses() {
  alert("Oh no your mom found your cavities!!! \r\n\n No more candy for you not even mints :/")
}

function initializeMineClues() {
  mineClues.push( { x: 0, y: 0 } );
}

function start() {
  createCells();
  generateMines();
  ctx.beginPath();
  ctx.arc(100,75,100,0,Math.PI*2,true);
 ctx.closePath();
 ctx.stroke();
}

start();
