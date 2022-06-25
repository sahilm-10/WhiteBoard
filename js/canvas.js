let canvas = document.querySelector("canvas");
canvas.width= innerWidth;
canvas.height = innerHeight;

let mousedown = false;

// Api defining 
let tool = canvas.getContext("2d");  // for drawing path

tool.strokeStyle = "red";  // for color
tool.lineWidth = "3";  // for thickness

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
            y:e.clientY
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
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

