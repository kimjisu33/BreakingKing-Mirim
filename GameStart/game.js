"use strict";


//음악
let a_kick = new Audio('../sound/발차기.wav');
let a_break = new Audio('../sound/격파성공.wav');
let a_score = new Audio('../sound/점수.wav');
let a_clear = new Audio('../sound/게임클리어.wav');
let a_play = new Audio('../sound/게임중.wav');
let a_over = new Audio('../sound/게임오버.wav');
let gaugeCanvas;
let context2;
let miniImg=new Image();
miniImg.src="../img/char_score1.png"
let minibackImg=new Image();
minibackImg.src="../img/space_map.png"
let scorebackImg=new Image();
scorebackImg.src="../img/score_back.png"
let clearImg=new Image();
clearImg.src="../img/박.png"
let mchar_y=550;
let mchar_x=300;
let mx=0;
let my=0;
let jumpguageImg=new Image();
jumpguageImg.src="../img/게이지.png"
let scoreText;
let gameCanvas;


let context;
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
let time_temp=0;
let run;
let bg_check=false;
let bloke_chek=false;

function gameStart(){
  gameCanvas = document.getElementById("gameCanvas");
  context = gameCanvas.getContext("2d");
  gameCanvas.width=800;
  gameCanvas.height=600;


  run=setTimeout(function runGame(){
    
    move();
    draw();
    a_play.play();
    minimove(); //미니맵 움직임
    minidraw();
    scoredraw(); //점수판

    bg_check=Spacekey==2 && bg_y<0 && bg_y >=-2680;
    if(bg_check){
      drawObs();
      if(!bloke_chek)createObstacle();
      time++;
      if(bloke_chek) time_temp+=7;
      if(time_temp>500) {
        bloke_chek=false;
        time_temp=0;
      }
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
  if(bg_check){
    if(time<200) bg_y+=5;
    else bg_y-=5;
  }
  if(bloke_chek) bg_y+=10;
  context.drawImage(charImg, char_x,char_y, 100,100); // 캐릭터 그리기

}

function drawObs(){
  for(let i=0 ; i<block_list.length ; i++){ //장애물 그리기
    context.drawImage(block_list[i].img, block_list[i].x, block_list[i].y, 100,100);
    if(time<200) block_list[i].y+=5;
    else block_list[i].y-=5;
    if(bloke_chek)block_list[i].y+=10;
    if(block_list[i].isblocken) //setTimeout(() => block_list.splice(i,1) , 100); //격파할때 이미지 바꾸는건 나중에 수정하기
    block_list.splice(i,1);
  }
}


//마지막 맵일때 박그리기
function cleardraw(){
  context.drawImage(clearImg, bakX[bak_key],0, 100,100);
}

//점프할 때 , 격파할 때
function Space(){
  //처음 점프 할 때
      if(Spacekey==1){ 
        Spacekey=2; dy=-7; //처음 높이  상승
        //my-=1;
        //setInterval(() =>  my+=0.2,1000);
        charImg.src="../img/char_flying.png"; 
      
      }  
      //격파 할 때
      else {
        a_kick.play(); 
        charImg.src="../img/char_kick.png"; 
        chkBreak();
    
        setTimeout(() => charImg.src="../img/char_flying.png", 200);
     
      }
   
}

//장애물 생성
function createObstacle(){
  if(time%30!=0) return; //블럭 생성 간격 주기

  let blocks;
  let x=[0,100,200,300,400,500,600,700];
  let set=new Set(); //중복처리 set

  for(let i=0 ; i<7 ; ){ //한줄에 블록 5개만 생성
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

        //박 격파 성공 
        // if(char_x+dx>=bakX[bak_key]-40 && char_x+dx<=bakX[bak_key]+40 && char_y+dy>=0 && char_y+dy<=40){
        //   clearImg.src="../img/박격파.png"
        //   setTimeout(() =>  clearImg.src="", 1000);
        //   a_clear.play(); 
        // }
  for (let i=0 ; i<block_list.length ; i++) {
      //격파성공하면
    let check=char_y+dy>=block_list[i].y-50 
              && char_y+dy<=block_list[i].y+50 
              && char_x+dx>=block_list[i].x-50 
              && char_x+dx<=block_list[i].x+50;
    if(check){

      block_list[i].img=ObsBreakImg;
      block_list[i].isblocken=true;
      charImg.src="../img/char_breaking.png"  

      bg_y+=5; //격파 성공시 y값 상승
      a_break.play(); 
      score+=10;
      scoreText.innerHTML="점수 : "+score;
      bloke_chek=true;
    } 
  }
 
}


//박 생성
let bak=new Set();
let bak_key=Math.floor(Math.random() * 8);
let bakX=[0,100,200,300,400,500,600,700];
function cleardraw(){
  context.drawImage(clearImg, bakX[bak_key],0, 100,100);
}

function keydown() {
  keycode=event.keyCode;
  switch(keycode){
    case 37:dx=-3; mx=-2; break; //좌
    case 39:dx=3;  mx=2; break; //우
    case 32: Space(); break; //스페이스
    
  }
  
}

function keyup() {
  keycode=event.keyCode;
  switch(keycode){
    case 37:dx=0;  mx=0; break; //좌
    case 39:dx=0;  mx=0; break; //우
    case 32:dy=0; break; //스페이스
  }
}

    //추가할 것
    function minimapStart(){
      gaugeCanvas = document.getElementById("gaugeCanvas");
      context2 = gaugeCanvas.getContext("2d");
      gaugeCanvas.width=800;
      gaugeCanvas.height=600;
    
    }
    function minidraw() {
      context2.drawImage(minibackImg,0,0,800,600);
      context2.drawImage(miniImg,mchar_x,mchar_y,200,30); // 사용자 위치 그리기
      // 사용자 위치 그리기
    }
    
    function minimove() {
    
      if( mchar_x+mx>0 && mchar_x+mx<550){
        mchar_x+=mx;
      }
    
    
    
      if( mchar_y+my>0 && mchar_y+my<550){
        mchar_y+=my;
      }
    }
    
    let context3=document.getElementById("scoreCanvas").getContext("2d");
    
    
    //온로드 동시에 사용가능
    window.onload = function() {
      gameStart();  minimapStart();
      scoreCanvas.width=300;
      scoreCanvas.height=300;
    
    
      context3.font ="50pt 굴림체";
      context3.fillStyle = "black";
      context3.textAlign = "center";
  
    
    }
    
    function scoredraw() {
      context3.drawImage(scorebackImg,0,0,300,300);
    
     

      context3.drawImage(miniImg,125,240,50,50);
      context3.fillText(score,150, 200);
      
    }
    
    