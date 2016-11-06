var canvas = document.getElementById('cnvs');
var context = canvas.getContext("2d");
var generate = document.getElementById('generate');
var solve = document.getElementById('solve');
var width = document.getElementById('maze_width');
var height = document.getElementById('maze_height');
var seed = document.getElementById('maze_seed');
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();
if(window.Worker) {
  var worker = new Worker("js/worker.js");
  generate.onclick = function() {
    disableButtons();
    var data = context.createImageData(canvas.width, canvas.height);
    worker.postMessage({ action: "gen_maze", values: { width: width.value, height: height.value, seed: seed.value, imageData: data } });
  };
  solve.onclick = function() {
    disableButtons();
    var data = context.createImageData(canvas.width, canvas.height);
    worker.postMessage({ action: "solve_maze", values: { imageData: data } });
  };
  worker.onmessage = function(e) {
    if (e.data.action === "render_maze") {
      context.putImageData(e.data.values.imageData, 0, 0);
      if (e.data.values.iterate) {
        var data = context.createImageData(canvas.width, canvas.height);
        worker.postMessage({ action: "iterate_maze", values: { imageData: data } });
      } else {
        enableButtons();
      }
    } else if (e.data.action === "render_solution") {
      context.putImageData(e.data.values.imageData, 0, 0);
      if (e.data.values.iterate) {
        var data = context.createImageData(canvas.width, canvas.height);
        worker.postMessage({ action: "iterate_solution", values: { imageData: data } });
      } else {
        enableButtons();
      }
    } else if (e.data.action === "render") {
      context.putImageData(e.data.values.imageData, 0, 0);
    }
  };
}

function resizeCanvas() {
  canvas.width = window.innerWidth - 60;
  canvas.height = window.innerHeight - 60;

  if(worker) {
    var data = context.createImageData(canvas.width, canvas.height);
    worker.postMessage({ action: "render", values: { imageData: data } });
  }
}

function disableButtons() {
  generate.value = "Please wait...";
  generate.enabled = false;
  solve.value = "Please wait...";
  solve.enabled = false;
}

function enableButtons() {
  generate.value = "Generate Maze";
  generate.enabled = true;
  solve.value = "Solve Maze";
  solve.enabled = true;
}