const http = require("http");
const ws = require("ws");
const port = process.env.PORT || "9090";

const wss = new ws.WebSocketServer({ noServer: true, clientTracking: true });

let users = {};
let messages = [];

function broadcast_message(msg) {
  console.log("Broadcasted message: " + msg);
  for (const [key, value] of Object.entries(users)) {
    value.send(msg);
  }
}

function user_join_to_string(username) {
  let message = { u: username };
  let parsed = "U".concat(JSON.stringify(message));
  return parsed;
}

function user_left_to_string(username) {
  let message = { u: username };
  let parsed = "u".concat(JSON.stringify(message));
  return parsed;
}

function message_to_string(msg) {
  let message = { t: msg.time, u: msg.user, m: msg.msg };
  let parsed = (msg.bold ? "M" : "m").concat(JSON.stringify(message));
  return parsed;
}

function get_message_list_string() {
  let result = { l: [] };
  messages.forEach((element) => {
    result.l.push(message_to_string(element));
  });
  let parsed = "L".concat(JSON.stringify(result));
  return parsed;
}

function get_user_list_string() {
  let result = { l: [] };
  for (const [key, value] of Object.entries(users)) {
    result.l.push(user_join_to_string(key));
  }
  let parsed = "L".concat(JSON.stringify(result));
  return parsed;
}

function push_message(username, message, is_bold) {
  let object = {
    time: Date.now(),
    user: username,
    msg: message,
    bold: is_bold,
  };
  messages.push(object);
  let result = message_to_string(object);
  console.log(result);
  broadcast_message(result);
  while (messages.length > 15) {
    messages.shift();
  }
}

function drop_user(username) {
  let socket = users[username];
  if (socket) {
    socket.close();
    delete users[username];
  }
  push_message(username, "left.", true);
  broadcast_message(user_left_to_string(username));
}

const requestListener = function (req, res) {
  console.log(req.method);
  res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
  res.end("Hello, World!");
};

wss.on("connection", function connection(ws, username) {
  console.log(username + " connected");
  ws.send(get_user_list_string());
  users[username] = ws;
  ws.send(get_message_list_string());
  push_message(username, "joined.", true);
  broadcast_message(user_join_to_string(username));
  // Message
  ws.on("message", function incoming(message) {
    console.log("received: %s", message + " from " + username);
    push_message(username, message.toString(), false);
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
  let user_url = req.url;
  if (user_url) {
    console.log("User attempted connection through URL: " + user_url);
    let username = decodeURI(user_url.substring(1));
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
