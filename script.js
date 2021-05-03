const container = document.querySelector("#container");
const clearButton = document.querySelector("#clear-btn");
const rainbowButton = document.querySelector("#rainbow-btn");
const grayScaleButton = document.querySelector("#gray-scale-btn");
const eraserButton = document.querySelector("#eraser-btn");
const colourPicker = document.querySelector("#colour-picker");
let isGridRainbow = false;
let isGridGrayScale = false;
let isEraser = false;

let gridColour = "rgba(0,0,0,1)";
let numSquares = 0;

let slider = document.querySelector("#myRange");
let outputSize = document.querySelector("#size-input-box");
outputSize.innerHTML = slider.value;

colourPicker.value = "rgba(0,0,0,1)";
slider.style.backgroundColor = gridColour;

makeRows(slider.value, slider.value);

outputSize.oninput = function () {
  if (this.value < 1 || this.value > 100) {
    alert("Enter size 1-100 only.");
    this.value = slider.value;
  }

  slider.value = this.value;
  makeRows(this.value, this.value);
  resetGrid();
};

slider.oninput = function () {
  outputSize.value = this.value;
  makeRows(this.value, this.value);
  resetGrid();
};

clearButton.addEventListener("click", () => {
  isGridRainbow = false;
  isGridGrayScale = false;
  isEraser = false;
  clearGrid();
  resetButtons(clearButton);
});

rainbowButton.addEventListener("click", () => {
  isGridGrayScale = false;
  isEraser = false;
  isGridRainbow = true;
  resetButtons(rainbowButton);
  rainbowButton.style.setProperty(
    "--btn-border-colour",
    generateRandomColour()
  );
});

grayScaleButton.addEventListener("click", () => {
  isGridRainbow = false;
  isEraser = false;
  isGridGrayScale = true;
  resetButtons(grayScaleButton);
});

eraserButton.addEventListener("click", () => {
  isGridRainbow = false;
  isGridGrayScale = false;
  isEraser = true;
  resetButtons(eraserButton);
});

function makeRows(rows, cols) {
  container.style.setProperty("--grid-rows", rows);
  container.style.setProperty("--grid-cols", cols);
  for (i = 0; i < rows * cols; i++) {
    let cell = document.createElement("div");
    container.appendChild(cell).className = "grid-item";

    colourPicker.addEventListener("click", () => {
      isGridRainbow = false;
      isGridGrayScale = false;
      isEraser = false;
    });

    colourPicker.addEventListener("change", () => {
      isGridRainbow = false;
      isGridGrayScale = false;
      isEraser = false;
      gridColour = hexToRGBA(colourPicker.value);
      slider.style.backgroundColor = gridColour;
    });

    cell.addEventListener("mouseenter", () => {
      if (isGridRainbow) {
        gridColour = generateRandomColour();
      } else if (isEraser) {
        gridColour = "rgba(255,255,255,1)";
      } else if (isGridGrayScale) {
        gridColour = generateGrayScale(cell);
      } else {
        gridColour = hexToRGBA(colourPicker.value);
      }
      cell.style.backgroundColor = gridColour;
    });
  }
}

function resetButtons(btn) {
  let buttons = Array.from(document.querySelectorAll(".button"));
  buttons.forEach((node) =>
    node.style.setProperty("--btn-border-colour", "white")
  );
  btn.style.setProperty("--btn-border-colour", "black");
}

function clearGrid() {
  let cell = Array.from(document.querySelectorAll(".grid-item"));
  cell.forEach((node) => (node.style.backgroundColor = "rgba(255,255,255,1)"));
}

function resetGrid() {
  let cell = Array.from(document.querySelectorAll(".grid-item"));
  cell.forEach((node) => node.remove());
  makeRows(slider.value, slider.value);
}

function generateRandomColour() {
  let x = Math.floor(Math.random() * 256);
  let y = Math.floor(Math.random() * 256);
  let z = Math.floor(Math.random() * 256);
  return "rgba(" + x + "," + y + "," + z + ", 1)";
}

function generateGrayScale(cell) {
  //let oldColour = cell.style.backgroundColor.slice(-18, -1);
  let currentOpacity = Number(cell.style.backgroundColor.slice(-4, -1));
  if (currentOpacity <= 0.9) {
    cell.classList.add("gray");
    return `rgba(0, 0, 0, ${currentOpacity + 0.1})`;
  } else if (
    cell.classList == "grid-item gray" &&
    cell.style.backgroundColor == "rgb(0, 0, 0)"
  ) {
    return;
  } else {
    cell.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  }
}

function hexToRGBA(hex) {
  let r, g, b, a;
  hex = hex.replace("#", "");
  if (3 === hex.length) {
    r = hex.charAt(0);
    g = hex.charAt(1);
    b = hex.charAt(2);
  } else if (4 === hex.length) {
    r = hex.charAt(0);
    g = hex.charAt(1);
    b = hex.charAt(2);
    a = hex.charAt(3);
  } else if (6 === hex.length) {
    r = hex.substring(0, 2);
    g = hex.substring(2, 4);
    b = hex.substring(4, 6);
  } else if (8 === hex.length) {
    r = hex.substring(0, 2);
    g = hex.substring(2, 4);
    b = hex.substring(4, 6);
    a = hex.substring(6, 8);
  } else {
    return "";
  }
  if ("undefined" === typeof a) {
    a = "ff";
  }
  if (1 === r.length) {
    r += r;
  }
  if (1 === g.length) {
    g += g;
  }
  if (1 === b.length) {
    b += b;
  }
  if (1 === a.length) {
    a += a;
  }
  r = parseInt(r, 16);
  g = parseInt(g, 16);
  b = parseInt(b, 16);
  a = parseInt(a, 16) / 255;
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

//Add javascript eyedropper
