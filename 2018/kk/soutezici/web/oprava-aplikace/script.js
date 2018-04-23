"use strict";
var StuffSimulator;
(function (StuffSimulator) {
    const parseMapFromFile = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onabort = () => reject();
        reader.onerror = () => reject();
        reader.onload = event => {
            const text = reader.result;
            try {
                const obj = JSON.parse(text);
                resolve(obj);
            }
            catch (e) {
                reject(e);
            }
        };
        reader.readAsText(file);
    });
    const initializeSimulation = (sim) => {
        const map = sim.map || fail("Can't load data without a map.");
        return {
            map,
            currentTime: sim.currentTime || 0,
            speed: sim.speed || 1,
            livingObjects: sim.livingObjects || [],
            lines: sim.lines || [],
            displayTimeOffset: sim.displayTimeOffset || 0
        };
    };
    const initializeRenderData = (simulation) => {
        return { simulation, running: true };
    };
    // simulation
    class PriorityQueue {
        constructor(getKey) {
            this.getKey = getKey;
            this.data = [];
        }
        push(...items) {
            this.data.push(...items);
            this.data.sort((a, b) => Math.sign(this.getKey(b) - this.getKey(a)));
            const min = this.getKey(this.peek());
            if (!this.data.map(this.getKey.bind(this)).every(m => m >= min))
                fail();
        }
        peek() { return this.data[this.data.length - 1]; }
        pop() { return this.data.pop(); }
        empty() { return this.data.length == 0; }
    }
    const fail = (message = "Assertion failure") => { throw new Error(message); };
    const cachedFunction = (func) => {
        const map = new WeakMap();
        return (arg) => {
            if (map.has(arg))
                return map.get(arg) || fail();
            else {
                const result = func(arg);
                map.set(arg, result);
                return result;
            }
        };
    };
    const flattenArray = (a) => {
        return a.reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
    };
    const getConnectionMap = cachedFunction((map) => {
        const result = map.nodes.map(n => []);
        for (let connId = 0; connId < map.connections.length; connId++) {
            const conn = map.connections[connId];
            result[conn.to].push({ conn, connId, to: conn.from });
            result[conn.from].push({ conn, connId, to: conn.to });
        }
        return result;
    });
    const findPath = (map, from, to) => {
        if (from == to)
            return [];
        const connectionMap = getConnectionMap(map);
        const q = new PriorityQueue(a => a.dist);
        q.push({ node: to, dist: 0 });
        const pathMap = {};
        // prohledám mapu zezadu, abych zjistil odkud se dá do cíle dostat
        searchLoop: while (!q.empty()) {
            const { node, dist } = q.pop() || fail();
            if (node == from)
                break searchLoop;
            const newNodes = connectionMap[node]
                .filter(({ to, conn }) => !(to in pathMap) || pathMap[to].dist > dist + conn.distance)
                .map(({ conn, connId, to }) => ({ node: to, dist: dist + conn.distance, connId, conn }));
            for (const { node: nextNode, connId, dist } of newNodes) {
                pathMap[nextNode] = { node, connId, dist };
            }
            q.push(...newNodes);
        }
        if (!(from in pathMap))
            fail(`Could not find path from node #${from} to node #${to}.`);
        const result = [];
        let l = from;
        while (l != to) {
            result.push(pathMap[l]);
            l = pathMap[l].node;
        }
        return result;
    };
    const createEventForStation = cachedFunction((map) => cachedFunction((fromStation) => cachedFunction((toStation) => {
        const path = findPath(map, fromStation.node, toStation.node);
        var action2 = "continueLine";
        for (let index = path.length - 1; index >= 1; index--) {
            action2 = {
                type: "continuePath",
                nextConnection: path[index].connId,
                followingAction: action2
            };
        }
        return (startTime, line) => {
            return {
                time: startTime,
                spawnedObject: {
                    line,
                    path: path[0].connId,
                    startTime: startTime,
                    startNode: fromStation.node,
                    endTime: startTime + map.connections[path[0].connId].distance,
                    followingAction: action2
                }
            };
        };
    })));
    const getGlobalEventList = cachedFunction((map) => cachedFunction((lines) => {
        const events = [];
        const eventFactory = createEventForStation(map);
        for (let lineId = 0; lineId < lines.length; lineId++) {
            const line = lines[lineId];
            for (const t of line.timeTable) {
                const position = t.from != null ? t.from : (t.direction == 1 ? 0 : line.stops.length - 1);
                const nextNode = line.stops[position + t.direction] || fail();
                events.push(eventFactory(map.stations[line.stops[position].id])(map.stations[nextNode.id])(t.time, { id: lineId, position, direction: t.direction }));
            }
        }
        events.sort((a, b) => a.time - b.time);
        return events;
    }));
    /** Posune stav o nějaký čas dál */
    const moveSimulation = (data, deltaTime) => {
        const time = data.currentTime + (deltaTime * data.speed);
        var triggeredObjects = data.livingObjects.filter(o => o.endTime < time);
        const newObjects = getGlobalEventList(data.map)(data.lines).filter(e => e.time >= data.currentTime && e.time < time).map(e => e.spawnedObject);
        const processObject = (obj) => {
            if (obj.followingAction == "die") {
            }
            else if (obj.followingAction == "continueLine") {
                const oldLine = obj.line || fail();
                const line = Object.assign({}, oldLine, { position: oldLine.position + oldLine.direction });
                const stop1 = data.lines[line.id].stops[line.position];
                const stop2 = data.lines[line.id].stops[line.position + line.direction];
                if (stop2 != null) {
                    return createEventForStation(data.map)(data.map.stations[stop1.id])(data.map.stations[stop2.id])(obj.endTime, line).spawnedObject;
                }
            }
            else if (obj.followingAction.type == "continuePath") {
                const oldConnection = data.map.connections[obj.path] || fail();
                const startNode = oldConnection.from == obj.startNode ? oldConnection.to : oldConnection.from;
                const connection = data.map.connections[obj.followingAction.nextConnection];
                return {
                    line: obj.line,
                    startTime: obj.endTime,
                    endTime: obj.endTime + connection.distance,
                    path: obj.followingAction.nextConnection,
                    startNode,
                    followingAction: obj.followingAction.followingAction,
                };
            }
            else
                fail();
            return undefined;
        };
        for (const obj of triggeredObjects) {
            const newObj = processObject(obj);
            if (newObj) {
                if (newObj.endTime < time) {
                    triggeredObjects.push(newObj);
                }
                else {
                    newObjects.push(newObj);
                }
            }
        }
        return Object.assign({}, data, { map: data.map, currentTime: time, livingObjects: triggeredObjects.length == 0 && newObjects.length == 0 ? data.livingObjects : data.livingObjects.filter(o => o.endTime > time).concat(newObjects) });
    };
    const getObjectProgress = (obj, time) => {
        if (time <= obj.startTime)
            return 0;
        else if (time >= obj.endTime)
            return 1;
        else
            return (time - obj.startTime) / (obj.endTime - obj.startTime);
    };
    // rendering
    const createMapRenderer = () => {
        const svgNS = "http://www.w3.org/2000/svg";
        const svgAttr = (element, name, value) => element.setAttributeNS(null, name, value);
        const updateCollection = (elements, rootElement, newData, oldData, updateFn, factoryFn, alwaysUpdate = false) => {
            if (newData == oldData && !alwaysUpdate)
                return;
            if (elements.length == newData.length) {
                for (let i = 0; i < elements.length; i++) {
                    if (alwaysUpdate || oldData && oldData[i] != newData[i]) {
                        updateFn(newData[i], elements[i]);
                    }
                }
            }
            else {
                for (const p of elements)
                    p.remove();
                while (elements.length)
                    elements.pop();
                for (const d of newData) {
                    const newElement = factoryFn();
                    updateFn(d, newElement);
                    rootElement.appendChild(newElement);
                    elements.push(newElement);
                }
            }
        };
        var paths = [], stations = [], objects = [];
        const mapRenderer = (() => {
            var lastData;
            return (data, element) => {
                if (lastData == data) {
                    return;
                }
                if (lastData == null) {
                    Array.from(element.childNodes).forEach(n => element.removeChild(n));
                }
                const renderPath = (conn, element) => {
                    // Prostě Chrome... Na tohle je API, dokonce dvě, ale ani jedno nefunguje. Jedno je už deprecated (a odstraněné z Chrome!), druhé tam asi ještě není. Díky.
                    // Navíc jsou teda fakt borci, že odstranili standardní API.
                    const x = data.nodes[conn.from].pos[0];
                    const y = data.nodes[conn.from].pos[1];
                    const width = data.nodes[conn.to].pos[0] - x;
                    const height = data.nodes[conn.to].pos[1] - y;
                    const pathString = conn.curve.map(i => `L${i[0] + x},${i[1] + y}`).join(" ");
                    svgAttr(element, "d", `M${x},${y} ` + pathString + ` L${x + width},${y + height}`);
                    svgAttr(element, "stroke", "black");
                    svgAttr(element, "stroke-width", "2");
                    svgAttr(element, "vector-effect", "non-scaling-stroke");
                    svgAttr(element, "fill", "none ");
                };
                updateCollection(paths, element, data.connections, lastData && lastData.connections, renderPath, () => document.createElementNS(svgNS, "path"));
                const renderStation = (station, element) => {
                    const node = data.nodes[station.node];
                    svgAttr(element, "d", `M${node.pos[0]},${node.pos[1]} l0,0`);
                    svgAttr(element, "stroke", "red");
                    svgAttr(element, "stroke-width", "10");
                    svgAttr(element, "stroke-linecap", "round");
                    svgAttr(element, "vector-effect", "non-scaling-stroke");
                    const title = Array.from(element.childNodes).find(e => e.nodeName == "title") || document.createElementNS(svgNS, "title");
                    title.textContent = `${station.name}`;
                    if (!title.parentNode)
                        element.appendChild(title);
                };
                updateCollection(stations, element, data.stations, lastData && lastData.stations, renderStation, () => document.createElementNS(svgNS, "path"));
                const viewBox = (() => {
                    const x = data.nodes.map(n => n.pos[0]);
                    const y = data.nodes.map(n => n.pos[1]);
                    const xMin = Math.min(...x), yMin = Math.min(...y), xMax = Math.max(...x), yMax = Math.max(...y), width = xMax - xMin, height = yMax - yMin;
                    return `${xMin - (width) * 0.1} ${yMin - height * 0.1} ${width * 1.2} ${height * 1.2}`;
                })();
                svgAttr(element, "viewBox", viewBox);
                lastData = data;
            };
        })();
        var lastData;
        return (data, element) => {
            if (lastData === data)
                return;
            mapRenderer(data.simulation.map, element);
            const time = data.simulation.currentTime;
            const renderObject = (obj, element) => {
                const position = (() => {
                    if (obj.path != null) {
                        const progress = getObjectProgress(obj, time);
                        const path = data.simulation.map.connections[obj.path];
                        if (path.from != obj.startNode && path.to != obj.startNode)
                            fail();
                        const lineProgress = path.from == obj.startNode ? progress : 1 - progress;
                        const p = paths[obj.path];
                        const point = p.getPointAtLength(p.getTotalLength() * lineProgress);
                        return [point.x, point.y];
                    }
                    else
                        return data.simulation.map.nodes[obj.startNode].pos;
                })();
                // const node = obj.path data.nodes[obj.path]
                svgAttr(element, "d", `M${position[0]},${position[1]} l0,0`);
                svgAttr(element, "stroke", "green");
                svgAttr(element, "stroke-width", "8");
                svgAttr(element, "stroke-linecap", "round");
                svgAttr(element, "vector-effect", "non-scaling-stroke");
            };
            updateCollection(objects, element, data.simulation.livingObjects, lastData && lastData.simulation.livingObjects, renderObject, () => document.createElementNS(svgNS, "path"), true);
            lastData = data;
        };
    };
    const saveMapToLocalStorage = (map) => {
        try {
            localStorage.setItem("lastUsedMap", JSON.stringify(map));
        }
        catch (_a) {
        }
    };
    const tryLoadMapFromLocalStorage = () => {
        try {
            const serializedMap = localStorage.getItem("lastUsedMap");
            return serializedMap ? JSON.parse(serializedMap) : null;
        }
        catch (_a) {
            console.warn("Nefunguje localStorage, nejde tam uložit mapa, tak jí bude potřeba načíst znova ručně.");
            return null;
        }
    };
    class ControlPanel {
        constructor(playButton, pauseButton, resetButton, speedInput, timeDisplay) {
            this.playButton = playButton;
            this.pauseButton = pauseButton;
            this.resetButton = resetButton;
            this.speedInput = speedInput;
            this.timeDisplay = timeDisplay;
            this.updates = [];
            playButton.onclick = () => this.updates.push(state => (Object.assign({}, state, { running: true })));
            pauseButton.onclick = () => this.updates.push(state => (Object.assign({}, state, { running: false })));
            resetButton.onclick = () => this.updates.push(state => {
                const simulation = Object.assign({}, state.simulation, { currentTime: 0, livingObjects: [] });
                return Object.assign({}, state, { simulation });
            });
            const speedOnChange = () => this.updates.push(state => {
                const speed = Math.pow(2, parseFloat(speedInput.value));
                const simulation = Object.assign({}, state.simulation, { speed });
                return Object.assign({}, state, { simulation });
            });
            speedInput.onchange = speedOnChange;
            speedInput.onmousemove = speedOnChange;
        }
        updateState(state) {
            for (const update of this.updates) {
                state = update(state);
            }
            if (this.updates.length)
                this.updates = [];
            // and update the panel
            this.speedInput.value = "" + Math.log2(state.simulation.speed);
            this.speedInput.title = `${state.simulation.speed * 100}%`;
            this.pauseButton.style.display = state.running ? "" : "none";
            this.playButton.style.display = state.running ? "none" : "";
            const relativeTime = state.simulation.currentTime + (state.simulation.displayTimeOffset || 0);
            this.timeDisplay.innerText = `${relativeTime / 60 | 0}:${relativeTime % 60 | 0}`;
            return state;
        }
        static create(someElement) {
            return new ControlPanel(someElement.querySelector("#playButton") || fail(), someElement.querySelector("#pauseButton") || fail(), someElement.querySelector("#resetButton") || fail(), someElement.querySelector("#speedRange") || fail(), someElement.querySelector("#timeDisplay") || fail());
        }
    }
    StuffSimulator.ControlPanel = ControlPanel;
    class App {
        constructor(svgCanvas, controlPanel) {
            this.svgCanvas = svgCanvas;
            this.controlPanel = controlPanel;
            this.renderDispatched = false;
            this.renderFrameId = -1;
        }
        loadMapFromFile(file) {
            return parseMapFromFile(file)
                .then(map => this.loadNewMap(map), error => alert("Error loading the file: " + error));
        }
        loadFromLocalStorage() {
            const map = tryLoadMapFromLocalStorage();
            map && this.loadNewMap(map);
        }
        loadNewMap(data) {
            this.data = initializeRenderData(initializeSimulation(data));
            this.mapRenderer = createMapRenderer();
            saveMapToLocalStorage(data);
            this.dispatchRender();
        }
        saveMap(link) {
            if (this.data == null)
                return false;
            const data = JSON.stringify(Object.assign({}, (this.data.simulation), { livingObjects: undefined, currentTime: undefined }), null, "\t");
            const blob = new Blob([data], { type: "text/json" });
            const url = URL.createObjectURL(blob);
            link.href = url;
            return true;
        }
        importEpicMap() {
            const normalizeName = (stName) => stName.replace(/\(.*\)/, "").trim().toLowerCase();
            const stops = JSON.parse(prompt("paste the stops") || fail());
            const lines = JSON.parse(prompt("paste the lines") || fail());
            const activeStopSet = new Set(flattenArray(flattenArray(Object.keys(lines).map(lName => lines[lName])).map(l => l.timetable)).map(d => normalizeName(d.stop)));
            const activeStops = stops.filter(s => activeStopSet.has(s.name.trim().toLowerCase()));
            const nodes = activeStops.map(s => ({ pos: [s.midPoint[0] * 100, -s.midPoint[1] * 100] }));
            const stations = activeStops.map((s, index) => ({ name: s.name.trim(), node: index }));
            const stopNameMap = new Map(activeStops.map((s, index) => [normalizeName(s.name), index]));
            const getStation = (st) => {
                const r = stopNameMap.get(normalizeName(st));
                if (r === undefined)
                    return fail();
                else
                    return r;
            };
            const dedupeLine = (array, key) => {
                const result = [];
                var lastKey = undefined;
                for (const i of array) {
                    const k = key(i);
                    if (k != lastKey)
                        result.push(i);
                    lastKey = k;
                }
                return result;
            };
            const resultLines = [];
            const resultConnections = [];
            const connectionDedupSet = new Set();
            for (const lineName of Object.keys(lines)) {
                const lol = lines[lineName];
                const stations = [];
                const departures = [];
                for (const table of lol) {
                    const timetable = dedupeLine(table.timetable, t => getStation(t.stop));
                    const commonPoint = timetable.map((t, i) => [i, stations.indexOf(getStation(t.stop))]).find(a => a[1] >= 0);
                    if (commonPoint) {
                        const direction = stations[commonPoint[1] - 1] == (timetable[commonPoint[0] - 1] && getStation(timetable[commonPoint[0] - 1].stop)) ? 1 : -1;
                        // maybe check additional station...
                        departures.push(...table.departures.map(time => ({ from: commonPoint[1], direction, time: (time + 20 * 60) % (24 * 60) })));
                    }
                    else {
                        stations.push(...timetable.map(t => getStation(t.stop)));
                        departures.push(...table.departures.map(time => ({ from: 0, direction: 1, time: (time + 20 * 60) % (24 * 60) })));
                    }
                    let lastNode = timetable[0];
                    for (let i = 1; i < timetable.length; i++) {
                        const distance = timetable[i].time - lastNode.time;
                        const from = getStation(lastNode.stop);
                        const to = getStation(timetable[i].stop);
                        if (!connectionDedupSet.has(`${from}|${to}`)) {
                            resultConnections.push({ from, to, curve: [], distance });
                            connectionDedupSet.add(`${from}|${to}`);
                            connectionDedupSet.add(`${to}|${from}`);
                        }
                        lastNode = timetable[i];
                    }
                }
                resultLines.push({ name: lineName, stops: stations.map(id => ({ id })), timeTable: departures });
            }
            const map = { nodes: nodes, connections: resultConnections, stations: stations };
            const simData = { map, lines: resultLines, livingObjects: [], currentTime: 0, speed: 1, displayTimeOffset: 4 * 60 };
            this.loadNewMap(simData);
        }
        dispatchRender() {
            if (this.renderDispatched) {
                return;
            }
            this.renderDispatched = true;
            this.renderFrameId = window.requestAnimationFrame(time => {
                this.renderDispatched = false;
                if (!this.mapRenderer || !this.data) {
                    this.lastAnimationTime = undefined;
                    return;
                }
                if (this.lastAnimationTime != null && this.data.running) {
                    this.data = this.controlPanel.updateState(this.data);
                    const deltaTime = time - this.lastAnimationTime;
                    this.data = Object.assign({}, this.data, { simulation: moveSimulation(this.data.simulation, deltaTime / 1000) });
                }
                this.lastAnimationTime = time;
                this.mapRenderer(this.data, this.svgCanvas);
                this.dispatchRender();
            });
        }
    }
    StuffSimulator.App = App;
})(StuffSimulator || (StuffSimulator = {}));
//# sourceMappingURL=script.js.map