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
var safeCellsLeft = [];
var mineClues = [];

var score = 0;
var gameOver = false;
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

window.addEventListener("contextmenu", clickHandler);

window.mobilecheck = function() {
  var check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};


// function rightClickHandler(e) {
//
// }
function clickHandler(e) {
  // check if click is in field
  e.preventDefault();
  var rect = canvas.getBoundingClientRect();
  var mouseX = (e.clientX - rect.left) * canvasScale;
  var mouseY = (e.clientY - rect.top) * canvasScale;

  if (!gameOver) {

    if (mouseX > 0 && mouseX < canvas.width
      && mouseY > 0 && mouseY < canvas.height) {

        var xCell = Math.floor(mouseX / cellWidth) * cellWidth;
        var yCell = Math.floor(mouseY / cellWidth) * cellWidth;

        var rightClick = false;
        if ("which" in e)
        rightClick = e.which == 3;
        else if ("button" in e)
        rightClick = e.button == 2;

        if (rightClick) {
          flagCell(xCell, yCell);
        } else {
          clickedCell(xCell, yCell);

        }

      }
  }


}

function flagCell(x, y) {
  var imgClicked = new Image();
  imgClicked.src = "snackpack/flag_" + cellWidth + "px.png"
  imgClicked.height = cellWidth;
  imgClicked.width = cellWidth;
  ctx.drawImage(imgClicked, x, y, cellWidth, cellWidth);
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
    return;
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

  setTimeout(function() {
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
    checkWin(x, y);
  }, 100);

}

function checkWin(x, y) {
  for(i=0; i<safeCellsLeft.length; i++) {
    if(safeCellsLeft[i].x == x && safeCellsLeft[i].y == y) {
      safeCellsLeft.splice(i, 1);
    }
  }

  if (safeCellsLeft.length == 0) {
    setTimeout(playerWins, 200);
  }
}

function neightbouringEmptyCells(x, y) {
  // use bfs
  var cellsToVisit = [];
  var visited = [];
  var i = cellsIndex(x, y);
  cellsToVisit.push(cells[i])
  visited[i] = true;

  while(cellsToVisit.length > 0) {
    console.log("s1: " + cellsToVisit);
    var cell = cellsToVisit.shift();
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

  safeCellsLeft = cells.filter(obj => {
      return !cellIsMine(obj.x, obj.y);
  });
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

// array.findIndex() may work
function cellsIndex(x, y) {
  if ((x/cellWidth) + ((y/cellWidth) * cellNums.y) < 0 || (x/cellWidth) + ((y/cellWidth) * cellNums.y) > 99) {
    console.log ("ERRORRRR");
  }
  var index = Math.round((x/cellWidth) + ((y/cellWidth) * cellNums.y));

  console.log("x :" + x + " Y: " + y + " INDEX: " + index);
  return Math.round((x/cellWidth) + ((y/cellWidth) * cellNums.y));
}

function playerLoses() {
  gameOver = true;
  alert("Oh no your mom found your cavities!!! \r\n\n No more candy for you not even mints :/");
}

function playerWins() {
  alert("WOOOO \r\n\n Tell ria to treat u to some treats");
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
