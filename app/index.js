const {remote,shell}=require("electron");
const {Menu,MenuItem}=remote;
var datastore=require("nedb");

var db=new datastore({filename:"db.db",autoload:true});
var curId; //last id for updates
var allTags; //tags tracker

//context menu for db box
var selectedBox;
const boxMenu=new Menu();
boxMenu.append(new MenuItem({label:"delete",click(){
    selectedBox.parentNode.removeChild(selectedBox);

    //insert code for remove from database here
    db.remove({id:selectedBox.id},{});
}}));

boxMenu.append(new MenuItem({
    label:"edit",
    click(){
        selectedBox.editMode=1;
    }
}));

window.onload=main;

function main()
{
    opBox();
    parseRaw();
    loadAll();
    getDbMeta();
}

//setup for op box(es)
function opBox()
{
    var eraw=document.querySelector(".expand-raw");
    var rawopbox=document.querySelector(".raw-box");
    var shuffleButton=document.querySelector(".shuffle");
    var searchBt=document.querySelector(".search-bt");
    var searchOpBox=document.querySelector(".search-op");

    eraw.addEventListener("click",(e)=>{
        rawopbox.classList.toggle("collapse");
    });

    shuffleButton.addEventListener("click",(e)=>{
        shuffle();
    });

    searchBt.addEventListener("click",(e)=>{
        searchOpBox.classList.toggle("collapse");
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

        newbox.classList.add("new");

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

                    for (var y=0;y<ne.tags.length;y++)
                    {
                        if (allTags[ne.tags[y]]==undefined)
                        {
                            allTags[ne.tags[y]]=0;
                        }

                        else
                        {
                            allTags[ne.tags[y]]++;
                        }
                    }

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
        db.update({meta:"alltags"},{$set:{"allTags":allTags}},{});
    });
}

//setup events for db boxes
function boxEvents()
{
    var boxes=document.querySelectorAll("db-box.new");

    for (var x=0;x<boxes.length;x++)
    {
        boxes[x].classList.remove("new");

        //apply context menu
        boxes[x].addEventListener("contextmenu",(e)=>{
            selectedBox=e.target;
            boxMenu.popup(remote.getCurrentWindow());
        });

        //apply link navigation
        boxes[x].addEventListener("linkclick",(e)=>{
            shell.openExternal(e.target.link);
        });

        //listen for box update
        boxes[x].addEventListener("updated",(e)=>{
            //updating entry with id of the updated box
            db.update({id:e.detail.id},e.detail,{});
        });
    }
}

//load all boxes
function loadAll()
{
    db.find({$and:[{meta:{$ne:"id"}},{meta:{$ne:"alltags"}}]},(err,res)=>{
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
function getDbMeta()
{
    db.find({meta:"id"},(err,res)=>{
        if (res==undefined || res.length==0)
        {
            db.insert({meta:"id",cur:0});
            curId=0;
            return;
        }

        curId=res[0].cur;
    });

    db.find({meta:"alltags"},(err,res)=>{
        if (res==undefined || res.length==0)
        {
            db.insert({meta:"alltags"});
            allTags={};
            return;
        }
        
        allTags=res[0].allTags;

        var tagSearch=document.querySelector("tag-box");
        tagSearch.tags=allTags;
    });
}