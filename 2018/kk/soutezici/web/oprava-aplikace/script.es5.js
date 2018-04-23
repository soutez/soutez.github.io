"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var StuffSimulator;
(function (StuffSimulator) {
    var parseMapFromFile = function (file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onabort = function () { return reject(); };
            reader.onerror = function () { return reject(); };
            reader.onload = function (event) {
                var text = reader.result;
                try {
                    var obj = JSON.parse(text);
                    resolve(obj);
                }
                catch (e) {
                    reject(e);
                }
            };
            reader.readAsText(file);
        });
    };
    var initializeSimulation = function (sim) {
        var map = sim.map || fail("Can't load data without a map.");
        return {
            map: map,
            currentTime: sim.currentTime || 0,
            speed: sim.speed || 1,
            livingObjects: sim.livingObjects || [],
            lines: sim.lines || [],
            displayTimeOffset: sim.displayTimeOffset || 0
        };
    };
    var initializeRenderData = function (simulation) {
        return { simulation: simulation, running: true };
    };
    // simulation
    var PriorityQueue = /** @class */ (function () {
        function PriorityQueue(getKey) {
            this.getKey = getKey;
            this.data = [];
        }
        PriorityQueue.prototype.push = function () {
            var _this = this;
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            (_a = this.data).push.apply(_a, items);
            this.data.sort(function (a, b) { return Math.sign(_this.getKey(b) - _this.getKey(a)); });
            var min = this.getKey(this.peek());
            if (!this.data.map(this.getKey.bind(this)).every(function (m) { return m >= min; }))
                fail();
            var _a;
        };
        PriorityQueue.prototype.peek = function () { return this.data[this.data.length - 1]; };
        PriorityQueue.prototype.pop = function () { return this.data.pop(); };
        PriorityQueue.prototype.empty = function () { return this.data.length == 0; };
        return PriorityQueue;
    }());
    var fail = function (message) {
        if (message === void 0) { message = "Assertion failure"; }
        throw new Error(message);
    };
    var cachedFunction = function (func) {
        var map = new WeakMap();
        return function (arg) {
            if (map.has(arg))
                return map.get(arg) || fail();
            else {
                var result = func(arg);
                map.set(arg, result);
                return result;
            }
        };
    };
    var flattenArray = function (a) {
        return a.reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []);
    };
    var getConnectionMap = cachedFunction(function (map) {
        var result = map.nodes.map(function (n) { return []; });
        for (var connId = 0; connId < map.connections.length; connId++) {
            var conn = map.connections[connId];
            result[conn.to].push({ conn: conn, connId: connId, to: conn.from });
            result[conn.from].push({ conn: conn, connId: connId, to: conn.to });
        }
        return result;
    });
    var findPath = function (map, from, to) {
        if (from == to)
            return [];
        var connectionMap = getConnectionMap(map);
        var q = new PriorityQueue(function (a) { return a.dist; });
        q.push({ node: to, dist: 0 });
        var pathMap = {};
        var _loop_1 = function () {
            var _a = q.pop() || fail(), node = _a.node, dist = _a.dist;
            if (node == from)
                return "break-searchLoop";
            var newNodes = connectionMap[node]
                .filter(function (_a) {
                var to = _a.to, conn = _a.conn;
                return !(to in pathMap) || pathMap[to].dist > dist + conn.distance;
            })
                .map(function (_a) {
                var conn = _a.conn, connId = _a.connId, to = _a.to;
                return ({ node: to, dist: dist + conn.distance, connId: connId, conn: conn });
            });
            for (var _i = 0, newNodes_1 = newNodes; _i < newNodes_1.length; _i++) {
                var _b = newNodes_1[_i], nextNode = _b.node, connId = _b.connId, dist_1 = _b.dist;
                pathMap[nextNode] = { node: node, connId: connId, dist: dist_1 };
            }
            q.push.apply(q, newNodes);
        };
        // prohledám mapu zezadu, abych zjistil odkud se dá do cíle dostat
        searchLoop: while (!q.empty()) {
            var state_1 = _loop_1();
            switch (state_1) {
                case "break-searchLoop": break searchLoop;
            }
        }
        if (!(from in pathMap))
            fail("Could not find path from node #" + from + " to node #" + to + ".");
        var result = [];
        var l = from;
        while (l != to) {
            result.push(pathMap[l]);
            l = pathMap[l].node;
        }
        return result;
    };
    var createEventForStation = cachedFunction(function (map) { return cachedFunction(function (fromStation) { return cachedFunction(function (toStation) {
        var path = findPath(map, fromStation.node, toStation.node);
        var action2 = "continueLine";
        for (var index = path.length - 1; index >= 1; index--) {
            action2 = {
                type: "continuePath",
                nextConnection: path[index].connId,
                followingAction: action2
            };
        }
        return function (startTime, line) {
            return {
                time: startTime,
                spawnedObject: {
                    line: line,
                    path: path[0].connId,
                    startTime: startTime,
                    startNode: fromStation.node,
                    endTime: startTime + map.connections[path[0].connId].distance,
                    followingAction: action2
                }
            };
        };
    }); }); });
    var getGlobalEventList = cachedFunction(function (map) { return cachedFunction(function (lines) {
        var events = [];
        var eventFactory = createEventForStation(map);
        for (var lineId = 0; lineId < lines.length; lineId++) {
            var line = lines[lineId];
            for (var _i = 0, _a = line.timeTable; _i < _a.length; _i++) {
                var t = _a[_i];
                var position = t.from != null ? t.from : (t.direction == 1 ? 0 : line.stops.length - 1);
                var nextNode = line.stops[position + t.direction] || fail();
                events.push(eventFactory(map.stations[line.stops[position].id])(map.stations[nextNode.id])(t.time, { id: lineId, position: position, direction: t.direction }));
            }
        }
        events.sort(function (a, b) { return a.time - b.time; });
        return events;
    }); });
    /** Posune stav o nějaký čas dál */
    var moveSimulation = function (data, deltaTime) {
        var time = data.currentTime + (deltaTime * data.speed);
        var triggeredObjects = data.livingObjects.filter(function (o) { return o.endTime < time; });
        var newObjects = getGlobalEventList(data.map)(data.lines).filter(function (e) { return e.time >= data.currentTime && e.time < time; }).map(function (e) { return e.spawnedObject; });
        var processObject = function (obj) {
            if (obj.followingAction == "die") {
            }
            else if (obj.followingAction == "continueLine") {
                var oldLine = obj.line || fail();
                var line = __assign({}, oldLine, { position: oldLine.position + oldLine.direction });
                var stop1 = data.lines[line.id].stops[line.position];
                var stop2 = data.lines[line.id].stops[line.position + line.direction];
                if (stop2 != null) {
                    return createEventForStation(data.map)(data.map.stations[stop1.id])(data.map.stations[stop2.id])(obj.endTime, line).spawnedObject;
                }
            }
            else if (obj.followingAction.type == "continuePath") {
                var oldConnection = data.map.connections[obj.path] || fail();
                var startNode = oldConnection.from == obj.startNode ? oldConnection.to : oldConnection.from;
                var connection = data.map.connections[obj.followingAction.nextConnection];
                return {
                    line: obj.line,
                    startTime: obj.endTime,
                    endTime: obj.endTime + connection.distance,
                    path: obj.followingAction.nextConnection,
                    startNode: startNode,
                    followingAction: obj.followingAction.followingAction,
                };
            }
            else
                fail();
            return undefined;
        };
        for (var _i = 0, triggeredObjects_1 = triggeredObjects; _i < triggeredObjects_1.length; _i++) {
            var obj = triggeredObjects_1[_i];
            var newObj = processObject(obj);
            if (newObj) {
                if (newObj.endTime < time) {
                    triggeredObjects.push(newObj);
                }
                else {
                    newObjects.push(newObj);
                }
            }
        }
        return __assign({}, data, { map: data.map, currentTime: time, livingObjects: triggeredObjects.length == 0 && newObjects.length == 0 ? data.livingObjects : data.livingObjects.filter(function (o) { return o.endTime > time; }).concat(newObjects) });
    };
    var getObjectProgress = function (obj, time) {
        if (time <= obj.startTime)
            return 0;
        else if (time >= obj.endTime)
            return 1;
        else
            return (time - obj.startTime) / (obj.endTime - obj.startTime);
    };
    // rendering
    var createMapRenderer = function () {
        var svgNS = "http://www.w3.org/2000/svg";
        var svgAttr = function (element, name, value) {
            return element.setAttributeNS(null, name, value);
        };
        var updateCollection = function (elements, rootElement, newData, oldData, updateFn, factoryFn, alwaysUpdate) {
            if (alwaysUpdate === void 0) { alwaysUpdate = false; }
            if (newData == oldData && !alwaysUpdate)
                return;
            if (elements.length == newData.length) {
                for (var i = 0; i < elements.length; i++) {
                    if (alwaysUpdate || oldData && oldData[i] != newData[i]) {
                        updateFn(newData[i], elements[i]);
                    }
                }
            }
            else {
                for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                    var p = elements_1[_i];
                    p.remove();
                }
                while (elements.length)
                    elements.pop();
                for (var _a = 0, newData_1 = newData; _a < newData_1.length; _a++) {
                    var d = newData_1[_a];
                    var newElement = factoryFn();
                    updateFn(d, newElement);
                    rootElement.appendChild(newElement);
                    elements.push(newElement);
                }
            }
        };
        var paths = [], stations = [], objects = [];
        var mapRenderer = (function () {
            var lastData;
            return function (data, element) {
                if (lastData == data) {
                    return;
                }
                if (lastData == null) {
                    Array.from(element.childNodes).forEach(function (n) { return element.removeChild(n); });
                }
                var renderPath = function (conn, element) {
                    // Prostě Chrome... Na tohle je API, dokonce dvě, ale ani jedno nefunguje. Jedno je už deprecated (a odstraněné z Chrome!), druhé tam asi ještě není. Díky.
                    // Navíc jsou teda fakt borci, že odstranili standardní API.
                    var x = data.nodes[conn.from].pos[0];
                    var y = data.nodes[conn.from].pos[1];
                    var width = data.nodes[conn.to].pos[0] - x;
                    var height = data.nodes[conn.to].pos[1] - y;
                    var pathString = conn.curve.map(function (i) { return "L" + (i[0] + x) + "," + (i[1] + y); }).join(" ");
                    svgAttr(element, "d", "M" + x + "," + y + " " + pathString + (" L" + (x + width) + "," + (y + height)));
                    svgAttr(element, "stroke", "black");
                    svgAttr(element, "stroke-width", "2");
                    svgAttr(element, "vector-effect", "non-scaling-stroke");
                    svgAttr(element, "fill", "none ");
                };
                updateCollection(paths, element, data.connections, lastData && lastData.connections, renderPath, function () { return document.createElementNS(svgNS, "path"); });
                var renderStation = function (station, element) {
                    var node = data.nodes[station.node];
                    svgAttr(element, "d", "M" + node.pos[0] + "," + node.pos[1] + " l0,0");
                    svgAttr(element, "stroke", "red");
                    svgAttr(element, "stroke-width", "10");
                    svgAttr(element, "stroke-linecap", "round");
                    svgAttr(element, "vector-effect", "non-scaling-stroke");
                    var title = Array.from(element.childNodes).find(function (e) { return e.nodeName == "title"; }) || document.createElementNS(svgNS, "title");
                    title.textContent = "" + station.name;
                    if (!title.parentNode)
                        element.appendChild(title);
                };
                updateCollection(stations, element, data.stations, lastData && lastData.stations, renderStation, function () { return document.createElementNS(svgNS, "path"); });
                var viewBox = (function () {
                    var x = data.nodes.map(function (n) { return n.pos[0]; });
                    var y = data.nodes.map(function (n) { return n.pos[1]; });
                    var xMin = Math.min.apply(Math, x), yMin = Math.min.apply(Math, y), xMax = Math.max.apply(Math, x), yMax = Math.max.apply(Math, y), width = xMax - xMin, height = yMax - yMin;
                    return xMin - (width) * 0.1 + " " + (yMin - height * 0.1) + " " + width * 1.2 + " " + height * 1.2;
                })();
                svgAttr(element, "viewBox", viewBox);
                lastData = data;
            };
        })();
        var lastData;
        return function (data, element) {
            if (lastData === data)
                return;
            mapRenderer(data.simulation.map, element);
            var time = data.simulation.currentTime;
            var renderObject = function (obj, element) {
                var position = (function () {
                    if (obj.path != null) {
                        var progress = getObjectProgress(obj, time);
                        var path = data.simulation.map.connections[obj.path];
                        if (path.from != obj.startNode && path.to != obj.startNode)
                            fail();
                        var lineProgress = path.from == obj.startNode ? progress : 1 - progress;
                        var p = paths[obj.path];
                        var point = p.getPointAtLength(p.getTotalLength() * lineProgress);
                        return [point.x, point.y];
                    }
                    else
                        return data.simulation.map.nodes[obj.startNode].pos;
                })();
                // const node = obj.path data.nodes[obj.path]
                svgAttr(element, "d", "M" + position[0] + "," + position[1] + " l0,0");
                svgAttr(element, "stroke", "green");
                svgAttr(element, "stroke-width", "8");
                svgAttr(element, "stroke-linecap", "round");
                svgAttr(element, "vector-effect", "non-scaling-stroke");
            };
            updateCollection(objects, element, data.simulation.livingObjects, lastData && lastData.simulation.livingObjects, renderObject, function () { return document.createElementNS(svgNS, "path"); }, true);
            lastData = data;
        };
    };
    var saveMapToLocalStorage = function (map) {
        try {
            localStorage.setItem("lastUsedMap", JSON.stringify(map));
        }
        catch (_a) {
        }
    };
    var tryLoadMapFromLocalStorage = function () {
        try {
            var serializedMap = localStorage.getItem("lastUsedMap");
            return serializedMap ? JSON.parse(serializedMap) : null;
        }
        catch (_a) {
            console.warn("Nefunguje localStorage, nejde tam uložit mapa, tak jí bude potřeba načíst znova ručně.");
            return null;
        }
    };
    var ControlPanel = /** @class */ (function () {
        function ControlPanel(playButton, pauseButton, resetButton, speedInput, timeDisplay) {
            var _this = this;
            this.playButton = playButton;
            this.pauseButton = pauseButton;
            this.resetButton = resetButton;
            this.speedInput = speedInput;
            this.timeDisplay = timeDisplay;
            this.updates = [];
            playButton.onclick = function () { return _this.updates.push(function (state) { return (__assign({}, state, { running: true })); }); };
            pauseButton.onclick = function () { return _this.updates.push(function (state) { return (__assign({}, state, { running: false })); }); };
            resetButton.onclick = function () { return _this.updates.push(function (state) {
                var simulation = __assign({}, state.simulation, { currentTime: 0, livingObjects: [] });
                return __assign({}, state, { simulation: simulation });
            }); };
            var speedOnChange = function () { return _this.updates.push(function (state) {
                var speed = Math.pow(2, parseFloat(speedInput.value));
                var simulation = __assign({}, state.simulation, { speed: speed });
                return __assign({}, state, { simulation: simulation });
            }); };
            speedInput.onchange = speedOnChange;
            speedInput.onmousemove = speedOnChange;
        }
        ControlPanel.prototype.updateState = function (state) {
            for (var _i = 0, _a = this.updates; _i < _a.length; _i++) {
                var update = _a[_i];
                state = update(state);
            }
            if (this.updates.length)
                this.updates = [];
            // and update the panel
            this.speedInput.value = "" + Math.log2(state.simulation.speed);
            this.speedInput.title = state.simulation.speed * 100 + "%";
            this.pauseButton.style.display = state.running ? "" : "none";
            this.playButton.style.display = state.running ? "none" : "";
            var relativeTime = state.simulation.currentTime + (state.simulation.displayTimeOffset || 0);
            this.timeDisplay.innerText = (relativeTime / 60 | 0) + ":" + (relativeTime % 60 | 0);
            return state;
        };
        ControlPanel.create = function (someElement) {
            return new ControlPanel(someElement.querySelector("#playButton") || fail(), someElement.querySelector("#pauseButton") || fail(), someElement.querySelector("#resetButton") || fail(), someElement.querySelector("#speedRange") || fail(), someElement.querySelector("#timeDisplay") || fail());
        };
        return ControlPanel;
    }());
    StuffSimulator.ControlPanel = ControlPanel;
    var App = /** @class */ (function () {
        function App(svgCanvas, controlPanel) {
            this.svgCanvas = svgCanvas;
            this.controlPanel = controlPanel;
            this.renderDispatched = false;
            this.renderFrameId = -1;
        }
        App.prototype.loadMapFromFile = function (file) {
            var _this = this;
            return parseMapFromFile(file)
                .then(function (map) { return _this.loadNewMap(map); }, function (error) { return alert("Error loading the file: " + error); });
        };
        App.prototype.loadFromLocalStorage = function () {
            var map = tryLoadMapFromLocalStorage();
            map && this.loadNewMap(map);
        };
        App.prototype.loadNewMap = function (data) {
            this.data = initializeRenderData(initializeSimulation(data));
            this.mapRenderer = createMapRenderer();
            saveMapToLocalStorage(data);
            this.dispatchRender();
        };
        App.prototype.saveMap = function (link) {
            if (this.data == null)
                return false;
            var data = JSON.stringify(__assign({}, (this.data.simulation), { livingObjects: undefined, currentTime: undefined }), null, "\t");
            var blob = new Blob([data], { type: "text/json" });
            var url = URL.createObjectURL(blob);
            link.href = url;
            return true;
        };
        App.prototype.importEpicMap = function () {
            var normalizeName = function (stName) { return stName.replace(/\(.*\)/, "").trim().toLowerCase(); };
            var stops = JSON.parse(prompt("paste the stops") || fail());
            var lines = JSON.parse(prompt("paste the lines") || fail());
            var activeStopSet = new Set(flattenArray(flattenArray(Object.keys(lines).map(function (lName) { return lines[lName]; })).map(function (l) { return l.timetable; })).map(function (d) { return normalizeName(d.stop); }));
            var activeStops = stops.filter(function (s) { return activeStopSet.has(s.name.trim().toLowerCase()); });
            var nodes = activeStops.map(function (s) { return ({ pos: [s.midPoint[0] * 100, -s.midPoint[1] * 100] }); });
            var stations = activeStops.map(function (s, index) { return ({ name: s.name.trim(), node: index }); });
            var stopNameMap = new Map(activeStops.map(function (s, index) { return [normalizeName(s.name), index]; }));
            var getStation = function (st) {
                var r = stopNameMap.get(normalizeName(st));
                if (r === undefined)
                    return fail();
                else
                    return r;
            };
            var dedupeLine = function (array, key) {
                var result = [];
                var lastKey = undefined;
                for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                    var i = array_1[_i];
                    var k = key(i);
                    if (k != lastKey)
                        result.push(i);
                    lastKey = k;
                }
                return result;
            };
            var resultLines = [];
            var resultConnections = [];
            var connectionDedupSet = new Set();
            var _loop_2 = function (lineName) {
                var lol = lines[lineName];
                var stations_1 = [];
                var departures = [];
                var _loop_3 = function (table) {
                    var timetable = dedupeLine(table.timetable, function (t) { return getStation(t.stop); });
                    var commonPoint = timetable.map(function (t, i) { return [i, stations_1.indexOf(getStation(t.stop))]; }).find(function (a) { return a[1] >= 0; });
                    if (commonPoint) {
                        var direction_1 = stations_1[commonPoint[1] - 1] == (timetable[commonPoint[0] - 1] && getStation(timetable[commonPoint[0] - 1].stop)) ? 1 : -1;
                        // maybe check additional station...
                        departures.push.apply(departures, table.departures.map(function (time) { return ({ from: commonPoint[1], direction: direction_1, time: (time + 20 * 60) % (24 * 60) }); }));
                    }
                    else {
                        stations_1.push.apply(stations_1, timetable.map(function (t) { return getStation(t.stop); }));
                        departures.push.apply(departures, table.departures.map(function (time) { return ({ from: 0, direction: 1, time: (time + 20 * 60) % (24 * 60) }); }));
                    }
                    var lastNode = timetable[0];
                    for (var i = 1; i < timetable.length; i++) {
                        var distance = timetable[i].time - lastNode.time;
                        var from = getStation(lastNode.stop);
                        var to = getStation(timetable[i].stop);
                        if (!connectionDedupSet.has(from + "|" + to)) {
                            resultConnections.push({ from: from, to: to, curve: [], distance: distance });
                            connectionDedupSet.add(from + "|" + to);
                            connectionDedupSet.add(to + "|" + from);
                        }
                        lastNode = timetable[i];
                    }
                };
                for (var _i = 0, lol_1 = lol; _i < lol_1.length; _i++) {
                    var table = lol_1[_i];
                    _loop_3(table);
                }
                resultLines.push({ name: lineName, stops: stations_1.map(function (id) { return ({ id: id }); }), timeTable: departures });
            };
            for (var _i = 0, _a = Object.keys(lines); _i < _a.length; _i++) {
                var lineName = _a[_i];
                _loop_2(lineName);
            }
            var map = { nodes: nodes, connections: resultConnections, stations: stations };
            var simData = { map: map, lines: resultLines, livingObjects: [], currentTime: 0, speed: 1, displayTimeOffset: 4 * 60 };
            this.loadNewMap(simData);
        };
        App.prototype.dispatchRender = function () {
            var _this = this;
            if (this.renderDispatched) {
                return;
            }
            this.renderDispatched = true;
            this.renderFrameId = window.requestAnimationFrame(function (time) {
                _this.renderDispatched = false;
                if (!_this.mapRenderer || !_this.data) {
                    _this.lastAnimationTime = undefined;
                    return;
                }
                if (_this.lastAnimationTime != null && _this.data.running) {
                    _this.data = _this.controlPanel.updateState(_this.data);
                    var deltaTime = time - _this.lastAnimationTime;
                    _this.data = __assign({}, _this.data, { simulation: moveSimulation(_this.data.simulation, deltaTime / 1000) });
                }
                _this.lastAnimationTime = time;
                _this.mapRenderer(_this.data, _this.svgCanvas);
                _this.dispatchRender();
            });
        };
        return App;
    }());
    StuffSimulator.App = App;
})(StuffSimulator || (StuffSimulator = {}));
//# sourceMappingURL=script.js.map