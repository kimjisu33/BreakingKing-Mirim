"use strict";


//음악
let a_kick = new Audio('../sound/발차기.wav');
let a_break = new Audio('../sound/격파성공.wav');
let a_score = new Audio('../sound/점수.wav');
let a_clear = new Audio('../sound/게임클리어.wav');
let a_play = new Audio('../sound/게임중.wav');
let a_over = new Audio('../sound/게임오버.wav');
let a_jump = new Audio('../sound/점프.wav');
let a_guage = new Audio('../sound/게이지.mp3');


let gaugeCanvas;
let context2;
let miniImg=new Image();
miniImg.src="../img/char_score1.png";
let minibackImg=new Image();
minibackImg.src="../img/space/map.png";
let scorebackImg=new Image();
scorebackImg.src="../img/score_back.png";
let clearImg=new Image();
clearImg.src="../img/bak.png";

let jumpguageImg=new Image();
jumpguageImg.src="../img/게이지.png";
let scoreText;
let gameCanvas;

let context3=document.getElementById("scoreCanvas").getContext("2d");

let context;
let backgroundImg=new Image();
backgroundImg.src="../img/space/map.png"; //배경
let charImg=new Image();
let ObstacleImg=new Image();
charImg.src="../img/space/char_ready.png";
ObstacleImg.src="../img/space/obs.png"; //장애물
let ObsBreakImg=new Image();
ObsBreakImg.src="../img/space/obsB.png";
let char_x=340; //캐릭터 x 좌표
let char_y=470; //캐릭터 y 좌표
let Obs_x=0; //장애물 x 좌표                                                                                
let Obs_y=0; //장애물 y 좌표
let dx=0;
let dy=0;
let Spacekey=-1; //스페이스 종류 판단
let keycode;
let break_cnt=0; //격파갯수

//배경 위치 상수
const c_bg_x=0;
const c_bg_y=-5760;
//배경 시작 위치
let bg_x=c_bg_x;
let bg_y=c_bg_y;

//점수
let score=0;



//true 왼쪽 false 오른쪽
let direction=true;

let block_list=[];

let time=0;
let time_temp=0;
let run;
let bg_check=false;
let bloke_chek=false;

let bak={
  x:280,
  y:c_bg_y+300,
  isblocken: false,
  img: clearImg,
};

let trampoline_list=[];
let trampolineImg=new Image();
trampolineImg.src="../img/trampoline.png";
let trampoline_check=false;

let gameover =false;
let gameclear=false;
let overImg=new Image();
overImg.src="../img/gameover_back.png";
let clearImg_bg=new Image();
clearImg_bg.src="../img/gameclear_back.png";

let temp_input=document.getElementById('temp_input');
function popup_over(){
  temp_input.value=score;
  window.open('gameover.html',"childForm", "width=570, height=350, resizable = no, scrollbars = no");
}
function gameStart(){
  gameCanvas = document.getElementById("gameCanvas");
  context = gameCanvas.getContext("2d");
  gameCanvas.width=800;
  gameCanvas.height=600;


  for(let i=0 ; i<35 ; i++) createObstacle();
  let a=0;
  run=setTimeout(function runGame(){
    //게임 오버 클리어 체크
    if(gameover){
      a++;
      if(a>100){
        clearTimeout(run);
        context.clearRect(0,0,800,600);
        context.drawImage(overImg, 0,0,800,600);
        context.font = "bold 50px Gulim";
        context.fillStyle="white";
        context.fillText(score, 360, 410);
        popup_over();
        return ;
      }
    }else if(gameclear){
      a++;
      if(a>300){
        clearTimeout(run);
        context.clearRect(0,0,800,600);
        context.drawImage(clearImg_bg, 0,0,800,600);
        context.font = "bold 50px Gulim";
        context.fillStyle="white";
        context.fillText(score, 360, 410);
        return ;
      }
    }
    move();
    draw();
   // a_play.play();
    minidraw();
    scoredraw(); //점수판

    bg_check = Spacekey==2 && bg_y<0 && bg_y >=c_bg_y;
    if(bg_check){
      drawObs();
      time++;
      if(bloke_chek||trampoline_check) time_temp+=7;
      if(time_temp>300) {
        bloke_chek=false;
        trampoline_check=false;
        time_temp=0;
      }
    }
    else if(Spacekey==2 && bg_y<0){
      dy=5;
      
      charImg.src="../img/space/char_ready.png";
      bg_y=c_bg_y;
      if(!gameover&&!bak.isblocken){
        gameover=true;
        a_over.play();
      
      } 
    }
    run=setTimeout(runGame,1);
  },1);
  
  //context.clearRect(0,0,800,600);

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
  //context.clearRect(0,0,1000,600);
  context.drawImage(backgroundImg, 0,bg_y,800,6360); // 배경 그리기
  if(bg_check){
    
    if(time<jump){ bg_y+=5;}
    else bg_y-=5;
  }
  if(bloke_chek){ bg_y+=15;}
  if(trampoline_check) { bg_y+=20;}
  if(bg_y>0) bg_y=-5;
 
  context.drawImage(charImg, char_x,char_y, 200,150); // 캐릭터 그리기
 
 if(Spacekey==0){
  jumpguage();
 }
 
}

function drawObs(){
  for(let i=0 ; i<trampoline_list.length ; i++){ //트램펄린 그리기
    context.drawImage(trampoline_list[i].img, trampoline_list[i].x, trampoline_list[i].y, 120,120);
    if(time<jump) trampoline_list[i].y+=5;
    else trampoline_list[i].y-=5;
    if(bloke_chek)trampoline_list[i].y+=13;
    if(trampoline_check) trampoline_list[i].y+=20;
    if(trampoline_list[i].isUsed) trampoline_list.splice(i,1);
  }
  for(let i=0 ; i<block_list.length ; i++){ //장애물 그리기
    context.drawImage(block_list[i].img, block_list[i].x, block_list[i].y, 100,100);
    if(time<jump) block_list[i].y+=5;
    else block_list[i].y-=5;
    if(bloke_chek)block_list[i].y+=13;
    if(trampoline_check) block_list[i].y+=20;
    if(block_list[i].isblocken) block_list.splice(i,1);//setTimeout(() => block_list.splice(i,1) , 100); //격파할때 이미지 바꾸는건 나중에 수정하기 
  } 
  if(time<jump) bak.y+=5; //빅 그리기
  else bak.y-=5;
  if(bloke_chek)bak.y+=13;
  if(trampoline_check) bak.y+=20;
  context.drawImage(bak.img, bak.x, bak.y, 300,300);
}




//점프할 때 , 격파할 때
function Space(){
  //처음 점프 할 때

      if(Spacekey==-1){
        setTimeout(() => {
          document.getElementById('alert1').style.display = 'none';
          document.getElementById('alert2').style.display = 'block';
          Spacekey=0;   
        }, 500);
     
      }
      else if(Spacekey==1){
        document.getElementById('alert2').style.display = 'none';
        setInterval(()=>dy=-5,200);
        Spacekey=2;
        
        charImg.src="../img/space/char_flying.png"; 
      
      }  
      //격파 할 때
      else {
   

        a_kick.play(); 

        //좌우 구분
        if(direction=true){
          charImg.src="../img/space/char_lkick.png"; 
        }
        else {
          charImg.src="../img/space/char_rkick.png"; 
        } 
        chkBreak();
        setTimeout(() => charImg.src="../img/space/char_flying.png", 200);
     
      }
   
}



//장애물 생성
let block_interval=0;
let trampoline_interval=0;
function createObstacle(){

  let blocks;
  let x=[0,100,200,300,400,500,600,700];
  let set=new Set(); //중복처리 set

  for(let i=0 ; i<4 ; ){ //한줄에 블록 4개만 생성
    Obs_x=Math.floor(Math.random() * 8);
  
    if(set.has(Obs_x)) continue; //중복 검사

    blocks={
      x: x[Obs_x],
      y: block_interval,
      img: ObstacleImg,
      isblocken: false,
    };
    i++;
    set.add(Obs_x);
    block_list.push(blocks);
    
  }
  block_interval-=150;

  Obs_x=Math.floor(Math.random() * 8);
  
  if(!set.has(Obs_x)){
    let t={
      x: x[Obs_x],
      y: trampoline_interval,
      img: trampolineImg,
      isUsed: false,
    };
    trampoline_list.push(t);
  }
    trampoline_interval-=150;
  
}


function chkBreak(){

  let popup1=false;
  for (let i=0 ; i<trampoline_list.length ; i++) {
     let check=char_y+dy>=trampoline_list[i].y-60 
            && char_y+dy<=trampoline_list[i].y+60 
            && char_x+dx>=trampoline_list[i].x-60 
            && char_x+dx<=trampoline_list[i].x+60;
    if(check){
      a_jump.play();
      trampoline_list[i].isUsed=true;
      trampoline_check=true;
    }
}
  for (let i=0 ; i<block_list.length ; i++) {
      //격파성공하면
    let check=char_y+dy>=block_list[i].y-70 
              && char_y+dy<=block_list[i].y+70 
              && char_x+dx>=block_list[i].x-70 
              && char_x+dx<=block_list[i].x+70;
    if(check){
      block_list[i].img=ObsBreakImg;
      block_list[i].isblocken=true;

      
      charImg.src="../img/space/char_rkick.png"  
      a_break.play(); 
      score+=10;

      bloke_chek=true;
    }
    
    
      //박 격파 성공 
      let clear_check=char_y+dy>=bak.y-100 
              && char_y+dy<=bak.y+100 
              && char_x+dx>=bak.x-100 
              && char_x+dx<=bak.x+100;
      if(clear_check){
          clearImg.src="../img/bakB.png";
    
          a_clear.play();

          //popup1=true; 
          bak.isblocken=true;
          gameclear=true;
      }
  }
  if(popup1==true){
    setTimeout(() =>  popup_clear(), 1000);
  }


}

function keydown() {
  keycode=event.keyCode;
  switch(keycode){
    case 37:dx=-3;  direction=true;  break; //좌
    case 39:dx=3;  direction=false;  break; //우
    case 32: Space(); break; //스페이스
    
  }
  
}

function keyup() {
  keycode=event.keyCode;
  switch(keycode){
    case 37:dx=0;   break; //좌
    case 39:dx=0;  break; //우
    case 32:dy=0; break; //스페이스
  }
}


//미니맵
    function minimapStart(){
      gaugeCanvas = document.getElementById("gaugeCanvas");
      context2 = gaugeCanvas.getContext("2d");
      gaugeCanvas.width=800;
      gaugeCanvas.height=600;
    
    }
    function minidraw() {
      context2.drawImage(minibackImg,0,0,800,600);
    }
    
  
    
    
    
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

      context3.fillText(score,160, 220);
      
    }
    
//점프게이지
let jump_x=250, jump_y=20; let jump=0;
let z=0;
function jumpguage(){

  a_guage.play();
    if(jump_x<=500 && z==0){
      jump_x+=10;
      if(jump_x==500) z=1;
    }
    else if(z==1) {
      jump_x-=10;
      if(jump_x==250)z=0;
    }
    context.drawImage(jumpguageImg, 250,20, 300,20);
    context.drawImage(miniImg, jump_x,20, 20,20);

if(keycode==13){

  z=3;
  context.drawImage(miniImg, jump_x,20, 20,20);


  //구간에 따라 y좌표 주기
  if(jump_x>=250 && jump_x<=300 || jump_x>=450 && jump_x<=500){
  jump=100;
  } 
  else if(jump_x>300 && jump_x<350 || jump_x>400 && jump_x<450) {
    jump=150;
  }
  else if(jump_x>=350 && jump_x<=400){
    jump=200;
  }

  setTimeout(() => {
    Spacekey=1;
  }, 300); 
}
}
