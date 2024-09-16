let grids = [];
let sands = [];
let size = 5;
let cols ;
let rows ;
let k = 0;
let kX;
let kY;

function setup() {
  createCanvas(800,600);
  gridArray();
}


function draw() {
  background(0);

  for (let i = 0; i < sands.length; i++) {
    sands[i].move();
    sands[i].show();
  }
}

function mouseDragged(){
  kX = parseInt(mouseX/size);
  kY = parseInt(mouseY/size);

  if (grids[kX][kY].gridEmpty) {
    sands[k] = new Sand(kX, kY);
    k++;
    grids[kX][kY].gridEmpty = false;
  }
}

function gridArray(){
  cols = width/size;
  rows = height/size;
  for (var i = 0; i < cols; i++){
    grids[i] = new Array(rows);
    for (var j = 0; j < rows; j++){
      grids[i][j] = new Grid(i, j);
    }
  }
}



class Sand{
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.x1;
    this.y1;

    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }
  move(){
    if (this.y+1 !== rows ) {
      if (grids[this.x][this.y+1].gridEmpty) {
        grids[this.x][this.y].gridEmpty = true;
        grids[this.x][this.y+1].gridEmpty = false;
        this.y = this.y+1;
      }
    }

    this.x1 = this.x*size+size/2;
    this.y1 = this.y*size+size/2;
  }
  show(){

    noStroke();
    fill(this.r,this.g,this.b);
    rectMode( CENTER);
    rect(this.x1, this.y1, size);
  }
}

class Grid{
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.gridEmpty = true;
  }
}