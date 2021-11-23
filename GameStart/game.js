"use strict";

let gameCanvas;
let context;
let scoreText;

let backgroundImg=new Image();
backgroundImg.src="../img/space_back1.png"; //배경
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

let score=0;

//let blocks=new Map();

let blocks=[
  new Map(),
  new Map(),
  new Map(),
  new Map(),
  new Map(),
];
let block_i=0;
//배경 바뀌면 장애물도 바뀌게 하기
//장애물이 바뀌면 격파할때 오류 생김.. 고쳐야함!! 일단 커밋

function gameStart(){
  gameCanvas = document.getElementById("gameCanvas");
  context = gameCanvas.getContext("2d");
  gameCanvas.width=800;
  gameCanvas.height=600;

  for(let i=0 ; i<blocks.length ; i++) createObstacle(i);
  let run=setTimeout(function runGame(){
    
    move();
    draw();

    if(Spacekey==2){
      drawObs();  
      if(char_y>430 && char_y<460){ char_y=100;  
        

        //배경 밑으로 내려오기
        switch (break_cnt) {
          case 0: case 1: case 2:  backgroundImg.src="../img/space_back1.png"; break;
          case 3: case 4: case 5: case 6:  backgroundImg.src="../img/space_back2.png";  break_cnt=0; break;
          case 7: case 8: case 9: case 10: case 11: backgroundImg.src="../img/space_back3.png"; break_cnt=3; break;
          case 12: backgroundImg.src="../img/space_back4.png"; break_cnt=7; break;
          default:backgroundImg.src="../img/space_back4.png"; break_cnt=7; break;
          

        } 
    }
 
    }
   

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

  // for(let block of set){ //장애물 그리기
  //   context.drawImage(ObstacleImg,block.x, block.y, 100,100);
  // }
  //context.drawImage(ObstacleImg,block.x, block.y,100,100);
  //context.fillText(score,10, 40);
}

function drawObs(){

  for(let key of blocks[block_i].keys()){ //장애물 그리기
    context.drawImage(blocks[block_i].get(key).img,blocks[block_i].get(key).x, blocks[block_i].get(key).y, 100,100);
    if(blocks[block_i].get(key).isblocken) setTimeout(() => blocks[block_i].delete(key), 100);
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


//점프할 때 , 격파할 때
function Space(){
  //처음 점프 할 때
      if(Spacekey==1){ 
        Spacekey=2; dy=-7;   //처음 높이 상승 나중에 수정할 것
        setInterval(() => dy+=0.1,200);  //높이가 0.2초마다 낮아짐
        charImg.src="../img/char_flying.png"; 
      
        setTimeout(() =>   backgroundImg.src="../img/space_back2.png", 500); //0.5초후 점프하면 하늘배경으로
      }  
      //격파 할 때
      else {
        charImg.src="../img/char_kick.png"; 
        chkBreak();
     
        setInterval(() =>  dy+=0.1,500);
        setTimeout(() => charImg.src="../img/char_flying.png", 200);
     
      }
   
}

//장애물 생성
function createObstacle(b_i){
  let x=[0,100,200,300,400,500,600,700];
  let y=[300,100,200];

  for(let i=0 ; i<20 ; ){
    Obs_x=Math.floor(Math.random() * 8);
    Obs_y= Math.floor(Math.random() * 3);
  
    if(blocks[b_i].has(`${Obs_x}${Obs_y}`)) continue;

    blocks[b_i].set(`${Obs_x}${Obs_y}`,{
      x: x[Obs_x],
      y: y[Obs_y],
      img:ObstacleImg,
      isblocken: false,
    });
    i++;
  } 
  
}


function chkBreak(){
  scoreText=document.getElementById("score");
  for (let xy of blocks[block_i].keys()) {
      //격파성공하면
    if(char_y+dy>=blocks[block_i].get(xy).y-40 && char_y+dy<=blocks[block_i].get(xy).y+40 && char_x+dx>=blocks[block_i].get(xy).x-40 && char_x+dx<=blocks[block_i].get(xy).x+40){
        break_cnt++;

        blocks[block_i].get(xy).img=ObsBreakImg;
        blocks[block_i].get(xy).isblocken=true;
        charImg.src="../img/char_breaking.png"  
        //set.delete(xy);

               //격파 갯수로 배경이 바뀜
               switch (break_cnt) {
                case 3:char_y=300; backgroundImg.src="../img/space_back3.png";
                block_i++; break;
                case 7: char_y=300;backgroundImg.src="../img/space_back4.png"; 
                block_i++; break;
                case 12:char_y=300; backgroundImg.src="../img/space_back5.png"
                block_i++; break;
  
              } 
          


      
        dy-=5; //격파 성공시 y값 상승
        
        score+=10;
        scoreText.innerHTML="점수 : "+score;
  
    } 
  }
 
}

