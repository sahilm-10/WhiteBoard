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
