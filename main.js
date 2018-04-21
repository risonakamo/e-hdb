const {app,BrowserWindow,ipcMain}=require("electron");
const path=require("path");
const url=require("url");
var datastore=require("nedb-core");

var win;
var _einputwin;

function main()
{
    win=new BrowserWindow({width:1000,height:720,useContentSize:true});
    win.loadURL(`${__dirname}/index.html`);

    win.on("closed",(e)=>{
        app.quit();
    });

    // _einputwin=new BrowserWindow({width:1000,height:720,useContentSize:true});
    // _einputwin.loadURL(`${__dirname}/einput/einput.html`);
}

app.on("ready",main);