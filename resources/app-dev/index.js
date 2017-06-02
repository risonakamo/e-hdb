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
                    i=-1;
                    break;
            }

            i++;
        }

        genBoxes(parsedData.slice(1));
    });
}