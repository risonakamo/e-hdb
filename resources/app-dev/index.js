const {ipcRenderer}=require("electron");

window.onload=main;

function main()
{
    
}

function genTest()
{
    var boxes=[{name:"hello",img:"http://i.imgur.com/HxIGGIS.jpg",tags:["tage1","tag3",]}];

    var boxinsert=document.querySelector(".db-boxes");
    var a=new dbBox();
    a.name=boxes[0].name;
    a.img=boxes[0].img;

    boxinsert.appendChild(a);
}