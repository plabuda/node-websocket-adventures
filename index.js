const http = require("http");
const port = process.env.PORT || '9090';

const requestListener = function (req, res) {
  console.log(req.method);
  res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
  res.end("Hello, World!");
};

const server = http.createServer(requestListener);
server.listen(port);
