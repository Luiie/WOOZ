const canvas = document.querySelector("canvas");

const lineWidth = document.querySelector("#line-width");

const color = document.querySelector("#color");
const colorOptions = Array.from(document.querySelectorAll(".color-option"));

const modeBtn = document.querySelector("#mode-btn");
const destroyBtn = document.querySelector("#destroy-btn");
const eraserBtn = document.querySelector("#eraser-btn");
const saveBtn = document.querySelector("#save");


const fileInput = document.querySelector("#file");
const textInput = document.querySelector("#text");


const context = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;
context.lineWidth = lineWidth.value;
context.lineCap = "round";

const CANVAS_WIDTH  = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const INITIAL_COLOR = context.fillStyle;


// canvas.addEventListener("click", (event) => {
//     x = event.offsetX;
//     y = event.offsetY;
//     context.lineTo(x, y);
//     context.stroke();
// })

// const colors = [
//     "#C4E538",
//     "#A3CB38",
//     "#12CBC4",
//     "#1289A7",
//     "#0652DD",
//     "#1B1464",
// ]
//
// let x = 0;
// let y = 0;
//
// canvas.addEventListener("mousemove", (event) => {
//     context.beginPath();
//     context.moveTo(x, y);
//     const color = colors[Math.floor(Math.random() * colors.length)]
//     context.strokeStyle = color;
//     context.lineTo(event.offsetX, event.offsetY);
//     context.stroke();
// })
//
// canvas.addEventListener("click", (event) => {
//     x = event.offsetX;
//     y = event.offsetY;
// })

canvas.addEventListener("mousemove", (event) => {
    if (isPainting) {
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
    } else {
        context.moveTo(event.offsetX, event.offsetY);
    }
})

let isPainting = false;
canvas.addEventListener("mousedown", (event) => {
    isPainting = true;
})
canvas.addEventListener("mouseup", (event) => {
    isPainting = false;
})
canvas.addEventListener("mouseleave", (event) => {
    isPainting = false;
})

lineWidth.addEventListener("change", (event) => {
    context.beginPath();
    context.lineWidth = event.target.value;
})
color.addEventListener("change", (event) => {
    context.beginPath();
    context.strokeStyle = event.target.value;
    context.fillStyle = event.target.value;
})

colorOptions.forEach((colorOption) => {
    colorOption.addEventListener("click", (event) => {
        context.beginPath();
        const colorValue =  event.target.dataset.color;
        color.value = colorValue;
        context.strokeStyle = colorValue;
        context.fillStyle = colorValue;
    });
})

let isFilling = false;
modeBtn.addEventListener("click", (event) => {
    if (isFilling) {
        isFilling = false;
        modeBtn.innerText = "Fill";
    } else{
        isFilling = true;
        modeBtn.innerText = "Draw";
    }
})

canvas.addEventListener("click", (event) => {
    if(isFilling) {
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
})

destroyBtn.addEventListener("click", (event) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
})

eraserBtn.addEventListener("click", (event) => {
    context.beginPath();
    context.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";
})

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0]; 
    const url = URL.createObjectURL(file);

    const image = new Image()
    image.src = url;
    image.onload = function() {
        context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fileInput.value = ""
    }
})

canvas.addEventListener("dblclick", (event) => {
    
    const text = textInput.value;
    if (text !== ""){
        context.save();
        context.lineWidth = "1"
        context.font = "48px serif";
        context.strokeText(text, event.offsetX, event.offsetY)
        context.restore();
    }

})

saveBtn.addEventListener("click", () => {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "saveImg.png";
    a.click();
})

