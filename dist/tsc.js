var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("DataStructures/IComparable", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Helpers/PseudoRandom", ["require", "exports"], function (require, exports) {
    "use strict";
    var PseudoRandom = (function () {
        function PseudoRandom() {
            this.seed = 1;
        }
        PseudoRandom.prototype.nextInt = function () {
            return this.gen();
        };
        PseudoRandom.prototype.nextDouble = function () {
            return (this.gen() / 2147483647);
        };
        PseudoRandom.prototype.nextIntRange = function (min, max) {
            min -= .4999;
            max += .4999;
            return Math.round(min + ((max - min) * this.nextDouble()));
        };
        PseudoRandom.prototype.nextDoubleRange = function (min, max) {
            return min + ((max - min) * this.nextDouble());
        };
        PseudoRandom.prototype.gen = function () {
            var hi = 16807 * (this.seed >> 16);
            var lo = 16807 * (this.seed & 0xFFFF) + ((hi & 0x7FFF) << 16) + (hi >> 15);
            return this.seed = (lo > 0x7FFFFFFF ? lo - 0x7FFFFFFF : lo);
        };
        return PseudoRandom;
    }());
    exports.PseudoRandom = PseudoRandom;
});
define("DataStructures/LinkedList", ["require", "exports"], function (require, exports) {
    "use strict";
    var ListNode = (function () {
        function ListNode(data, list) {
            this.next = this.prev = null;
            this.data = data;
            this.list = list;
        }
        ListNode.prototype.unlink = function () {
            this.list.unlink(this);
        };
        return ListNode;
    }());
    exports.ListNode = ListNode;
    var LinkedList = (function () {
        function LinkedList() {
            this.head = this.tail = null;
            this.size = 0;
        }
        LinkedList.prototype.append = function (data) {
            var node = this.createNode(data);
            if (this.tail != null) {
                node.prev = this.tail;
                this.tail.next = node;
            }
            else {
                this.head = node;
            }
            this.tail = node;
            this.size++;
            return node;
        };
        LinkedList.prototype.prepend = function (data) {
            var node = this.createNode(data);
            if (this.head != null) {
                node.next = this.head;
                this.head.prev = node;
            }
            else {
                this.tail = node;
            }
            this.head = node;
            this.size++;
        };
        LinkedList.prototype.createNode = function (data) {
            return new ListNode(data, this);
        };
        LinkedList.prototype.removeHead = function () {
            var node = this.head;
            if (this.size > 1) {
                this.head = this.head.next;
                if (this.head == null) {
                    this.tail = null;
                }
                this.size--;
            }
            else {
                this.head = this.tail = null;
                this.size = 0;
            }
            return node.data;
        };
        LinkedList.prototype.removeTail = function () {
            var node = this.tail;
            if (this.size > 1) {
                this.tail = this.tail.prev;
                if (this.tail == null) {
                    this.head = null;
                }
                this.size--;
            }
            else {
                this.head = this.tail = null;
                this.size = 0;
            }
            return node.data;
        };
        LinkedList.prototype.unlink = function (node) {
            if (node === this.head) {
                this.head = this.head.next;
            }
            else if (node === this.tail) {
                this.tail = this.tail.prev;
            }
            var temp = node.next;
            if (node.prev != null) {
                node.prev.next = node.next;
            }
            if (node.next != null) {
                node.next.prev = node.prev;
            }
            if (this.head == null) {
                this.tail = null;
            }
            this.size--;
            return temp;
        };
        LinkedList.prototype.merge = function (list) {
            if (list.head != null) {
                var node = list.head;
                for (var i = 0; i < list.size; i++) {
                    node.list = this;
                    node = node.next;
                }
                if (this.head != null) {
                    this.tail.next = list.head;
                    this.tail = list.tail;
                }
                else {
                    this.head = list.head;
                    this.tail = list.tail;
                }
                this.size += list.size;
            }
        };
        LinkedList.prototype.clear = function () {
            this.head = this.tail = null;
        };
        Object.defineProperty(LinkedList.prototype, "iterator", {
            get: function () {
                return new ListIterator(this);
            },
            enumerable: true,
            configurable: true
        });
        LinkedList.prototype.nodeOf = function (data, from) {
            if (from === void 0) { from = null; }
            var node = from == null ? this.head : from;
            while (node != null) {
                if (node.data.equals(data)) {
                    break;
                }
                node = node.next;
            }
            return node;
        };
        LinkedList.prototype.contains = function (data) {
            var node = this.head;
            while (node != null) {
                if (node.data.equals(data)) {
                    return true;
                }
                node = node.next;
            }
            return false;
        };
        LinkedList.prototype.shuffle = function (prng) {
            var s = this.size;
            while (s > 1) {
                s--;
                var i = prng.nextIntRange(0, s);
                var node1 = this.head;
                var j = void 0;
                for (j = 0; j < s; j++) {
                    node1 = node1.next;
                }
                var t = node1.data;
                var node2 = this.head;
                for (j = 0; j < i; j++) {
                    node2 = node2.next;
                }
                node1.data = node2.data;
                node2.data = t;
            }
        };
        return LinkedList;
    }());
    exports.LinkedList = LinkedList;
    var ListIterator = (function () {
        function ListIterator(list) {
            this.list = list;
            this.reset();
        }
        ListIterator.prototype.reset = function () {
            this.walker = this.list.head;
        };
        ListIterator.prototype.hasNext = function () {
            return this.walker != null;
        };
        ListIterator.prototype.next = function () {
            var data = this.walker.data;
            this.walker = this.walker.next;
            return data;
        };
        return ListIterator;
    }());
    exports.ListIterator = ListIterator;
});
define("DataStructures/DisjointSet", ["require", "exports", "DataStructures/LinkedList"], function (require, exports, LinkedList_1) {
    "use strict";
    var DisjointSet = (function () {
        function DisjointSet(size) {
            this.list = new Array(size);
            this.index = 0;
        }
        DisjointSet.prototype.createSet = function (data) {
            var newSet = new LinkedList_1.LinkedList();
            var node = newSet.append(data);
            this.list[this.index++] = node;
        };
        DisjointSet.prototype.findSet = function (data) {
            for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
                var node = _a[_i];
                if (node && node.data.equals(data)) {
                    return node.list;
                }
            }
            return null;
        };
        DisjointSet.prototype.mergeSet = function (dataA, dataB) {
            var setA = this.findSet(dataA);
            var setB = this.findSet(dataB);
            if (setA.size > setB.size) {
                setA.merge(setB);
            }
            else {
                setB.merge(setA);
            }
        };
        return DisjointSet;
    }());
    exports.DisjointSet = DisjointSet;
});
define("Objects/MazeGrid", ["require", "exports"], function (require, exports) {
    "use strict";
    var MazeCell = (function () {
        function MazeCell(x, y) {
            this.xPos = x;
            this.yPos = y;
            this.wallList = new Array();
            this.initialize();
        }
        MazeCell.prototype.equals = function (other) {
            return this === other;
        };
        MazeCell.prototype.walls = function () {
            return this.wallList.length;
        };
        return MazeCell;
    }());
    exports.MazeCell = MazeCell;
    var MazeWall = (function () {
        function MazeWall(cellA, cellB) {
            this.cellA = cellA;
            this.cellB = cellB;
        }
        MazeWall.prototype.equals = function (wall) {
            if (this.cellA === wall.cellA && this.cellB === wall.cellB) {
                return true;
            }
            if (this.cellB === wall.cellA && this.cellA === wall.cellB) {
                return true;
            }
            return false;
        };
        return MazeWall;
    }());
    exports.MazeWall = MazeWall;
    var MazeGrid = (function () {
        function MazeGrid() {
        }
        Object.defineProperty(MazeGrid.prototype, "startCell", {
            get: function () { return this.gridStartCell; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MazeGrid.prototype, "endCell", {
            get: function () { return this.gridEndCell; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MazeGrid.prototype, "width", {
            get: function () { return this.gridWidth; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MazeGrid.prototype, "height", {
            get: function () { return this.gridHeight; },
            enumerable: true,
            configurable: true
        });
        return MazeGrid;
    }());
    exports.MazeGrid = MazeGrid;
});
define("Objects/SquareMazeGrid", ["require", "exports", "DataStructures/DisjointSet", "DataStructures/LinkedList", "Helpers/PseudoRandom", "Objects/MazeGrid"], function (require, exports, DisjointSet_1, LinkedList_2, PseudoRandom_1, MazeGrid_1) {
    "use strict";
    var SquareMazeCell = (function (_super) {
        __extends(SquareMazeCell, _super);
        function SquareMazeCell() {
            _super.apply(this, arguments);
        }
        SquareMazeCell.prototype.removeWall = function (ind) {
            if (ind >= 0 && ind < this.wallList.length) {
                this.wallList[ind] = false;
            }
        };
        SquareMazeCell.prototype.hasWall = function (ind) {
            if (ind >= 0 && ind < this.wallList.length) {
                return this.wallList[ind];
            }
            else {
                return false;
            }
        };
        SquareMazeCell.prototype.initialize = function () {
            // TOP
            this.wallList.push(true);
            // RIGHT
            this.wallList.push(true);
            // BOTTOM
            this.wallList.push(true);
            // LEFT
            this.wallList.push(true);
        };
        return SquareMazeCell;
    }(MazeGrid_1.MazeCell));
    exports.SquareMazeCell = SquareMazeCell;
    var SquareMazeGrid = (function (_super) {
        __extends(SquareMazeGrid, _super);
        function SquareMazeGrid(width, height) {
            _super.call(this);
            this.gridWidth = width;
            this.gridHeight = height;
            this.initGrid();
        }
        SquareMazeGrid.generate = function (width, height, seed) {
            if (seed === void 0) { seed = 1; }
            var mazeGrid = new SquareMazeGrid(width, height);
            var wallList = new LinkedList_2.LinkedList();
            var wall;
            for (var x = 0; x < mazeGrid.width; x++) {
                for (var y = 0; y < mazeGrid.height; y++) {
                    var cellA = mazeGrid.getCell(x, y);
                    var cellB = void 0;
                    if (x > 0) {
                        cellB = mazeGrid.getCell(x - 1, y);
                        if (cellB != null) {
                            wall = new MazeGrid_1.MazeWall(cellA, cellB);
                            if (!wallList.contains(wall)) {
                                wallList.append(wall);
                            }
                        }
                    }
                    if (y > 0) {
                        cellB = mazeGrid.getCell(x, y - 1);
                        if (cellB != null) {
                            wall = new MazeGrid_1.MazeWall(cellA, cellB);
                            if (!wallList.contains(wall)) {
                                wallList.append(wall);
                            }
                        }
                    }
                    if (x < (mazeGrid.width - 1)) {
                        cellB = mazeGrid.getCell(x + 1, y);
                        if (cellB != null) {
                            wall = new MazeGrid_1.MazeWall(cellA, cellB);
                            if (!wallList.contains(wall)) {
                                wallList.append(wall);
                            }
                        }
                    }
                    if (y < (mazeGrid.height - 1)) {
                        cellB = mazeGrid.getCell(x, y + 1);
                        if (cellB != null) {
                            wall = new MazeGrid_1.MazeWall(cellA, cellB);
                            if (!wallList.contains(wall)) {
                                wallList.append(wall);
                            }
                        }
                    }
                }
                return mazeGrid;
            }
            var sets = new DisjointSet_1.DisjointSet(mazeGrid.width * mazeGrid.height);
            for (var x = 0; x < mazeGrid.width; x++) {
                for (var y = 0; y < mazeGrid.height; y++) {
                    var cell = mazeGrid.getCell(x, y);
                    sets.createSet(cell);
                }
            }
            var prng = new PseudoRandom_1.PseudoRandom();
            prng.seed = seed > 0 ? seed : new Date().getTime();
            wallList.shuffle(prng);
            while (wallList.size > 0) {
                wall = wallList.removeHead();
                if (sets.findSet(wall.cellA) === sets.findSet(wall.cellB)) {
                    continue;
                }
                sets.mergeSet(wall.cellA, wall.cellB);
                if (wall.cellA.xPos > wall.cellB.xPos) {
                    wall.cellA.removeWall(3 /* Left */);
                    wall.cellB.removeWall(1 /* Right */);
                }
                else if (wall.cellA.yPos > wall.cellB.yPos) {
                    wall.cellA.removeWall(0 /* Top */);
                    wall.cellB.removeWall(2 /* Bottom */);
                }
                else if (wall.cellA.xPos < wall.cellB.xPos) {
                    wall.cellA.removeWall(1 /* Right */);
                    wall.cellB.removeWall(3 /* Left */);
                }
                else if (wall.cellA.yPos < wall.cellB.yPos) {
                    wall.cellA.removeWall(2 /* Bottom */);
                    wall.cellB.removeWall(0 /* Top */);
                }
            }
            // Add start and end.
            mazeGrid.createExitCells(prng);
        };
        SquareMazeGrid.prototype.getCell = function (x, y) {
            var ind = (x << this.shift) | y;
            return this.grid[ind];
        };
        SquareMazeGrid.prototype.createExitCells = function (prng) {
            var outerWall = prng.nextIntRange(0, 3);
            var xPos = 0;
            var yPos = 0;
            switch (outerWall) {
                case 0 /* Top */:
                    xPos = prng.nextIntRange(0, this.gridWidth - 1);
                    yPos = 0;
                case 1 /* Right */:
                    yPos = prng.nextIntRange(0, this.gridHeight - 1);
                    xPos = this.gridWidth - 1;
                case 2 /* Bottom */:
                    xPos = prng.nextIntRange(0, this.gridWidth - 1);
                    yPos = this.gridHeight - 1;
                case 3 /* Left */:
                    yPos = prng.nextIntRange(0, this.gridHeight - 1);
                    xPos = 0;
                default:
                    break;
            }
            this.gridStartCell = this.getCell(xPos, yPos);
            switch (outerWall) {
                case 0 /* Top */:
                    xPos = prng.nextIntRange(0, this.gridWidth - 1);
                    yPos = this.gridHeight - 1;
                case 1 /* Right */:
                    yPos = prng.nextIntRange(0, this.gridHeight - 1);
                    xPos = 0;
                case 2 /* Bottom */:
                    xPos = prng.nextIntRange(0, this.gridWidth - 1);
                    yPos = 0;
                case 3 /* Left */:
                    yPos = prng.nextIntRange(0, this.gridHeight - 1);
                    xPos = this.gridWidth - 1;
                default:
                    break;
            }
            this.gridEndCell = this.getCell(xPos, yPos);
        };
        SquareMazeGrid.prototype.initGrid = function () {
            this.shift = 0;
            var minLength = this.gridWidth * this.gridHeight;
            var powOfTwo = 1;
            while (powOfTwo < minLength) {
                powOfTwo *= 2;
                this.shift++;
            }
            this.grid = new Array(this.gridWidth << this.shift);
            for (var x = 0; x < this.gridWidth; x++) {
                for (var y = 0; y < this.gridHeight; y++) {
                    var ind = (x << this.shift) | y;
                    this.grid[ind] = new SquareMazeCell(x, y);
                }
            }
        };
        return SquareMazeGrid;
    }(MazeGrid_1.MazeGrid));
    exports.SquareMazeGrid = SquareMazeGrid;
});
define("Objects/SquareMazeSolver", ["require", "exports", "DataStructures/LinkedList"], function (require, exports, LinkedList_3) {
    "use strict";
    var SquareMazeSolver = (function () {
        function SquareMazeSolver() {
        }
        SquareMazeSolver.solve = function (maze) {
            var facing;
            var path = new LinkedList_3.LinkedList();
            if (maze.startCell.yPos === 0) {
                facing = 2 /* Bottom */;
            }
            else if (maze.startCell.xPos === maze.width - 1) {
                facing = 3 /* Left */;
            }
            else if (maze.startCell.yPos === maze.height - 1) {
                facing = 0 /* Top */;
            }
            else {
                facing = 1 /* Right */;
            }
            var cell;
            var lastCell;
            var nextCell;
            var x;
            var y;
            while (!path.contains(maze.endCell)) {
                lastCell = cell;
                cell = path.tail.data;
                var w = SquareMazeSolver.getRightHandWall(facing);
                if (cell.hasWall(w)) {
                    if (cell.hasWall(facing)) {
                        facing = SquareMazeSolver.getLeftHandWall(facing);
                    }
                    else {
                        x = cell.xPos;
                        y = cell.yPos;
                        switch (facing) {
                            case 0 /* Top */:
                                y--;
                                break;
                            case 2 /* Bottom */:
                                y++;
                                break;
                            case 3 /* Left */:
                                x--;
                                break;
                            case 1 /* Right */:
                                x++;
                                break;
                            default:
                                break;
                        }
                        nextCell = maze.getCell(x, y);
                        if (nextCell != null) {
                            if (path.contains(nextCell)) {
                                path.tail.unlink();
                            }
                            else if (nextCell === lastCell) {
                                path.tail.unlink();
                            }
                            else {
                                path.append(nextCell);
                            }
                        }
                    }
                }
                else {
                    facing = SquareMazeSolver.getRightHandWall(facing);
                    x = cell.xPos;
                    y = cell.yPos;
                    switch (facing) {
                        case 0 /* Top */:
                            y--;
                            break;
                        case 2 /* Bottom */:
                            y++;
                            break;
                        case 3 /* Left */:
                            x--;
                            break;
                        case 1 /* Right */:
                            x++;
                            break;
                        default:
                            break;
                    }
                    nextCell = maze.getCell(x, y);
                    if (nextCell != null) {
                        if (path.contains(nextCell)) {
                            path.tail.unlink();
                        }
                        else if (nextCell === lastCell) {
                            path.tail.unlink();
                        }
                        else {
                            path.append(nextCell);
                        }
                    }
                }
            }
            return path;
        };
        SquareMazeSolver.getRightHandWall = function (facing) {
            switch (facing) {
                case 0 /* Top */:
                    return 1 /* Right */;
                case 1 /* Right */:
                    return 2 /* Bottom */;
                case 2 /* Bottom */:
                    return 3 /* Left */;
                case 3 /* Left */:
                    return 0 /* Top */;
                default:
                    throw new Error();
            }
        };
        SquareMazeSolver.getLeftHandWall = function (facing) {
            switch (facing) {
                case 0 /* Top */:
                    return 3 /* Left */;
                case 3 /* Left */:
                    return 2 /* Bottom */;
                case 2 /* Bottom */:
                    return 1 /* Right */;
                case 1 /* Right */:
                    return 0 /* Top */;
                default:
                    throw new Error();
            }
        };
        SquareMazeSolver.RIGHT_HAND = 0;
        SquareMazeSolver.LEFT_HAND = 1;
        return SquareMazeSolver;
    }());
    exports.SquareMazeSolver = SquareMazeSolver;
});
define("Main", ["require", "exports", "Objects/SquareMazeGrid", "Objects/SquareMazeSolver"], function (require, exports, SquareMazeGrid_1, SquareMazeSolver_1) {
    "use strict";
    var Main = (function () {
        function Main(canvas) {
            this.canvas = canvas;
            this.context = this.canvas.getContext("2d");
        }
        Main.prototype.generateMaze = function (width, height, seed) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.maze = SquareMazeGrid_1.SquareMazeGrid.generate(width, height, seed);
            var scale = 1;
            if (height < width) {
                scale = this.canvas.width / width;
            }
            else {
                scale = this.canvas.height / height;
            }
            this.renderGrid(this.context, this.maze, scale);
        };
        Main.prototype.solveMaze = function () {
            var path = SquareMazeSolver_1.SquareMazeSolver.solve(this.maze);
            var scale = 1;
            if (this.maze.height < this.maze.width) {
                scale = this.canvas.width / this.maze.width;
            }
            else {
                scale = this.canvas.height / this.maze.height;
            }
            this.renderPath(this.context, path, scale);
        };
        Main.prototype.renderCell = function (context, cell, scale) {
            if (scale === void 0) { scale = 1.0; }
            var xOffset = cell.xPos * scale;
            var yOffset = cell.yPos * scale;
            var penX = xOffset;
            var penY = yOffset;
            context.moveTo(penX, penY);
            penX += scale;
            context.lineTo(penX, penY);
            penY += scale;
            context.lineTo(penX, penY);
            penX = xOffset;
            context.lineTo(penX, penY);
            penY = yOffset;
            context.lineTo(penX, penY);
        };
        Main.prototype.renderWalls = function (context, cell, scale) {
            if (scale === void 0) { scale = 1.0; }
            var xOffset = cell.xPos * scale;
            var yOffset = cell.yPos * scale;
            var penX = xOffset;
            var penY = yOffset;
            context.moveTo(penX, penY);
            penX += scale;
            if (cell.hasWall(0 /* Top */)) {
                context.lineTo(penX, penY);
            }
            else {
                context.moveTo(penX, penY);
            }
            penY += scale;
            if (cell.hasWall(1 /* Right */)) {
                context.lineTo(penX, penY);
            }
            else {
                context.moveTo(penX, penY);
            }
            penX = xOffset;
            if (cell.hasWall(2 /* Bottom */)) {
                context.lineTo(penX, penY);
            }
            else {
                context.moveTo(penX, penY);
            }
            penY = yOffset;
            if (cell.hasWall(3 /* Left */)) {
                context.lineTo(penX, penY);
            }
            else {
                context.moveTo(penX, penY);
            }
        };
        Main.prototype.renderGrid = function (context, maze, scale) {
            if (scale === void 0) { scale = 1.0; }
            context.strokeStyle = "#000000";
            context.lineWidth = 0.5;
            context.beginPath();
            for (var x = 0; x < maze.width; x++) {
                for (var y = 0; y < maze.height; y++) {
                    var cell = maze.getCell(x, y);
                    this.renderWalls(context, cell, scale);
                }
            }
            context.stroke();
            if (maze.startCell) {
                context.fillStyle = "#008800";
                context.beginPath();
                this.renderCell(context, maze.startCell, scale);
                context.fill();
            }
            if (maze.endCell) {
                context.fillStyle = "#880000";
                context.beginPath();
                this.renderCell(context, maze.endCell, scale);
                context.fill();
            }
        };
        Main.prototype.renderPath = function (context, path, scale) {
            if (scale === void 0) { scale = 1.0; }
            context.fillStyle = "#33888866";
            context.beginPath();
            var itr = path.iterator;
            while (itr.hasNext()) {
                var cell = itr.next();
                this.renderCell(context, cell, scale);
            }
            context.fill();
        };
        return Main;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Main;
});
//# sourceMappingURL=tsc.js.map