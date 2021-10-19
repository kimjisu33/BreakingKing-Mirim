"use strict";

let gameCanvas;
let context;

let backgroundImg=new Image();
backgroundImg.src="../img/game_gaugeBackground.png";
let charImg=new Image();
let ObstacleImg=new Image();
charImg.src="../img/char_ready.png"
ObstacleImg.src="../img/char_ready.png"
let char_x=340; //캐릭터 x 좌표
let char_y=470; //캐릭터 y 좌표
let dx=0;
let dy=0;
let Spacekey=1; //스페이스 종류 판단

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
  if(char_x+dx>0 && char_x+dx<700)  char_x+=dx; //캐릭터 좌우 캔버스 안나가게 하기
  char_y+=dy;
}
function draw() {
  context.drawImage(backgroundImg, 0,0,800,600); // 배경 그리기
  context.drawImage(charImg, char_x,char_y, 100,100); // 캐릭터 그리기
  context.fillText(keycode,10, 40);
}

function keydown() {
  keycode=event.keyCode;
  switch(keycode){
    case 37:dx=-2; break; //좌
    case 39:dx=2; break; //우
    case 32: Space(); break; //스페이스
    
  }
  
}

function keyup() {
  keycode=event.keyCode;
  switch(keycode){
    case 37:dx=0; break; //좌
    case 39:dx=0; break; //우
    case 32:dy=0; break; //스페이스
  }
}


//점프할 때 , 격파할 때
function Space(){
      if(Spacekey==1){ Spacekey=2; dy=-7;  charImg.src="../img/char_flying.png";} //처음 점프 할 때
      else {charImg.src="../img/char_kick.png";  setTimeout(() => charImg.src="../img/char_flying.png", 200);}//격파 할 때
   
}

//장애물 생성
function Obstacle(){

}