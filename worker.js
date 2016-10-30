importScripts("https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.2/require.min.js");
importScripts("dist/tsc.js");

require(['MazeWorker'], function(MazeWorker) {
  let worker = new MazeWorker.MazeWorker();
  onmessage = e => {
    if (e.data.action === "gen_maze") {
      worker.generateMaze(e.data.values.width, e.data.values.height, e.data.values.seed);
      let data = worker.render(e.data.values.imageData);
      postMessage(data);
    } else if (e.data.action === "solve_maze") {
      worker.solveMaze();
      let data = worker.render(e.data.values.imageData);
      postMessage(data);
    }
  };
});
