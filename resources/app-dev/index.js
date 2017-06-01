const {ipcRenderer}=require("electron");

window.onload=main;

function main()
{
    var boxes=[{name:"hello",
                img:"http://i.imgur.com/eOuukmp.png",
                tags:["tage1","tag3",],
                type:"nope"}];

    genBoxes(boxes);

    var eraw=document.querySelector(".expand-raw");
    var opbox=document.querySelector(".op-box");

    eraw.addEventListener("click",(e)=>{
        opbox.classList.toggle("collapse");
    });

    parseRaw();
}

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

        if (data[x].wide!=undefined)
        {
            newbox.wide=1;
        }

        ipoint.appendChild(newbox);
    }
}

function parseRaw()
{
    var pbutton=document.querySelector(".parse-raw");
    var inputbox=document.querySelector(".raw-input");

    pbutton.addEventListener("click",(e)=>{
        var data=inputbox.value.split("\n");

        console.log(data);
    });
}