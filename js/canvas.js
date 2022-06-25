let canvas = document.querySelector("canvas");
canvas.width= innerWidth;
canvas.height = innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthEle = document.querySelector(".pencil-width");
let eraserWidthEle = document.querySelector(".eraser-width");
let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthEle.val;
let eraserWidth = eraserWidthEle.val;
let mousedown = false;
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");
let undoRedoTracker = [];
let track = 0;

// Api defining 
let tool = canvas.getContext("2d");  // for drawing path

tool.strokeStyle = penColor;  // for color
tool.lineWidth = eraserColor;  // for thickness

// tool.beginPath(); // New graphic point (line)
// tool.moveTo(10,20); //starting point (x,y) co-ordinates 
// tool.lineTo(100,150); // ending point
// tool.stroke();  // fill color (fill graphic)
 
//  new path won't begin again it will join from the first line co-ordinate
// tool.lineTo(200,200);
// tool.stroke(); 



// using mouseListener 
//  mousedown -> startpath
// mousemove -> fill the path/graphics

canvas.addEventListener("mousedown",(e)=>{
    mousedown = true;
    beginPath({
        x:e.clientX,
        y:e.clientY
    });
});

// mousemove 
canvas.addEventListener("mousemove",(e)=>{
    // filling the graphics
    if(mousedown){
        drawStroke({
            x:e.clientX,
            y:e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width : eraserFlag ? eraserWidth : penWidth
        });
    }
});

canvas.addEventListener("mouseup",(e)=>{
    mousedown = false;
    let url = canvas.toDataURL();  //converting canvas into url
    undoRedoTracker.push(url); // pushing url into array
    track = undoRedoTracker.length - 1; //updating the track
});

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}
function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem)=> {
    colorElem.addEventListener("click", (e)=>{
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
});

pencilWidthEle.addEventListener("change",(e)=>{
    penWidth = pencilWidthEle.value;
    tool.lineWidth = penWidth
})

eraserWidthEle.addEventListener("change",(e)=>{
    eraserWidth = eraserWidthEle.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click",(e)=>{
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click",(e)=>{
    let url  = canvas.toDataURL();  // converts pixel into url

    // setting url
    let a = document.createElement("a");
    a.href  = url;
    a.download = "board.jpg";
    a.click();
})


// undo actions -- hoga 
undo.addEventListener("click",(e)=>{
    if(track > 0){
        track--;
    }
    let trackObj = {
        trackValue : track,
        undoRedoTracker 
    }
    undoRedoCanvas(trackObj);

})

// redo actions ++ hoga 
redo.addEventListener("click",(e)=>{
    if(track < undoRedoTracker.length -1){
        track++;
    }
    // performing action
    let trackObj = {
        trackValue : track,
        undoRedoTracker 
    }
    undoRedoCanvas(trackObj);
})

function undoRedoCanvas(trackObj){
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url =  undoRedoTracker[track];
    let img = new Image();
    img.src = url;
    img.onload = (e) =>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}

