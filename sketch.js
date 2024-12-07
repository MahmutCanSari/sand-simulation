let grids = [];
let sands = [];
let size = 2;
let cols ;
let rows ;
let brushS = 1;
let sK = 0;
let kX;
let kY;

function setup() {
  createCanvas(800,600);
  gridArray();
}

function draw() {
  background(0);

  for(let i = 0; i < 2; i++){
    for (let i = 0; i < sands.length; i++) {
      sands[i].move();
      sands[i].show();
    }
  } 
}

function mouseDragged(){
  kX = parseInt(mouseX/size);
  kY = parseInt(mouseY/size);

  if(brushS == 1){
    if(kX<cols && kY<rows && kX>0 && kY>0){
      if(grids[kX][kY].gridEmpty){
        sands[sK] = new Sand(kX, kY ,sK);
        sK++;
        grids[kX][kY].gridEmpty = false;
        grids[kX][kY].k = sK;
      }
    }
  }else if(brushS == 2){
    for(let i = -1; i < 2; i++){
      for(let j = -1; j < 2; j++){
        if(kX+i<cols && kY+j<rows && kX+i>0 && kY+j>0){
          if(grids[kX+i][kY+j].gridEmpty){
            sands[sK] = new Sand(kX+i, kY+j ,sK);
            sK++;
            grids[kX+i][kY+j].gridEmpty = false;
            grids[kX][kY].k = sK;
          }
        } 
      }
    }    
  }
}

function keyPressed(){
  if(keyCode == 90){
    brushS++;
    if(brushS == 3){
      brushS = 1;
    }
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

function rate(rate){
  let rdr = random(0,100);
  return rdr<rate;
}

class Sand{
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xP;
    this.yP;

    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }
  move(){
    if(this.y+1 != rows){
      if(grids[this.x][this.y+1].gridEmpty){
        grids[this.x][this.y].gridEmpty = true;
        grids[this.x][this.y+1].gridEmpty = false;
        this.y++;
      }else if(rate(50)){
        if(this.x+1 != cols){
          if(grids[this.x+1][this.y+1].gridEmpty && grids[this.x+1][this.y].gridEmpty){
            grids[this.x][this.y].gridEmpty = true;
            grids[this.x+1][this.y+1].gridEmpty = false;
            this.x++;
            this.y++;
          }
        }
      }
      else if(rate(50)){
        if(this.x-1 != -1){
          if(grids[this.x-1][this.y+1].gridEmpty && grids[this.x-1][this.y].gridEmpty){
            grids[this.x][this.y].gridEmpty = true;
            grids[this.x-1][this.y+1].gridEmpty = false;
            this.x--;
            this.y++;
          }
        }
      }   
    }
  }
  show(){
    this.xP = this.x*size+size/2;
    this.yP = this.y*size+size/2;
    rectMode(CENTER);
    noStroke();
    fill(this.r, this.g, this.b);
    rect(this.xP,this.yP,size);
  }
}

class Grid{
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.gridEmpty = true;
  }
}