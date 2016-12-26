importScripts("https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.2/require.min.js");
importScripts("../dist/tsc.js");

require(['MazeWorker'], function(MazeWorker) {
  let worker = new MazeWorker.MazeWorker();
  onmessage = e => {
    if (e.data.action === "gen_maze") {
      worker.generateMaze(e.data.values.width, e.data.values.height, e.data.values.seed);
      let data = worker.render(e.data.values.imageData);
      let message = {
        action: "render_maze",
        values: {
          imageData: data,
          iterate: true
        }
      };
      postMessage(message, [message.values.imageData.data.buffer]);
    } else if (e.data.action === "iterate_maze") {
      let done = worker.iterateMaze();
      let data = worker.render(e.data.values.imageData);
      let message = {
        action: "render_maze",
        values: {
          imageData: data,
          iterate: !done
        }
      };
      postMessage(message, [message.values.imageData.data.buffer]);
    } else if (e.data.action === "solve_maze") {
      worker.solveMaze();
      let data = worker.render(e.data.values.imageData);
      let message = {
        action: "render_solution",
        values: {
          imageData: data,
          iterate: true
        }
      };
      postMessage(message, [message.values.imageData.data.buffer]);
    } else if (e.data.action === "iterate_solution") {
      let done = worker.iterateSolution();
      let data = worker.render(e.data.values.imageData);
      let message = {
        action: "render_solution",
        values: {
          imageData: data,
          iterate: !done
        }
      };
      postMessage(message, [message.values.imageData.data.buffer]);
    } else if (e.data.action === "render") {
      let data = worker.render(e.data.values.imageData);
      let message = {
        action: "render_solution",
        values: {
          imageData: data
        }
      };
      postMessage(message, [message.values.imageData.data.buffer]);
    }
  };
});
