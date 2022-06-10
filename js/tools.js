let toolsCont = document.querySelector(".tools-container");
let optionsCont = document.querySelector(".options-container");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let upload = document.querySelector(".upload");
let sticky = document.querySelector(".sticky");

let optionsFlag = true;
let pencilFlag = false;
let eraserFlag = false;


optionsCont.addEventListener("click" , (e) =>{
    optionsFlag = !optionsFlag;

    if(optionsFlag) openTools();
    else closeTools();
});

function openTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-xmark");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "flex";
    
}

function closeTools() { 
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-xmark");
    toolsCont.style.display = "none";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
 }

pencil.addEventListener("click",(e)=>{
    pencilFlag = !pencilFlag;

    if(pencilFlag){
        pencilToolCont.style.display = "block";
    }
    else{
        pencilToolCont.style.display = "none";
    }
});

eraser.addEventListener("click",(e)=>{
    eraserFlag = !eraserFlag;
    if(eraserFlag){
        eraserToolCont.style.display = "flex";
    }else{
        eraserToolCont.style.display = "none";
    }
});

upload.addEventListener("click" ,(e)=>{
    // for file explorer
    let input = document.querySelector("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change", (e)=>{
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");
    stickyCont.innerHTML = `
    <div class="sticky-cont">
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="notes-cont">
            <img src = "${url}" />
        </div>
    </div>
    `;

    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");

    noteActions(minimize,remove,stickyCont);
    


    stickyCont.onmousedown = function(event) {
        dragAndDrop(stickyCont,event);
    };
      
    stickyCont.ondragstart = function() {
    return false;
    };

    })


    
})

sticky.addEventListener("click" , (e)=>{
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");
    stickyCont.innerHTML = `
    <div class="sticky-cont">
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="notes-cont">
            <textarea ></textarea>
        </div>
    </div>
    `;

    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");

    noteActions(minimize,remove,stickyCont);
    


    stickyCont.onmousedown = function(event) {
        dragAndDrop(stickyCont,event);
    };
      
    stickyCont.ondragstart = function() {
    return false;
    };
})

function noteActions(minimize,remove,stickyCont){
    remove.addEventListener("click",(e)=>{
        stickyCont.remove();
    })
    minimize.addEventListener("click", (e)=>{
        let notesCont = stickyCont.querySelector(".notes-cont");
        let display = getComputedStyle(notesCont).getPropertyValue("display");
        if(display === "none"){
            notesCont.style.display="block";
        }
        else notesCont.style.display = "none";
    })
}


function dragAndDrop(element,event) { 

        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;
      
        element.style.position = 'absolute';
        element.style.zIndex = 1000;
        document.body.append(element);
      
        moveAt(event.pageX, event.pageY);
      
        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
          element.style.left = pageX - shiftX + 'px';
          element.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the ball, remove unneeded handlers
        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;
        };
      
     
 }
