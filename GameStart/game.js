"use strict";

let gameCanvas;
let context;
let scoreText;

let backgroundImg=new Image();
backgroundImg.src="../img/space_back1.png";//배경 나중에 바꾸기
let charImg=new Image();
let ObstacleImg=new Image();
charImg.src="../img/char_ready.png"
ObstacleImg.src="../img/obstacle1.png"
let ObsBreakImg=new Image();
ObsBreakImg.src="../img/obstacle1_break.png"
let char_x=340; //캐릭터 x 좌표
let char_y=470; //캐릭터 y 좌표
let Obs_x=0; //장애물 x 좌표
let Obs_y=0; //장애물 y 좌표
let dx=0;
let dy=0;
let Spacekey=1; //스페이스 종류 판단
let keycode;
setInterval(dy=2,1);

let score=0;

let set=new Set();

function gameStart(){
  gameCanvas = document.getElementById("gameCanvas");
  context = gameCanvas.getContext("2d");
  gameCanvas.width=800;
  gameCanvas.height=600;

  
  createObstacle();
  let run=setTimeout(function runGame(){
    
    move();
    draw();

    run=setTimeout(runGame,1);
  },1);


  //setInterval(runGame,1);
}

/*
function runGame(){
  move();
  draw();
}*/

function move() {
  if(char_x+dx>0 && char_x+dx<700 ){
    char_x+=dx; //캐릭터 좌우 캔버스 안나가게 하기
  }

  if( char_y+dy>0 && char_y+dy<470){
    char_y+=dy;
  }
}
function draw() {
 
  context.drawImage(backgroundImg, 0,0,800,600); // 배경 그리기

  context.drawImage(charImg, char_x,char_y, 100,100); // 캐릭터 그리기

  for(let block of set){ //장애물 그리기
    context.drawImage(ObstacleImg,block.x, block.y, 100,100);
  }
  //context.drawImage(ObstacleImg,block.x, block.y,100,100);
  //context.fillText(score,10, 40);
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
  //처음 점프 할 때
      if(Spacekey==1){ 
        Spacekey=2; dy=-10;   //처음 높이 상승 나중에 수정할 것
        setInterval(() => dy++,200);  //높이가 0.5초마다 낮아짐
        charImg.src="../img/char_flying.png"; 
      
        setTimeout(() =>   backgroundImg.src="../img/space_back2.png", 500); //0.5초후 점프하면 하늘배경으로
      }  
      //격파 할 때
      else {
        charImg.src="../img/char_kick.png"; 
        chkBreak();
        
        setInterval(() => dy++,500);
        setTimeout(() => charImg.src="../img/char_flying.png", 200);
     
      }
   
}

//장애물 생성
function createObstacle(){
  let x=[0,100,200,300,400,500,600,700];
  let y=[0,100,200];

  for(let i=0 ; i<15 ; i++){
    Obs_x=Math.floor(Math.random() * 8);
    Obs_y= Math.floor(Math.random() * 3);
    //블록 중복 제거 해야할듯~~~ 블록 하나깰때 점수 10 이상 찍힘
    set.add({
      x: x[Obs_x],
      y: y[Obs_y],
    });
  } 
  
}

function chkBreak(){
  scoreText=document.getElementById("score");
  for (let xy of set) {
      //격파성공하면
    if(char_y+dy>=xy.y-40 && char_y+dy<=xy.y+40 && char_x+dx>=xy.x-40 && char_x+dx<=xy.x+40){
        charImg.src="../img/char_breaking.png"  
        
        set.delete(xy);
        dy-=8; //격파 성공시 y값 상승
        score+=10;
        scoreText.innerHTML="점수 : "+score;
      
    } 
  }
 
}

