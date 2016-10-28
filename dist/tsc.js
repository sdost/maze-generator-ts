var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
                if (node.data === data) {
                    break;
                }
                node = node.next;
            }
            return node;
        };
        LinkedList.prototype.contains = function (data) {
            var node = this.head;
            while (node != null) {
                if (node.data === data) {
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
                if (node && node.data === data) {
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
define("Objects/MazeCell", ["require", "exports"], function (require, exports) {
    "use strict";
    var MazeCell = (function () {
        function MazeCell() {
            this.wallList = new Array();
            this.initialize();
        }
        MazeCell.prototype.walls = function () {
            return this.wallList.length;
        };
        return MazeCell;
    }());
    exports.MazeCell = MazeCell;
});
define("Objects/MazeGrid", ["require", "exports"], function (require, exports) {
    "use strict";
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
define("Objects/MazeSolver", ["require", "exports", "DataStructures/LinkedList"], function (require, exports, LinkedList_2) {
    "use strict";
    var MazeSolver = (function () {
        function MazeSolver(maze) {
            this.maze = maze;
            this.path = new LinkedList_2.LinkedList();
            this.path.append(this.maze.startCell);
        }
        return MazeSolver;
    }());
    exports.MazeSolver = MazeSolver;
});
define("Objects/MazeWall", ["require", "exports"], function (require, exports) {
    "use strict";
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
});
define("Objects/SquareMazeCell", ["require", "exports", "Objects/MazeCell"], function (require, exports, MazeCell_1) {
    "use strict";
    var SquareMazeCell = (function (_super) {
        __extends(SquareMazeCell, _super);
        function SquareMazeCell(x, y) {
            _super.call(this);
            this.xPos = x;
            this.yPos = y;
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
        SquareMazeCell.prototype.render = function (context, scale) {
            var xOffset = this.xPos * scale;
            var yOffset = this.yPos * scale;
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
    }(MazeCell_1.MazeCell));
    exports.SquareMazeCell = SquareMazeCell;
});
define("Objects/SquareMazeGrid", ["require", "exports", "DataStructures/DisjointSet", "DataStructures/LinkedList", "Helpers/PseudoRandom", "Objects/MazeGrid", "Objects/MazeWall", "Objects/SquareMazeCell"], function (require, exports, DisjointSet_1, LinkedList_3, PseudoRandom_1, MazeGrid_1, MazeWall_1, SquareMazeCell_1) {
    "use strict";
    var SquareMazeGrid = (function (_super) {
        __extends(SquareMazeGrid, _super);
        function SquareMazeGrid(width, height) {
            _super.call(this);
            this.gridWidth = width;
            this.gridHeight = height;
            this.initGrid();
        }
        SquareMazeGrid.prototype.generate = function (seed) {
            if (seed === void 0) { seed = 1; }
            this.wallList = new WallList();
            var ind;
            var wall;
            for (var x = 0; x < this.gridWidth; x++) {
                for (var y = 0; y < this.gridHeight; y++) {
                    ind = (x << this.shift) | y;
                    var cellA = this.grid[ind];
                    var cellB = void 0;
                    if (x > 0) {
                        ind = ((x - 1) << this.shift) | y;
                        cellB = this.grid[ind];
                        if (cellB != null) {
                            wall = new MazeWall_1.MazeWall(cellA, cellB);
                            if (!this.wallList.contains(wall)) {
                                this.wallList.append(wall);
                            }
                        }
                    }
                    if (y > 0) {
                        ind = (x << this.shift) | (y - 1);
                        cellB = this.grid[ind];
                        if (cellB != null) {
                            wall = new MazeWall_1.MazeWall(cellA, cellB);
                            if (!this.wallList.contains(wall)) {
                                this.wallList.append(wall);
                            }
                        }
                    }
                    if (x < (this.gridWidth - 1)) {
                        ind = ((x + 1) << this.shift) | y;
                        cellB = this.grid[ind];
                        if (cellB != null) {
                            wall = new MazeWall_1.MazeWall(cellA, cellB);
                            if (!this.wallList.contains(wall)) {
                                this.wallList.append(wall);
                            }
                        }
                    }
                    if (y < (this.gridHeight - 1)) {
                        ind = (x << this.shift) | (y + 1);
                        cellB = this.grid[ind];
                        if (cellB != null) {
                            wall = new MazeWall_1.MazeWall(cellA, cellB);
                            if (!this.wallList.contains(wall)) {
                                this.wallList.append(wall);
                            }
                        }
                    }
                }
            }
            var prng = new PseudoRandom_1.PseudoRandom();
            prng.seed = seed > 0 ? seed : new Date().getTime();
            this.wallList.shuffle(prng);
            while (this.wallList.size > 0) {
                wall = this.wallList.removeHead();
                var indA = (wall.cellA.xPos << this.shift) | wall.cellA.yPos;
                var indB = (wall.cellB.xPos << this.shift) | wall.cellB.yPos;
                if (this.ds.findSet(indA) === this.ds.findSet(indB)) {
                    continue;
                }
                this.ds.mergeSet(indA, indB);
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
            // Add start.
            this.gridStartCell = this.createExitCell(prng);
            // Add finish.
            this.gridEndCell = this.createExitCell(prng);
            while (this.gridStartCell.xPos === this.gridEndCell.xPos ||
                this.gridStartCell.yPos === this.gridEndCell.yPos) {
                this.gridEndCell = this.createExitCell(prng);
            }
        };
        SquareMazeGrid.prototype.render = function (context, scale) {
            context.strokeStyle = "#000000";
            context.lineWidth = 0.5;
            context.beginPath();
            for (var x = 0; x < this.gridWidth; x++) {
                for (var y = 0; y < this.gridHeight; y++) {
                    var cell = this.getCell(x, y);
                    this.renderWalls(context, cell, scale);
                }
            }
            context.stroke();
            if (this.startCell) {
                context.fillStyle = "#008800";
                context.beginPath();
                this.startCell.render(context, scale);
                context.fill();
            }
            if (this.endCell) {
                context.fillStyle = "#880000";
                context.beginPath();
                this.endCell.render(context, scale);
                context.fill();
            }
        };
        SquareMazeGrid.prototype.getCell = function (x, y) {
            var ind = (x << this.shift) | y;
            return this.grid[ind];
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
            for (var i = 0; i < this.grid.length; i++) {
                this.grid[i] = null;
            }
            this.ds = new DisjointSet_1.DisjointSet(this.gridWidth * this.gridHeight);
            for (var x = 0; x < this.gridWidth; x++) {
                for (var y = 0; y < this.gridHeight; y++) {
                    var ind = (x << this.shift) | y;
                    this.grid[ind] = new SquareMazeCell_1.SquareMazeCell(x, y);
                    this.ds.createSet(ind);
                }
            }
        };
        SquareMazeGrid.prototype.createExitCell = function (prng) {
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
            return this.getCell(xPos, yPos);
        };
        SquareMazeGrid.prototype.renderWalls = function (context, cell, scale) {
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
        return SquareMazeGrid;
    }(MazeGrid_1.MazeGrid));
    exports.SquareMazeGrid = SquareMazeGrid;
    var WallList = (function (_super) {
        __extends(WallList, _super);
        function WallList() {
            _super.apply(this, arguments);
        }
        WallList.prototype.contains = function (data) {
            var node = this.head;
            while (node != null) {
                if (node.data.equals(data)) {
                    return true;
                }
                node = node.next;
            }
            return false;
        };
        WallList.prototype.nodeOf = function (data, from) {
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
        return WallList;
    }(LinkedList_3.LinkedList));
});
define("Objects/SquareMazeSolver", ["require", "exports", "Objects/MazeSolver"], function (require, exports, MazeSolver_1) {
    "use strict";
    var SquareMazeSolver = (function (_super) {
        __extends(SquareMazeSolver, _super);
        function SquareMazeSolver(maze) {
            _super.call(this, maze);
        }
        SquareMazeSolver.prototype.solve = function () {
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
            var cell;
            var lastCell;
            var nextCell;
            var x;
            var y;
            while (!this.path.contains(this.maze.endCell)) {
                lastCell = cell;
                cell = this.path.tail.data;
                var w = this.getRightHandWall();
                if (cell.hasWall(w)) {
                    if (cell.hasWall(this.facing)) {
                        this.facing = this.getLeftHandWall();
                    }
                    else {
                        x = cell.xPos;
                        y = cell.yPos;
                        if (this.facing === 0 /* Top */) {
                            y--;
                        }
                        else if (this.facing === 2 /* Bottom */) {
                            y++;
                        }
                        else if (this.facing === 3 /* Left */) {
                            x--;
                        }
                        else if (this.facing === 1 /* Right */) {
                            x++;
                        }
                        nextCell = this.maze.getCell(x, y);
                        if (nextCell != null) {
                            if (this.path.contains(nextCell)) {
                                this.path.tail.unlink();
                            }
                            else if (nextCell === lastCell) {
                                this.path.tail.unlink();
                            }
                            else {
                                this.path.append(nextCell);
                            }
                        }
                    }
                }
                else {
                    this.facing = this.getRightHandWall();
                    x = cell.xPos;
                    y = cell.yPos;
                    if (this.facing === 0 /* Top */) {
                        y--;
                    }
                    else if (this.facing === 2 /* Bottom */) {
                        y++;
                    }
                    else if (this.facing === 3 /* Left */) {
                        x--;
                    }
                    else if (this.facing === 1 /* Right */) {
                        x++;
                    }
                    nextCell = this.maze.getCell(x, y);
                    if (nextCell != null) {
                        if (this.path.contains(nextCell)) {
                            this.path.tail.unlink();
                        }
                        else if (nextCell === lastCell) {
                            this.path.tail.unlink();
                        }
                        else {
                            this.path.append(nextCell);
                        }
                    }
                }
            }
        };
        SquareMazeSolver.prototype.render = function (context, scale) {
            context.fillStyle = "#33888866";
            context.beginPath();
            var itr = this.path.iterator;
            while (itr.hasNext()) {
                var cell = itr.next();
                cell.render(context, scale);
            }
            context.fill();
        };
        SquareMazeSolver.prototype.getRightHandWall = function () {
            if (this.facing === 0 /* Top */) {
                return 1 /* Right */;
            }
            if (this.facing === 1 /* Right */) {
                return 2 /* Bottom */;
            }
            if (this.facing === 2 /* Bottom */) {
                return 3 /* Left */;
            }
            if (this.facing === 3 /* Left */) {
                return 0 /* Top */;
            }
            return Number.NaN;
        };
        SquareMazeSolver.prototype.getLeftHandWall = function () {
            if (this.facing === 0 /* Top */) {
                return 3 /* Left */;
            }
            if (this.facing === 3 /* Left */) {
                return 2 /* Bottom */;
            }
            if (this.facing === 2 /* Bottom */) {
                return 1 /* Right */;
            }
            if (this.facing === 1 /* Right */) {
                return 0 /* Top */;
            }
            return Number.NaN;
        };
        SquareMazeSolver.RIGHT_HAND = 0;
        SquareMazeSolver.LEFT_HAND = 1;
        return SquareMazeSolver;
    }(MazeSolver_1.MazeSolver));
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
            this.maze = new SquareMazeGrid_1.SquareMazeGrid(width, height);
            this.maze.generate(seed);
            var scale = 1;
            if (height < width) {
                scale = this.canvas.width / width;
            }
            else {
                scale = this.canvas.height / height;
            }
            this.maze.render(this.context, scale);
        };
        Main.prototype.solveMaze = function () {
            this.solver = new SquareMazeSolver_1.SquareMazeSolver(this.maze);
            this.solver.solve();
            var scale = 1;
            if (this.maze.height < this.maze.width) {
                scale = this.canvas.width / this.maze.width;
            }
            else {
                scale = this.canvas.height / this.maze.height;
            }
            this.solver.render(this.context, scale);
        };
        return Main;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Main;
});
//# sourceMappingURL=tsc.js.map