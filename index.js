const http = require("http");
const ws = require("ws");
const port = process.env.PORT || "9090";

const wss = new ws.WebSocketServer({ noServer: true, clientTracking: true });

const requestListener = function (req, res) {
  console.log(req.method);
  res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
  res.end("Hello, World!");
};

wss.on("connection", function connection(ws) {
  console.log("something connected");
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    ws.send("something " + message);
  });

  ws.send("something connected");
});

const server = http.createServer(requestListener);
server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, function done(ws) {
    wss.emit("connection", ws, req);
  });
});
server.listen(port);
