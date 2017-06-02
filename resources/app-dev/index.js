const {remote,shell}=require("electron");
const {Menu,MenuItem}=remote;
var datastore=require("nedb");

var db=new datastore({filename:"db.db",autoload:true});
var curId;

//context menu for db box
var deleteBox;
const boxMenu=new Menu();
boxMenu.append(new MenuItem({label:"delete",click(){
    deleteBox.parentNode.removeChild(deleteBox);

    //insert code for remove from database here
    db.remove({id:deleteBox.id},{});
}}));

window.onload=main;

function main()
{
    // var boxes=[{name:"hello",
    //             img:"http://i.imgur.com/eOuukmp.png",
    //             tags:["tage1","tag3",],
    //             type:"nope",
    //             id:3222}];

    // genBoxes(boxes);

    opBox();
    parseRaw();
    loadAll();
    getId();
}

//setup for op box
function opBox()
{
    var eraw=document.querySelector(".expand-raw");
    var opbox=document.querySelector(".op-box");
    var shuffleButton=document.querySelector(".shuffle");

    eraw.addEventListener("click",(e)=>{
        opbox.classList.toggle("collapse");
    });

    shuffleButton.addEventListener("click",(e)=>{
        shuffle();
    });
}

//generate and add boxes
//requires array of objects
function genBoxes(data)
{
    var ipoint=document.querySelector(".db-boxes");

    for (var x=0;x<data.length;x++)
    {
        var newbox=new dbBox();
        newbox.name=data[x].name;
        newbox.img=data[x].img;
        newbox.tags=data[x].tags;
        newbox.type=data[x].type;
        newbox.link=data[x].link;
        newbox.id=data[x].id;

        if (data[x].wide!=undefined)
        {
            newbox.wide=1;
        }

        ipoint.appendChild(newbox);
    }

    boxEvents();
}

//set up parse raw old system
function parseRaw()
{
    var pbutton=document.querySelector(".parse-raw");
    var inputbox=document.querySelector(".raw-input");

    pbutton.addEventListener("click",(e)=>{
        var data=inputbox.value.split("\n");
        var parsedData=[];

        var ne;
        var i=0;
        for (var x=0;x<data.length;x++)
        {
            switch (i)
            {
                case 0:
                    ne={};
                    ne.name=data[x];
                    ne.id=curId;
                    curId++;
                    break;
                
                case 1:
                    ne.type=data[x];
                    break;

                case 2:
                    ne.img=data[x];
                    break;

                case 3:
                    ne.link=data[x];
                    break;

                case 4:
                    ne.tags=data[x].split(",");
                    break;

                case 5:
                    parsedData.push(ne);
                    db.insert(ne);
                    i=-1;
                    break;
            }

            i++;
        }

        genBoxes(parsedData);
        db.update({meta:"id"},{$set:{cur:curId}},{});
    });
}

//setup events for db boxes
function boxEvents()
{
    var boxes=document.querySelectorAll("db-box");

    for (var x=0;x<boxes.length;x++)
    {
        boxes[x].addEventListener("contextmenu",(e)=>{
            deleteBox=e.target;
            boxMenu.popup(remote.getCurrentWindow());
        });

        boxes[x].addEventListener("click",(e)=>{
            e.preventDefault();
            shell.openExternal(e.target.link);
        });
    }
}

//load all boxes
function loadAll()
{
    db.find({meta:{$ne:"id"}},(err,res)=>{
        if (res!=undefined)
        {
            genBoxes(res);
        }
    });
}

//shuffle all boxes
function shuffle()
{
    var boxes=document.querySelectorAll("db-box");
    var ipoint=document.querySelector(".db-boxes");

    ipoint.classList.add("hidden");

    setTimeout(()=>{
        var size=boxes.length;
        for (var x=boxes.length;x>=0;x--)
        {
            ipoint.appendChild(arrayPick(boxes,size));
            size--;
        }

        ipoint.classList.remove("hidden");
    },200);
}

//randomly pick item from array of size size (moves picked to end)
function arrayPick(array,size)
{
    var pos=Math.floor(Math.random()*size);
    var item=array[pos];
    array[pos]=array[size-1];
    array[size-1]=item;
    return item;
}

//retrive current id from databse or initialise
function getId()
{
    db.find({meta:"id"},(err,res)=>{
        if (res==undefined || res.length==0)
        {
            db.insert({meta:"id",cur:0});
            curId=0;
            console.log(curId);
            return;
        }

        curId=res[0].cur;
    });
}