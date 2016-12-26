import { LinkedList, ListIterator } from "../DataStructures/LinkedList";
import { SquareMazeCell, SquareMazeGrid, SquareWall } from "./SquareMazeGrid";

export class SquareMazeRenderer {
  public static renderCell(img: ImageData,
                           cell: SquareMazeCell,
                           scale: number = 1.0,
                           r: number, g: number, b: number, a: number): void {
    const xOffset: number = cell.xPos * scale;
    const yOffset: number = cell.yPos * scale;

    SquareMazeRenderer.drawRect(img, xOffset + 1, yOffset + 1, xOffset + scale - 1, yOffset + scale - 1, r, g, b, a);
  }

  public static renderWalls(img: ImageData,
                            cell: SquareMazeCell,
                            scale: number = 1.0,
                            r: number, g: number, b: number, a: number): void {
    const xOffset: number = cell.xPos * scale;
    const yOffset: number = cell.yPos * scale;

    if ( cell.hasWall(SquareWall.Top) ) {
      SquareMazeRenderer.drawLine(img, xOffset, yOffset, xOffset + scale, yOffset, r, g, b, a);
    }

    if ( cell.hasWall(SquareWall.Right) ) {
      SquareMazeRenderer.drawLine(img, xOffset + scale, yOffset, xOffset + scale, yOffset + scale, r, g, b, a);
    }

    if ( cell.hasWall(SquareWall.Bottom) ) {
      SquareMazeRenderer.drawLine(img, xOffset, yOffset + scale, xOffset + scale, yOffset + scale, r, g, b, a);
    }

    if ( cell.hasWall(SquareWall.Left) ) {
      SquareMazeRenderer.drawLine(img, xOffset, yOffset, xOffset, yOffset + scale, r, g, b, a);
    }
  }

  public static renderGrid(img: ImageData,
                           maze: SquareMazeGrid,
                           scale: number = 1.0): void {
    SquareMazeRenderer.drawRect(img, 0, 0, maze.width * scale, maze.height * scale, 1.0, 1.0, 1.0, 1.0);

    for ( let x: number = 0; x < maze.width; x++ ) {
      for ( let y: number = 0; y < maze.height; y++ ) {
        let cell: SquareMazeCell = maze.getCell(x, y) as SquareMazeCell;
        if (cell === maze.startCell) {
          SquareMazeRenderer.renderCell(img, cell, scale, 0, 0.8, 0, 1.0);
        } else if (cell === maze.endCell) {
          SquareMazeRenderer.renderCell(img, cell, scale, 0.8, 0, 0, 1.0);
        } else if (!cell.visited) {
          SquareMazeRenderer.renderCell(img, cell, scale, 0.8, 0.8, 0.8, 1.0);
        }

        SquareMazeRenderer.renderWalls(img, cell, scale, 0.2, 0.2, 0.2, 1.0);
      }
    }
  }

  public static renderPath(img: ImageData,
                           path: LinkedList<SquareMazeCell>,
                           scale: number = 1.0): void {
    let itr: ListIterator<SquareMazeCell> = path.iterator;
    while (itr.hasNext()) {
      let cell: SquareMazeCell = itr.next();
      SquareMazeRenderer.renderCell(img, cell, scale, 0.3, 0.8, 0.8, 0.4);
    }
  }

  private static setPixel(img: ImageData, x: number, y: number, r: number, g: number, b: number, a: number): void {
    let index: number = (x + y * img.width) * 4;

    let invAlpha: number = 1.0 - a;

    r *= a;
    g *= a;
    b *= a;

    img.data[index] = (img.data[index++] * invAlpha) + (255 * r);
    img.data[index] = (img.data[index++] * invAlpha) + (255 * g);
    img.data[index] = (img.data[index++] * invAlpha) + (255 * b);
    img.data[index] = (img.data[index] * invAlpha) + (255 * a);
  }

  private static drawLine(img: ImageData, x0: number, y0: number, x1: number, y1: number,
                          r: number, g: number, b: number, a: number): void {
    let dX = x1 - x0;
    let dY = y1 - y0;

    if (dX === 0) {
      for (let y: number = y0; y <= y1; y++) {
        let x = x1 + dX * (y - y1) / dY;
        SquareMazeRenderer.setPixel(img, x, y, r, g, b, a);
      }
    } else {
      for (let x: number = x0; x <= x1; x++) {
        let y = y1 + dY * (x - x1) / dX;
        SquareMazeRenderer.setPixel(img, x, y, r, g, b, a);
      }
    }
  }

  private static drawRect(img: ImageData, x0: number, y0: number, x1: number, y1: number,
                          r: number, g: number, b: number, a: number): void {
    for (let x: number = x0; x <= x1; x++) {
      for (let y: number = y0; y <= y1; y++) {
        SquareMazeRenderer.setPixel(img, x, y, r, g, b, a);
      }
    }
  }
}
