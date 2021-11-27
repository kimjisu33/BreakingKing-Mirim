"use strict";

let gameCanvas;
let context;
let scoreText;

let backgroundImg=new Image();
backgroundImg.src="../img/space_map.png"; //배경
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
let break_cnt=0; //격파갯수
setInterval(dy=2,1);

let bg_x=0;
let bg_y=-2680;

let score=0;


let block_list=[];
//let block_i=0;

let time=0;
let run;
function gameStart(){
  gameCanvas = document.getElementById("gameCanvas");
  context = gameCanvas.getContext("2d");
  gameCanvas.width=800;
  gameCanvas.height=600;


  run=setTimeout(function runGame(){
    
    move();
    draw();

    if(Spacekey==2){
      //createObstacle();
      drawObs();
      createObstacle();
    }
   

    run=setTimeout(runGame,1);
  },1);
}



function move() {
  if(char_x+dx>0 && char_x+dx<700 ){
    char_x+=dx; //캐릭터 좌우 캔버스 안나가게 하기
  }

  if( char_y+dy>200 && char_y+dy<470){ //위아래 제한
    char_y+=dy;
  }
}

function draw() {
  context.clearRect(0,0,800,600);
  context.drawImage(backgroundImg, 0,bg_y,800,3282); // 배경 그리기
  if(Spacekey==2){
    bg_y+=3;
  }
  context.drawImage(charImg, char_x,char_y, 100,100); // 캐릭터 그리기

}

function drawObs(){
  
  for(let i=0 ; i<block_list.length ; i++){ //장애물 그리기
    context.drawImage(block_list[i].img, block_list[i].x, block_list[i].y, 100,100);
    if(Spacekey==2) block_list[i].y+=3;
    if(block_list[i].isblocken) //setTimeout(() => block_list.splice(i,1) , 100); //격파할때 이미지 바꾸는건 나중에 수정하기
    block_list.splice(i,1);
  }
}



//점프할 때 , 격파할 때
function Space(){
  //처음 점프 할 때
      if(Spacekey==1){ 
        Spacekey=2; dy=-7; //처음 높이  상승
        //배경 움직이기
        //setInterval(() => bg_y+=0.1,200); //높이가 0.2초마다 낮아짐
        charImg.src="../img/char_flying.png"; 
      
      }  
      //격파 할 때
      else {
        charImg.src="../img/char_kick.png"; 
        chkBreak();
     
        //setInterval(() =>  dy+=0.1 ,500);
        setTimeout(() => charImg.src="../img/char_flying.png", 200);
     
      }
   
}

//장애물 생성
function createObstacle(){
  let result=Math.floor(Math.random()*100);
  if(result != 1 && result  !=2 ) return; //블록 생성되는 간격 주기

  let blocks;
  let x=[0,100,200,300,400,500,600,700];
  let set=new Set(); //중복처리 set

  for(let i=0 ; i<4 ; ){ //한줄에 블록 5개만 생성
    Obs_x=Math.floor(Math.random() * 8);
  
    if(set.has(Obs_x)) continue; //중복 검사

    blocks={
      x: x[Obs_x],
      y: -100,
      img: ObstacleImg,
      isblocken: false,
    };
    i++;
    set.add(Obs_x);
    block_list.push(blocks);
  }
  
}


function chkBreak(){
  scoreText=document.getElementById("score");
  for (let i=0 ; i<block_list.length ; i++) {
      //격파성공하면
    let check=char_y+dy>=block_list[i].y-40 
              && char_y+dy<=block_list[i].y+40 
              && char_x+dx>=block_list[i].x-40 
              && char_x+dx<=block_list[i].x+40;
    if(check){

       block_list[i].img=ObsBreakImg;
       block_list[i].isblocken=true;
      charImg.src="../img/char_breaking.png"  

       // bg_y+=5; //격파 성공시 y값 상승
        
        score+=10;
        scoreText.innerHTML="점수 : "+score;
  
    } 
  }
 
}

function keydown() {
  keycode=event.keyCode;
  switch(keycode){
    case 37:dx=-3; break; //좌
    case 39:dx=3; break; //우
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