"use strict";

let gameCanvas;
let context;

let backgroundImg=new Image();
backgroundImg.src="../img/game_gaugeBackground.png";
let charImg=new Image();
charImg.src="../img/char_ready.png"
let char_x=340; //캐릭터 x 좌표
let char_y=470; //캐릭터 y 좌표
let dx=0;
let dy=0;

let keycode;

function gameStart(){
  gameCanvas = document.getElementById("gameCanvas");
  context = gameCanvas.getContext("2d");
  gameCanvas.width=800;
  gameCanvas.height=600;

  runGame();
  setInterval(runGame,1);
}

function runGame(){
  move();
  draw();
}

function move() {
  char_x+=dx;
  char_y+=dy;
}
function draw() {
  context.drawImage(backgroundImg, 0,0,800,600);
  context.drawImage(charImg, char_x,char_y, 100,100);
  
  context.fillText(keycode,10, 40);
}

function keydown() {
  keycode=event.keyCode;
  switch(keycode){
    case 37:dx=-1; break; //좌
    case 39:dx=1; break; //우
  }
}
function keyup() {
  keycode=event.keyCode;
  switch(keycode){
    case 37:dx=0; break; //좌
    case 39:dx=0; break; //우
  }
}