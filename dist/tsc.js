var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("DataStructures/IComparable", ["require", "exports"], function (require, exports) {
    "use strict";
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
define("Objects/MazeGrid", ["require", "exports"], function (require, exports) {
    "use strict";
    var MazeCell = (function () {
        function MazeCell(x, y) {
            this.xPos = x;
            this.yPos = y;
            this.visited = false;
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
define("Objects/SquareMazeGrid", ["require", "exports", "DataStructures/DisjointSet", "Helpers/PseudoRandom", "Objects/MazeGrid"], function (require, exports, DisjointSet_1, PseudoRandom_1, MazeGrid_1) {
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
    var SquareMazeWall = (function () {
        function SquareMazeWall(cellA, cellB) {
            this.cellA = cellA;
            this.cellB = cellB;
        }
        SquareMazeWall.prototype.equals = function (wall) {
            if (this.cellA === wall.cellA && this.cellB === wall.cellB) {
                return true;
            }
            if (this.cellB === wall.cellA && this.cellA === wall.cellB) {
                return true;
            }
            return false;
        };
        return SquareMazeWall;
    }());
    var SquareMazeGrid = (function (_super) {
        __extends(SquareMazeGrid, _super);
        function SquareMazeGrid(width, height) {
            _super.call(this);
            this.gridWidth = width;
            this.gridHeight = height;
        }
        SquareMazeGrid.generate = function (width, height, seed) {
            if (seed === void 0) { seed = 1; }
            var mazeGrid = new SquareMazeGrid(width, height);
            var prng = new PseudoRandom_1.PseudoRandom();
            prng.seed = seed > 0 ? seed : new Date().getTime();
            mazeGrid.initGrid(prng);
            mazeGrid.createExitCells(prng);
            return mazeGrid;
        };
        SquareMazeGrid.prototype.initGrid = function (prng) {
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
            // this.wallList = new LinkedList<SquareMazeWall>();
            this.wallList = new Array();
            var wall;
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    var cellA = this.getCell(x, y);
                    var cellB = void 0;
                    if (x > 0) {
                        cellB = this.getCell(x - 1, y);
                        if (cellB != null) {
                            wall = new SquareMazeWall(cellA, cellB);
                            if (!this.wallList.some(function (val) { return wall.equals(val); })) {
                                this.wallList.push(wall);
                            }
                        }
                    }
                    if (y > 0) {
                        cellB = this.getCell(x, y - 1);
                        if (cellB != null) {
                            wall = new SquareMazeWall(cellA, cellB);
                            if (!this.wallList.some(function (val) { return wall.equals(val); })) {
                                this.wallList.push(wall);
                            }
                        }
                    }
                    if (x < (this.width - 1)) {
                        cellB = this.getCell(x + 1, y);
                        if (cellB != null) {
                            wall = new SquareMazeWall(cellA, cellB);
                            if (!this.wallList.some(function (val) { return wall.equals(val); })) {
                                this.wallList.push(wall);
                            }
                        }
                    }
                    if (y < (this.height - 1)) {
                        cellB = this.getCell(x, y + 1);
                        if (cellB != null) {
                            wall = new SquareMazeWall(cellA, cellB);
                            if (!this.wallList.some(function (val) { return wall.equals(val); })) {
                                this.wallList.push(wall);
                            }
                        }
                    }
                }
            }
            var s = this.wallList.length;
            while (s > 1) {
                s--;
                var i = prng.nextIntRange(0, s);
                var temp = this.wallList[s];
                this.wallList[s] = this.wallList[i];
                this.wallList[i] = temp;
            }
            this.sets = new DisjointSet_1.DisjointSet(this.width * this.height);
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    var cell = this.getCell(x, y);
                    this.sets.createSet(cell);
                }
            }
        };
        SquareMazeGrid.prototype.iterate = function () {
            var wall = this.getNextWall();
            if (wall != null) {
                this.sets.mergeSet(wall.cellA, wall.cellB);
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
                wall.cellA.visited = true;
                wall.cellB.visited = true;
                return false;
            }
            else {
                return true;
            }
        };
        SquareMazeGrid.prototype.getCell = function (x, y) {
            var ind = (x << this.shift) | y;
            return this.grid[ind];
        };
        SquareMazeGrid.prototype.getNextWall = function () {
            if (this.wallList.length > 0) {
                var wall = this.wallList.pop();
                while (this.sets.findSet(wall.cellA) === this.sets.findSet(wall.cellB)) {
                    if (this.wallList.length > 0) {
                        wall = this.wallList.pop();
                    }
                    else {
                        return null;
                    }
                }
                return wall;
            }
            else {
                return null;
            }
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
        return SquareMazeGrid;
    }(MazeGrid_1.MazeGrid));
    exports.SquareMazeGrid = SquareMazeGrid;
});
define("Objects/SquareMazeRenderer", ["require", "exports"], function (require, exports) {
    "use strict";
    var SquareMazeRenderer = (function () {
        function SquareMazeRenderer() {
        }
        SquareMazeRenderer.renderCell = function (img, cell, scale, r, g, b, a) {
            if (scale === void 0) { scale = 1.0; }
            var xOffset = cell.xPos * scale;
            var yOffset = cell.yPos * scale;
            SquareMazeRenderer.drawRect(img, xOffset + 1, yOffset + 1, xOffset + scale - 1, yOffset + scale - 1, r, g, b, a);
        };
        SquareMazeRenderer.renderWalls = function (img, cell, scale, r, g, b, a) {
            if (scale === void 0) { scale = 1.0; }
            var xOffset = cell.xPos * scale;
            var yOffset = cell.yPos * scale;
            if (cell.hasWall(0 /* Top */)) {
                SquareMazeRenderer.drawLine(img, xOffset, yOffset, xOffset + scale, yOffset, r, g, b, a);
            }
            if (cell.hasWall(1 /* Right */)) {
                SquareMazeRenderer.drawLine(img, xOffset + scale, yOffset, xOffset + scale, yOffset + scale, r, g, b, a);
            }
            if (cell.hasWall(2 /* Bottom */)) {
                SquareMazeRenderer.drawLine(img, xOffset, yOffset + scale, xOffset + scale, yOffset + scale, r, g, b, a);
            }
            if (cell.hasWall(3 /* Left */)) {
                SquareMazeRenderer.drawLine(img, xOffset, yOffset, xOffset, yOffset + scale, r, g, b, a);
            }
        };
        SquareMazeRenderer.renderGrid = function (img, maze, scale) {
            if (scale === void 0) { scale = 1.0; }
            SquareMazeRenderer.drawRect(img, 0, 0, maze.width * scale, maze.height * scale, 1.0, 1.0, 1.0, 1.0);
            for (var x = 0; x < maze.width; x++) {
                for (var y = 0; y < maze.height; y++) {
                    var cell = maze.getCell(x, y);
                    if (cell === maze.startCell) {
                        SquareMazeRenderer.renderCell(img, cell, scale, 0, 0.8, 0, 1.0);
                    }
                    else if (cell === maze.endCell) {
                        SquareMazeRenderer.renderCell(img, cell, scale, 0.8, 0, 0, 1.0);
                    }
                    else if (!cell.visited) {
                        SquareMazeRenderer.renderCell(img, cell, scale, 0.8, 0.8, 0.8, 1.0);
                    }
                    SquareMazeRenderer.renderWalls(img, cell, scale, 0.2, 0.2, 0.2, 1.0);
                }
            }
        };
        SquareMazeRenderer.renderPath = function (img, path, scale) {
            if (scale === void 0) { scale = 1.0; }
            var itr = path.iterator;
            while (itr.hasNext()) {
                var cell = itr.next();
                SquareMazeRenderer.renderCell(img, cell, scale, 0.3, 0.8, 0.8, 0.4);
            }
        };
        SquareMazeRenderer.setPixel = function (img, x, y, r, g, b, a) {
            var index = (x + y * img.width) * 4;
            var invAlpha = 1.0 - a;
            r *= a;
            g *= a;
            b *= a;
            img.data[index] = (img.data[index++] * invAlpha) + (255 * r);
            img.data[index] = (img.data[index++] * invAlpha) + (255 * g);
            img.data[index] = (img.data[index++] * invAlpha) + (255 * b);
            img.data[index] = (img.data[index] * invAlpha) + (255 * a);
        };
        SquareMazeRenderer.drawLine = function (img, x0, y0, x1, y1, r, g, b, a) {
            var dX = x1 - x0;
            var dY = y1 - y0;
            if (dX === 0) {
                for (var y = y0; y <= y1; y++) {
                    var x = x1 + dX * (y - y1) / dY;
                    SquareMazeRenderer.setPixel(img, x, y, r, g, b, a);
                }
            }
            else {
                for (var x = x0; x <= x1; x++) {
                    var y = y1 + dY * (x - x1) / dX;
                    SquareMazeRenderer.setPixel(img, x, y, r, g, b, a);
                }
            }
        };
        SquareMazeRenderer.drawRect = function (img, x0, y0, x1, y1, r, g, b, a) {
            for (var x = x0; x <= x1; x++) {
                for (var y = y0; y <= y1; y++) {
                    SquareMazeRenderer.setPixel(img, x, y, r, g, b, a);
                }
            }
        };
        return SquareMazeRenderer;
    }());
    exports.SquareMazeRenderer = SquareMazeRenderer;
});
define("Objects/SquareMazeSolver", ["require", "exports", "DataStructures/LinkedList"], function (require, exports, LinkedList_2) {
    "use strict";
    var SquareMazeSolver = (function () {
        function SquareMazeSolver(maze) {
            this.maze = maze;
            this.currentPath = new LinkedList_2.LinkedList();
            this.currentPath.append(this.maze.startCell);
            if (this.maze.startCell.yPos === 0) {
                this.facing = 2 /* Bottom */;
            }
            else if (this.maze.startCell.xPos === this.maze.width - 1) {
                this.facing = 3 /* Left */;
            }
            else if (this.maze.startCell.yPos === this.maze.height - 1) {
                this.facing = 0 /* Top */;
            }
            else {
                this.facing = 1 /* Right */;
            }
        }
        SquareMazeSolver.solve = function (maze) {
            var solver = new SquareMazeSolver(maze);
            return solver;
        };
        SquareMazeSolver.prototype.iterate = function () {
            if (this.currentPath.contains(this.maze.endCell)) {
                return true;
            }
            var lastCell = this.currentCell;
            this.currentCell = this.currentPath.tail.data;
            var w = getRightHandWall(this.facing);
            if (this.currentCell.hasWall(w)) {
                if (this.currentCell.hasWall(this.facing)) {
                    this.facing = getLeftHandWall(this.facing);
                }
                else {
                    var x = this.currentCell.xPos;
                    var y = this.currentCell.yPos;
                    switch (this.facing) {
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
                    var nextCell = this.maze.getCell(x, y);
                    if (nextCell != null) {
                        if (this.currentPath.contains(nextCell)) {
                            this.currentPath.tail.unlink();
                        }
                        else if (nextCell === lastCell) {
                            this.currentPath.tail.unlink();
                        }
                        else {
                            this.currentPath.append(nextCell);
                        }
                    }
                }
            }
            else {
                this.facing = getRightHandWall(this.facing);
                var x = this.currentCell.xPos;
                var y = this.currentCell.yPos;
                switch (this.facing) {
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
                var nextCell = this.maze.getCell(x, y);
                if (nextCell != null) {
                    if (this.currentPath.contains(nextCell)) {
                        this.currentPath.tail.unlink();
                    }
                    else if (nextCell === lastCell) {
                        this.currentPath.tail.unlink();
                    }
                    else {
                        this.currentPath.append(nextCell);
                    }
                }
            }
            return false;
        };
        Object.defineProperty(SquareMazeSolver.prototype, "path", {
            get: function () {
                return this.currentPath;
            },
            enumerable: true,
            configurable: true
        });
        SquareMazeSolver.RIGHT_HAND = 0;
        SquareMazeSolver.LEFT_HAND = 1;
        return SquareMazeSolver;
    }());
    exports.SquareMazeSolver = SquareMazeSolver;
    function getRightHandWall(facing) {
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
    }
    function getLeftHandWall(facing) {
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
    }
});
define("MazeWorker", ["require", "exports", "Objects/SquareMazeGrid", "Objects/SquareMazeRenderer", "Objects/SquareMazeSolver"], function (require, exports, SquareMazeGrid_1, SquareMazeRenderer_1, SquareMazeSolver_1) {
    "use strict";
    var MazeWorker = (function () {
        function MazeWorker() {
        }
        MazeWorker.prototype.generateMaze = function (width, height, seed) {
            this.solution = null;
            this.maze = SquareMazeGrid_1.SquareMazeGrid.generate(width, height, seed);
        };
        MazeWorker.prototype.iterateMaze = function () {
            if (this.maze) {
                return this.maze.iterate();
            }
            else {
                return false;
            }
        };
        MazeWorker.prototype.solveMaze = function () {
            if (this.maze) {
                this.solution = SquareMazeSolver_1.SquareMazeSolver.solve(this.maze);
            }
        };
        MazeWorker.prototype.iterateSolution = function () {
            if (this.solution) {
                return this.solution.iterate();
            }
            else {
                return false;
            }
        };
        MazeWorker.prototype.render = function (img) {
            if (this.maze) {
                var hScale = Math.floor(img.width / this.maze.width);
                var vScale = Math.floor(img.height / this.maze.height);
                SquareMazeRenderer_1.SquareMazeRenderer.renderGrid(img, this.maze, (hScale < vScale) ? hScale : vScale);
                if (this.solution) {
                    SquareMazeRenderer_1.SquareMazeRenderer.renderPath(img, this.solution.path, (hScale < vScale) ? hScale : vScale);
                }
            }
            return img;
        };
        return MazeWorker;
    }());
    exports.MazeWorker = MazeWorker;
});
//# sourceMappingURL=tsc.js.map