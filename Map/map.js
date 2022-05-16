"use strict";

let space=document.getElementById("space");
let sea=document.getElementById("sea");
let underground=document.getElementById("underground");
let school=document.getElementById("school");
let well=document.getElementById("well");

//우주
space.addEventListener("mouseover",()=>{
    space.src="../img/space/over.png";
});
space.addEventListener("mouseout",()=>{
    space.src="../img/space/choice.png";
});


//바다
sea.addEventListener("mouseover",()=>{
    sea.src="../img/sea/over.png";
});
sea.addEventListener("mouseout",()=>{
    sea.src="../img/sea/choice.png";
});


//땅 속
underground.addEventListener("mouseover",()=>{
    underground.src="../img/map_underground_over.png";
});
underground.addEventListener("mouseout",()=>{
    underground.src="../img/map_underground.png";
});


//학교
school.addEventListener("mouseover",()=>{
    school.src="../img/school/over.png";
});
school.addEventListener("mouseout",()=>{
    school.src="../img/school/choice.png";
});


//우물
well.addEventListener("mouseover",()=>{
    well.src="../img/map_well_over.png";
});
well.addEventListener("mouseout",()=>{
    well.src="../img/map_well.png";
});