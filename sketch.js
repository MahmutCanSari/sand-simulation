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
  const canvasSize = canvasSize4x3();
  const canvas = createCanvas(canvasSize.w, canvasSize.h);
  canvas.parent('canvas-holder');
  setupPanels(canvasSize);
  setupBrushButtons();
  gridArray();
}

// Each side panel is 1/PANEL_RATIO of the canvas width
const PANEL_RATIO = 10;

// Largest 4:3 canvas that fits in the window together with both side panels.
// It is built from steps of 400 x 300, so width and height are always multiples of 100.
// One step with panels is 400 + 2 * 40 = 480 wide.
// Example: window 1905 x 1035 -> 1905/480 = 3, 1035/300 = 3 -> canvas 1200 x 900, panels 120
function canvasSize4x3() {
  const stepWidth = 400 + 2 * (400 / PANEL_RATIO);
  const steps = max(1, min(floor(windowWidth / stepWidth), floor(windowHeight / 300)));
  return { w: steps * 400, h: steps * 300 };
}

// Give both side panels the right size next to the canvas
function setupPanels(canvasSize) {
  const panelWidth = canvasSize.w / PANEL_RATIO;
  for (const id of ['#left-panel', '#right-panel']) {
    select(id).style('width', panelWidth + 'px');
    select(id).style('height', canvasSize.h + 'px');
  }
}

function draw() {
  background(0);

  // Run physics twice per frame so sand falls faster
  for (let step = 0; step < 2; step++) {
    for (let i = 0; i < sands.length; i++) {
      sands[i].move();
    }
  }

  // Draw each grain once
  for (let i = 0; i < sands.length; i++) {
    sands[i].show();
  }
}

// Place sand on a single click and while the mouse is dragged.
// Press Z to switch brush size.
function mousePressed(){
  placeSand();
}

function mouseDragged(){
  placeSand();
}

function placeSand(){
  kX = parseInt(mouseX/size);
  kY = parseInt(mouseY/size);

  // Brush size 1: single particle
  if(brushS == 1){
    if(kX<cols && kY<rows && kX>=0 && kY>=0){
      if(grids[kX][kY].gridEmpty){
        sands[sK] = new Sand(kX, kY ,sK);
        sK++;
        grids[kX][kY].gridEmpty = false;
      }
    }
  // Brush size 2: small 3x3 area
  }else if(brushS == 2){
    for(let i = -1; i < 2; i++){
      for(let j = -1; j < 2; j++){
        if(kX+i<cols && kY+j<rows && kX+i>=0 && kY+j>=0){
          if(grids[kX+i][kY+j].gridEmpty){
            sands[sK] = new Sand(kX+i, kY+j ,sK);
            sK++;
            grids[kX+i][kY+j].gridEmpty = false;
          }
        } 
      }
    }    
  }
}

// Z key cycles through brush sizes: 1 -> 2 -> back to 1
function keyPressed(){
  if(keyCode == 90){
    brushS++;
    if(brushS == 3){
      brushS = 1;
    }
    setBrush(brushS);
  }
}

// Brush buttons in the left panel
function setupBrushButtons(){
  for (const button of selectAll('.brush-button')) {
    button.mousePressed(() => setBrush(Number(button.attribute('data-brush'))));
  }
  setBrush(brushS);
}

// Change brush size and highlight the matching button
function setBrush(newSize){
  brushS = newSize;
  for (const button of selectAll('.brush-button')) {
    if (Number(button.attribute('data-brush')) === brushS) {
      button.addClass('active');
    } else {
      button.removeClass('active');
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


class Grid{
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.gridEmpty = true;
  }
}