import { LinkedList, ListIterator } from "../DataStructures/LinkedList";
import { SquareMazeCell, SquareMazeGrid, SquareWall } from "./SquareMazeGrid";

export class SquareMazeRenderer {
  public static renderCell(context: CanvasRenderingContext2D, cell: SquareMazeCell, scale: number = 1.0): void {
    const xOffset: number = cell.xPos * scale;
    const yOffset: number = cell.yPos * scale;

    let penX: number = xOffset;
    let penY: number = yOffset;

    context.moveTo(penX, penY);

    penX += scale;
    context.lineTo(penX, penY);

    penY += scale;
    context.lineTo(penX, penY);

    penX = xOffset;
    context.lineTo(penX, penY);

    penY = yOffset;
    context.lineTo(penX, penY);
  }

  public static renderWalls(context: CanvasRenderingContext2D, cell: SquareMazeCell, scale: number = 1.0): void {
    let xOffset: number = cell.xPos * scale;
    let yOffset: number = cell.yPos * scale;

    let penX: number = xOffset;
    let penY: number = yOffset;

    context.moveTo(penX, penY);

    penX += scale;
    if ( cell.hasWall(SquareWall.Top) ) {
      context.lineTo(penX, penY);
    } else {
      context.moveTo(penX, penY);
    }

    penY += scale;
    if ( cell.hasWall(SquareWall.Right) ) {
      context.lineTo(penX, penY);
    } else {
      context.moveTo(penX, penY);
    }

    penX = xOffset;
    if ( cell.hasWall(SquareWall.Bottom) ) {
      context.lineTo(penX, penY);
    } else {
      context.moveTo(penX, penY);
    }

    penY = yOffset;
    if ( cell.hasWall(SquareWall.Left) ) {
      context.lineTo(penX, penY);
    } else {
      context.moveTo(penX, penY);
    }
  }

  public static renderGrid(context: CanvasRenderingContext2D, maze: SquareMazeGrid, scale: number = 1.0): void {
    context.strokeStyle = "#000000";
    context.lineWidth = 0.5;

    context.beginPath();

    for ( let x: number = 0; x < maze.width; x++ ) {
      for ( let y: number = 0; y < maze.height; y++ ) {
        let cell: SquareMazeCell = maze.getCell(x, y) as SquareMazeCell;
        SquareMazeRenderer.renderWalls(context, cell, scale);
      }
    }

    context.stroke();

    if (maze.startCell) {
      context.fillStyle = "#008800";
      context.beginPath();
      SquareMazeRenderer.renderCell(context, maze.startCell as SquareMazeCell, scale);
      context.fill();
    }

    if (maze.endCell) {
      context.fillStyle = "#880000";
      context.beginPath();
      SquareMazeRenderer.renderCell(context, maze.endCell as SquareMazeCell, scale);
      context.fill();
    }
  }

  public static renderPath(context: CanvasRenderingContext2D,
                           path: LinkedList<SquareMazeCell>,
                           scale: number = 1.0): void {
    context.fillStyle = "#33888866";

    context.beginPath();

    let itr: ListIterator<SquareMazeCell> = path.iterator;
    while (itr.hasNext()) {
      let cell: SquareMazeCell = itr.next();
      SquareMazeRenderer.renderCell(context, cell, scale);
    }

    context.fill();
  }
}
