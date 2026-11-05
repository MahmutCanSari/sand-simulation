let grids = [];
let particles = []; // every particle on the canvas (sand, water, ...)
let size = 2;
let cols ;
let rows ;
let brushS = 1;
let kX;
let kY;

// The class used for new particles; changed by the material buttons.
// The eraser has no class (null), because it removes particles instead of making one.
let particleType = Sand;
let materialName = 'sand'; // name of the selected material, used by the X key
const PARTICLE_TYPES = { eraser: null, sand: Sand, water: Water, brick: Brick };

function setup() {
  const canvasSize = canvasSize4x3();
  const canvas = createCanvas(canvasSize.w, canvasSize.h);
  canvas.parent('canvas-holder');
  setupPanels(canvasSize);
  setupBrushButtons();
  setupMaterialButtons();
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

  // Take erased particles out of the list (once per frame, before moving)
  particles = particles.filter(p => !p.removed);

  // Run physics twice per frame so sand falls faster
  for (let step = 0; step < 2; step++) {
    for (let i = 0; i < particles.length; i++) {
      particles[i].move();
    }
  }

  // Draw each particle once
  for (let i = 0; i < particles.length; i++) {
    particles[i].show();
  }
}

// Place particles on a single click and while the mouse is dragged.
// Press Z to switch brush size.
function mousePressed(){
  placeParticle();
}

function mouseDragged(){
  placeParticle();
}

function placeParticle(){
  kX = parseInt(mouseX/size);
  kY = parseInt(mouseY/size);

  // Brush size 1: single cell
  if(brushS == 1){
    paintCell(kX, kY);
  // Brush size 2: small 3x3 area
  }else if(brushS == 2){
    for(let i = -1; i < 2; i++){
      for(let j = -1; j < 2; j++){
        paintCell(kX+i, kY+j);
      }
    }
  }
}

// Do the selected action on one cell:
// eraser -> remove the particle there, material -> create a new particle if empty
function paintCell(x, y){
  if(x < 0 || x >= cols || y < 0 || y >= rows){
    return;
  }
  const cell = grids[x][y];

  if(particleType === null){
    if(cell.particle){
      cell.particle.removed = true; // taken out of the list in draw()
      cell.particle = null;
    }
    return;
  }

  if(cell.gridEmpty){
    const p = new particleType(x, y);
    particles.push(p);
    cell.particle = p;
  }
}

// Z key cycles through brush sizes: 1 -> 2 -> back to 1
// X key cycles through materials in list order: eraser -> sand -> water -> brick -> back to eraser
function keyPressed(){
  if(keyCode == 90){ // Z
    brushS++;
    if(brushS == 3){
      brushS = 1;
    }
    setBrush(brushS);
  }else if(keyCode == 88){ // X
    const names = Object.keys(PARTICLE_TYPES);
    const next = (names.indexOf(materialName) + 1) % names.length;
    setMaterial(names[next]);
  }
}

// Brush buttons in the left panel
function setupBrushButtons(){
  for (const button of selectAll('.brush-button')) {
    button.mousePressed(() => setBrush(Number(button.attribute('data-brush'))));
  }
  setBrush(brushS);
}

// Material buttons in the right panel
function setupMaterialButtons(){
  for (const button of selectAll('.material-button')) {
    button.mousePressed(() => setMaterial(button.attribute('data-type')));
  }
  setMaterial('sand');
}

// Change the particle type and highlight the matching button
function setMaterial(typeName){
  particleType = PARTICLE_TYPES[typeName];
  materialName = typeName;
  for (const button of selectAll('.material-button')) {
    if (button.attribute('data-type') === typeName) {
      button.addClass('active');
    } else {
      button.removeClass('active');
    }
  }
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
    this.particle = null; // the particle in this cell, or null if empty
  }

  // True when no particle is in this cell
  get gridEmpty() {
    return this.particle === null;
  }
}