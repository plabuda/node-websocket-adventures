const http = require("http");
const ws = require("ws");
const port = process.env.PORT || "9090";

const wss = new ws.WebSocketServer({ noServer: true, clientTracking: true });

let users = {};

function drop_user(username) {
  const socket = users[username];
  if (socket) {
    socket.close();
    delete users[username];
  }
}

const requestListener = function (req, res) {
  console.log(req.method);
  res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
  res.end("Hello, World!");
};

wss.on("connection", function connection(ws, username) {
  console.log(username + " connected");
  users[username] = ws;
  // Message
  ws.on("message", function incoming(message) {
    console.log("received: %s", message + " from " + username);
    ws.send("something " + message);
  });
  // Error
  ws.on("error", function error_handler(error) {
    console.log("Websocker for " + username + " got an error " + error.message);
    drop_user(username);
  });
  // Close
  ws.on("close", function close_handler(close) {
    console.log(
      "Websocker for " + username + " closed with reason " + close.reason
    );
    drop_user(username);
  });
});

const server = http.createServer(requestListener);
server.on("upgrade", (req, socket, head) => {
  const user_url = req.url;
  if (user_url) {
    console.log("User attempted connection through URL: " + user_url);
    const username = decodeURI(user_url.substring(1));
    console.log("Decoded user name is: " + username);
    if (username && !(username in users)) {
      wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit("connection", ws, username);
      });
    } else {
      console.log("Empty username or username taken");
      socket.destroy();
    }
  } else {
    socket.destroy();
  }
});
server.listen(port);
