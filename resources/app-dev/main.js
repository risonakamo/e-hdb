const {app,BrowserWindow,ipcMain}=require("electron");
const path=require("path");
const url=require("url");
var datastore=require("nedb");

let win;

function createWindow()
{
    win=new BrowserWindow({width:800,height:600});

    win.loadURL(url.format({
        pathname:path.join(__dirname,"index.html"),
        protocol:"file:",
        slashes:true}));
}

// ipcMain.on("commands",(e,msg)=>{
//     console.log(msg);
// });

// var db=new datastore({filename:"db.db",autoload:true});

// // db.insert({name:"1",tags:["tag1","tag2"]});
// // db.insert({name:"2",tags:["tag1"]});

// db.find({},(err,docs)=>{
//     console.log(docs);
// });

// db.find({tags:"tag2"},(err,docs)=>{
//     console.log("----");
//     console.log(docs);
// });

app.on("ready",createWindow);