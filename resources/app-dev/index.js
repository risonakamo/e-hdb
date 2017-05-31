const {ipcRenderer}=require("electron");

window.onload=main;

function main()
{
    var but=document.querySelector(".but");
    var ibox=document.querySelector(".ibox");

    but.addEventListener("click",(e)=>{
        ipcRenderer.send("commands",ibox.value);
    });

    ibox.addEventListener("keydown",(e)=>{
        if (e.key && e.key=="Enter")
        {
            e.preventDefault();
            ipcRenderer.send("commands",ibox.value);
        }
    });
}