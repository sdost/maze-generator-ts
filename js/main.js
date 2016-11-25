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
    context.clearRect(0, 0, canvas.width, canvas.height);
    let data = context.createImageData(canvas.width, canvas.height);
    let message = {
      action: "gen_maze",
      values: {
        width: width.value,
        height: height.value,
        seed: seed.value,
        imageData: data
      }
    };
    worker.postMessage(message, [message.values.imageData.data.buffer]);
  };
  solve.onclick = function() {
    disableButtons();
    var data = context.createImageData(canvas.width, canvas.height);
    let message = {
      action: "solve_maze",
      values: {
        imageData: data
      }
    };
    worker.postMessage(message, [message.values.imageData.data.buffer]);
  };
  worker.onmessage = function(e) {
    if (e.data.action === "render_maze") {
      createImageBitmap(e.data.values.imageData).then(function(bitmap) {
        context.drawImage(bitmap, 0, 0);
      });
      if (e.data.values.iterate) {
        let message = {
          action: "iterate_maze",
          values: {
            imageData: e.data.values.imageData
          }
        };
        worker.postMessage(message, [message.values.imageData.data.buffer]);
      } else {
        enableButtons();
      }
    } else if (e.data.action === "render_solution") {
      createImageBitmap(e.data.values.imageData).then(function(bitmap) {
        context.drawImage(bitmap, 0, 0);
      });
      if (e.data.values.iterate) {
        let message = {
          action: "iterate_solution",
          values: {
            imageData: e.data.values.imageData
          }
        };
        worker.postMessage(message, [message.values.imageData.data.buffer]);
      } else {
        enableButtons();
      }
    } else if (e.data.action === "render") {
      createImageBitmap(e.data.values.imageData).then(function(bitmap) {
        context.drawImage(bitmap, 0, 0);
      });
    }
  };
}

function resizeCanvas() {
  canvas.width = window.innerWidth - 60;
  canvas.height = window.innerHeight - 60;

  if(worker) {
    var data = context.createImageData(canvas.width, canvas.height);
    let message = {
      action: "render",
      values: {
        imageData: data
      }
    };
    worker.postMessage(message, [message.values.imageData.data.buffer]);
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