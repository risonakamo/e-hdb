window.onload=()=>{
    new einput;
};

class einput
{
    constructor()
    {
        this.currentPanel=0;
        this.initSidebar();
    }

    initSidebar()
    {
        var buttons=document.querySelectorAll(".sidebar .button");
        var panels=document.querySelectorAll(".panels .panel");

        buttons.forEach((x,i)=>{
            x.addEventListener("click",(e)=>{
                buttons[this.currentPanel].classList.remove("selected");
                panels[this.currentPanel].classList.remove("show");

                this.currentPanel=i;

                x.classList.add("selected");
                panels[i].classList.add("show");
            });
        });
    }
}