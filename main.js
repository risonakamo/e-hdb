const {app,BrowserWindow,ipcMain}=require("electron");
const path=require("path");
const url=require("url");
var datastore=require("nedb-core");

let win;

function createWindow()
{
    win=new BrowserWindow({width:1000,height:720});

    win.loadURL(url.format({
        pathname:path.join(__dirname,"index.html"),
        protocol:"file:",
        slashes:true}));

    win.on("closed",(e)=>{
        app.quit();
    });
}

app.on("ready",createWindow);